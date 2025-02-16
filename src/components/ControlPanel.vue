<script setup lang="ts"></script>
<template>
  <div class="controlpanel" id="draft_name">
    <button class="accordion active"><slot></slot></button>
    <div class="panel">
      <span class="panelitem">
        <slot></slot>
      </span>
    </div>
  </div>
</template>
