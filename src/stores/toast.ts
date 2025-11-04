import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useToastMessageStore = defineStore('toastMessage', () => {
  const toastMessage = ref('')
  const toastVariant = ref<'success' | 'error'>('success')

  const setMessage = (message: string, variant: 'success' | 'error') => {
    toastMessage.value = message
    toastVariant.value = variant
  }

  return { toastMessage, toastVariant, setMessage }
})
