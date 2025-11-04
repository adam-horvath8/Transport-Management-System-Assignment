<template>
  <section class="flex items-center justify-center flex-col gap-3 max-w-7xl mx-auto">
    <h1 class="text-2xl font-bold text-blue-700">Create Order</h1>

    <form
      @submit.prevent="addOrder"
      class="flex w-full flex-col gap-8 bg-gray-100 px-6 sm:px-12 sm:py-6 py-3 rounded-lg"
    >
      <div class="flex gap-6">
        <div class="flex flex-col gap-1 w-full">
          <label for="number">Number<span class="text-red-500">*</span></label>

          <InputBar type="number" id="number" v-model="formData.number" />
        </div>

        <div class="flex flex-col gap-1 w-full">
          <label for="customer_name">Customer Name<span class="text-red-500">*</span></label>

          <InputBar type="text" id="customer_name" v-model="formData.customer_name" />
        </div>

        <div class="flex flex-col gap-1 w-full">
          <label for="date">Date<span class="text-red-500">*</span></label>

          <InputBar type="date" id="date" v-model="formData.date" />
        </div>
      </div>

      <ButtonBase
        v-if="formData.waypoints.length === 0"
        class="self-center"
        type="button"
        @click="addWaypoint"
      >
        <PlusCircle />Add Waypoint
      </ButtonBase>

      <div class="grid grid-cols-3 gap-6">
        <TransitionGroup name="fade" mode="out-in">
          <div
            v-for="(waypoint, index) in formData.waypoints"
            :key="waypoint.id"
            class="flex flex-col gap-2 w-full bg-white p-4 px-6 rounded-xl relative shadow-md"
          >
            <ButtonBase
              v-if="index === formData.waypoints.length - 1"
              class="absolute flex items-center justify-center top-1/2 -translate-y-1/2 -right-8 rounded-full size-10 p-0"
              type="button"
              @click="addWaypoint"
            >
              <PlusCircle />
            </ButtonBase>

            <ButtonBase
              class="absolute top-1 right-1 size-6"
              variant="red"
              kind="icon"
              type="button"
              @click="handleConfirmDeleteModalOpen(waypoint)"
              ><XmarkCircle />
            </ButtonBase>

            <div class="flex flex-col gap-1 w-full">
              <label for="location_address">Location Address</label>
              <InputBar
                type="text"
                id="location_address"
                v-model="waypoint.location_address"
                class="bg-gray-100"
              />
            </div>

            <div class="flex flex-col gap-1 w-full">
              <label for="type">Type</label>

              <select
                id="type"
                v-model="waypoint.type"
                class="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg bg-gray-100"
              >
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <ButtonBase class="self-center" type="submit" variant="green">
        <PlusCircle /> Create Order
      </ButtonBase>
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
      type: z.enum(WaypointTypeEnum),
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
    toastMessageStore.setMessage(validatedData.error.message, 'error')
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
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
