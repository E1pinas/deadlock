export type ApiHeroStat = {
  value: number | string;
  display_stat_name?: string;
};

export type ApiProperty = {
  value?: number | string;
  label?: string;
  postfix?: string;
  prefix?: string;
  postvalue_label?: string;
};

export type ApiHero = {
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

export type ApiItem = {
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
