export interface IExpansionObject {
  id: string;
  imgUrl?: string;
  active?: boolean;
}

export interface IExpansion {
  [key: string]: IExpansionObject;
}

export interface IArmyObject extends IExpansionObject {
  expansions: string[];
  active?: boolean;
  isWarParty?: boolean;
  imgUrl?: string;
}

export interface IArmy {
  [key: string]: IArmyObject;
}

export interface IOptionRadio {
  label?: string;
  name?: string;
  value?: string;
  imgUrl?: string;
  expansions?: string[];
  armies?: string[];
  availability?: string;
  isWarParty?: boolean;
  active?: boolean;
}
export interface IUnitObject {
  availability: string;
  combat?: number;
  ranged?: number;
  grit?: number;
  defaultWeapon?: string;
  defaultBody?: string;
  defaultBarding?: string;
  defaultShield?: string;
  traits: string[];
  cost?: number;
  options: string[];
  selectedOptions?: string[];
  armies: string[];
  translate?: string;
  weapon?: string;
  body?: string;
  barding?: string;
  shield?: string;
  size?: number;
  modsCosts?: number;
  modsFixedCosts?: number;
  dontCountForBreak?: boolean;
  fixedFigures?: number;
  fixedSave?: number;
  fixedCost?: number;
  countsDouble?: boolean;
  noDeployToken?: boolean;
  specialDeployAssasin?: boolean;
  upgradedWeapon?: boolean;
  upgradedBody?: boolean;
  upgradedBarding?: boolean;
  upgradedShield?: boolean;
  upgradedCommand?: boolean;
  upgradedMount?: boolean;
  isLeader?: boolean;
  isCharacter?: boolean;
  zeroFigures?: boolean;
  freeUnits?: number;
  commandRange?: number;
  commandPoints?: number;
}

export interface IUnit {
  [key: string]: IUnitObject;
}

export interface IArmorObject {
  id: string;
  value: number;
  special: boolean;
  book?: string;
  page?: number;
}

export interface IArmor {
  [key: string]: IArmorObject;
}

export interface IWeaponObject {
  id: string;
  rangeShort?: number;
  rangeLong?: number;
  saveModification?: number;
  type: string[];
  special: string[];
  initiative?: number;
  book?: string;
  page?: number;
}

export interface IWeapon {
  [key: string]: IWeaponObject;
}

export interface IAvailability {
  [key: string]: string;
}

export interface IUnitOptionObject {
  id: string;
  cost?: number;
  fixedCost?: number;
  fixedUnits?: number;
  upgradeWeapon?: string;
  upgradeArmour?: string;
  upgradeShield?: string;
  upgradeBarding?: string;
  upgradeTraits?: string[];
  removeTraits?: string[];
  neededTraits?: string[];
  neededWeapons?: string[];
  incompatibleTraits?: string[];
  incompatibleShields?: string[];
  incompatibleWeapons?: string[];
  armies?: string[];
}

export interface IUnitOption {
  [key: string]: IUnitOptionObject;
}

export interface ITraitObject {
  id: string;
  book?: string;
  requires?: boolean;
  page?: number;
  value?: boolean;
}

export interface ITrait {
  [key: string]: ITraitObject;
}
export interface IList {
  expansion?: string | number;
  army?: string | number | undefined;
  inList?: string | number | undefined;
  name?: string | number | undefined;
  units?: string | undefined;
}

export interface IListUnit {
  unitSize?: string | number;
  index?: string | number;
  options?: string | number;
}

export interface IListUpgrade {
  upgrade: string;
  index: number;
}

export interface ITableAditionalRow {
  name: string;
  page?: number;
  book?: string;
  requires?: boolean;
}

type ToastColors = "success" | "error" | "warning" | "light" | "dark";

export interface IToast {
  text?: string;
  color?: ToastColors;
  time?: number;
  closable?: boolean;
}
