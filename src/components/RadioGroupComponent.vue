<template>
  <div class="radio-group">
    <template v-for="(radio, index) in options" :key="index">
      <label
        v-if="radio.active"
        :for="radio.name"
        :class="radio.value == modelValue ? 'active' : ''"
      >
        <input
          :id="radio.name"
          class="radio-input"
          type="radio"
          :value="radio.value"
          :checked="radio.value == modelValue"
          @change="updateValue($event)"
        />
        <img v-if="radio.imgUrl" :src="radio.imgUrl" />
        <b>{{ radio.label }}</b>
      </label>
    </template>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["update:modelValue"]);

defineProps<{
  modelValue?: string;
  options: {
    label?: string;
    name?: string;
    value?: string;
    imgUrl?: string;
    active?: boolean;
  }[];
}>();

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<style scoped src="@/assets/scss/components/radioGroup.scss"></style>
