<script setup lang="ts">
const props = defineProps({});
</script>
<template>
  <div>
    <table>
      <tr>
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
        <td class="colornum" id="NUM0"></td>
        <td class="colornum" id="NUM1"></td>
        <td class="colornum" id="NUM2"></td>
        <td class="colornum" id="NUM3"></td>
        <td class="colornum" id="NUM4"></td>
        <td class="colornum" id="NUM5"></td>
        <td class="colornum" id="NUM6"></td>
        <td class="colornum" id="NUM7"></td>
        <td class="colornum" id="NUM8"></td>
        <td class="colornum" id="NUM9"></td>
        <td class="colornum" id="NUM10"></td>
        <td class="colornum" id="NUM11"></td>
        <td class="colornum" id="NUM12"></td>
      </tr>
    </table>
  </div>
</template>
