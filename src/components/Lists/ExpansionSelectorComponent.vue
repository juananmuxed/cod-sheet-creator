<template>
  <h3
    v-if="sheets.isCreatingList"
    v-text="sheets.getCompleteExpansion?.label"
  ></h3>
  <div v-else>
    <h2 v-text="$t('web.titles.expansion')"></h2>
    <RadioGroupComponent
      v-model="sheets.selectedExpansion"
      :options="sheets.expansions"
    ></RadioGroupComponent>
    <p v-text="$t('web.texts.expansion')"></p>
  </div>
</template>

<script setup lang="ts">
import { useSheetsStore } from "@/stores/sheets";
import RadioGroupComponent from "../RadioGroupComponent.vue";

const sheets = useSheetsStore();
</script>

<style scoped></style>
