<script setup lang="ts">
import BaseHeader from '@/components/BaseHeader.vue';
import BaseFooter from '@/components/BaseFooter.vue';
</script>

<template>
  <div class="BaseLayoutContainer">
    <BaseHeader> </BaseHeader>
    <main class="BaseMain">
      <slot></slot>
    </main>
    <BaseFooter> </BaseFooter>
  </div>
</template>

<style lang="scss">
@use '@/styles/util';

.BaseLayoutContainer {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: util.$background-color;
  color: util.$text-color;
}

.BaseMain {
  margin: 1rem;
  section {
    flex-direction: column;
    width: fit-content;
    gap: 1em;
  }
}
</style>
