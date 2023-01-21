<template>
  <div class="input-number">
    <label>
      <span v-if="label"></span>
      <slot v-else></slot>
    </label>
    <div class="control">
      <button @click="decreaseModel">
        <IconComponent name="minus"></IconComponent>
      </button>
      <input
        type="text"
        v-model="model"
        :min="min"
        :max="max"
        @keydown="changeInput"
      />
      <button @click="incrementModel">
        <IconComponent name="plus"></IconComponent>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Constants } from "@/utils/constants";
import IconComponent from "./IconComponent.vue";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps<{
  modelValue: number;
  label?: string;
  min: number;
  max: number;
}>();

const model = computed({
  get() {
    return Math.min(Math.max(props.modelValue, props.min), props.max);
  },
  set(value) {
    emit("update:modelValue", Math.min(Math.max(value, props.min), props.max));
  },
});

function changeInput(event: Event) {
  const charcode = (event as KeyboardEvent).key;
  if (
    !Constants.REGEX_EXPRESIONS.ONLY_DIGITS.test(charcode) ||
    model.value >= props.max ||
    model.value < props.min
  )
    return event.preventDefault();
  return true;
}

function incrementModel() {
  model.value = Math.min(model.value + 1, props.max);
}

function decreaseModel() {
  model.value = Math.max(model.value - 1, props.min);
}
</script>

<style scoped src="@/assets/scss/components/numberInput.scss"></style>
