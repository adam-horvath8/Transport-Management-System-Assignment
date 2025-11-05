import type { Order } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrderStore = defineStore('order', () => {
  const order = ref<Order | null>(null)

  const setOrderData = (data: Order) => {
    order.value = data
  }
  const clearOrderData = () => {
    order.value = null
  }

  return { order, setOrderData, clearOrderData }
})
