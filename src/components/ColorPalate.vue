<script setup lang="ts">
const props = defineProps({});
</script>
<template>
  <table class="colorPalete">
    <tr id="colorboxRow">
      <td class="colorbox selected" id="EMPTYBOX">None</td>
      <td class="colorbox" id="BOX1"></td>
      <td class="colorbox" id="BOX2"></td>
      <td class="colorbox" id="BOX3"></td>
      <td class="colorbox" id="BOX4"></td>
      <td class="colorbox" id="BOX5"></td>
      <td class="colorbox" id="BOX6"></td>
      <td class="colorbox" id="BOX7"></td>
      <td class="colorbox" id="BOX8"></td>
      <td class="colorbox" id="BOX9"></td>
      <td class="colorbox" id="BOX10"></td>
      <td class="colorbox" id="BOX11"></td>
      <td class="colorbox" id="BOX12"></td>
    </tr>
    <tr id="colornumRow">
      <td class="colornum" id="NUM0">0</td>
      <td class="colornum" id="NUM1">1</td>
      <td class="colornum" id="NUM2">2</td>
      <td class="colornum" id="NUM3">3</td>
      <td class="colornum" id="NUM4">4</td>
      <td class="colornum" id="NUM5">5</td>
      <td class="colornum" id="NUM6">6</td>
      <td class="colornum" id="NUM7">7</td>
      <td class="colornum" id="NUM8">8</td>
      <td class="colornum" id="NUM9">9</td>
      <td class="colornum" id="NUM10">10</td>
      <td class="colornum" id="NUM11">11</td>
      <td class="colornum" id="NUM12">12</td>
    </tr>
  </table>
</template>

<style lang="scss" scoped>
@use '@/styles/util';

.colorPalete {
  border-spacing: 0.2rem;
}
.colorbox {
  width: 2em;
  height: 2em;
  border: 1px solid black;
  border-radius: util.$border-radius;
}

.colornum {
  text-align: center;
}
</style>
