<template>
  <div v-if="sheets.isCreatingList">
    <h4
      v-text="
        `${sheets.getCompleteArmy?.label} (${units.costTotal} ${$t(
          'web.texts.points'
        )})`
      "
    ></h4>
    <p>
      {{ $t(`sheets.warbandTypes.${units.warbandType}`) }} ({{
        units.warbandType
      }})
      {{
        $t("web.texts.ofFigures", units.figuresTotal) +
        " " +
        $t("web.texts.inUnits", units.unitsTotal)
      }}
    </p>
    <p
      v-html="
        $t('web.texts.breakPointsEveryFigures', units.breakPointThreshold)
      "
    ></p>
  </div>
  <div v-else>
    <h2 v-text="$t('web.titles.army')"></h2>
    <RadioGroupComponent
      v-model="sheets.selectedArmy"
      :options="sheets.availableArmies"
    ></RadioGroupComponent>
    <p v-text="$t('web.texts.army')"></p>
  </div>
</template>

<script setup lang="ts">
import { useSheetsStore } from "@/stores/sheets";
import { useUnitsStore } from "@/stores/units";
import RadioGroupComponent from "../RadioGroupComponent.vue";

const units = useUnitsStore();
const sheets = useSheetsStore();
</script>

<style scoped></style>
