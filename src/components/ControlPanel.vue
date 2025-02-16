<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  id: String,
  title: String,
});

let isActive = ref(true);
console.log(props.title);
</script>
<!--todo: hiding when accodion is closed-->
<template>
  <div class="ControlPanel" id="{{ id }}">
    <button class="accordion" @click="isActive = !isActive">
      {{ title }}
    </button>
    <div class="panel" v-if="isActive">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/styles/util';
</style>
