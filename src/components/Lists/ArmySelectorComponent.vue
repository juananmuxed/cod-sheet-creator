<template>
  <div v-if="sheets.isCreatingList">
    <h4
      v-text="
        `${sheets.getCompleteArmy?.label} (${sheets.costTotal} ${$t(
          'web.texts.points'
        )})`
      "
    ></h4>
    <p>
      {{ $t(`sheets.warbandTypes.${sheets.warbandType}`) }} ({{
        sheets.warbandType
      }})
      {{
        $t("web.texts.ofFigures", sheets.figuresTotal) +
        " " +
        $t("web.texts.inUnits", sheets.unitsTotal)
      }}
    </p>
    <p
      v-html="
        $t('web.texts.breakPointsEveryFigures', sheets.breakPointThreshold)
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
import RadioGroupComponent from "../RadioGroupComponent.vue";

const sheets = useSheetsStore();
</script>

<style scoped></style>
