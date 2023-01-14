<template>
  <div class="checkbox-group">
    <label
      :for="checkbox.name"
      v-for="(checkbox, index) in options"
      :key="index"
      :class="isActive(checkbox.value?.toString() || '') ? 'active' : ''"
    >
      <input
        :id="checkbox.name"
        class="checkbox-input"
        type="checkbox"
        :value="checkbox.value"
        v-model="model"
      />
      <b>{{ checkbox.label }}</b>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps<{
  modelValue?: string[];
  options: {
    label?: string;
    name?: string;
    value?: string;
  }[];
}>();

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const isActive = (checkboxValue: string) => {
  return props.modelValue?.includes(checkboxValue);
};
</script>

<style scoped src="@/assets/scss/components/checkboxGroup.scss"></style>
