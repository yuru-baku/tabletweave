<script setup lang="ts">
import BaseHeader from '@/components/BaseHeader.vue'
import BaseFooter from '@/components/BaseFooter.vue'
</script>

<template>
  <div class="BaseLayoutContainer">
    <BaseHeader> </BaseHeader>
    <main>
      <slot></slot>
    </main>
    <BaseFooter> </BaseFooter>
  </div>
</template>
