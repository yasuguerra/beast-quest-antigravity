import { ArenaTier, ChestType } from "./types";

export const APP_NAME = "Beast Quest";
export const APP_VERSION = "0.1.0-alpha";

export const ARENA_THRESHOLDS = {
  [ArenaTier.CIVILIAN]: { min: 0, max: 99, name: "Civilian" },
  [ArenaTier.WARRIOR]: { min: 100, max: 299, name: "Warrior" },
  [ArenaTier.ELITE]: { min: 300, max: 599, name: "Elite" },
  [ArenaTier.BEAST]: { min: 600, max: 2999, name: "Beast" },
  [ArenaTier.LEGENDARY_MONSTER]: { min: 3000, max: 99999, name: "Legendary Monster" },
};

export const CHEST_UNLOCK_TIMES = {
  [ChestType.COMMON]: 3 * 60 * 60 * 1000, // 3 hours
  [ChestType.RARE]: 6 * 60 * 60 * 1000,   // 6 hours
  [ChestType.EPIC]: 12 * 60 * 60 * 1000,  // 12 hours
  [ChestType.LEGENDARY]: 24 * 60 * 60 * 1000, // 24 hours
  [ChestType.BEAST]: 24 * 60 * 60 * 1000, // 24h (Special)
  [ChestType.DIVINE]: 48 * 60 * 60 * 1000, // 48 hours
};

export const DEFAULT_USER_STATE = {
  level: 1,
  xp: 0,
  trophies: 0,
  gold: 100,
  gems: 10,
  fragments: 0,
  monsterSouls: 0,
  streakDays: 0,
};

// Placeholder for animation assets
export const LOTTIE_ANIMATIONS = {
  chestOpen: "https://assets9.lottiefiles.com/packages/lf20_k9w8ar8k.json", // Placeholder
  levelUp: "https://assets9.lottiefiles.com/packages/lf20_w2h2qg.json", // Placeholder
};
