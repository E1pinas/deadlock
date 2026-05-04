import type { DeadlockItemCategory } from "./types";

export const HEROES_API_URL = "https://assets.deadlock-api.com/v2/heroes";
export const ITEMS_API_URL = "https://assets.deadlock-api.com/v2/items";
export const REVALIDATE_SECONDS = 60 * 60 * 6;
export const SHOP_ITEM_CATEGORY_SET = new Set(["weapon", "vitality", "spirit"]);
export const INTERNAL_ITEM_NAME_PATTERN =
  /_|^(armor_upgrade_t|weapon_upgrade_t|tech_upgrade_t)/i;
export const SIGNATURE_SLOTS = [
  "signature1",
  "signature2",
  "signature3",
  "signature4",
];

export const categoryLabelMap: Record<string, DeadlockItemCategory> = {
  spirit: "Spirit",
  vitality: "Vitality",
  weapon: "Weapon",
};

export const heroAccentFallbacks = [
  "rgb(191 146 87)",
  "rgb(172 118 75)",
  "rgb(118 134 150)",
  "rgb(126 67 53)",
];

export const itemCategoryOrder: DeadlockItemCategory[] = [
  "Weapon",
  "Vitality",
  "Spirit",
];

export const heroStatLabels: Record<string, string> = {
  max_health: "Salud maxima",
  base_health_regen: "Regeneracion base",
  stamina: "Resistencia",
  stamina_regen_per_second: "Regeneracion de resistencia",
  max_move_speed: "Velocidad maxima",
  sprint_speed: "Velocidad de sprint",
  light_melee_damage: "Daño melee ligero",
  heavy_melee_damage: "Daño melee pesado",
  tech_range: "Alcance de habilidades",
  tech_duration: "Duracion de habilidades",
};

export const priorityHeroStats = [
  "max_health",
  "base_health_regen",
  "stamina",
  "stamina_regen_per_second",
  "max_move_speed",
  "sprint_speed",
  "light_melee_damage",
  "heavy_melee_damage",
  "tech_range",
  "tech_duration",
];
