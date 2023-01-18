<template>
  <div class="list-toasts">
    <TransitionGroup name="list" mode="in-out">
      <div
        class="toast-container"
        :class="toast?.color || 'light'"
        v-for="(toast, index) in toasts.toastsArray"
        :key="index"
      >
        <span>{{ toast?.text }}</span>
        <button v-if="toast?.closable" @click="toasts.deleteToast(index)">
          <IconComponent name="close"></IconComponent>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import IconComponent from "../IconComponent.vue";

const toasts = useToastStore();
</script>

<style scoped src="@/assets/scss/components/toasts.scss"></style>
