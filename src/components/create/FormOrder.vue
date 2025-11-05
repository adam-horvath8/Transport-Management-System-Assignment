<template>
  <div class="max-w-7xl mx-auto">
    <form
      @submit.prevent="handleSubmit"
      class="flex w-full flex-col gap-8 bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div class="bg-blue-700 p-6">
        <h2 class="text-xl font-bold mb-4 text-white">Order Information</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <label for="number" class="text-sm font-semibold text-white">
                Number <span class="text-red-300">*</span>
              </label>

              <span v-if="formErrors.number.isError" class="text-red-200 text-sm">
                {{ formErrors.number.message }}
              </span>
            </div>

            <InputBar type="number" id="number" v-model="formData.number" />
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <label for="customer_name" class="text-sm font-semibold text-white">
                Customer Name <span class="text-red-300">*</span>
              </label>

              <span v-if="formErrors.customer_name.isError" class="text-red-200 text-sm">
                {{ formErrors.customer_name.message }}
              </span>
            </div>

            <InputBar type="text" id="customer_name" v-model="formData.customer_name" />
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <label for="date" class="text-sm font-semibold text-white">
                Date <span class="text-red-300">*</span>
              </label>

              <span v-if="formErrors.date.isError" class="text-red-200 text-sm">
                {{ formErrors.date.message }}
              </span>
            </div>

            <InputBar type="date" id="date" v-model="formData.date" />
          </div>
        </div>
      </div>

      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-blue-800">Waypoints</h2>

          <span v-if="formErrors.location_address.isError" class="text-red-500 text-sm">
            {{ formErrors.location_address.message }}
          </span>
        </div>

        <div v-if="formData.waypoints.length === 0" class="p-8 bg-gray-100 rounded-lg text-center">
          <p class="text-gray-600 mb-4">No waypoints added yet</p>

          <ButtonBase type="button" variant="green" @click="addWaypoint">
            <PlusCircle /> Add Your First Waypoint
          </ButtonBase>
        </div>

        <WaypointsForms
          v-else
          :waypoints="formData.waypoints"
          @add-waypoint="addWaypoint"
          @open-delete-modal="handleConfirmDeleteModalOpen($event)"
          :formErrors="formErrors"
        />
      </div>

      <div class="p-6 bg-gray-50 border-t border-gray-200">
        <div class="flex justify-center gap-4">
          <ButtonBase v-if="!isEdit" type="submit"> <PlusCircle />{{ 'Create Order' }} </ButtonBase>
          <ButtonBase v-else type="submit"> <PenEdit />{{ 'Edit Order' }} </ButtonBase>
        </div>
      </div>
    </form>

    <ConfirmDeleteModal
      v-model="isConfirmDeleteModalOpen"
      @confirm="removeWaypoint(waypointToDelete?.id ?? '')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Order, Waypoint } from '@/types'
import { useRouter } from 'vue-router'
import ButtonBase from '@/components/base/ButtonBase.vue'
import InputBar from '@/components/base/InputBar.vue'
import { WaypointTypeEnum } from '@/enums'
import PlusCircle from '@/components/icons/PlusCircle.vue'
import { useToastMessageStore } from '@/stores/toast'
import WaypointsForms from '@/components/create/WaypointsForms.vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import ConfirmDeleteModal from '../base/ConfirmDeleteModal.vue'
import { useOrderStore } from '@/stores/order'
import PenEdit from '../icons/PenEdit.vue'

dayjs.extend(utc)

const props = defineProps<{
  isEdit?: boolean
}>()

const orderStore = useOrderStore()
const router = useRouter()

const toastMessageStore = useToastMessageStore()

const formData = ref<Order>({
  number: orderStore.order?.number ?? null,
  customer_name: orderStore.order?.customer_name ?? '',
  date: orderStore.order?.date ?? '',
  waypoints: orderStore.order?.waypoints ?? [],
})

const formErrors = ref({
  number: {
    isError: false,
    message: 'Number is required',
  },
  customer_name: {
    isError: false,
    message: 'Customer name is required',
  },
  date: {
    isError: false,
    message: 'Date is required',
  },
  location_address: {
    isError: false,
    message: 'All waypoints must have a location address',
  },
})

const isConfirmDeleteModalOpen = ref(false)
const waypointToDelete = ref<Waypoint | null>(null)

const removeWaypoint = (id: string) => {
  formData.value.waypoints = formData.value.waypoints.filter((wpoint) => wpoint.id !== id)
}

const createOrder = async () => {
  try {
    if (!validateForm()) {
      toastMessageStore.setMessage('Please fill in all required fields', 'error')
      return
    }

    const response = await fetch('http://localhost:3001/orders', {
      method: 'POST',
      body: JSON.stringify(formData.value),
    })

    if (!response.ok) throw Error('Something went wrong!')

    toastMessageStore.setMessage('Order created successfully!', 'success')
    router.push('/orders')
  } catch (error) {
    if (error) {
      toastMessageStore.setMessage('Something went wrong!', 'error')
    }
  }
}

const editOrder = async () => {
  console.log('editOrder')
  try {
    if (!validateForm()) {
      toastMessageStore.setMessage('Please fill in all required fields', 'error')
      return
    }

    const orderId = orderStore.order?.id

    console.log(orderId)

    const response = await fetch(`http://localhost:3001/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(formData.value),
    })

    if (!response.ok) throw Error('Something went wrong!')

    toastMessageStore.setMessage('Order edited successfully!', 'success')
    router.push(`/order/${orderId}`)
  } catch (error) {
    if (error) {
      toastMessageStore.setMessage('Something went wrong!', 'error')
    }
  }
}

const addWaypoint = () => {
  formData.value.waypoints.push({
    id: crypto.randomUUID(),
    location_address: '',
    type: WaypointTypeEnum.PICKUP,
  })
}

const handleConfirmDeleteModalOpen = (waypoint: Waypoint) => {
  waypointToDelete.value = waypoint
  isConfirmDeleteModalOpen.value = true
}

const validateForm = () => {
  if (!formData.value.number) {
    formErrors.value.number.isError = true
  } else {
    formErrors.value.number.isError = false
  }

  if (!formData.value.customer_name) {
    formErrors.value.customer_name.isError = true
  } else {
    formErrors.value.customer_name.isError = false
  }

  if (!formData.value.date) {
    formErrors.value.date.isError = true
    formErrors.value.date.message = 'Date is required'
  } else {
    validateDateIsFuture()
  }

  if (formData.value.waypoints.some((wpoint) => !wpoint.location_address)) {
    formErrors.value.location_address.isError = true
  } else {
    formErrors.value.location_address.isError = false
  }

  return Object.values(formErrors.value).every((error) => !error.isError)
}

const validateDateIsFuture = () => {
  const selectedDate = dayjs.utc(formData.value.date).startOf('day')
  const today = dayjs.utc().startOf('day')

  if (selectedDate.isBefore(today)) {
    formErrors.value.date.isError = true
    formErrors.value.date.message = 'Date must be a future date'
  } else {
    formErrors.value.date.isError = false
  }
}

const handleSubmit = () => {
  if (props.isEdit) {
    editOrder()
  } else {
    createOrder()
  }
}
</script>
