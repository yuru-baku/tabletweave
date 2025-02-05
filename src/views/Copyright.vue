<script setup lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies'
import { onUnmounted, ref } from 'vue'

const cookies = useCookies(['username'])
let name = ref(cookies.get('username') || '')
function joinRoom() {
  cookies.set('username', name.value)
}
</script>

<template>
  <main class="vertical">
    <form class="frame" id="name-chooser" @submit.prevent="joinRoom()">
      <label for="nickname">Choose your name</label>
      <input
        type="text"
        id="nickname"
        default="LustigerName420"
        v-model="name" />
      <!-- <button type="button" class="startButton" @click="joinRoom()">Start</button> -->
    </form>
  </main>
</template>
