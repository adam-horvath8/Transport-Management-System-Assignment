<template>
  <div class="flex flex-col min-h-screen">
    <header>
      <nav class="p-4 bg-gray-200">
        <ul class="flex gap-2 justify-center">
          <li>
            <ButtonBase elementType="link" :to="{ name: 'orders' }">Orders</ButtonBase>
          </li>
          <li>
            <ButtonBase elementType="link" :to="{ name: 'create-order' }">Create Order</ButtonBase>
          </li>
        </ul>
      </nav>
    </header>

    <main class="flex-1 p-6">
      <Transition name="fade" mode="out-in">
        <RouterView :key="route.path" />
      </Transition>
    </main>

    <footer class="bg-gray-200 text-black p-2">
      <p class="text-center">
        Created by
        <a
          href="https://github.com/adam-horvath8?tab=repositories"
          target="_blank"
          class="text-blue-800 underline"
          >Adam Horváth</a
        >
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import ButtonBase from '@/components/base/ButtonBase.vue'
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
