<script setup lang="ts">
import { RouterView } from "vue-router";
import HeaderPage from "@/components/Header/HeaderPage.vue";
import FooterPage from "@/components/Footer/FooterPage.vue";
import ToastListComponent from "@/components/Toast/ToastListComponent.vue";
</script>

<template>
  <HeaderPage class="no-print" />
  <main>
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
  <FooterPage class="no-print" />
  <ToastListComponent class="no-print" />
</template>

<style lang="scss">
#app {
}
</style>
