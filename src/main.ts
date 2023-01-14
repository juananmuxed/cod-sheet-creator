import { createApp } from "vue";
import { createPinia } from "pinia";
import { setupI18n } from "./locales/i18n";

import App from "@/App.vue";
import router from "@/router";

export const i18n = setupI18n();

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");

// TODO: TDD desgracias
