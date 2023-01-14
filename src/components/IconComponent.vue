<template>
  <component
    :style="computedStyle"
    :is="iconComponent"
    role="image"
  ></component>
</template>

<script setup lang="ts">
import { computed, type Component } from "vue";
import { kebabize } from "@/utils/strings";

const Components = import.meta.glob("./icons/*.vue", { eager: true });

interface IGlobItem {
  default: Component;
}

interface Icon {
  [key: string]: Component;
}

const icons: Icon = {};

Object.keys(Components).forEach((filename) => {
  const name = filename.split("/")[2].split(".")[0].split("Icon")[0];
  const iconName = kebabize(name);

  icons[iconName] = (Components[filename] as IGlobItem).default;
});

const props = defineProps<{
  name: string;
  height?: string | number;
  width?: string | number;
}>();

const computedStyle = computed(() => {
  let style = [];
  if (props.height) style.push(`height:${props.height}px`);
  if (props.width) style.push(`width:${props.width}px`);
  return style.join(";");
});

const iconComponent = computed(() => icons[props.name]);
</script>
