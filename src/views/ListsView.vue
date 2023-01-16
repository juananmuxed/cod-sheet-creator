<script setup lang="ts">
import { useSheetsStore } from "@/stores/sheets";
import { useOptionsStore } from "@/stores/options";
import ExpansionSelectorComponent from "@/components/Lists/ExpansionSelectorComponent.vue";
import ArmySelectorComponent from "@/components/Lists/ArmySelectorComponent.vue";
import SheetOptionsComponent from "@/components/Lists/SheetOptionsComponent.vue";
import ArmyDataComponent from "@/components/Lists/ArmyDataComponent.vue";
import ArmyTableComponent from "@/components/Lists/ArmyTableComponent.vue";
import TableAditionalComponent from "@/components/Lists/TableAditionalComponent.vue";

const sheets = useSheetsStore();
const options = useOptionsStore();

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
      <TableAditionalComponent
        :title="$t('web.titles.traitsDescriptions')"
        type="traits"
        :items="sheets.availableTraits"
        v-if="options.printTraitsTable && sheets.availableTraits.length > 0"
      ></TableAditionalComponent>
      <TableAditionalComponent
        :title="$t('web.titles.weaponsDescriptions')"
        type="weapons"
        :items="sheets.availableWeapons"
        v-if="options.printWeaponsTable && sheets.availableWeapons.length > 0"
      ></TableAditionalComponent>
      <TableAditionalComponent
        :title="$t('web.titles.armoursDescriptions')"
        type="armors"
        :items="sheets.availableArmours"
        v-if="options.printArmourTable && sheets.availableArmours.length > 0"
      ></TableAditionalComponent>
    </div>
  </div>
</template>

<style scoped src="@/assets/scss/components/lists.scss"></style>
