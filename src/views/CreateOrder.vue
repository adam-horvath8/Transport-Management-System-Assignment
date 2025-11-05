<template>
  <section>
    <h1 class="text-4xl font-bold text-blue-800 text-center mb-6">Create Order</h1>

    <FormOrder />
  </section>
</template>

<script setup lang="ts">
import FormOrder from '@/components/create/FormOrder.vue'
import { useOrderStore } from '@/stores/order'

const orderStore = useOrderStore()
orderStore.clearOrderData()
</script>
