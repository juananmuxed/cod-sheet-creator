<script setup lang="ts">
import { RouterView } from "vue-router";
import HeaderPage from "@/components/Header/HeaderPage.vue";
import FooterPage from "@/components/Footer/FooterPage.vue";
</script>

<template>
  <HeaderPage />
  <main>
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
  <FooterPage />
</template>

<style lang="scss">
#app {
}
</style>
