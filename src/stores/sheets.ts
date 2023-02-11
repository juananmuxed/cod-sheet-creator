import { computed, ref, watch, type ComputedRef, type Ref } from "vue";
import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import { useUnitsStore } from "./units";
import { useToastStore } from "./toast";
import { Constants } from "@/utils/constants";
import type {
  IArmy,
  IExpansion,
  IOptionRadio,
  IUnitObject,
  IList,
  IListUnit,
  IListUpgrade,
} from "@/types/sheetTypes";
import { getLS, setLS } from "@/utils/localStorage";

import expansionsJSON from "./data/expansions.json";
import armiesJSON from "./data/armies.json";

const imagesArmies = import.meta.glob("@/assets/images/armies/*.png", {
  as: "url",
  eager: true,
});

export const useSheetsStore = defineStore("sheets", () => {
  const { t } = useI18n();
  const units = useUnitsStore();
  const toasts = useToastStore();

  const setFromSaved = ref(false);
  const selectedExpansion: Ref<string | undefined> = ref(undefined);
  const selectedArmy: Ref<string | undefined> = ref(undefined);
  const selectedSavedList: Ref<string | undefined> = ref(undefined);
  const inList: Ref<boolean> = ref(false);
  const listName: Ref<string> = ref("");
  const savedLists: Ref<Record<string, string>> = ref(
    JSON.parse(getLS(Constants.LS_NAMES.SAVED_LISTS) || "{}")
  );

  const importedExpansions: IExpansion = expansionsJSON;
  const importedExpansionsKeys: string[] = Object.keys(expansionsJSON);
  const importedArmies: IArmy = armiesJSON;
  const importedArmiesKeys: string[] = Object.keys(armiesJSON);

  const expansions: IOptionRadio[] = importedExpansionsKeys.map((exp) => {
    return {
      label: t(`sheets.expansions.${exp}`),
      name: importedExpansions[exp].id,
      value: exp,
      imgUrl: importedExpansions[exp].imgUrl || undefined,
      active: importedExpansions[exp].active || false,
    };
  });

  const armies: IOptionRadio[] = importedArmiesKeys.map((army) => {
    const image =
      imagesArmies[
        Object.keys(imagesArmies).find((path) =>
          path.endsWith(importedArmies[army].imgUrl || "")
        ) || 0
      ];
    return {
      label: t(`sheets.armies.${army}`),
      name: importedArmies[army].id,
      value: army,
      imgUrl: image || undefined,
      expansions: importedArmies[army].expansions,
      isWarParty: importedArmies[army].isWarParty,
      active: importedArmies[army].active || false,
    };
  });

  watch(selectedExpansion, changeSelectedExpansion);
  watch(selectedArmy, updateUriParams);
  watch(inList, updateUriParams);
  watch(listName, updateUriParams);
  watch(savedLists, updateSavedLists, { deep: true });

  const isSelectedExpansion: ComputedRef<Boolean> = computed(
    () => selectedExpansion.value !== undefined
  );

  const isSelectedArmy: ComputedRef<Boolean> = computed(
    () => selectedArmy.value !== undefined
  );

  const getCompleteExpansion = computed(() =>
    expansions.find((exp) => exp.value?.toString() === selectedExpansion.value)
  );

  const getCompleteArmy = computed(() =>
    armies.find((exp) => exp.value?.toString() === selectedArmy.value)
  );

  const isCreatingList: ComputedRef<Boolean> = computed(() => inList.value);

  const availableArmies: ComputedRef<IOptionRadio[]> = computed(() => {
    return armies.filter((army) =>
      army.expansions?.includes(selectedExpansion.value || "")
    );
  });

  const isInSavedList = computed(() => {
    return savedLists.value[listName.value] !== undefined;
  });

  const isEditedList = computed(() => {
    return savedLists.value[listName.value] !== getCompactList();
  });

  const availabedSavedLists: ComputedRef<IOptionRadio[]> = computed(() => {
    return Object.keys(savedLists.value).map((key) => {
      return {
        label: key,
        value: key,
        name: key + "-list",
        active: true,
      };
    });
  });

  function changeSelectedExpansion(
    _value: Ref<string | number | undefined>,
    oldValue?: Ref<string | number | undefined>
  ) {
    if (oldValue !== undefined) clearSelectedArmy();
    updateUriParams();
  }

  function clearSelectedArmy() {
    if (!setFromSaved.value) selectedArmy.value = undefined;
    setFromSaved.value = false;
  }

  function updateUriParams() {
    const url = new URL(window.location.href);
    const compactList = getCompactList();
    setLS(Constants.LS_NAMES.COMPACT_LIST, compactList);
    url.searchParams.set("id", compactList);
    history.replaceState(history.state, "", url);
  }

  function getUriParams() {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    setCompactList(!id ? getLS(Constants.LS_NAMES.COMPACT_LIST) : id);
  }

  function getCompactList() {
    const list: IList = {
      expansion: selectedExpansion.value
        ? importedExpansionsKeys.findIndex(
            (exp) => exp === selectedExpansion.value
          )
        : undefined,
      army: selectedArmy.value
        ? importedArmiesKeys.findIndex((exp) => exp === selectedArmy.value)
        : undefined,
      inList: undefined,
      name: undefined,
      units: undefined,
    };

    if (selectedExpansion.value && selectedArmy.value)
      list.inList = inList.value ? 1 : 0;
    if (list.inList) list.name = encodeURIComponent(listName.value);
    if (units.unitsTotal > 0) {
      const unitsCompact = units.unitsInArmy.map((unit) =>
        getCompactUnit(unit)
      );
      list.units = unitsCompact.join(Constants.SEPARATORS.UNITS);
    }

    return Object.values(list)
      .filter((val) => val !== undefined)
      .join(Constants.SEPARATORS.LIST);
  }

  function getCompactUnit(unit: IUnitObject) {
    const listUnit: IListUnit = {
      unitSize: unit.size ? units.getUnitSize(unit) : undefined,
      index: unit.size
        ? Object.keys(units.importedUnits).findIndex(
            (key) => unit.translate === key
          )
        : undefined,
      options: undefined,
    };

    if (unit.selectedOptions && unit.selectedOptions.length > 0) {
      const options = unit.selectedOptions?.map((selectedOption) => {
        return getCompactOptions(selectedOption);
      });
      listUnit.options = options.join(Constants.SEPARATORS.OPTIONS);
    }

    return Object.values(listUnit)
      .filter((val) => val !== undefined)
      .join(Constants.SEPARATORS.UNIT_VALUES);
  }

  function getCompactOptions(selectedOptions: string) {
    return Object.keys(units.importedOptions)
      .findIndex((option) => option === selectedOptions)
      .toString();
  }

  function setCompactList(id: string | null) {
    if (!id) return;
    const list = compactedListDeconstruct(id);
    setFromSaved.value = true;
    selectedExpansion.value = list.expansion;
    selectedArmy.value = list.army;
    inList.value = list.inList;
    listName.value = list.listName;
    if (list.units) units.unitsInArmy = list.units;
    if (list.options)
      list.options.forEach((option) => {
        if (option) units.upgradeUnit(option.upgrade, option.index);
      });
  }

  function compactedListDeconstruct(id: string) {
    const arrayList = id.split(Constants.SEPARATORS.LIST);
    let mapedUnits = undefined;
    const mapedOptions: IListUpgrade[] = [];
    if (arrayList[Constants.LIST_INDEXS.UNITS]) {
      const compactUnits = arrayList[Constants.LIST_INDEXS.UNITS].split(
        Constants.SEPARATORS.UNITS
      );
      const unitsArray: string[] = compactUnits.map(
        (unit) =>
          Object.keys(units.importedUnits)[
            Number(unit.split(Constants.SEPARATORS.UNIT_VALUES)[1])
          ]
      );
      const sizes: number[] = compactUnits.map((unit) =>
        Number(unit.split(Constants.SEPARATORS.UNIT_VALUES)[0])
      );
      mapedUnits = units.mapUnits(unitsArray, sizes);
      const options = compactUnits.map(
        (unit) => unit.split(Constants.SEPARATORS.UNIT_VALUES)[2]
      );
      options.forEach((option, index) => {
        if (option) {
          const upgrades = option.split(Constants.SEPARATORS.OPTIONS);
          upgrades.forEach((upgrade) => {
            mapedOptions.push({
              upgrade: Object.keys(units.importedOptions)[Number(upgrade)],
              index,
            });
          });
        }
      });
    }
    return {
      expansion:
        importedExpansionsKeys[
          Number(arrayList[Constants.LIST_INDEXS.EXPANSION])
        ],
      army: importedArmiesKeys[Number(arrayList[Constants.LIST_INDEXS.ARMY])],
      inList: Number(arrayList[Constants.LIST_INDEXS.ENLISTED]) === 1,
      listName: arrayList[Constants.LIST_INDEXS.NAME]
        ? decodeURIComponent(arrayList[Constants.LIST_INDEXS.NAME])
        : "",
      units: mapedUnits,
      options: mapedOptions,
    };
  }

  function startList() {
    inList.value = true;
    listName.value = t(`web.texts.newArmy`);
  }

  function resetList() {
    selectedExpansion.value = undefined;
    inList.value = false;
    listName.value = "";
    units.unitsInArmy = [];
    units.selectedUnits = [];
  }

  function saveList() {
    const compactList = getCompactList();
    savedLists.value[listName.value] = compactList;
    toasts.addToast({
      text: t("web.toasts.saveList"),
      color: "success",
      time: 4000,
    });
  }

  function deleteList() {
    delete savedLists.value[listName.value];
    resetList();
    toasts.addToast({
      text: t("web.toasts.deletedList"),
      color: "warning",
      time: 4000,
    });
  }

  function loadList() {
    setCompactList(savedLists.value[selectedSavedList.value || ""]);
    selectedSavedList.value = undefined;
    toasts.addToast({
      text: t("web.toasts.loadedList"),
      color: "success",
      time: 4000,
    });
  }

  function updateSavedLists() {
    setLS(Constants.LS_NAMES.SAVED_LISTS, JSON.stringify(savedLists.value));
  }

  function printList() {
    window.print();
  }

  function copyUrl() {
    const url = new URL(window.location.href);
    const compactList = getCompactList();
    url.searchParams.set("id", compactList);
    navigator.clipboard.writeText(url.toString());
    toasts.addToast({
      text: t("web.toasts.copiedClipboard"),
      color: "success",
      time: 4000,
    });
  }

  return {
    selectedExpansion,
    getCompleteExpansion,
    isSelectedExpansion,
    expansions,
    selectedArmy,
    getCompleteArmy,
    isSelectedArmy,
    availableArmies,
    isCreatingList,
    listName,
    updateUriParams,
    getUriParams,
    isInSavedList,
    isEditedList,
    availabedSavedLists,
    selectedSavedList,
    startList,
    resetList,
    saveList,
    deleteList,
    loadList,
    printList,
    copyUrl,
  };
});
