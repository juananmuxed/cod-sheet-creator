<template>
  <div class="data">
    <ul>
      <li>{{ $t("web.titles.leaders") }}: {{ sheets.leadersTotal }}</li>
      <li>{{ $t("web.titles.civis") }}: {{ sheets.civisTotal }}</li>
      <li>{{ $t("web.titles.milites") }}: {{ sheets.militesTotal }}</li>
      <li>{{ $t("web.titles.rares") }}: {{ sheets.raresTotal }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useSheetsStore } from "@/stores/sheets";

const sheets = useSheetsStore();
</script>

<style scoped src="@/assets/scss/components/data.scss"></style>
