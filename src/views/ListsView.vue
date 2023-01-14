<script setup lang="ts">
import { useSheetsStore } from "@/stores/sheets";
import ExpansionSelectorComponent from "@/components/Lists/ExpansionSelectorComponent.vue";
import ArmySelectorComponent from "@/components/Lists/ArmySelectorComponent.vue";
import SheetOptionsComponent from "@/components/Lists/SheetOptionsComponent.vue";
import ArmyDataComponent from "@/components/Lists/ArmyDataComponent.vue";
import ArmyTableComponent from "@/components/Lists/ArmyTableComponent.vue";

const sheets = useSheetsStore();

sheets.getUriParams();
</script>

<template>
  <div class="container">
    <div class="army">
      <div class="titles">
        <ExpansionSelectorComponent></ExpansionSelectorComponent>
        <ArmySelectorComponent
          v-if="sheets.isSelectedExpansion"
        ></ArmySelectorComponent>
      </div>
      <div class="data" v-if="sheets.isCreatingList">
        <ArmyDataComponent></ArmyDataComponent>
      </div>
    </div>
    <button
      v-if="!sheets.isCreatingList"
      :disabled="!Boolean(sheets.isSelectedArmy)"
      @click="sheets.startList"
    >
      {{ $t("web.buttons.createList") }}
    </button>
    <div class="sheet" v-else>
      <SheetOptionsComponent></SheetOptionsComponent>
      <ArmyTableComponent></ArmyTableComponent>
      <!-- TODO: add traits, weapons and armour tables -->
    </div>
  </div>
</template>

<style scoped src="@/assets/scss/components/lists.scss"></style>
