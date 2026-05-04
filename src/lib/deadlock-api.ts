import { cache } from "react";

const HEROES_API_URL = "https://assets.deadlock-api.com/v2/heroes";
const ITEMS_API_URL = "https://assets.deadlock-api.com/v2/items";
const REVALIDATE_SECONDS = 60 * 60 * 6;
const SHOP_ITEM_CATEGORY_SET = new Set(["weapon", "vitality", "spirit"]);
const INTERNAL_ITEM_NAME_PATTERN =
  /_|^(armor_upgrade_t|weapon_upgrade_t|tech_upgrade_t)/i;
const SIGNATURE_SLOTS = ["signature1", "signature2", "signature3", "signature4"];

type ApiHeroStat = {
  value: number | string;
  display_stat_name?: string;
};

type ApiProperty = {
  value?: number | string;
  label?: string;
  postfix?: string;
  prefix?: string;
  postvalue_label?: string;
};

type ApiHero = {
  id: number;
  class_name?: string;
  name: string;
  player_selectable: boolean;
  disabled: boolean;
  complexity?: number;
  description?: {
    lore?: string;
    role?: string;
    playstyle?: string;
  };
  items?: Record<string, string>;
  starting_stats?: Record<string, ApiHeroStat>;
  images?: {
    icon_hero_card?: string;
    icon_hero_card_webp?: string;
    hero_card_gloat?: string;
    hero_card_gloat_webp?: string;
    background_image?: string;
    background_image_webp?: string;
    top_bar_vertical_image?: string;
    top_bar_vertical_image_webp?: string;
    icon_image_small?: string;
    icon_image_small_webp?: string;
  };
  colors?: {
    ui?: number[];
  };
};

type ApiItem = {
  id: number;
  class_name?: string;
  name: string;
  type: string;
  cost?: number;
  image?: string | null;
  image_webp?: string | null;
  item_slot_type?: string;
  item_tier?: number;
  description?: {
    desc?: string;
    quip?: string;
  };
  properties?: Record<string, ApiProperty>;
  tooltip_details?: {
    info_sections?: Array<{
      loc_string?: string;
    }>;
  } | null;
  upgrades?: Array<{
    property_upgrades?: Array<{
      name: string;
      bonus: number | string;
    }>;
  }>;
  ability_type?: string;
  videos?: {
    webm?: string;
    mp4?: string;
  };
};

export type DeadlockHero = {
  id: number;
  name: string;
  role: string;
  playstyle: string;
  lore: string;
  complexity: number;
  accent: string;
  image: string;
  backgroundImage: string;
  portrait: string;
};

export type DeadlockItemCategory = "Weapon" | "Vitality" | "Spirit";

export type DeadlockStat = {
  label: string;
  value: string;
};

export type DeadlockAbilityUpgrade = {
  tier: number;
  bonuses: string[];
};

export type DeadlockAbility = {
  id: number;
  className: string;
  name: string;
  type: string;
  summary: string;
  description: string;
  icon: string;
  video?: string;
  stats: DeadlockStat[];
  upgrades: DeadlockAbilityUpgrade[];
};

export type DeadlockHeroDetail = DeadlockHero & {
  stats: DeadlockStat[];
  abilities: DeadlockAbility[];
};

export type DeadlockShopItem = {
  id: number;
  name: string;
  cost: number;
  category: DeadlockItemCategory;
  tier: number;
  icon: string;
  summary: string;
};

export type DeadlockShopItemDetail = DeadlockShopItem & {
  description: string;
  stats: DeadlockStat[];
};

const categoryLabelMap: Record<string, DeadlockItemCategory> = {
  spirit: "Spirit",
  vitality: "Vitality",
  weapon: "Weapon",
};

const heroAccentFallbacks = [
  "rgb(191 146 87)",
  "rgb(172 118 75)",
  "rgb(118 134 150)",
  "rgb(126 67 53)",
];

const itemCategoryOrder: DeadlockItemCategory[] = [
  "Weapon",
  "Vitality",
  "Spirit",
];

