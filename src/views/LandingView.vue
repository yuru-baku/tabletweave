<script setup lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies';
import { onUnmounted, ref } from 'vue';
import { useRouter, type Router } from 'vue-router';
const router = useRouter();
import ControlPanel from '@/components/ControlPanel.vue';
import ControlBar from '@/components/ControlBar.vue';
import BaseLayout from '@/components/BaseLayout.vue';

const cookies = useCookies(['username']);
</script>

<template>
  <BaseLayout>
    <ControlBar>
      <ControlPanel></ControlPanel>
    </ControlBar>
  </BaseLayout>
</template>

<style lang="scss">
@import '@/styles/style.scss';
</style>
