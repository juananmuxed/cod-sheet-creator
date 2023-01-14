<template>
  <div class="cell no-print">
    <div class="options-buttons">
      <button
        :class="sheets.isFirstUnit(index) ? 'invisible' : ''"
        :disabled="sheets.isFirstUnit(index)"
        @click="sheets.orderUp(index)"
      >
        <IconComponent name="arrow-up"></IconComponent>
      </button>
      <button
        :class="sheets.isLastUnit(index) ? 'invisible' : ''"
        :disabled="sheets.isLastUnit(index)"
        @click="sheets.orderDown(index)"
      >
        <IconComponent name="arrow-down"></IconComponent>
      </button>
    </div>
  </div>
  <div class="cell cell-wide">
    <span>
      <b>{{ $t(`sheets.units.${unit.translate}`) }}</b>
      ({{ sheets.getAvailability(unit.availability) }})
    </span>
  </div>
  <div class="cell">{{ unit.combat }}+</div>
  <div class="cell">{{ unit.ranged }}+</div>
  <div class="cell">{{ unit.grit }}+</div>
  <div class="cell">{{ sheets.calculateSave(unit) }}+</div>
  <div class="cell cell-medium">
    <span class="flex">
      <BadgeComponent
        color="primary"
        outlined
        small
        v-if="unit.weapon && !sheets.isHidenItem(unit.weapon)"
        >{{
          $t(`sheets.weapons.${sheets.getWeaponTranslate(unit.weapon)}`) +
          sheets.getWeaponIniciative(unit.weapon)
        }}</BadgeComponent
      >
    </span>
  </div>
  <div class="cell cell-medium">
    <span class="flex">
      <BadgeComponent
        color="primary"
        outlined
        small
        v-if="unit.shield && !sheets.isHidenItem(unit.shield)"
        >{{
          $t(`sheets.armors.${sheets.getArmourTranslate(unit.shield)}`)
        }}</BadgeComponent
      >
      <BadgeComponent
        color="primary"
        outlined
        small
        v-if="unit.body && !sheets.isHidenItem(unit.body)"
        >{{
          $t(`sheets.armors.${sheets.getArmourTranslate(unit.body)}`)
        }}</BadgeComponent
      >
      <BadgeComponent
        color="primary"
        outlined
        small
        v-if="unit.barding && !sheets.isHidenItem(unit.barding)"
        >{{
          $t(`sheets.armors.${sheets.getArmourTranslate(unit.barding)}`)
        }}</BadgeComponent
      >
    </span>
  </div>
  <div class="cell cell-wide">
    <span class="flex">
      <BadgeComponent
        color="primary"
        outlined
        small
        v-for="(trait, index) in unit.traits"
        :key="'trait' + index"
        >{{
          $t(`sheets.traits.${sheets.getTraitTranslate(trait).text}`, {
            value: sheets.getTraitTranslate(trait).value,
          })
        }}</BadgeComponent
      >
    </span>
  </div>
  <div class="cell no-print">
    <div class="options-buttons">
      <button @click="sheets.deleteUnit(index)">
        <IconComponent name="close"></IconComponent>
      </button>
    </div>
  </div>
  <div class="cell cell-slim">
    <div
      class="deployment-number"
      v-if="!unit.noDeployToken && options.deploymentNumber"
    >
      <span>
        {{ index + 1 }}
      </span>
    </div>
  </div>
  <div class="cell cell-slim cell-wide">
    <div class="flex counter">
      <button @click="sheets.decreaseSize(index)" v-if="!unit.fixedFigures">
        <IconComponent name="minus"></IconComponent>
      </button>
      <span>
        <b v-if="!unit.fixedFigures">{{ unit.size }}</b>
        <b v-else>{{ unit.fixedFigures }}</b>
        {{
          $t(
            "web.texts.figure",
            !unit.fixedFigures ? unit.size || 1 : unit.fixedFigures
          )
        }}
      </span>
      <button @click="sheets.increaseSize(index)" v-if="!unit.fixedFigures">
        <IconComponent name="plus"></IconComponent>
      </button>
    </div>
  </div>
  <div class="cell cell-slim cell-xwide">
    {{ unit.cost }}
    <span v-if="unit.modsCosts !== 0">({{ unit.modsCosts }})</span>
    {{ $t("web.texts.costEach", unit.cost) }}
  </div>
  <div class="cell cell-slim cell-wide">
    {{ $t("web.texts.totalCostUnit") }}:
    {{ sheets.calculateUnitCost(unit) }}
  </div>
  <div
    class="cell cell-full cell-slim"
    v-if="isPrintable || hasOptions"
    :class="isPrintable ? '' : 'no-print'"
  >
    <OptionsSelectorComponent
      :unit="unit"
      :row-index="index"
      :print="isPrintable"
      @select-option="upgrade"
      @unselect-option="downgrade"
    ></OptionsSelectorComponent>
  </div>
</template>

<script setup lang="ts">
import { useOptionsStore } from "@/stores/options";
import { useSheetsStore } from "@/stores/sheets";
import type { IUnitObject } from "@/types/sheetTypes";
import { computed } from "vue";
import BadgeComponent from "../BadgeComponent.vue";
import IconComponent from "../IconComponent.vue";
import OptionsSelectorComponent from "./OptionsSelectorComponent.vue";

const sheets = useSheetsStore();
const options = useOptionsStore();

const props = defineProps<{
  unit: IUnitObject;
  index: number;
}>();

const isPrintable = computed(
  () => (props.unit.selectedOptions?.length || -1) > 0
);

const hasOptions = computed(() => props.unit.options.length > 0);

function upgrade(option: string) {
  sheets.upgradeUnit(option, props.index);
}

function downgrade(option: string) {
  sheets.downgradeUnit(option, props.index);
}
</script>

<style scoped src="@/assets/scss/components/table.scss"></style>
