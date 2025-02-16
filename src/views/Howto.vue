<script setup lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies';
import { onUnmounted, ref } from 'vue';
import { useRouter, type Router } from 'vue-router';
const router = useRouter();
const cookies = useCookies(['username']);
let name = ref(cookies.get('username') || '');
function joinRoom() {
  cookies.set('username', name.value);
}
</script>

<template>
  <main class="vertical">
    <h1 data-i18n="howto.title"></h1>

    <div id="explanation">
      <p data-i18n="howto.explanation"></p>

      <ol>
        <li data-i18n="howto.no1"></li>
        <li data-i18n="howto.no2"></li>
        <li data-i18n="howto.no3"></li>
        <li data-i18n="howto.no4"></li>
        <li data-i18n="howto.no5"></li>
        <li data-i18n="howto.no6"></li>
        <li data-i18n="howto.no7"></li>
      </ol>

      <p>
        <span data-i18n="howto.blog"></span>
        <a href="http://www.tabletweavingintheoryandpractice.co.uk">
          www.tabletweavingintheoryandpractice.co.uk
        </a>
      </p>

      <p>
        <span data-i18n="howto.mail"></span>
        <a href="mailto:catherine.ward+tdd@gmail.com">
          catherine.ward+tdd@gmail.com
        </a>
      </p>
    </div>
  </main>
</template>
