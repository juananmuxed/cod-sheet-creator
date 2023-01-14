import { getLS, setLS } from "@/utils/localStorage";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { Constants } from "@/utils/constants";

export const useOptionsStore = defineStore("options", () => {
  const defaultUnitNumber = ref(
    Number(getLS(Constants.LS_NAMES.DEFAULT_UNIT_NUMBER)) || 6
  );
  const deploymentNumber = ref(
    getLS(Constants.LS_NAMES.DEPLOYMENT_NUMBER) !== "false"
  );
  const printTraitsTable = ref(false);
  const printWeaponsTable = ref(false);
  const printArmourTable = ref(false);

  watch(defaultUnitNumber, setUnitNumber);
  watch(deploymentNumber, setDeploymentNumber);

  function setUnitNumber(value: number) {
    setLS(Constants.LS_NAMES.DEFAULT_UNIT_NUMBER, value.toString());
  }

  function setDeploymentNumber(value: boolean) {
    setLS(Constants.LS_NAMES.DEPLOYMENT_NUMBER, value.toString());
  }

  return {
    defaultUnitNumber,
    deploymentNumber,
    printTraitsTable,
    printWeaponsTable,
    printArmourTable,
  };
});
