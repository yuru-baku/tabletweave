import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

/* setup font awesome */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import BaseLayout from '@/components/BaseLayout.vue'
import ControlBar from '@/components/ControlBar.vue'
library.add(fas)

const app = createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('BaseLayout', BaseLayout)
  .use(createPinia())
  .use(router)
  .mount('#app')
