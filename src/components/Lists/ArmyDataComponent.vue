<template>
  <div class="data">
    <ul>
      <li>Personajes: {{ sheets.leadersTotal }}</li>
      <li>Civis: {{ sheets.civisTotal }}</li>
      <li>Milites: {{ sheets.militesTotal }}</li>
      <li>Rare: {{ sheets.raresTotal }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useSheetsStore } from "@/stores/sheets";

const sheets = useSheetsStore();
</script>

<style scoped src="@/assets/scss/components/data.scss"></style>
