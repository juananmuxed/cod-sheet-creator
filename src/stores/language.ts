import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { getLS, setLS } from "@/utils/localStorage";
import { setI18nLanguage } from "@/locales/i18n";
import { i18n } from "@/locales/i18n";
import { defaultLocale } from "@/locales/messages";

export const useLanguageStore = defineStore("language", () => {
  const lang = ref(getLS("lang") || defaultLocale);

  watch(lang, langToggle);

  function langToggle() {
    setI18nLanguage(i18n, lang.value);
    setLS("lang", String(lang.value));
  }

  return { lang };
});
