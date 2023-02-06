<template>
  <div class="select-option">
    <div class="checkbox-group no-print">
      <label
        :for="option.id + rowIndex"
        v-for="(option, index) in options"
        :key="index"
      >
        <input
          :id="option.id + rowIndex"
          class="checkbox-input"
          type="checkbox"
          :value="option.translate"
          @change="selectOption(option.translate)"
        />{{
          `${$t(`sheets.options.${option.id}`)} (${
            option.cost !== undefined ? option.cost : option.fixedCost
          })`
        }}
      </label>
    </div>
    <div class="checkbox-group-selected">
      <label
        :for="option.id + rowIndex + '-selected'"
        v-for="(option, index) in selectedOptions"
        :key="index"
      >
        <IconComponent
          :height="18"
          name="close"
          class="no-print"
        ></IconComponent>
        <input
          :id="option.id + rowIndex + '-selected'"
          class="checkbox-input"
          type="checkbox"
          :value="option.translate"
          @change="unselectOption(option.translate)"
        />{{
          `${$t(`sheets.options.${option.id}`)} (${
            option.cost !== undefined ? option.cost : option.fixedCost
          })`
        }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUnitsStore } from "@/stores/units";
import type { IUnitObject } from "@/types/sheetTypes";
import { computed } from "vue";
import IconComponent from "../IconComponent.vue";

const units = useUnitsStore();

const props = defineProps<{
  unit: IUnitObject;
  rowIndex: number;
  print: boolean;
}>();

const options = computed(() => units.filteredOptions(props.unit));
const selectedOptions = computed(() =>
  units.mapedOptions(props.unit.selectedOptions || [])
);

const emit = defineEmits(["selectOption", "unselectOption"]);

function selectOption(option: string) {
  emit("selectOption", option);
}

function unselectOption(option: string) {
  emit("unselectOption", option);
}
</script>

<style scoped src="@/assets/scss/components/optionsSelect.scss"></style>
