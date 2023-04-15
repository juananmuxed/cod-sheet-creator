<template>
  <div class="data">
    <img
      v-if="sheets.getCompleteArmy?.imgUrl && options.printArmiesImages"
      :src="sheets.getCompleteArmy?.imgUrl"
    />
    <ul>
      <li>{{ $t("web.titles.leaders") }}: {{ units.leadersTotal }}</li>
      <li>{{ $t("web.titles.civis") }}: {{ units.civisTotal }}</li>
      <li>{{ $t("web.titles.milites") }}: {{ units.militesTotal }}</li>
      <li>{{ $t("web.titles.rares") }}: {{ units.raresTotal }}</li>
      <li>{{ $t("web.titles.characters") }}: {{ units.charactersTotal }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useOptionsStore } from "@/stores/options";
import { useSheetsStore } from "@/stores/sheets";
import { useUnitsStore } from "@/stores/units";

const units = useUnitsStore();
const sheets = useSheetsStore();
const options = useOptionsStore();
</script>

<style scoped src="@/assets/scss/components/data.scss"></style>
