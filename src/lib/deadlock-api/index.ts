import { fetchHeroesApi, fetchItemsApi } from "./fetchers";
import {
  isShopUpgrade,
  mapHero,
  mapHeroDetail,
  mapItem,
  mapShopItemDetail,
  sortShopItems,
} from "./mappers";

export type {
  DeadlockAbility,
  DeadlockAbilityUpgrade,
  DeadlockHero,
  DeadlockHeroDetail,
  DeadlockItemCategory,
  DeadlockShopItem,
  DeadlockShopItemDetail,
  DeadlockStat,
} from "./types";

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
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort(sortShopItems);
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
