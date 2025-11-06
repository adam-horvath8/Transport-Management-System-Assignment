<template>
  <section class="flex flex-col items-center justify-center min-h-screen gap-6">
    <h1 class="text-6xl font-bold text-blue-800">404</h1>

    <h2 class="text-2xl font-semibold text-gray-700">Page Not Found</h2>

    <p class="text-gray-600 text-center max-w-md">
      The page you're looking for doesn't exist or has been moved.
    </p>

    <ButtonBase variant="blue" @click="goHome"> Go to Orders </ButtonBase>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import ButtonBase from '@/components/base/ButtonBase.vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>
