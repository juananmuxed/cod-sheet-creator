<script setup lang="ts">
import { useLanguageStore } from "@/stores/language";
import { RouterLink } from "vue-router";
import menu from "./menu.json";

const language = useLanguageStore();
</script>

<template>
  <header>
    <nav>
      <ul>
        <li v-for="(link, index) in menu.links" :key="index">
          <RouterLink :to="{ name: link.name }">{{
            $t(`web.menu.${link.name}`)
          }}</RouterLink>
        </li>
      </ul>
      <!-- <li>
        <select v-model="language.lang">
          <option
            v-for="locale in $i18n.availableLocales"
            :key="`locale-${locale}`"
            :value="locale"
          >
            {{ locale }}
          </option>
        </select>
      </li> -->
    </nav>
  </header>
</template>

<style lang="scss" scoped src="@/assets/scss/components/header.scss"></style>
