import {
  categoryLabelMap,
  heroStatLabels,
  INTERNAL_ITEM_NAME_PATTERN,
  itemCategoryOrder,
  priorityHeroStats,
  SHOP_ITEM_CATEGORY_SET,
  SIGNATURE_SLOTS,
} from "./constants";
import {
  createFallbackAbilityIcon,
  createFallbackItemIcon,
  pickHeroBackground,
  pickHeroImage,
  pickHeroPortrait,
  rgbFromApiColor,
} from "./images";
import {
  formatNumber,
  normalizeDisplayValue,
  startCase,
  stripHtml,
} from "./text";
import type {
  ApiHero,
  ApiHeroStat,
  ApiItem,
  ApiProperty,
  DeadlockAbility,
  DeadlockAbilityUpgrade,
  DeadlockHero,
  DeadlockHeroDetail,
  DeadlockShopItem,
  DeadlockShopItemDetail,
  DeadlockStat,
} from "./types";

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

export function mapProperties(
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

export function extractItemDescription(item: ApiItem) {
  const primary =
    item.description?.desc ??
    item.description?.quip ??
    item.tooltip_details?.info_sections?.[0]?.loc_string;

  return stripHtml(primary);
}

export function mapHero(hero: ApiHero, index: number): DeadlockHero {
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

export function isShopUpgrade(item: ApiItem) {
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

export function mapItem(item: ApiItem): DeadlockShopItem | null {
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

export function sortShopItems(left: DeadlockShopItem, right: DeadlockShopItem) {
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
}

export function mapHeroStartingStats(stats?: Record<string, ApiHeroStat>) {
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

export function mapAbility(ability: ApiItem): DeadlockAbility {
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

export function mapHeroDetail(
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

export function mapShopItemDetail(item: ApiItem): DeadlockShopItemDetail | null {
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
