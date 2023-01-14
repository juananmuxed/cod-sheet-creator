<template>
  <div class="container">
    <h1>Configuration</h1>
    <p>
      <input type="number" v-model="options.defaultUnitNumber" />
    </p>
    <p>
      <input
        type="checkbox"
        v-model="options.deploymentNumber"
        id="deployment-number"
      />
      <label for="deployment-number">Deployment number</label>
      <!-- TODO: finish config view -->
    </p>
  </div>
</template>

<script setup lang="ts">
import { useOptionsStore } from "@/stores/options";

const options = useOptionsStore();
</script>
