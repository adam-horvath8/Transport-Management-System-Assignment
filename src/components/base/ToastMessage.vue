<template>
  <Transition name="toast">
    <div
      v-if="toastMessageStore.toastMessage"
      role="status"
      aria-live="polite"
      :class="twMerge('fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-md', variantClass)"
    >
      <p class="text-white font-bold">{{ toastMessageStore.toastMessage }}</p>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useToastMessageStore } from '@/stores/toast'
import { twMerge } from 'tailwind-merge'

const toastMessageStore = useToastMessageStore()

const variantClass = computed(() => {
  switch (toastMessageStore.toastVariant) {
    case 'success':
      return 'bg-green-600'
    case 'error':
      return 'bg-red-600'
    default:
      return 'bg-green-600'
  }
})

watch(
  () => toastMessageStore.toastMessage,
  (newMessage) => {
    if (newMessage) {
      setTimeout(() => {
        toastMessageStore.toastMessage = ''
      }, 3000)
    }
  },
)
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
