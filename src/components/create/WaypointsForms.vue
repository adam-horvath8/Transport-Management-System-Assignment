<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <TransitionGroup name="fade" mode="out-in">
      <div
        v-for="(waypoint, index) in waypoints"
        :key="waypoint.id"
        class="flex flex-col gap-4 w-full bg-gray-100 p-5 rounded-lg relative shadow-md"
      >
        <ButtonBase
          v-if="index === waypoints.length - 1"
          class="rounded-full size-10 p-0 absolute top-1/2 -translate-y-1/2 -right-6"
          variant="blue"
          kind="icon"
          type="button"
          @click="emit('add-waypoint')"
        >
          <PlusCircle />
        </ButtonBase>

        <div class="flex items-center justify-between">
          <span
            class="px-3 py-1 rounded-full text-sm font-semibold text-white"
            :class="waypoint.type === 'pickup' ? 'bg-green-500' : 'bg-blue-500'"
          >
            {{ index + 1 }}. {{ waypoint.type === 'pickup' ? 'Pickup' : 'Delivery' }}
          </span>

          <div class="flex gap-2">
            <ButtonBase
              class="rounded-full size-8 p-0"
              variant="red"
              kind="icon"
              type="button"
              @click="emit('open-delete-modal', waypoint)"
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
</template>

<script setup lang="ts">
import type { Waypoint } from '@/types'
import ButtonBase from '../base/ButtonBase.vue'
import InputBar from '../base/InputBar.vue'
import PlusCircle from '../icons/PlusCircle.vue'
import XmarkCircle from '../icons/XmarkCircle.vue'

defineProps<{
  waypoints: Waypoint[]
}>()

const emit = defineEmits<{
  (e: 'add-waypoint'): void
  (e: 'open-delete-modal', waypoint: Waypoint): void
}>()
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
