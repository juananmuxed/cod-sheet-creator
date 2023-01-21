<template>
  <div class="input-checkbox">
    <input :id="id" type="checkbox" v-model="model" />
    <div
      class="control"
      :class="modelValue ? 'active' : ''"
      @click="model = !model"
    >
      <IconComponent name="check"></IconComponent>
    </div>
    <label :for="id">
      <span v-if="label" v-html="label"></span>
      <slot v-else></slot>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import IconComponent from "./IconComponent.vue";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps<{
  modelValue: boolean;
  id: string;
  label?: string;
}>();

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<style scoped src="@/assets/scss/components/checkbox.scss"></style>
