<script setup lang="ts"></script>

<template>
  <footer class="BaseFooter">
    <div id="instructions">
      <span class="instructionlink">
        <a
          href="https://www.tabletweavingintheoryandpractice.co.uk/2021/02/getting-most-from-tablet-weaving-draft.html"
          target="_blank">
          Instructions
        </a>
      </span>
    </div>
    <div id="usingRepeats">
      <span class="instructionlink">
        <a
          href="https://www.tabletweavingintheoryandpractice.co.uk/2021/01/using-new-pattern-repeat-tool-on-tdd.html"
          target="_blank">
          Using the Pattern Repeat Tool
        </a>
      </span>
    </div>
    <div id="blogvert">
      <p class="blogvert">
        For more tablet weaving drafts, information and help with tablet
        weaving, please read my
        <a href="https://www.tabletweavingintheoryandpractice.co.uk"> blog </a>.
      </p>
    </div>

    <div class="copyright">
      <h3>Copyright Notice:</h3>
      <p>
        Tablet Weaving Draft Designer v1.7.1 Copyright &copy; 2015-2024 James P.
        Weaver and Catherine Weaver. The copyright of drafts designed with this
        software rests with the designer of the draft, not of the software. For
        more details on copyright and usage please click
        <RouterLink to="/copyright">here</RouterLink>
      </p>
    </div>
  </footer>
</template>

<style lang="scss">
@use '@/styles/util';

.BaseFooter {
  margin: 1rem;
  padding: 0.5rem;
  border: util.$border;
  border-radius: util.$border-radius;
  text-align: left;
}
</style>
