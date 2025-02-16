<script setup lang="ts">
import { useRouter, type Router } from 'vue-router';
import BaseLayout from '@/components/BaseLayout.vue';

const router = useRouter();
</script>

<template>
  <BaseLayout>
    <h1 data-i18n="copyright_notice.title"></h1>

    <div id="explanation">
      <ul>
        <li>
          Tabletweaving Draft Designer is provided free of charge for use in
          creating, editing, viewing, and otherwise working with tablet weaving
          drafts. We do not currently plan to ever charge for it.
        </li>
        <li>
          Any draft created using this software belongs to THE PERSON WHO
          DESIGNED IT, and that person may use it however they wish. This
          applies to both the computer-readable .tdd file and any human readable
          output format (.txt, .png. .svg, .jpg, etc...).
        </li>
        <li>
          You MAY use drafts you designed yourself in commercial work if you
          wish.
        </li>
        <li>
          We ASK (but do not require) that you include a statement that the
          drafts were designed using TDD and a link to TDD
          <a href="http://bazzalisk.org/tabletweave/">
            http://bazzalisk.org/tabletweave/
          </a>
          >so that others might find it more easily/s.
        </li>
        <li>
          If you wish to support the work we do then links to Catherine's books
          can be found here:
          <a
            href="http://www.tabletweavingintheoryandpractice.co.uk/p/books-ive-written-about-tablet-weaving.html">
            http://www.tabletweavingintheoryandpractice.co.uk/p/books-ive-written-about-tablet-weaving.html
          </a>
        </li>
      </ul>
    </div>
  </BaseLayout>
</template>
