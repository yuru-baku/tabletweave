<script setup lang="ts">
import ControlPanel from './ControlPanel.vue';
import PaletControl from './PaletControl.vue';
</script>

<template>
  <div>
    <section class="controlbar">
      <ControlPanel id="draft_name" title="Draft Name">
        <span class="panelitem">
          <label class="panelitemlabel" for="draftname">Draft Name:</label>
          <input
            id="draftname"
            class="panelitemvalue readout"
            value=""
            type="text" />
        </span>
      </ControlPanel>
      <ControlPanel id="controls" title="Controls">
        <span class="panelitem" id="mainrowcontrols">
          <label class="panelitemlabel">Picks</label>
          <span class="numberInput panelitemvalue">
            <button class="minus">-</button>
            <input class="readout" value="0" />
            <button class="plus">+</button>
          </span>
        </span>
        <span class="panelitem" id="lowrowcontrols">
          <label class="panelitemlabel">Number of Holes:</label>
          <span class="panelitemvalue numberInput">
            <button class="minus">-</button>
            <input class="readout" value="0" />
            <button class="plus">+</button>
          </span>
        </span>
        <span class="panelitem" id="colcontrols">
          <label class="panelitemlabel">Number of Tablets:</label>
          <span class="panelitemvalue numberInput">
            <button class="minus">-</button>
            <input class="readout" value="0" />
            <button class="plus">+</button>
          </span>
        </span>
        <span class="panelitem" id="showcontrols">
          <label class="panelitemlabel" for="addright"> Add tablets on:</label>
          <span class="panelitemvalue">
            <div class="selectionlist" id="addright">
              <span>
                <label for="left">Left</label>
                <input type="radio" name="addright" value="left" id="left" />
              </span>
              <span>
                <label for="right">Right</label>
                <input type="radio" name="addright" value="right" id="right" />
              </span>
            </div>
          </span>
        </span>
        <span class="panelitem" id="showcontrols">
          <label class="panelitemlabel" for="lockdraft">Lock Draft</label>
          <span class="panelitemvalue">
            <input type="checkbox" id="lockdraft" checked="false" />
          </span>
        </span>
      </ControlPanel>

      <ControlPanel id="rulers" title="Rulers"
        ><span class="panelitem" id="showcontrols">
          <label class="panelitemlabel" for="showhruler"
            >Show Horizontal Ruler</label
          >
          <span class="panelitemvalue">
            <input type="checkbox" id="showhruler" checked="true" />
          </span>
        </span>
        <span class="panelitem" id="showcontrols">
          <label class="panelitemlabel" for="showvruler"
            >Show Vertical Ruler</label
          >
          <span class="panelitemvalue">
            <input type="checkbox" id="showvruler" checked="true" />
          </span>
        </span>
        <span class="panelitem" id="hruler">
          <label class="panelitemlabel"> Horizontal Ruler Position: </label>
          <span class="panelitemvalue">
            <button class="minus">-</button>
            <input class="readout" value="0" />
            <button class="plus">+</button>
          </span>
        </span>
        <span class="panelitem" id="vruler">
          <label class="panelitemlabel"> Vertical Ruler Position: </label>
          <span class="panelitemvalue">
            <button class="minus">-</button>
            <input class="readout" value="0" />
            <button class="plus">+</button>
          </span>
        </span>
      </ControlPanel>

      <ControlPanel id="display" title="Display">
        <span class="panelitem" id="showcontrols">
          <label class="panelitemlabel" for="showovals">Show Threads</label>
          <span class="panelitemvalue">
            <input type="checkbox" id="showovals" checked="true" />
          </span>
        </span>
        <span class="panelitem" id="showcontrols">
          <label class="panelitemlabel" for="showsquares"
            >Only Show Thread Colour</label
          >
          <span class="panelitemvalue">
            <input type="checkbox" id="showsquares" />
          </span>
        </span>
        <span class="panelitem" id="showcontrols">
          <label class="panelitemlabel" for="showtwist">Show twist</label>
          <span class="panelitemvalue">
            <input type="checkbox" id="showtwist" checked="true" />
          </span>
        </span>
        <span class="panelitem" id="showcontrols">
          <label class="panelitemlabel" for="showupper"
            >Show Turning Diagram</label
          >
          <span class="panelitemvalue">
            <input type="checkbox" id="showupper" checked="true" />
          </span>
        </span>
        <span class="panelitem" id="showcontrols">
          <label class="panelitemlabel" for="showlower"
            >Show Threading Diagram</label
          >
          <span class="panelitemvalue">
            <input type="checkbox" id="showlower" checked="true" />
          </span>
        </span>
        <span class="panelitem" id="showcontrols">
          <label class="panelitemlabel" for="showreversal"
            >Show Reversal Points</label
          >
          <span class="panelitemvalue">
            <input type="checkbox" id="showreversal" checked="true" />
          </span>
        </span>
        <span class="panelitem" id="showcontrols">
          <label class="panelitemlabel" for="showtext"
            >Show Text Description</label
          >
          <span class="panelitemvalue">
            <input type="checkbox" id="showtext" />
          </span>
        </span>
        <span class="panelitem" id="showcontrols">
          <label class="panelitemlabel" for="showgrid">Show grid</label>
          <span class="panelitemvalue">
            <input type="checkbox" id="showgrid" checked="true" />
          </span>
        </span>
        <span class="panelitem" id="showcontrols">
          <label class="panelitemlabel" for="labelholescw"
            >Label Holes Clockwise</label
          >
          <span class="panelitemvalue">
            <input id="labelholescw" type="checkbox" checked="true" />
          </span>
        </span>
        <span class="panelitem" id="showcontrols">
          <label class="panelitemlabel" for="invertsz">S ↔Z</label>
          <span class="panelitemvalue">
            <label class="switch">
              <input type="checkbox" id="invertsz" checked="true" />
              <span class="slider round"> </span>
            </label>
          </span>
        </span>
        <span class="panelitem" id="saturationcontrols">
          <label class="panelitemlabel">Backwards Turn Saturation:</label>
          <span class="panelitemvalue">
            <input type="range" min="0" max="255" id="GREYSLIDER" value="144" />
            <input class="readout" id="GREYVAL" value="144" />
          </span>
        </span>
        <span class="panelitem" id="scalecontrols">
          <label class="panelitemlabel">Visual Scale:</label>
          <span class="panelitemvalue">
            <button class="minus">-</button>
            <input class="readout" value="0" />
            <button class="plus">+</button>
          </span>
        </span>
      </ControlPanel>

      <ControlPanel id="repeats" title="Repeats">
        <span class="panelitem" id="showrepeat">
          <label class="panelitemlabel" for="showrepeats">Show Repeats</label>
          <span class="panelitemvalue">
            <input type="checkbox" id="showrepeats" checked="false" />
          </span>
        </span>
        <span class="panelitem" id="repeatstart">
          <label class="panelitemlabel">Repeat Starting at Pick:</label>
          <span class="numberInput panelitemvalue">
            <button class="minus">-</button>
            <input class="readout" value="0" />
            <button class="plus">+</button>
          </span>
        </span>
        <span class="panelitem" id="repeatend">
          <label class="panelitemlabel">Repeat Ending at Pick:</label>
          <span class="numberInput panelitemvalue">
            <button class="minus">-</button>
            <input class="readout" value="0" />
            <button class="plus">+</button>
          </span>
        </span>
        <span class="panelitem" id="numrepeats">
          <label class="panelitemlabel">Number of Repeats:</label>
          <span class="numberInput panelitemvalue">
            <button class="minus">-</button>
            <input class="readout" value="0" />
            <button class="plus">+</button>
          </span>
        </span>
        <span class="panelitem" id="rscalecontrols">
          <label class="panelitemlabel">Visual Scale:</label>
          <span class="numberInput panelitemvalue">
            <button class="minus">-</button>
            <input class="readout" value="0" />
            <button class="plus">+</button>
          </span>
        </span>
      </ControlPanel>

      <ControlPanel id="resets" title="Resets">
        <div class="panel">
          <span class="panelitem">
            <button id="resetpallette">Reset Palette</button>
          </span>
          <span class="panelitem">
            <button id="clear">Clear Pattern</button>
          </span>
          <span class="panelitem">
            <button id="reset">Reset Everything</button>
          </span>
        </div>
      </ControlPanel>

      <ControlPanel id="palete" title="Palette"
        ><PaletControl></PaletControl
      ></ControlPanel>

      <ControlPanel id="export" title="Export">
        <div class="panel">
          <div class="ControlPanel">
            <span class="panelitem">
              <label for="export_width">Export Width (px):</label>
              <span>
                <input class="readout" id="export_width" value="1920" />
              </span>
            </span>
          </div>
          <div class="panelitem" id="draftexport">
            <h4>Draft</h4>
            <span> <button id="svg">SVG</button> </span>
            <span> <button id="jpeg">JPEG</button> </span>
            <span> <button id="png">PNG</button> </span>
            <span> <button id="txt">Text</button> </span>
          </div>
          <div class="panelitem" id="repeatexport">
            <h4>Repeat</h4>
            <span> <button id="svg">SVG</button> </span>
            <span> <button id="jpeg">JPEG</button> </span>
            <span> <button id="png">PNG</button> </span>
          </div>
        </div>
      </ControlPanel>

      <controlPanel id="fileio" title="Files">
        <div class="panel">
          <span class="panelitem"> <button id="save">Save</button> </span>
          <span class="panelitem">
            <label>Load</label>
            <input type="file" accept="application/json,.tdd,.txt" id="load" />
          </span>
        </div>
      </controlPanel>
    </section>

    <section id="mainsection">
      <div id="draftcanvas" class="draftcanvas">
        <svg></svg>
      </div>
    </section>

    <section id="repeatsection">
      <div id="repeatcanvas" class="repeatcanvas"></div>
    </section>

    <section id="textinstructions">
      <ul>
        <li>Threading:</li>
        <ol id="threadinginstructions"></ol>
        <li>Turning:</li>
        <ol id="turninginstructions"></ol>
      </ul>
    </section>
  </div>
