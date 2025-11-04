import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/OrdersView.vue'
import TwoExample from '../views/CreateOrder.vue'
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'
import OrderDetail from '@/views/OrderDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'default-layout',
      component: DefaultLayout,
      children: [
        {
          path: '/',
          name: 'orders',
          component: HomeView,
        },
        {
          path: '/create-order',
          name: 'create-order',
          component: TwoExample,
        },
        {
          path: '/order/:id',
          name: 'order',
          component: OrderDetail,
        },
      ],
    },
  ],
})

export default router
