<template>
  <section>
    <h1 class="text-4xl font-bold text-blue-800 text-center mb-6">Edit Order</h1>

    <FormOrder :is-edit="true" />
  </section>
</template>

<script setup lang="ts">
import FormOrder from '@/components/create/FormOrder.vue'
</script>
