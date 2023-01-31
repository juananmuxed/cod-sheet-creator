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
    let acc = 0;
    return suffleDeploymentNumbers(
      unitsInArmy.value.map((unit) => (!unit.noDeployToken ? ++acc : undefined))
    );
  });

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
        requires: trait.requires,
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

  function suffleDeploymentNumbers(array: Array<number | undefined>) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      if (array[i] && array[j]) {
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
    return array;
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
          option.neededWeapons &&
          option.neededWeapons.filter(
            (weapon: string) => unit.weapon === weapon
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
          option.incompatibleWeapons &&
          option.incompatibleWeapons.includes(unit.weapon || "")
        );
      })
      .filter((option) => {
        return !(
          option.armies !== undefined &&
          !option.armies.includes(sheets.selectedArmy || "")
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
    warbandType,
    unitsInArmy,
    figuresTotal,
    unitsTotal,
    getUnitSize,
    mapUnits,
    breakPointThreshold,
  };
});
