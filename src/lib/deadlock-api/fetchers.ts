import { cache } from "react";
import { HEROES_API_URL, ITEMS_API_URL, REVALIDATE_SECONDS } from "./constants";
import type { ApiHero, ApiItem } from "./types";

export const fetchHeroesApi = cache(async () => {
  const response = await fetch(HEROES_API_URL, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Heroes API returned ${response.status}`);
  }

  return (await response.json()) as ApiHero[];
});

export const fetchItemsApi = cache(async () => {
  const response = await fetch(ITEMS_API_URL, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Items API returned ${response.status}`);
  }

  return (await response.json()) as ApiItem[];
});
