<template>
  <section class="flex items-center justify-center flex-col gap-3">
    <h1 class="text-2xl font-bold text-blue-700">Create Order</h1>

    <form
      @submit.prevent="addOrder"
      class="flex flex-col w-full gap-4 items-center bg-gray-100 px-6 sm:px-12 sm:py-6 py-3 rounded-md sm:max-w-120"
    >
      <div class="flex flex-col gap-1 w-full">
        <label for="number">Number</label>
        <InputBar type="number" id="number" v-model="form.number" />
      </div>

      <div class="flex flex-col gap-1 w-full">
        <label for="customer_name">Customer Name</label>
        <InputBar type="text" id="customer_name" v-model="form.customer_name" />
      </div>

      <div class="flex flex-col gap-1 w-full">
        <label for="date">Date</label>
        <InputBar type="date" id="date" v-model="form.date" />
      </div>

      <div
        v-for="waypoint in form.waypoints"
        :key="waypoint.id"
        class="flex flex-col gap-1 w-full bg-white p-4 rounded-md"
      >
        <div class="flex flex-col gap-1 w-full">
          <label for="customer_name">Customer Name</label>
          <InputBar type="text" id="customer_name" v-model="form.customer_name" class="bg-gray-100"/>
        </div>

        <div class="flex flex-col gap-1 w-full">
          <label for="customer_name">Customer Name</label>
          <InputBar type="text" id="customer_name" v-model="form.customer_name" />
        </div>
      </div>

      <ButtonBase type="button" @click="addWaypoint">Add Waypoint</ButtonBase>

      <ButtonBase class="w-full self-start" type="submit"> Create Order </ButtonBase>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Order } from '@/types'
import { useRouter } from 'vue-router'
import ButtonBase from '@/components/base/ButtonBase.vue'
import InputBar from '@/components/base/InputBar.vue'
import { WaypointTypeEnum } from '@/enums'

const form = ref<Order>({
  number: null,
  customer_name: '',
  date: '',
  waypoints: [],
})

const router = useRouter()

const addOrder = async () => {
  try {
    const response = await fetch('http://localhost:3001/orders', {
      method: 'POST',
      body: JSON.stringify(form.value),
    })
    if (!response.ok) throw Error('Something went wrong!')

    alert('Order created successfully!')
    router.push('/')
  } catch (error) {
    if (error) {
      console.log(error)
    }
  }
}

const addWaypoint = () => {
  form.value.waypoints.push({
    id: crypto.randomUUID(),
    location_address: '',
    type: WaypointTypeEnum.PICKUP,
  })
}
</script>
