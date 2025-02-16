import { createRouter, createWebHashHistory } from 'vue-router'
import Copyright from '@/views/Copyright.vue'
import LandingView from '@/views/LandingView.vue'
import HowTo from '@/views/HowTo.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: LandingView,
    },
    {
      path: '/',
      name: 'copyright',
      component: Copyright,
    },
    {
      path: '/',
      name: 'hotwo',
      component: HowTo,
    },
  ],
})

export default router
