import type {
  IArmor,
  IAvailability,
  IOptionRadio,
  ITableAditionalRow,
  ITrait,
  IUnit,
  IUnitObject,
  IUnitOption,
  IWeapon,
} from "@/types/sheetTypes";
import { defineStore } from "pinia";
import { computed, ref, watch, type ComputedRef, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { Constants } from "@/utils/constants";
import { useSheetsStore } from "./sheets";
import { useOptionsStore } from "./options";

import unitsJSON from "./data/units";
import availabilitiesJSON from "./data/availabilities.json";
import armorsJSON from "./data/armors.json";
import weaponsJSON from "./data/weapons.json";
import optionsJSON from "./data/options.json";
import traitsJSON from "./data/traits.json";
import { suffleArray } from "@/utils/arrays";

export const useUnitsStore = defineStore("units", () => {
  const { t } = useI18n();
  const sheets = useSheetsStore();
  const options = useOptionsStore();
  const selectedUnits: Ref<string[]> = ref([]);
  const unitsInArmy: Ref<IUnitObject[]> = ref([]);

  const importedUnits: IUnit = unitsJSON;
  const importedAvailabilities: IAvailability = availabilitiesJSON;
  const importedArmors: IArmor = armorsJSON;
  const importedWeapons: IWeapon = weaponsJSON;
  const importedOptions: IUnitOption = optionsJSON;
  const importedTraits: ITrait = traitsJSON;

  const units: IOptionRadio[] = Object.keys(importedUnits).map((unit) => {
    return {
      label: t(`sheets.units.${unit}`),
      name: unit,
      value: unit,
      armies: importedUnits[unit].armies,
      availability: importedUnits[unit].availability,
    };
  });

  watch(unitsInArmy, () => sheets.updateUriParams(), { deep: true });

  const isSelectedUnits: ComputedRef<Boolean> = computed(
    () => selectedUnits.value?.length > 0
  );

  const availableUnitsByType = computed(() => {
    return orderUnitsByAvailability(
      units.filter((unit) => unit.armies?.includes(sheets.selectedArmy || ""))
    );
  });

  const unitsTotal = computed(() => {
    return unitsInArmy.value.filter((unit) => !unit.dontCountForBreak).length;
  });

  const costTotal = computed(() => {
    return unitsInArmy.value.reduce(
      (a, unit) => a + calculateUnitCost(unit),
      0
    );
  });

  const figureCountForBreak = computed(() => {
    return unitsInArmy.value.reduce((a, unit) => {
      return (
        a +
        (unit.dontCountForBreak ? 0 : getUnitSize(unit) + (unit.freeUnits || 0))
      );
    }, 0);
  });

  const breakPointThreshold = computed(() => {
    return Math.floor(figureCountForBreak.value / 6);
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

  const charactersTotal = computed(() => {
    return sumType(Constants.AVAILABILITIES_TYPES.SPECIAL_CHARACTER);
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
    if (sheets.getCompleteArmy?.isWarParty)
      return isWarParty.value
        ? Constants.WARBAND_TYPES.WARPARTY
        : Constants.WARBAND_TYPES.ADHOC;
    return isMuster.value
      ? Constants.WARBAND_TYPES.MUSTER
      : Constants.WARBAND_TYPES.ADHOC;
  });

  const deploymentNumbers = computed(() => {
    const suffledArray = suffleArray(
      Array.from({ length: options.maxMarks }, (_, i) => i + 1)
    );
    let acc = 0;
    return unitsInArmy.value.map((unit) => {
      if (unit.noDeployToken) return [undefined];
      if (unit.specialDeployAssasin)
        return [suffledArray[acc++], suffledArray[acc++], suffledArray[acc++]];
      if (isExtraDeploymentToken(unit))
        return [suffledArray[acc++], suffledArray[acc++]];
      return [suffledArray[acc++]];
    });
  });

  function isExtraDeploymentToken(unit: IUnitObject) {
    const save = calculateNumberSave(unit);
    return (
      save > 5 || (save > 4 && unit.traits.includes(Constants.TRAITS.MOUNTED))
    );
  }

  function orderUnitsByAvailability(units: IOptionRadio[]) {
    const availabilitiesOrder = Object.keys(importedAvailabilities);
    return units.sort(
      (a, b) =>
        availabilitiesOrder.indexOf(a.availability || "") -
        availabilitiesOrder.indexOf(b.availability || "")
    );
  }

  function mapUnits(units: string[], sizes?: number[]) {
    return units.map((unit, index) => {
      return {
        ...importedUnits[unit],
        translate: unit,
        weapon: importedUnits[unit].noStats
          ? undefined
          : importedUnits[unit].defaultWeapon,
        body: importedUnits[unit].noStats
          ? undefined
          : importedUnits[unit].defaultBody,
        shield: importedUnits[unit].noStats
          ? undefined
          : importedUnits[unit].defaultShield,
        size: sizes
          ? sizes[index] || options.defaultUnitNumber
          : options.defaultUnitNumber,
        modsCosts: 0,
        modsFixedCosts: 0,
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
        requires: trait.requires,
      };
    });
  }

  function mapWeapons(): ITableAditionalRow[] {
    const weaponsFromUnits: string[] = [];
    unitsInArmy.value.forEach((unit) => {
      weaponsFromUnits.push(unit.weapon || unit.defaultWeapon || "");
      const importedMounted = (unit.weapon || unit.defaultWeapon) + "_MOUNTED";
      if (
        unit.traits.includes(Constants.TRAITS.MOUNTED) &&
        importedWeapons[importedMounted]
      )
        weaponsFromUnits.push(importedMounted);
    });
    return [...new Set(weaponsFromUnits)]
      .filter((weapon) => weapon !== "")
      .map((weapon) => {
        return {
          name: importedWeapons[weapon].id,
          book: importedWeapons[weapon].book,
          page: importedWeapons[weapon].page,
          rangeShort: importedWeapons[weapon].rangeShort,
          rangeLong: importedWeapons[weapon].rangeLong,
          type: importedWeapons[weapon].type,
          initiative: importedWeapons[weapon].initiative,
          saveModification: importedWeapons[weapon].saveModification,
        };
      });
  }

  function mapArmours(): ITableAditionalRow[] {
    const armoursFromUnits: string[] = [];
    unitsInArmy.value.forEach((unit) => {
      armoursFromUnits.push(unit.body || unit.defaultBody || "");
      armoursFromUnits.push(unit.shield || unit.defaultShield || "");
      armoursFromUnits.push(unit.barding || unit.defaultBarding || "");
    });
    return [...new Set(armoursFromUnits)]
      .filter((armor) => armor !== "" && !isHidenItem(armor))
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

  function calculateUnitCost(unit: IUnitObject): number {
    return unit.fixedCost
      ? getFixedCost(unit)
      : getIndividualCost(unit) * getUnitSize(unit);
  }

  function calculateSave(unit: IUnitObject): string {
    if (unit.fixedSave) return unit.fixedSave.toString();
    const save = calculateNumberSave(unit);
    if (isSpecialArmour(unit)) return `*${save}`;
    return save.toString();
  }

  function isSpecialArmour(unit: IUnitObject) {
    const shield = unit.shield || unit.defaultShield;
    const barding = unit.barding || unit.defaultBarding;
    const body = unit.body || unit.defaultBody;
    return (
      (body && importedArmors[body]?.special) ||
      (shield && importedArmors[shield]?.special) ||
      (barding && importedArmors[barding]?.special)
    );
  }

  function calculateNumberSave(unit: IUnitObject): number {
    let save: number = 7;
    const shield = unit.shield || unit.defaultShield;
    const barding = unit.barding || unit.defaultBarding;
    const body = unit.body || unit.defaultBody;
    if (body && importedArmors[body]) save -= importedArmors[body].value;
    if (shield && importedArmors[shield]) save -= importedArmors[shield].value;
    if (barding && importedArmors[barding])
      save -= importedArmors[barding].value;
    return save;
  }

  function isHidenItem(key: string) {
    return (
      key === Constants.HIDE_OPTION ||
      key === Constants.NO_ARMOUR ||
      key === Constants.NO_SHIELD ||
      key === Constants.NO_BARDING
    );
  }

  function getArmourTranslate(key: string) {
    return importedArmors[key] ? importedArmors[key].id : key;
  }

  function getWeaponTranslate(key: string) {
    return importedWeapons[key] ? importedWeapons[key].id : key;
  }

  function getTraitTranslate(key: string) {
    const translationObject: Record<string, string | undefined> = {
      text: undefined,
      value: undefined,
      id: key.split("(")[0],
    };
    translationObject.text = importedTraits[key] ? importedTraits[key].id : key;
    if (Constants.REGEX_EXPRESIONS.ROUND_BRACKETS_EXTRACT.test(key))
      translationObject.text = importedTraits[key.split("(")[0]].id
        ? importedTraits[key.split("(")[0]].id
        : key;
    translationObject.value = getEquipmentTranslate(
      Constants.REGEX_EXPRESIONS.ROUND_BRACKETS_EXTRACT.exec(key)?.[0]
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
      .reduce((a, unit) => a + getUnitSizeForType(unit), 0);
  }

  function getUnitSizeForType(unit: IUnitObject): number {
    const unitSize = getUnitSize(unit);
    return unit.countsDouble ? unitSize * 2 : unitSize;
  }

  function getUnitSize(unit: IUnitObject): number {
    return unit.fixedFigures ? unit.fixedFigures : unit.size || 1;
  }

  function getIndividualCost(unit: IUnitObject): number {
    return (unit.cost || 0) + (unit.modsCosts || 0);
  }

  function getFixedCost(unit: IUnitObject): number {
    return (
      (unit.fixedCost || 0) +
      (unit.modsFixedCosts || 0) +
      (unit.modsCosts || 0) * getUnitSize(unit)
    );
  }

  function filteredOptions(unit: IUnitObject) {
    return mapedOptions(unit.options)
      .filter((option) => !unit.selectedOptions?.includes(option.key))
      .filter((option) => !(option.upgradeWeapon && unit.upgradedWeapon))
      .filter((option) => !(option.upgradeShield && unit.upgradedShield))
      .filter((option) => !(option.upgradeArmour && unit.upgradedBody))
      .filter((option) => !(option.upgradeBarding && unit.upgradedBarding))
      .filter(
        (option) =>
          !(
            option.neededTraits &&
            option.neededTraits.filter((trait: string) =>
              unit.traits.includes(trait)
            ).length == 0
          )
      )
      .filter(
        (option) =>
          !(
            option.neededWeapons &&
            option.neededWeapons.filter(
              (weapon: string) => unit.weapon === weapon
            ).length == 0
          )
      )
      .filter(
        (option) =>
          !(
            option.incompatibleTraits &&
            option.incompatibleTraits.filter((trait: string) =>
              unit.traits.includes(trait)
            ).length > 0
          )
      )
      .filter(
        (option) =>
          !(
            option.incompatibleShields &&
            option.incompatibleShields.includes(unit.shield || "")
          )
      )
      .filter(
        (option) =>
          !(
            option.incompatibleWeapons &&
            option.incompatibleWeapons.includes(unit.weapon || "")
          )
      )
      .filter(
        (option) =>
          !(
            option.armies !== undefined &&
            !option.armies.includes(sheets.selectedArmy || "")
          )
      );
  }

  function mapedOptions(options: string[]) {
    return options.map((option) => {
      return { ...importedOptions[option], translate: option, key: option };
    });
  }

  function upgradeUnit(upgrade: string, index: number) {
    const option = importedOptions[upgrade];
    if (!option) return;

    unitsInArmy.value[index].selectedOptions?.push(upgrade);
    unitsInArmy.value[index].modsCosts =
      (unitsInArmy.value[index].modsCosts || 0) + (option.cost || 0);

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
    if (option.fixedUnits && option.fixedCost) {
      unitsInArmy.value[index].fixedFigures =
        (unitsInArmy.value[index].fixedFigures || 0) + (option.fixedUnits || 0);
      unitsInArmy.value[index].modsFixedCosts =
        (unitsInArmy.value[index].modsFixedCosts || 0) +
        (option.fixedCost || 0);
    }
    sheets.updateUriParams();
  }

  function downgradeUnit(upgrade: string, index: number) {
    const option = importedOptions[upgrade];
    if (!option) return;

    const upgradeIndex = unitsInArmy.value[index].selectedOptions?.findIndex(
      (option) => option === upgrade
    );

    unitsInArmy.value[index].selectedOptions?.splice(upgradeIndex || 0, 1);
    unitsInArmy.value[index].modsCosts =
      (unitsInArmy.value[index].modsCosts || 0) - (option.cost || 0);

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
    if (option.fixedUnits && option.fixedCost) {
      unitsInArmy.value[index].fixedFigures =
        (unitsInArmy.value[index].fixedFigures || 0) - (option.fixedUnits || 0);
      unitsInArmy.value[index].modsFixedCosts =
        (unitsInArmy.value[index].modsFixedCosts || 0) -
        (option.fixedCost || 0);
    }
    sheets.updateUriParams();
  }

  return {
    importedUnits,
    importedOptions,
    costTotal,
    selectedUnits,
    availableUnitsByType,
    isSelectedUnits,
    availableTraits,
    availableWeapons,
    availableArmours,
    deploymentNumbers,
    addUnits,
    increaseSize,
    decreaseSize,
    deleteUnit,
    isFirstUnit,
    isLastUnit,
    orderUp,
    orderDown,
    getAvailability,
    calculateUnitCost,
    calculateSave,
    getArmourTranslate,
    getWeaponTranslate,
    getWeaponIniciative,
    getTraitTranslate,
    filteredOptions,
    mapedOptions,
    upgradeUnit,
    downgradeUnit,
    isHidenItem,
    leadersTotal,
    civisTotal,
    militesTotal,
    raresTotal,
    charactersTotal,
    warbandType,
    unitsInArmy,
    figureCountForBreak,
    unitsTotal,
    getUnitSize,
    mapUnits,
    breakPointThreshold,
  };
});
