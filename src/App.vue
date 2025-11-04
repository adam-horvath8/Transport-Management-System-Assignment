<template>
  <div class="min-h-screen">
    <ToastMessage />

    <RouterView />
  </div>
</template>

<script setup lang="ts">
import ToastMessage from '@/components/base/ToastMessage.vue'
</script>
