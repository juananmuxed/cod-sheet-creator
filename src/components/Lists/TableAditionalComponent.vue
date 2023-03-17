<template>
  <div class="table-aditional">
    <h4>{{ title }}</h4>
    <table>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <template v-if="type === 'traits'">
            <td class="small">
              <span class="name">
                {{
                  $t(
                    `sheets.${type}.${units.getTraitTranslate(item.name).text}`,
                    {
                      value: "X",
                    }
                  )
                }}</span
              >
              <span class="sub-text">{{
                `${$t("web.texts.pageCompact")}.${item.page} (${item.book})`
              }}</span>
            </td>
            <td class="wide">
              <span class="require" v-if="item.requires">
                <i>{{
                  $t(
                    `sheets.${type}.requires.${
                      units.getTraitTranslate(item.name).text
                    }`
                  )
                }}</i>
              </span>
              <span class="description">
                {{
                  $t(
                    `sheets.${type}.descriptions.${
                      units.getTraitTranslate(item.name).text
                    }`
                  )
                }}
              </span>
            </td>
            <td class="wide"></td>
          </template>
          <template v-else>
            <td class="small">
              <span class="name">
                {{ $t(`sheets.${type}.${item.name}`) }}
              </span>
              <span class="sub-text">{{
                `${$t("web.texts.pageCompact")}.${item.page} (${item.book})`
              }}</span>
            </td>
            <td class="wide">
              <span class="requires" v-if="item.type?.includes('ranged')">
                <i>{{
                  `${$t("web.texts.shortRange")}: ${
                    item.rangeShort ? item.rangeShort + '"' : "-"
                  } / ${$t("web.texts.longRange")}: ${
                    item.rangeLong ? item.rangeLong + '"' : "-"
                  }`
                }}</i>
              </span>
              <span class="requires" v-if="item.type?.includes('melee')">
                <i>{{
                  `${$t("web.texts.initiative")}: ${item.initiative || 0}`
                }}</i>
              </span>
              <span class="requires" v-if="item.saveModification">
                <i>{{
                  `${$t("web.texts.saveModification")}: ${
                    item.saveModification
                  }`
                }}</i>
              </span>
              {{ $t(`sheets.${type}.descriptions.${item.name}`) }}
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { ITableAditionalRow } from "@/types/sheetTypes";
import { useUnitsStore } from "@/stores/units";

const units = useUnitsStore();

defineProps<{
  title: string;
  type: string;
  items: ITableAditionalRow[];
}>();
</script>

<style scoped src="@/assets/scss/components/tableAditional.scss"></style>
