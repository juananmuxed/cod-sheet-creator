import { computed, ref, watch, type ComputedRef, type Ref } from "vue";
import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import { useOptionsStore } from "./options";
import { Constants } from "@/utils/constants";
import type {
  IArmor,
  IArmy,
  IAvailability,
  IExpansion,
  IOptionRadio,
  IUnit,
  IUnitObject,
  IWeapon,
  IUnitOption,
  IList,
  IListUnit,
  IListUpgrade,
  ITrait,
  ITableAditionalRow,
} from "@/types/sheetTypes";
import { setLS } from "@/utils/localStorage";

import expansionsJSON from "./data/expansions.json";
import armiesJSON from "./data/armies.json";
import unitsJSON from "./data/units";
import availabilitiesJSON from "./data/availabilities.json";
import armorsJSON from "./data/armors.json";
import weaponsJSON from "./data/weapons.json";
import optionsJSON from "./data/options.json";
import traitsJSON from "./data/traits.json";

export const useSheetsStore = defineStore("sheets", () => {
  const { t } = useI18n();
  const options = useOptionsStore();

  const selectedExpansion: Ref<string | undefined> = ref(undefined);
  const selectedArmy: Ref<string | undefined> = ref(undefined);
  const selectedUnits: Ref<string[]> = ref([]);
  const inList: Ref<boolean> = ref(false);
  const listName: Ref<string> = ref("");
  const unitsInArmy: Ref<IUnitObject[]> = ref([]);

  const importedExpansions: IExpansion = expansionsJSON;
  const importedExpansionsKeys: string[] = Object.keys(expansionsJSON);
  const importedArmies: IArmy = armiesJSON;
  const importedArmiesKeys: string[] = Object.keys(armiesJSON);
  const importedUnits: IUnit = unitsJSON;
  const importedUnitsKeys: string[] = Object.keys(unitsJSON);
  const importedAvailabilities: IAvailability = availabilitiesJSON;
  const importedArmors: IArmor = armorsJSON;
  const importedWeapons: IWeapon = weaponsJSON;
  const importedOptions: IUnitOption = optionsJSON;
  const importedTraits: ITrait = traitsJSON;

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
    return {
      label: t(`sheets.armies.${army}`),
      name: importedArmies[army].id,
      value: army,
      imgUrl: importedArmies[army].imgUrl || undefined,
      expansions: importedArmies[army].expansions,
      isWarParty: importedArmies[army].isWarParty,
      active: importedArmies[army].active || false,
    };
  });

  const units: IOptionRadio[] = importedUnitsKeys.map((unit) => {
    return {
      label: t(`sheets.units.${unit}`),
      name: unit,
      value: unit,
      armies: importedUnits[unit].armies,
    };
  });

  watch(selectedExpansion, changeSelectedExpansion);
  watch(selectedArmy, updateUriParams);
  watch(inList, updateUriParams);
  watch(listName, updateUriParams);
  watch(unitsInArmy, updateUriParams, { deep: true });

  const isSelectedExpansion: ComputedRef<Boolean> = computed(
    () => selectedExpansion.value !== undefined
  );

  const isSelectedArmy: ComputedRef<Boolean> = computed(
    () => selectedArmy.value !== undefined
  );

  const isSelectedUnits: ComputedRef<Boolean> = computed(
    () => selectedUnits.value?.length > 0
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

  const availableUnits = computed(() => {
    return units.filter((unit) =>
      unit.armies?.includes(selectedArmy.value || "")
    );
  });

  const availableTraits = computed(() => {
    return mapTraits();
  });

  const availableWeapons = computed(() => {
    return mapWeapons();
  });

  const availableArmours = computed(() => {
    return mapArmours();
  });

  const leadersTotal = computed(() => {
    return sumType(Constants.AVAILABILITIES_TYPES.LEADER);
  });

  const civisTotal = computed(() => {
    return sumType(Constants.AVAILABILITIES_TYPES.CIVIS);
  });

  const militesTotal = computed(() => {
    return sumType(Constants.AVAILABILITIES_TYPES.MILITES);
  });

  const raresTotal = computed(() => {
    return sumType(Constants.AVAILABILITIES_TYPES.RARE);
  });

  const figuresTotal = computed(() => {
    return unitsInArmy.value.reduce((a, unit) => a + getUnitSize(unit), 0);
  });

  const unitsTotal = computed(() => {
    return unitsInArmy.value.length;
  });

  const costTotal = computed(() => {
    return unitsInArmy.value.reduce(
      (a, unit) => a + calculateUnitCost(unit),
      0
    );
  });

  const isWarParty = computed(() => {
    return (
      militesTotal.value >= civisTotal.value &&
      militesTotal.value >= 2 * raresTotal.value
    );
  });

  const isMuster = computed(() => {
    return (
      civisTotal.value >= militesTotal.value + raresTotal.value &&
      militesTotal.value >= raresTotal.value
    );
  });

  const warbandType = computed(() => {
    if (getCompleteArmy.value?.isWarParty)
      return isWarParty.value
        ? Constants.WARBAND_TYPES.WARPARTY
        : Constants.WARBAND_TYPES.ADHOC;
    return isMuster.value
      ? Constants.WARBAND_TYPES.MUSTER
      : Constants.WARBAND_TYPES.ADHOC;
  });

  const figureCountForBreak = computed(() => {
    return unitsInArmy.value.reduce((a, unit) => {
      return a + (unit.dontCountForBreak ? 0 : getUnitSize(unit));
    }, 0);
  });

  const breakPointThreshold = computed(() => {
    return Math.floor(figureCountForBreak.value / 6);
  });

  function changeSelectedExpansion(
    _value: Ref<string | number | undefined>,
    oldValue?: Ref<string | number | undefined>
  ) {
    if (oldValue !== undefined) clearSelectedArmy();
    updateUriParams();
  }

  function clearSelectedArmy() {
    selectedArmy.value = undefined;
  }

  function startList() {
    inList.value = true;
    listName.value = t(`web.texts.newArmy`);
  }

  function resetList() {
    inList.value = false;
    listName.value = "";
    unitsInArmy.value = [];
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
    url.searchParams.get("id");
    setCompactList(url.searchParams.get("id"));
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
    if (unitsTotal.value > 0) {
      const unitsCompact = unitsInArmy.value.map((unit) =>
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
      unitSize: unit.size ? getUnitSize(unit) : undefined,
      index: unit.size
        ? importedUnitsKeys.findIndex((key) => unit.translate === key)
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
    return Object.keys(importedOptions)
      .findIndex((option) => option === selectedOptions)
      .toString();
  }

  function setCompactList(id: string | null) {
    if (!id) return;
    const list = compactedListDeconstruct(id);
    selectedExpansion.value = list.expansion;
    selectedArmy.value = list.army;
    inList.value = list.inList;
    listName.value = list.listName;
    if (list.units) unitsInArmy.value = list.units;
    if (list.options)
      list.options.forEach((option) => {
        if (option) upgradeUnit(option.upgrade, option.index);
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
          importedUnitsKeys[
            Number(unit.split(Constants.SEPARATORS.UNIT_VALUES)[1])
          ]
      );
      const sizes: number[] = compactUnits.map((unit) =>
        Number(unit.split(Constants.SEPARATORS.UNIT_VALUES)[0])
      );
      mapedUnits = mapUnits(unitsArray, sizes);
      const options = compactUnits.map(
        (unit) => unit.split(Constants.SEPARATORS.UNIT_VALUES)[2]
      );
      const keys = Object.keys(importedOptions);
      options.forEach((option, index) => {
        if (option) {
          const upgrades = option.split(Constants.SEPARATORS.OPTIONS);
          upgrades.forEach((upgrade) => {
            mapedOptions.push({
              upgrade: keys[Number(upgrade)],
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

  function mapUnits(units: string[], sizes?: number[]) {
    return units.map((unit, index) => {
      return {
        ...importedUnits[unit],
        translate: unit,
        weapon: importedUnits[unit].isCharacter
          ? undefined
          : importedUnits[unit].defaultWeapon,
        body: importedUnits[unit].isCharacter
          ? undefined
          : importedUnits[unit].defaultBody,
        shield: importedUnits[unit].isCharacter
          ? undefined
          : importedUnits[unit].defaultShield,
        size: sizes
          ? sizes[index] || options.defaultUnitNumber
          : options.defaultUnitNumber,
        modsCosts: 0,
        selectedOptions: [],
      };
    });
  }

  function mapTraits(): ITableAditionalRow[] {
    let traitsFromUnits: string[] = [];
    unitsInArmy.value.forEach((unit) => {
      traitsFromUnits = traitsFromUnits.concat(unit.traits);
    });
    const traitsFromUnitsCheck = traitsFromUnits.map(
      (trait) => importedTraits[getTraitTranslate(trait).id || ""]
    );
    return [...new Set(traitsFromUnitsCheck)].map((trait) => {
      return {
        name: trait.id,
        book: trait.book,
        page: trait.page,
      };
    });
  }

  function mapWeapons(): ITableAditionalRow[] {
    const weaponsFromUnits: string[] = [];
    unitsInArmy.value.forEach((unit) => {
      weaponsFromUnits.push(unit.weapon || unit.defaultWeapon || "");
    });
    return [...new Set(weaponsFromUnits)]
      .filter((weapon) => weapon !== "")
      .map((trait) => {
        return {
          name: importedWeapons[trait].id,
          book: importedWeapons[trait].book,
          page: importedWeapons[trait].page,
        };
      });
  }

  function mapArmours(): ITableAditionalRow[] {
    const armoursFromUnits: string[] = [];
    unitsInArmy.value.forEach((unit) => {
      armoursFromUnits.push(unit.body || unit.defaultBody || "");
      armoursFromUnits.push(unit.shield || unit.defaultShield || "");
    });
    return [...new Set(armoursFromUnits)]
      .filter((armor) => armor !== "")
      .map((trait) => {
        return {
          name: importedArmors[trait].id,
          book: importedArmors[trait].book,
          page: importedArmors[trait].page,
        };
      });
  }

  function addUnits() {
    const mapedUnits = mapUnits(selectedUnits.value);
    if (mapedUnits !== undefined) {
      unitsInArmy.value = unitsInArmy.value?.concat(mapedUnits);
    }
    selectedUnits.value = [];
  }

  function increaseSize(index: number) {
    unitsInArmy.value[index].size = Math.min(
      (unitsInArmy.value[index].size || 0) + 1,
      Constants.UNIT_SIZE.MAX
    );
  }

  function decreaseSize(index: number) {
    unitsInArmy.value[index].size = Math.max(
      (unitsInArmy.value[index].size || 0) - 1,
      Constants.UNIT_SIZE.MIN
    );
  }

  function isFirstUnit(index: number) {
    return index === 0;
  }

  function isLastUnit(index: number) {
    return unitsInArmy.value.length === index + 1;
  }

  function orderUp(index: number) {
    const unitTemp = unitsInArmy.value[index];
    unitsInArmy.value.splice(index, 1);
    unitsInArmy.value.splice(index - 1, 0, unitTemp);
  }

  function orderDown(index: number) {
    const unitTemp = unitsInArmy.value[index];
    unitsInArmy.value.splice(index, 1);
    unitsInArmy.value.splice(index + 1, 0, unitTemp);
  }

  function deleteUnit(index: number) {
    unitsInArmy.value.splice(index, 1);
  }

  function getAvailability(availability: string) {
    return t(`sheets.availabilities.${importedAvailabilities[availability]}`);
  }

  function getDeploymentNumber(index: number) {
    const notDeploymentUnits = unitsInArmy.value.reduce(
      (acc, unit) => (unit.noDeployToken !== undefined ? 1 + acc : 0 + acc),
      0
    );
    return index + 1 - notDeploymentUnits;
  }

  function calculateUnitCost(unit: IUnitObject): number {
    return getIndividualCost(unit) * getUnitSize(unit);
  }

  function calculateSave(unit: IUnitObject): string {
    if (unit.fixedSave) return unit.fixedSave.toString();
    let save: number = 7;
    const shield = unit.shield || unit.defaultShield;
    const barding = unit.barding || unit.defaultBarding;
    const body = unit.body || unit.defaultBody;
    if (body && importedArmors[body]) save -= importedArmors[body].value || 0;
    if (shield && body && importedArmors[body])
      save -= importedArmors[shield].value || 0;
    if (barding && body && importedArmors[body])
      save -= importedArmors[barding || -1].value || 0;
    if (
      (body && importedArmors[body].special) ||
      (shield && importedArmors[shield].special) ||
      (barding && importedArmors[barding]?.special)
    )
      return `*${save}`;
    return save.toString();
  }

  function isHidenItem(key: string) {
    return key === Constants.HIDE_OPTION;
  }

  function getArmourTranslate(key: string) {
    return importedArmors[key] ? importedArmors[key].id : key;
  }

  function getWeaponTranslate(key: string) {
    return importedWeapons[key] ? importedWeapons[key].id : key;
  }

  function getTraitTranslate(key: string) {
    const roundBracketsRegexExtract = new RegExp(/\((.*)\)/);
    const translationObject: Record<string, string | undefined> = {
      text: undefined,
      value: undefined,
      id: key.split("(")[0],
    };
    translationObject.text = importedTraits[key] ? importedTraits[key].id : key;
    if (roundBracketsRegexExtract.test(key))
      translationObject.text = importedTraits[key.split("(")[0]].id
        ? importedTraits[key.split("(")[0]].id
        : key;
    translationObject.value = getEquipmentTranslate(
      roundBracketsRegexExtract.exec(key)?.[0]
    );
    return translationObject;
  }

  function getEquipmentTranslate(string: string | undefined) {
    if (string === undefined) return string;
    const key = string.substring(1, string.length - 1);
    if (importedArmors[key])
      return t(`sheets.armors.${importedArmors[key].id}`);
    if (importedWeapons[key])
      return t(`sheets.weapons.${importedWeapons[key].id}`);
    return key;
  }

  function getWeaponIniciative(key: string) {
    const initiative = importedWeapons[key]
      ? importedWeapons[key].initiative
      : "";
    return initiative ? ` (${initiative})` : "";
  }

  function sumType(type: string) {
    return unitsInArmy.value
      .filter((unit) => unit.availability === type)
      .reduce((a, unit) => a + getUnitSize(unit), 0);
  }

  function getUnitSize(unit: IUnitObject): number {
    return unit.fixedFigures ? unit.fixedFigures : unit.size || 1;
  }

  function getIndividualCost(unit: IUnitObject): number {
    return unit.cost + (unit.modsCosts || 0);
  }

  function filteredOptions(unit: IUnitObject) {
    return mapedOptions(unit.options)
      .filter((option) => {
        return !(option.upgradeWeapon && unit.upgradedWeapon);
      })
      .filter((option) => {
        return !(option.upgradeShield && unit.upgradedShield);
      })
      .filter((option) => {
        return !(option.upgradeArmour && unit.upgradedBody);
      })
      .filter((option) => {
        return !(option.upgradeBarding && unit.upgradedBarding);
      })
      .filter((option) => {
        return !(
          option.neededTraits &&
          option.neededTraits.filter((trait: string) =>
            unit.traits.includes(trait)
          ).length == 0
        );
      })
      .filter((option) => {
        return !(
          option.incompatibleTraits &&
          option.incompatibleTraits.filter((trait: string) =>
            unit.traits.includes(trait)
          ).length > 0
        );
      })
      .filter((option) => {
        return !(
          option.incompatibleShields &&
          option.incompatibleShields.includes(unit.shield || "")
        );
      })
      .filter((option) => {
        return !(
          option.armies !== undefined &&
          !option.armies.includes(selectedArmy.value || "")
        );
      });
  }

  function mapedOptions(options: string[]) {
    return options.map((option) => {
      return { ...importedOptions[option], translate: option };
    });
  }

  function upgradeUnit(upgrade: string, index: number) {
    const option = importedOptions[upgrade];
    if (!option) return;

    const upgradeIndex = unitsInArmy.value[index].options.findIndex(
      (option) => option === upgrade
    );

    unitsInArmy.value[index].selectedOptions?.push(upgrade);
    unitsInArmy.value[index].modsCosts =
      (unitsInArmy.value[index].modsCosts || 0) + option.cost;
    unitsInArmy.value[index].options.splice(upgradeIndex, 1);

    if (option.upgradeWeapon) {
      unitsInArmy.value[index].upgradedWeapon = true;
      unitsInArmy.value[index].weapon = option.upgradeWeapon;
    }
    if (option.upgradeShield) {
      unitsInArmy.value[index].upgradedShield = true;
      unitsInArmy.value[index].shield = option.upgradeShield;
    }
    if (option.upgradeArmour) {
      unitsInArmy.value[index].upgradedBody = true;
      unitsInArmy.value[index].body = option.upgradeArmour;
    }
    if (option.upgradeBarding) {
      unitsInArmy.value[index].upgradedBarding = true;
      unitsInArmy.value[index].barding = option.upgradeBarding;
    }
    if (option.upgradeTraits && option.upgradeTraits.length > 0)
      unitsInArmy.value[index].traits = unitsInArmy.value[index].traits.concat(
        option.upgradeTraits
      );
    if (option.removeTraits && option.removeTraits.length > 0)
      unitsInArmy.value[index].traits = unitsInArmy.value[index].traits.filter(
        (x) => !option.removeTraits?.includes(x)
      );
    updateUriParams();
  }

  function downgradeUnit(upgrade: string, index: number) {
    const option = importedOptions[upgrade];
    if (!option) return;

    const upgradeIndex = unitsInArmy.value[index].selectedOptions?.findIndex(
      (option) => option === upgrade
    );

    unitsInArmy.value[index].selectedOptions?.splice(upgradeIndex || 0, 1);
    unitsInArmy.value[index].modsCosts =
      (unitsInArmy.value[index].modsCosts || 0) - option.cost;
    unitsInArmy.value[index].options?.push(upgrade);

    if (option.upgradeWeapon) {
      unitsInArmy.value[index].upgradedWeapon = false;
      unitsInArmy.value[index].weapon = unitsInArmy.value[index].defaultWeapon;
    }
    if (option.upgradeShield) {
      unitsInArmy.value[index].upgradedShield = false;
      unitsInArmy.value[index].shield = unitsInArmy.value[index].defaultShield;
    }
    if (option.upgradeArmour) {
      unitsInArmy.value[index].upgradedBody = false;
      unitsInArmy.value[index].body = unitsInArmy.value[index].defaultBody;
    }
    if (option.upgradeBarding) {
      unitsInArmy.value[index].upgradedBarding = false;
      unitsInArmy.value[index].barding =
        unitsInArmy.value[index].defaultBarding;
    }
    if (option.upgradeTraits && option.upgradeTraits.length > 0)
      unitsInArmy.value[index].traits = unitsInArmy.value[index].traits.filter(
        (x) => !option.upgradeTraits?.includes(x)
      );
    if (option.removeTraits && option.removeTraits.length > 0)
      unitsInArmy.value[index].traits = unitsInArmy.value[index].traits.concat(
        option.removeTraits
      );
    updateUriParams();
  }

  function saveList() {
    // TODO: crear guardado
  }

  function deleteList() {
    // TODO: crear eliminado
  }

  function printList() {
    window.print();
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
    costTotal,
    selectedUnits,
    availableUnits,
    availableTraits,
    availableWeapons,
    availableArmours,
    isSelectedUnits,
    addUnits,
    increaseSize,
    decreaseSize,
    deleteUnit,
    isFirstUnit,
    isLastUnit,
    orderUp,
    orderDown,
    unitsInArmy,
    getAvailability,
    calculateUnitCost,
    calculateSave,
    getArmourTranslate,
    getWeaponTranslate,
    getWeaponIniciative,
    getTraitTranslate,
    getDeploymentNumber,
    filteredOptions,
    mapedOptions,
    upgradeUnit,
    downgradeUnit,
    isHidenItem,
    leadersTotal,
    civisTotal,
    militesTotal,
    raresTotal,
    figuresTotal,
    unitsTotal,
    warbandType,
    breakPointThreshold,
    getUriParams,
    startList,
    resetList,
    saveList,
    deleteList,
    printList,
  };
});
