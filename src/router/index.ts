import { createRouter, createWebHashHistory } from 'vue-router'
import Copyright from 'src/views/Copyright.vue'
import LandingView from 'src/views/LandingView.vue'

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
