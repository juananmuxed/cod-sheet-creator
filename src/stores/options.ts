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
  const printTraitsTable = ref(
    getLS(Constants.LS_NAMES.PRINT_TRAITS) !== "false"
  );
  const printWeaponsTable = ref(
    getLS(Constants.LS_NAMES.PRINT_WEAPONS) !== "false"
  );
  const printArmourTable = ref(
    getLS(Constants.LS_NAMES.PRINT_ARMOURS) !== "false"
  );

  watch(defaultUnitNumber, setUnitNumber);
  watch(deploymentNumber, setDeploymentNumber);
  watch(printTraitsTable, setPrintTraitsTable);
  watch(printWeaponsTable, setPrintWeaponsTable);
  watch(printArmourTable, setPrintArmoursTable);

  function setUnitNumber(value: number) {
    setLS(Constants.LS_NAMES.DEFAULT_UNIT_NUMBER, value.toString());
  }

  function setDeploymentNumber(value: boolean) {
    setLS(Constants.LS_NAMES.DEPLOYMENT_NUMBER, value.toString());
  }

  function setPrintTraitsTable(value: boolean) {
    setLS(Constants.LS_NAMES.PRINT_TRAITS, value.toString());
  }

  function setPrintWeaponsTable(value: boolean) {
    setLS(Constants.LS_NAMES.PRINT_WEAPONS, value.toString());
  }

  function setPrintArmoursTable(value: boolean) {
    setLS(Constants.LS_NAMES.PRINT_ARMOURS, value.toString());
  }

  return {
    defaultUnitNumber,
    deploymentNumber,
    printTraitsTable,
    printWeaponsTable,
    printArmourTable,
  };
});
