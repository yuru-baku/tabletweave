import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

/* setup font awesome */
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas); // 

/* setup components*/
import BaseLayout from '@/components/BaseLayout.vue';
import ControlBar from '@/components/ControlBar.vue';
import Colorbox from '@/components/Colorbox.vue';
import ControlPanel from '@/components/ControlPanel.vue';

const app = createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .component('BaseLayout', BaseLayout)
  .component('ControlBar', ControlBar)
  .component('Colorbox', Colorbox)
  .component('ControlPanel', ControlPanel)
  .use(router)
  .mount('#app');
