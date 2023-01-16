<template>
  <div class="options">
    <div class="options-name">
      <span>
        <span class="no-print">{{ $t("web.texts.armyName") }}</span>
        <span class="rendered-name" v-text="sheets.listName"></span>
      </span>
      <input type="text" v-model="sheets.listName" />
    </div>
    <div class="options-buttons">
      <button @click="sheets.resetList">
        <IconComponent name="undo"></IconComponent>
        {{ $t("web.buttons.reset") }}
      </button>
      <button @click="sheets.saveList">
        <IconComponent name="save"></IconComponent>
        {{ $t("web.buttons.save") }}
      </button>
      <button @click="sheets.deleteList">
        <IconComponent name="delete"></IconComponent>
        {{ $t("web.buttons.delete") }}
      </button>
      <button @click="sheets.printList">
        <IconComponent name="print"></IconComponent>
        {{ $t("web.buttons.print") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconComponent from "../IconComponent.vue";
import { useSheetsStore } from "@/stores/sheets";

const sheets = useSheetsStore();
</script>

<style scoped src="@/assets/scss/components/options.scss"></style>
