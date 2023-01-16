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
    </p>
    <p>
      <input
        type="checkbox"
        v-model="options.printTraitsTable"
        id="table-traits"
      />
      <label for="table-traits">Show traits table</label>
    </p>
    <p>
      <input
        type="checkbox"
        v-model="options.printWeaponsTable"
        id="table-weapons"
      />
      <label for="table-weapons">Show weapons table</label>
    </p>
    <p>
      <input
        type="checkbox"
        v-model="options.printArmourTable"
        id="table-armours"
      />
      <label for="table-armours">Show armours table</label>
      <!-- TODO: finish config view -->
    </p>
  </div>
</template>

<script setup lang="ts">
import { useOptionsStore } from "@/stores/options";

const options = useOptionsStore();
</script>
