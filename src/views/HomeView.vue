<script setup lang="ts"></script>

<template>
  <div class="container">
    <h1>⚔️ {{ $t("web.titles.home") }} ⚔️</h1>
    <h3>{{ $t("web.titles.welcome") }}</h3>
    <p v-html="$t('web.texts.home.p.welcome01')"></p>
    <p v-html="$t('web.texts.home.p.welcome02')"></p>
    <h3>{{ $t("web.titles.sections") }}</h3>
    <p v-html="$t('web.texts.home.p.sections01')"></p>
    <h3>{{ $t("web.titles.expansionsAvailable") }}</h3>
    <ul>
      <li>Clash of Spears</li>
      <li>Fields of Blood</li>
      <li>Rise of Eagles</li>
      <li>Clash of Katanas</li>
    </ul>
    <h3>{{ $t("web.titles.componentsWebs") }}</h3>
    <ul>
      <li v-html="$t('web.texts.home.p.webs01')"></li>
    </ul>
    <h3>{{ $t("web.titles.news") }}</h3>
    <ul>
      <li v-html="$t('web.texts.home.p.news01')"></li>
      <li v-html="$t('web.texts.home.p.news02')"></li>
      <li v-html="$t('web.texts.home.p.news03')"></li>
      <li v-html="$t('web.texts.home.p.news04')"></li>
    </ul>
    <p
      v-html="
        $t('web.texts.home.p.listAllChanges', {
          url: 'https://github.com/juananmuxed/cod-sheet-creator/blob/main/CHANGELOG.md',
        })
      "
    ></p>
  </div>
</template>
