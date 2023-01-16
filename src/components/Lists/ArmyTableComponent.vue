<template>
  <div class="units-add no-print">
    <h4>{{ $t("web.texts.units") }}</h4>
    <CheckboxGroupComponent
      v-model="sheets.selectedUnits"
      :options="sheets.availableUnits"
    ></CheckboxGroupComponent>
    <div>
      <button @click="sheets.addUnits" :disabled="!sheets.isSelectedUnits">
        {{ $t("web.texts.addUnits") }}
      </button>
    </div>
  </div>

  <div class="table">
    <div class="table-header">
      <div class="row">
        <div class="cell no-print"></div>
        <div class="cell cell-wide">
          {{ $t("web.texts.troopName") }}
        </div>
        <div class="cell">{{ $t("web.texts.combatCompact") }}</div>
        <div class="cell">{{ $t("web.texts.rangedCompact") }}</div>
        <div class="cell">{{ $t("web.texts.gritCompact") }}</div>
        <div class="cell">{{ $t("web.texts.salvationCompact") }}</div>
        <div class="cell cell-medium">{{ $t("web.texts.weapon") }}</div>
        <div class="cell cell-medium">{{ $t("web.texts.armour") }}</div>
        <div class="cell cell-wide">{{ $t("web.texts.traits") }}</div>
        <div class="cell no-print"></div>
      </div>
    </div>
    <div class="table-body">
      <div
        class="row"
        v-for="(unit, index) in sheets.unitsInArmy"
        :key="index + '-unit'"
      >
        <UnitRowComponent :unit="unit" :index="index"></UnitRowComponent>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSheetsStore } from "@/stores/sheets";
import CheckboxGroupComponent from "../CheckboxGroupComponent.vue";
import UnitRowComponent from "./UnitRowComponent.vue";

const sheets = useSheetsStore();
</script>

<style scoped src="@/assets/scss/components/table.scss"></style>
