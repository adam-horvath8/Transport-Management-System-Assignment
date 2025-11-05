<template>
  <div
    v-if="modelValue"
    class="fixed top-0 left-0 w-full h-full bg-black/50 backdrop:backdrop-blur-sm"
  >
    <dialog
      ref="dialogRef"
      :open="modelValue"
      @click="handleBackdropClick"
      class="rounded-lg p-0 shadow-xl max-w-md w-full fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <div class="p-6">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <h2 class="text-xl font-semibold">Confirm Delete</h2>
            <p class="text-gray-600">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
          </div>

          <div class="flex gap-3 justify-end">
            <ButtonBase type="button" variant="gray" @click="handleCancel">Cancel</ButtonBase>
            <ButtonBase type="button" variant="red" @click="handleConfirm">Delete</ButtonBase>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ButtonBase from '@/components/base/ButtonBase.vue'

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

const model = defineModel<boolean>({ required: true })

const handleConfirm = () => {
  model.value = false
  emit('confirm')
}

const handleCancel = () => {
  model.value = false
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === dialogRef.value) {
    model.value = false
  }
}
</script>
