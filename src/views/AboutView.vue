<script setup lang="ts"></script>

<template>
  <div class="container">
    <h1 v-text="$t('web.titles.about')"></h1>
    <h3 v-text="$t('web.titles.whatIsThisWeb')"></h3>
    <p v-html="$t('web.texts.about.p.whatIsThisWeb01')"></p>
    <p v-html="$t('web.texts.about.p.whatIsThisWeb02')"></p>
    <ul>
      <li>
        <a href="https://www.fightinghedgehog.com/" target="_blank"
          >Fighting Hedgehog</a
        >
      </li>
      <li>
        <a href="https://www.facebook.com/CLASHofSpears/" target="_blank"
          >Clash of Spears Facebook</a
        >
      </li>
      <li>
        <a href="http://www.thewargamespot.com/clash-of-spears/" target="_blank"
          >The warhammer spot</a
        >
      </li>
    </ul>
    <h3 v-text="$t('web.titles.howReportBugs')"></h3>
    <p v-html="$t('web.texts.about.p.howReportBugs01')"></p>
    <ul>
      <li>
        <a href="https://discord.gg/88rzwfU" target="_blank">Discord</a>
      </li>
      <li>
        <a
          href="https://github.com/juananmuxed/cod-sheet-creator/issues"
          target="_blank"
          >GitHub</a
        >
      </li>
    </ul>
    <p v-html="$t('web.texts.about.p.howReportBugs02')"></p>
    <h3 v-text="$t('web.titles.howSaveLists')"></h3>
    <p v-html="$t('web.texts.about.p.howSaveLists01')"></p>
    <p v-html="$t('web.texts.about.p.howSaveLists02')"></p>
    <p v-html="$t('web.texts.about.p.howSaveLists03')"></p>
    <h3 v-text="$t('web.titles.whoIsProject')"></h3>
    <h4 v-text="$t('web.titles.developers')"></h4>
    <ul>
      <li><a href="https://muxed.dev" target="_blank">MuXeD</a></li>
    </ul>
    <h4 v-text="$t('web.titles.translaters')"></h4>
    <ul>
      <li><a href="https://muxed.dev" target="_blank">MuXeD</a></li>
    </ul>
    <p v-html="$t('web.texts.about.p.whoIsProject01')"></p>
  </div>
</template>
