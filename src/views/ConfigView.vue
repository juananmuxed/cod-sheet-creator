<template>
  <div class="container">
    <h1>{{ $t("web.titles.config") }}</h1>
    <h3>{{ $t("web.titles.configList") }}</h3>
    <div class="config-item">
      <NumberInputComponent
        v-model="options.defaultUnitNumber"
        :max="Constants.UNIT_SIZE.MAX"
        :min="Constants.UNIT_SIZE.MIN"
      >
        {{ $t("web.texts.configLabels.defaultUnitNumber") }}
      </NumberInputComponent>
    </div>
    <h3>{{ $t("web.titles.configPrint") }}</h3>
    <div class="config-item">
      <CheckboxComponent
        v-model="options.printTraitsTable"
        id="printTraitsTable"
      >
        {{ $t("web.texts.configLabels.showTraitsTable") }}
      </CheckboxComponent>
    </div>
    <div class="config-item">
      <CheckboxComponent
        v-model="options.printWeaponsTable"
        id="printWeaponsTable"
      >
        {{ $t("web.texts.configLabels.printWeaponsTable") }}
      </CheckboxComponent>
    </div>
    <div class="config-item">
      <CheckboxComponent
        v-model="options.printArmourTable"
        id="printArmourTable"
      >
        {{ $t("web.texts.configLabels.printArmourTable") }}
      </CheckboxComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import CheckboxComponent from "@/components/CheckboxComponent.vue";
import NumberInputComponent from "@/components/NumberInputComponent.vue";
import { useOptionsStore } from "@/stores/options";
import { Constants } from "@/utils/constants";

const options = useOptionsStore();
</script>

<style scoped src="@/assets/scss/components/config.scss"></style>