const heroStatLabels: Record<string, string> = {
  max_health: "Salud máxima",
  base_health_regen: "Regeneración base",
  stamina: "Resistencia",
  stamina_regen_per_second: "Regeneración de resistencia",
  max_move_speed: "Velocidad máxima",
  sprint_speed: "Velocidad de sprint",
  light_melee_damage: "Daño melee ligero",
  heavy_melee_damage: "Daño melee pesado",
  tech_range: "Alcance de habilidades",
  tech_duration: "Duración de habilidades",
};

const priorityHeroStats = [
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

function createFallbackItemIcon(
  name: string,
  category: DeadlockItemCategory,
  tier: number,
) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <rect width="128" height="128" rx="26" fill="#241711" />
      <rect x="9" y="9" width="110" height="110" rx="20" fill="none" stroke="#d8ae67" stroke-width="2.5" />
      <text x="64" y="50" text-anchor="middle" fill="#f7ecd4" font-size="14" font-family="Verdana, sans-serif">${category}</text>
      <text x="64" y="78" text-anchor="middle" fill="#d8ae67" font-size="22" font-family="Verdana, sans-serif" font-weight="700">T${tier}</text>
      <text x="64" y="102" text-anchor="middle" fill="#c5b391" font-size="8" font-family="Verdana, sans-serif">${name.slice(0, 18)}</text>
    </svg>
  `)}`;
}

function createFallbackAbilityIcon(name: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <rect width="128" height="128" rx="26" fill="#241711" />
      <rect x="11" y="11" width="106" height="106" rx="18" fill="none" stroke="#d8ae67" stroke-width="2" />
      <path d="M64 28 78 58H62l12 42-26-36h16l0-36Z" fill="#f7ecd4" />
      <text x="64" y="114" text-anchor="middle" fill="#c5b391" font-size="8" font-family="Verdana, sans-serif">${name.slice(0, 18)}</text>
    </svg>
  `)}`;
}

function pickHeroImage(images?: ApiHero["images"]) {
  return (
    images?.hero_card_gloat_webp ??
    images?.hero_card_gloat ??
    images?.icon_hero_card_webp ??
    images?.icon_hero_card ??
    ""
  );
}

function pickHeroBackground(images?: ApiHero["images"]) {
  return (
    images?.background_image_webp ??
    images?.background_image ??
    pickHeroImage(images)
  );
}

function pickHeroPortrait(images?: ApiHero["images"]) {
  return (
    images?.top_bar_vertical_image_webp ??
    images?.top_bar_vertical_image ??
    images?.icon_image_small_webp ??
    images?.icon_image_small ??
    pickHeroImage(images)
  );
}

function rgbFromApiColor(color?: number[], index = 0) {
  if (!color || color.length < 3) {
    return heroAccentFallbacks[index % heroAccentFallbacks.length];
  }

  return `rgb(${color[0]} ${color[1]} ${color[2]})`;
}

function formatNumber(value: number) {
  if (Number.isInteger(value)) {
    return value.toString();
  }

  if (Math.abs(value) < 1) {
    return value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  }

  return value.toFixed(1).replace(/\.0$/, "");
}

