<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue';
import { useCookies } from '@vueuse/integrations/useCookies';
import { onUnmounted, ref } from 'vue';
import { useRouter, type Router } from 'vue-router';
const router = useRouter();
const cookies = useCookies(['username']);
let name = ref(cookies.get('username') || '');
function joinRoom() {
  cookies.set('username', name.value);
}
</script>

<template>
  <BaseLayout>
    <div id="HowTo">
      TDD is designed to produce tablet weaving patterns with two sections; the
      threading diagram and the turning diagram. The threading diagram (at the
      bottom) shows how the tablets should be set up and the turning diagram (at
      the top) shows how forwards and backwards turns of the tablets will make
      the pattern. Each column of the turning diagram represents one tablet and
      each row represents a single pick (or row) of weaving. Each oval in both
      the threading and turning diagrams represent a single warp thread.

      <ol>
        <li>
          Use the controls to select the number of tablets you want, how many
          holes they should have, and how many picks you want the turning
          diagram to have.
        </li>
        <li>
          Select the threading of each tablet by clicking on the S or Z below
          the threading diagram. The letters correspond to the way that the
          threads pass through the tablet, as described by Peter Collingwood in
          "The Techniques of Tablet Weaving". The oval shapes in the threading
          diagram correspond to the alignment of the tablets on the warp when
          viewed from above.
        </li>

        <li>
          Click on a colour from the palette to select it, adjusting it using
          the RGB sliders if needed, and click on an oval in the threading
          diagram to change its colour. Select the "none" square in the palette,
          then click on an oval in the threading diagram to leave that hole
          empty. The number you see under each colour in the palette shows how
          many threads of each colour have been used in the threading diagram.
        </li>
        <li>
          TDD will automatically update the turning diagram if you change the
          threading direction or the thread colours in the threading diagram.
        </li>

        <li>
          The squares in the turning diagram with white backgrounds show that
          the tablet should be turned forwards; click on the square to change
          the background to grey to show that the tablet should turn backwards.
          Every pick above the point where you changed the turning direction
          will also change turning direction automatically. During weaving, the
          warp threads will twine (twist) in the direction shown by the ovals of
          the turning diagram.
        </li>
        <li>
          You can save your work as a tdd file or turn the pattern into an svg,
          jpeg, or png image file.
        </li>
        <li>
          More advanced features are included, such as repeating pattern
          sections, and configurable rulers which you can position on the draft
          to make things easier for you. These advanced features are turned off
          by default, but you can find them in the control panel.
        </li>
      </ol>
      <p>
        More help on how to use TDD, as well as tutorials, patterns and a
        gallery of woven bands, can be found on Catherine's blog at
        <a href="www.tabletweavingintheoryandpractice.co.uk">
          www.tabletweavingintheoryandpractice.co.uk
        </a>
      </p>
      <p>
        If you have any bugs, comments, or suggestions please contact us at
        <a href="mailto:catherine.ward+tdd@gmail.com">
          catherine.ward+tdd@gmail.com
        </a>
      </p>
    </div>
  </BaseLayout>
</template>

<style lang="scss">
#HowTo {
  margin: auto;
  width: 40rem;
}
</style>
