import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/OrdersView.vue'
import CreateOrder from '../views/CreateOrder.vue'
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'
import OrderDetail from '@/views/OrderDetail.vue'
import NotFoundView from '@/views/NotFound.vue'
import EditOrder from '@/views/EditOrder.vue'

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
          path: '/edit-order/:id',
          name: 'edit-order',
          component: EditOrder,
        },
        {
          path: '/create-order',
          name: 'create-order',
          component: CreateOrder,
        },
        {
          path: '/order/:id',
          name: 'order',
          component: OrderDetail,
        },
      ],
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

export default router
