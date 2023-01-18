import type { IToast } from "@/types/sheetTypes";
import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";

export const useToastStore = defineStore("toast", () => {
  const toasts: Ref<Record<number, IToast | undefined>> = ref({});
  const autoIncremntId = ref(0);

  const toastsArray = computed(() => {
    return Object.keys(toasts.value)
      .map((key) => toasts.value[Number(key)])
      .filter((toast) => toast !== undefined);
  });

  function addToast(toast: IToast) {
    toasts.value[autoIncremntId.value] = toast;
    setTimeToast(autoIncremntId.value, toast.time || 3000);
    ++autoIncremntId.value;
  }

  function setTimeToast(id: number, time: number) {
    setTimeout(() => {
      deleteToast(id);
    }, time);
  }

  function deleteToast(id: number) {
    toasts.value[id] = undefined;
  }

  return {
    toastsArray,
    addToast,
    deleteToast,
  };
});
