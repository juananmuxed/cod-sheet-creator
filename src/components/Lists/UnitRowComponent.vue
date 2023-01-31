<template>
  <div class="cell no-print">
    <div class="options-buttons">
      <button
        :class="units.isFirstUnit(index) ? 'invisible' : ''"
        :disabled="units.isFirstUnit(index)"
        @click="units.orderUp(index)"
      >
        <IconComponent name="arrow-up"></IconComponent>
      </button>
      <button
        :class="units.isLastUnit(index) ? 'invisible' : ''"
        :disabled="units.isLastUnit(index)"
        @click="units.orderDown(index)"
      >
        <IconComponent name="arrow-down"></IconComponent>
      </button>
    </div>
  </div>
  <div class="cell cell-wide">
    <div class="flex column">
      <span>
        <b>{{ $t(`sheets.units.${unit.translate}`) }}</b>
        ({{ units.getAvailability(unit.availability) }})
      </span>
      <span v-if="unit.isLeader">
        <BadgeComponent color="primary" outlined small>{{
          `${unit.commandPoints}${$t("web.texts.combatCommandPoints")} / ${
            unit.commandRange
          }"`
        }}</BadgeComponent>
      </span>
    </div>
  </div>
  <div class="cell" v-if="unit.combat">{{ unit.combat }}+</div>
  <div class="cell" v-else></div>
  <div class="cell" v-if="unit.ranged">{{ unit.ranged }}+</div>
  <div class="cell" v-else></div>
  <div class="cell" v-if="unit.grit">{{ unit.grit }}+</div>
  <div class="cell" v-else></div>
  <div class="cell" v-if="!unit.isCharacter">
    {{ units.calculateSave(unit) }}+
  </div>
  <div class="cell" v-else></div>
  <div class="cell cell-medium">
    <span class="flex">
      <BadgeComponent
        color="primary"
        outlined
        small
        v-if="unit.weapon && !units.isHidenItem(unit.weapon)"
        >{{
          $t(`sheets.weapons.${units.getWeaponTranslate(unit.weapon)}`) +
          units.getWeaponIniciative(unit.weapon)
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
        v-if="unit.shield && !units.isHidenItem(unit.shield)"
        >{{
          $t(`sheets.armors.${units.getArmourTranslate(unit.shield)}`)
        }}</BadgeComponent
      >
      <BadgeComponent
        color="primary"
        outlined
        small
        v-if="unit.body && !units.isHidenItem(unit.body)"
        >{{
          $t(`sheets.armors.${units.getArmourTranslate(unit.body)}`)
        }}</BadgeComponent
      >
      <BadgeComponent
        color="primary"
        outlined
        small
        v-if="unit.barding && !units.isHidenItem(unit.barding)"
        >{{
          $t(`sheets.armors.${units.getArmourTranslate(unit.barding)}`)
        }}</BadgeComponent
      >
    </span>
  </div>
  <div class="cell cell-wide">
    <span class="flex">
      <BadgeComponent
        color="primary"
        :title="
          $t(
            `sheets.traits.descriptions.${units.getTraitTranslate(trait).text}`
          )
        "
        outlined
        small
        v-for="(trait, index) in unit.traits"
        :key="'trait' + index"
        >{{
          $t(`sheets.traits.${units.getTraitTranslate(trait).text}`, {
            value: units.getTraitTranslate(trait).value,
          })
        }}</BadgeComponent
      >
    </span>
  </div>
  <div class="cell no-print">
    <div class="options-buttons">
      <button @click="units.deleteUnit(index)">
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
        {{ units.deploymentNumbers[index] }}
      </span>
    </div>
  </div>
  <div class="cell cell-slim cell-wide">
    <div class="flex counter">
      <button
        @click="units.decreaseSize(index)"
        v-if="unit.fixedFigures === undefined"
      >
        <IconComponent name="minus"></IconComponent>
      </button>
      <span>
        <b v-if="unit.fixedFigures === undefined">{{ unit.size }}</b>
        <b v-else>{{ unit.fixedFigures }}</b>
        {{
          $t(
            "web.texts.figure",
            unit.fixedFigures === undefined ? unit.size || 1 : unit.fixedFigures
          )
        }}{{ unit.freeUnits ? `(+${unit.freeUnits})` : "" }}
      </span>
      <button
        @click="units.increaseSize(index)"
        v-if="unit.fixedFigures === undefined"
      >
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
    {{ units.calculateUnitCost(unit) }}
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
import { useUnitsStore } from "@/stores/units";
import type { IUnitObject } from "@/types/sheetTypes";
import { computed } from "vue";
import BadgeComponent from "../BadgeComponent.vue";
import IconComponent from "../IconComponent.vue";
import OptionsSelectorComponent from "./OptionsSelectorComponent.vue";

const units = useUnitsStore();
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
  units.upgradeUnit(option, props.index);
}

function downgrade(option: string) {
  units.downgradeUnit(option, props.index);
}
</script>

<style scoped src="@/assets/scss/components/table.scss"></style>
