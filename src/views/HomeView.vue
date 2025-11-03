<template>
  <div class="text-red-500 bg-blue-200">{{ data }}</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const data = ref()

onMounted(async () => {
  const response = await fetch('http://localhost:3001/vehicles')
  console.log(response)

  if (response.ok) {
    console.log('fdfs')

    data.value = await response.json()
    console.log(data.value)
  }
})
</script>
