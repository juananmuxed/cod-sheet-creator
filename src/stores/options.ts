import { getLS, setLS } from "@/utils/localStorage";
import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { Constants } from "@/utils/constants";

export const useOptionsStore = defineStore("options", () => {
  const defaultUnitNumber = ref(
    Number(getLS(Constants.LS_NAMES.DEFAULT_UNIT_NUMBER)) || 6
  );
  const maxMarks = ref(Number(getLS(Constants.LS_NAMES.MAX_MARKS)) || 11);
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
  const printArmiesImages = ref(
    getLS(Constants.LS_NAMES.PRINT_ARMIES_IMAGES) !== "false"
  );

  watch(defaultUnitNumber, setUnitNumber);
  watch(maxMarks, setMaxMarks);
  watch(deploymentNumber, setDeploymentNumber);
  watch(printTraitsTable, setPrintTraitsTable);
  watch(printWeaponsTable, setPrintWeaponsTable);
  watch(printArmourTable, setPrintArmoursTable);
  watch(printArmiesImages, setPrintArmiesImages);

  function setMaxMarks(value: number) {
    setLS(Constants.LS_NAMES.MAX_MARKS, value.toString());
  }

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

  function setPrintArmiesImages(value: boolean) {
    setLS(Constants.LS_NAMES.PRINT_ARMIES_IMAGES, value.toString());
  }

  return {
    defaultUnitNumber,
    maxMarks,
    deploymentNumber,
    printTraitsTable,
    printWeaponsTable,
    printArmourTable,
    printArmiesImages,
  };
});
