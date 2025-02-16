<script setup lang="ts"></script>
<template>
  <div class="panel" id="fg">
    <label>Colours:</label>
    <ColorPalete></ColorPalete>
    <span class="panelitem">
      <label class="panelitemlabel"> Colour Name:</label>
      <label class="panelitemvalue" id="colourname"> </label>
    </span>
    <div id="coloursliders">
      <span class="panelitem">
        <label class="panelitemlabel">Red:</label>
        <span class="panelitemvalue">
          <input type="range" min="0" max="255" id="REDSLIDE" value="0" />
          <input class="readout" id="REDVAL" value="0" />
        </span>
      </span>

      <span class="panelitem">
        <label class="panelitemlabel">Green:</label>
        <span class="panelitemvalue">
          <input type="range" min="0" max="255" id="GREENSLIDE" value="0" />
          <input class="readout" id="GREENVAL" value="0" />
        </span>
      </span>

      <span class="panelitem">
        <label class="panelitemlabel">Blue:</label>
        <span class="panelitemvalue">
          <input type="range" min="0" max="255" id="BLUESLIDE" value="0" />
          <input class="readout" id="BLUEVAL" value="0" />
        </span>
      </span>
    </div>
  </div>
</template>
<style lang="scss">
@use '@/styles/util';
</style>
