import { createI18n, type I18n } from "vue-i18n";
import { defaultLocale, locale, messages } from "./messages";

export let i18n: I18n;

export const setupI18n = () => {
  i18n = createI18n({
    legacy: false,
    locale: locale,
    fallbackLocale: defaultLocale,
    messages: messages,
    warnHtmlMessage: false,
  });

  setI18nLanguage(i18n, locale);
  return i18n;
};

export const setI18nLanguage = (
  i18n: I18n<{}, {}, {}, string, false>,
  locale: string
) => {
  i18n.global.locale.value = locale;
  document.querySelector("html")?.setAttribute("lang", locale);
};
