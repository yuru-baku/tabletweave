import { createRouter, createWebHashHistory } from 'vue-router'
import Copyright from '@/views/Copyright.vue'
import LandingView from '@/views/LandingView.vue'

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
  ],
})

export default router