function stripHtml(value?: string) {
  if (!value) {
    return "";
  }

  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function startCase(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeDisplayValue(
  value: string | number | undefined,
  postfix?: string,
  prefix?: string,
) {
  if (value === undefined || value === null) {
    return null;
  }

  const raw = String(value).trim();

  if (!raw || raw === "-1" || raw === "-1.0" || raw === "-2" || raw === "-2.0") {
    return null;
  }

  const numeric = Number.parseFloat(raw.replace(/[^\d.-]/g, ""));
  const hasNumeric = !Number.isNaN(numeric);

  if (hasNumeric && numeric === 0) {
    return null;
  }

  const cleanPrefix =
    prefix && !prefix.includes("{s:sign}") ? prefix.replace(/\{s:sign\}/g, "") : "";
  const needsPostfix = Boolean(postfix) && !raw.endsWith(postfix ?? "");

  return `${cleanPrefix}${raw}${needsPostfix ? postfix : ""}`;
}

function propertyToStat(key: string, property: ApiProperty): DeadlockStat | null {
  const label = property.label ?? property.postvalue_label ?? startCase(key);
  const value = normalizeDisplayValue(
    property.value,
    property.postfix,
    property.prefix,
  );

  if (!value) {
    return null;
  }

  return { label, value };
}

function mapProperties(
  properties?: Record<string, ApiProperty>,
  maxItems = 10,
) {
  if (!properties) {
    return [];
  }

  return Object.entries(properties)
    .map(([key, property]) => propertyToStat(key, property))
    .filter((property): property is DeadlockStat => property !== null)
    .slice(0, maxItems);
}

function extractItemDescription(item: ApiItem) {
  const primary =
    item.description?.desc ??
    item.description?.quip ??
    item.tooltip_details?.info_sections?.[0]?.loc_string;

  return stripHtml(primary);
}

function mapHero(hero: ApiHero, index: number): DeadlockHero {
  return {
    id: hero.id,
    name: hero.name,
    role: hero.description?.role ?? "Especialista",
    playstyle: hero.description?.playstyle ?? "",
    lore: hero.description?.lore ?? "",
    complexity: hero.complexity ?? 1,
    accent: rgbFromApiColor(hero.colors?.ui, index),
    image: pickHeroImage(hero.images),
    backgroundImage: pickHeroBackground(hero.images),
    portrait: pickHeroPortrait(hero.images),
  };
}

function isShopUpgrade(item: ApiItem) {
  return (
    item.type === "upgrade" &&
    typeof item.cost === "number" &&
    item.cost > 0 &&
    typeof item.item_slot_type === "string" &&
    SHOP_ITEM_CATEGORY_SET.has(item.item_slot_type) &&
    typeof item.name === "string" &&
    !INTERNAL_ITEM_NAME_PATTERN.test(item.name)
  );
}

function mapItem(item: ApiItem): DeadlockShopItem | null {
  const category = item.item_slot_type
    ? categoryLabelMap[item.item_slot_type]
    : undefined;

  if (!category) {
    return null;
  }

  const tier = item.item_tier ?? 1;
  const summary = extractItemDescription(item);

  return {
    id: item.id,
    name: item.name,
    cost: item.cost ?? 0,
    category,
    tier,
    icon:
      item.image_webp ??
      item.image ??
      createFallbackItemIcon(item.name, category, tier),
    summary:
      summary ||
      `Mejora de ${category} con coste ${item.cost ?? 0} y tier ${tier}.`,
  };
}

function mapHeroStartingStats(stats?: Record<string, ApiHeroStat>) {
  if (!stats) {
    return [];
  }

  return priorityHeroStats
    .map((key) => {
      const stat = stats[key];

      if (!stat) {
        return null;
      }

      const value =
        typeof stat.value === "number"
          ? formatNumber(stat.value)
          : normalizeDisplayValue(stat.value) ?? String(stat.value);

      if (!value) {
        return null;
      }

      return {
        label: heroStatLabels[key] ?? startCase(key),
        value,
      };
    })
    .filter((stat): stat is DeadlockStat => stat !== null);
}

function mapAbilityType(value?: string) {
  if (!value) {
    return "Poder";
  }

  const labels: Record<string, string> = {
    signature: "Poder",
    ultimate: "Definitiva",
    passive: "Pasiva",
    weapon: "Arma",
  };

  return labels[value] ?? startCase(value);
}

function mapAbilityUpgrade(
  ability: ApiItem,
  upgrade: NonNullable<ApiItem["upgrades"]>[number],
  tier: number,
): DeadlockAbilityUpgrade | null {
  const bonuses =
    upgrade.property_upgrades
      ?.map((entry) => {
        const property = ability.properties?.[entry.name];
        const value = normalizeDisplayValue(
          entry.bonus,
          property?.postfix,
          property?.prefix,
        );

        if (!value) {
          return null;
        }

        return `${property?.label ?? startCase(entry.name)}: ${value}`;
      })
      .filter((bonus): bonus is string => bonus !== null) ?? [];

  if (!bonuses.length) {
    return null;
  }

  return {
    tier,
    bonuses,
  };
}

function mapAbility(ability: ApiItem): DeadlockAbility {
  const description = extractItemDescription(ability);
  const summary = stripHtml(ability.description?.quip) || description;

  return {
    id: ability.id,
    className: ability.class_name ?? "",
    name: ability.name,
    type: mapAbilityType(ability.ability_type),
    summary,
    description,
    icon:
      ability.image_webp ??
      ability.image ??
      createFallbackAbilityIcon(ability.name),
    video: ability.videos?.mp4 ?? ability.videos?.webm,
    stats: mapProperties(ability.properties, 12),
    upgrades:
      ability.upgrades
        ?.map((upgrade, index) => mapAbilityUpgrade(ability, upgrade, index + 1))
        .filter((upgrade): upgrade is DeadlockAbilityUpgrade => upgrade !== null) ??
      [],
  };
}

function mapHeroDetail(
  hero: ApiHero,
  items: ApiItem[],
  index: number,
): DeadlockHeroDetail {
  const baseHero = mapHero(hero, index);
  const itemMap = new Map(
    items
      .filter((item) => item.class_name)
      .map((item) => [item.class_name as string, item]),
  );
  const abilities = SIGNATURE_SLOTS.map((slot) => hero.items?.[slot])
    .map((className) => (className ? itemMap.get(className) : undefined))
    .filter((item): item is ApiItem => item !== undefined)
    .map(mapAbility);

  return {
    ...baseHero,
    stats: mapHeroStartingStats(hero.starting_stats),
    abilities,
  };
}

function mapShopItemDetail(item: ApiItem): DeadlockShopItemDetail | null {
  const baseItem = mapItem(item);

  if (!baseItem) {
    return null;
  }

  return {
    ...baseItem,
    description:
      extractItemDescription(item) ||
      `Objeto de ${baseItem.category} pensado para reforzar tu build en el tier ${baseItem.tier}.`,
    stats: mapProperties(item.properties, 14),
  };
}

const fetchHeroesApi = cache(async () => {
  const response = await fetch(HEROES_API_URL, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Heroes API returned ${response.status}`);
  }

  return (await response.json()) as ApiHero[];
});

const fetchItemsApi = cache(async () => {
  const response = await fetch(ITEMS_API_URL, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Items API returned ${response.status}`);
  }

  return (await response.json()) as ApiItem[];
});

export async function getPlayableHeroes() {
  const heroes = await fetchHeroesApi();

  return heroes
    .filter((hero) => hero.player_selectable && !hero.disabled)
    .map(mapHero)
    .filter((hero) => hero.image);
}

export async function getShopItems() {
  const items = await fetchItemsApi();

  return items
    .filter(isShopUpgrade)
    .map(mapItem)
    .filter((item): item is DeadlockShopItem => item !== null)
    .sort((left, right) => {
      const categoryDiff =
        itemCategoryOrder.indexOf(left.category) -
        itemCategoryOrder.indexOf(right.category);

      if (categoryDiff !== 0) {
        return categoryDiff;
      }

      if (left.cost !== right.cost) {
        return left.cost - right.cost;
      }

      return left.name.localeCompare(right.name);
    });
}

export async function getHeroDetail(id: number) {
  const [heroes, items] = await Promise.all([fetchHeroesApi(), fetchItemsApi()]);
  const playableHeroes = heroes.filter(
    (hero) => hero.player_selectable && !hero.disabled,
  );
  const index = playableHeroes.findIndex((hero) => hero.id === id);

  if (index === -1) {
    return null;
  }

  return mapHeroDetail(playableHeroes[index], items, index);
}

export async function getShopItemDetail(id: number) {
  const items = await fetchItemsApi();
  const item = items.find((entry) => entry.id === id && isShopUpgrade(entry));

  if (!item) {
    return null;
  }

  return mapShopItemDetail(item);
}