</template>

<style lang="scss">
@use '@/styles/util';

.controlbar {
  border: util.$border;
  border-radius: util.$border-radius;
  overflow-y: scroll;
  background-color: util.$control_background;
  display: flex;
  flex-direction: column;
  gap: 1em;

  .ControlPanel {
    display: flex;
    flex-direction: column;
    background-color: util.$control_background;

    .active:after {
      content: '\2796'; /* Unicode character for "minus" sign (-) */
    }

    .accordion {
      background-color: hsl(0, 0%, 90%);
      font-variant: small-caps;
      font-size: larger;
      color: black;
      cursor: pointer;
      padding: 18px;
      text-align: left;
      transition: 0.4s;

      /* Overwrite button styling*/
      border: none;
      outline: none;
      width: 100%;
      &:hover {
        background-color: util.$active_highlight;
        transition: 0.2s;
      }

      //switch + with - when controls are extendet
      &::after {
        content: '\02795'; /* Unicode character for "plus" sign (+) */
        font-size: 13px;
        color: #777;
        float: right;
        margin-left: 5px;
      }
    }

    .panel {
      margin: 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.5em;

      .panelitem {
        display: flex;
        flex-direction: row;

        .panelitemlabel {
          flex: 2;
        }

        .panelitemvalue {
          flex: 3;
        }
      }
    }
  }
}
</style>
