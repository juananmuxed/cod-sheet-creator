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
  static readonly MARK_SIZE = {
    MIN: 1,
    MAX: 20,
  };
  static readonly WEAPON_TYPES = ["melee", "ranged"];
  static readonly AVAILABILITIES_TYPES = {
    CIVIS: "CIVIS",
    MILITES: "MILITES",
    RARE: "RARE",
    LEADER: "LEADER",
    SPECIAL_CHARACTER: "SPECIAL_CHARACTER",
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
  static readonly NO_SHIELD = "NO_SHIELD";
  static readonly NO_ARMOUR = "NO_ARMOUR";
  static readonly NO_BARDING = "NO_BARDING";
  static readonly LS_NAMES = {
    DEFAULT_UNIT_NUMBER: "default-unit-number",
    MAX_MARKS: "max-marks-number",
    DEPLOYMENT_NUMBER: "deployment-number",
    COMPACT_LIST: "compact-list",
    SAVED_LISTS: "saved-lists",
    PRINT_TRAITS: "print-traits",
    PRINT_WEAPONS: "print-weapons",
    PRINT_ARMOURS: "print-armours",
    PRINT_ARMIES_IMAGES: "print-armies-images",
  };
  static readonly REGEX_EXPRESIONS = {
    ROUND_BRACKETS_EXTRACT: /\((.*)\)/,
    ONLY_DIGITS: /^-?\d+$/,
  };
  static readonly TRAITS = {
    MOUNTED: "MOUNTED",
  };
}
