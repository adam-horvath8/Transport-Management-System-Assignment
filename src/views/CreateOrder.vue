<template>
  <section class="flex items-center justify-center flex-col gap-6 max-w-7xl mx-auto">
    <h1 class="text-2xl font-bold text-blue-700">Create Order</h1>

    <form
      @submit.prevent="addOrder"
      class="flex w-full flex-col gap-8 bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div class="bg-blue-600 p-6">
        <h2 class="text-xl font-bold mb-4 text-white">Order Information</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="flex flex-col gap-2">
            <label for="number" class="text-sm font-semibold text-white">
              Number <span class="text-red-300">*</span>
            </label>

            <InputBar type="number" id="number" v-model="formData.number" />
          </div>

          <div class="flex flex-col gap-2">
            <label for="customer_name" class="text-sm font-semibold text-white">
              Customer Name <span class="text-red-300">*</span>
            </label>
            <InputBar type="text" id="customer_name" v-model="formData.customer_name" />
          </div>

          <div class="flex flex-col gap-2">
            <label for="date" class="text-sm font-semibold text-white">
              Date <span class="text-red-300">*</span>
            </label>

            <InputBar type="date" id="date" v-model="formData.date" />
          </div>
        </div>
      </div>

      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-blue-700">Waypoints</h2>

          <ButtonBase
            v-if="formData.waypoints.length === 0"
            type="button"
            variant="blue"
            @click="addWaypoint"
          >
            <PlusCircle /> Add Waypoint
          </ButtonBase>
        </div>

        <div v-if="formData.waypoints.length === 0" class="p-8 bg-gray-100 rounded-lg text-center">
          <p class="text-gray-600 mb-4">No waypoints added yet</p>

          <ButtonBase type="button" variant="blue" @click="addWaypoint">
            <PlusCircle /> Add Your First Waypoint
          </ButtonBase>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <TransitionGroup name="fade" mode="out-in">
            <div
              v-for="(waypoint, index) in formData.waypoints"
              :key="waypoint.id"
              class="flex flex-col gap-4 w-full bg-gray-100 p-5 rounded-lg relative shadow-md"
            >
              <ButtonBase
                v-if="index === formData.waypoints.length - 1"
                class="rounded-full size-10 p-0 absolute top-1/2 -translate-y-1/2 -right-6"
                variant="blue"
                kind="icon"
                type="button"
                @click="addWaypoint"
              >
                <PlusCircle />
              </ButtonBase>

              <div class="flex items-center justify-between">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-semibold text-white',
                    waypoint.type === 'pickup' ? 'bg-green-500' : 'bg-blue-500',
                  ]"
                >
                  {{ index + 1 }}. {{ waypoint.type === 'pickup' ? 'Pickup' : 'Delivery' }}
                </span>

                <div class="flex gap-2">
                  <ButtonBase
                    class="rounded-full size-8 p-0"
                    variant="red"
                    kind="icon"
                    type="button"
                    @click="handleConfirmDeleteModalOpen(waypoint)"
                  >
                    <XmarkCircle />
                  </ButtonBase>
                </div>
              </div>

              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <label for="location_address" class="text-sm font-semibold text-gray-700">
                    Location Address <span class="text-red-500">*</span>
                  </label>

                  <InputBar
                    type="text"
                    :id="`location_address_${waypoint.id}`"
                    v-model="waypoint.location_address"
                    class="bg-white"
                  />
                </div>

                <div class="flex flex-col gap-2">
                  <label for="type" class="text-sm font-semibold text-gray-700"> Type </label>

                  <select
                    :id="`type_${waypoint.id}`"
                    v-model="waypoint.type"
                    class="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white border border-gray-300"
                  >
                    <option value="pickup">Pickup</option>

                    <option value="delivery">Delivery</option>
                  </select>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <div class="p-6 bg-gray-50 border-t border-gray-200">
        <div class="flex justify-center gap-4">
          <ButtonBase type="submit" variant="green"> <PlusCircle /> Create Order </ButtonBase>
        </div>
      </div>
    </form>

    <ConfirmDeleteModal
      v-model="isConfirmDeleteModalOpen"
      @confirm="removeWaypoint(waypointToDelete?.id ?? '')"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Order, Waypoint } from '@/types'
import { useRouter } from 'vue-router'
import ButtonBase from '@/components/base/ButtonBase.vue'
import InputBar from '@/components/base/InputBar.vue'
import { WaypointTypeEnum } from '@/enums'
import PlusCircle from '@/components/icons/PlusCircle.vue'
import XmarkCircle from '@/components/icons/XmarkCircle.vue'
import ConfirmDeleteModal from '@/components/create/ConfirmDeleteModal.vue'
import { useToastMessageStore } from '@/stores/toast'
import * as z from 'zod'

const formData = ref<Order>({
  number: null,
  customer_name: '',
  date: '',
  waypoints: [],
})

const Order = z.object({
  number: z.number().min(1),
  customer_name: z.string().min(1),
  date: z.string().min(1),
  waypoints: z.array(
    z.object({
      id: z.string(),
      location_address: z.string().min(1),
      type: z.enum([WaypointTypeEnum.PICKUP, WaypointTypeEnum.DELIVERY]),
    }),
  ),
})

const router = useRouter()
const toastMessageStore = useToastMessageStore()

const isConfirmDeleteModalOpen = ref(false)
const waypointToDelete = ref<Waypoint | null>(null)

const addOrder = async () => {
  if (!validateForm()) return

  try {
    const response = await fetch('http://localhost:3001/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value),
    })
    if (!response.ok) throw Error('Something went wrong!')

    toastMessageStore.setMessage('Order created successfully!', 'success')
    router.push('/')
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

const removeWaypoint = (id: string) => {
  formData.value.waypoints = formData.value.waypoints.filter((wpoint) => wpoint.id !== id)
}

const handleConfirmDeleteModalOpen = (waypoint: Waypoint) => {
  waypointToDelete.value = waypoint
  isConfirmDeleteModalOpen.value = true
}

const validateForm = () => {
  const validatedData = Order.safeParse(formData.value)
  if (!validatedData.success) {
    toastMessageStore.setMessage('Please fill in all required fields', 'error')
    console.log(validatedData.error)
    return false
  }
  return true
}

watch(
  () => formData.value,
  () => {
    console.log(formData.value)
  },
  { deep: true },
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
