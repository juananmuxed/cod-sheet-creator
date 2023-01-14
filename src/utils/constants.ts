export class Constants {
  static readonly LIST_INDEXS = {
    EXPANSION: 0,
    ARMY: 1,
    ENLISTED: 2,
    NAME: 3,
    UNITS: 4,
  };
  static readonly UNIT_SIZE = {
    MIN: 1,
    MAX: 15,
  };
  static readonly WEAPON_TYPES = ["melee", "ranged"];
  static readonly AVAILABILITIES_TYPES = {
    CIVIS: "CIVIS",
    MILITES: "MILITES",
    RARE: "RARE",
  };
  static readonly WARBAND_TYPES = {
    WARPARTY: "warParty",
    MUSTER: "muster",
    ADHOC: "adHoc",
  };
  static readonly SEPARATORS = {
    LIST: "_",
    UNITS: "-",
    UNIT_VALUES: "x",
    OPTIONS: "z",
  };
  static readonly UNIT_INDEXS = {
    SIZE: 0,
    UNIT: 1,
    OPTIONS: 2,
  };
  static readonly HIDE_OPTION = "HIDE_OPTION";
  static readonly LS_NAMES = {
    DEFAULT_UNIT_NUMBER: "default-unit-number",
    DEPLOYMENT_NUMBER: "deployment-number",
    COMPACT_LIST: "compact-list",
  };
}
