<template>
  <div class="data">
    <ul>
      <li>{{ $t("web.titles.leaders") }}: {{ units.leadersTotal }}</li>
      <li>{{ $t("web.titles.civis") }}: {{ units.civisTotal }}</li>
      <li>{{ $t("web.titles.milites") }}: {{ units.militesTotal }}</li>
      <li>{{ $t("web.titles.rares") }}: {{ units.raresTotal }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useUnitsStore } from "@/stores/units";

const units = useUnitsStore();
</script>

<style scoped src="@/assets/scss/components/data.scss"></style>
