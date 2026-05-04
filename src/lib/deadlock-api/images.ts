import { heroAccentFallbacks } from "./constants";
import type { ApiHero, DeadlockItemCategory } from "./types";

export function createFallbackItemIcon(
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

export function createFallbackAbilityIcon(name: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <rect width="128" height="128" rx="26" fill="#241711" />
      <rect x="11" y="11" width="106" height="106" rx="18" fill="none" stroke="#d8ae67" stroke-width="2" />
      <path d="M64 28 78 58H62l12 42-26-36h16l0-36Z" fill="#f7ecd4" />
      <text x="64" y="114" text-anchor="middle" fill="#c5b391" font-size="8" font-family="Verdana, sans-serif">${name.slice(0, 18)}</text>
    </svg>
  `)}`;
}

export function pickHeroImage(images?: ApiHero["images"]) {
  return (
    images?.hero_card_gloat_webp ??
    images?.hero_card_gloat ??
    images?.icon_hero_card_webp ??
    images?.icon_hero_card ??
    ""
  );
}

export function pickHeroBackground(images?: ApiHero["images"]) {
  return (
    images?.background_image_webp ??
    images?.background_image ??
    pickHeroImage(images)
  );
}

export function pickHeroPortrait(images?: ApiHero["images"]) {
  return (
    images?.top_bar_vertical_image_webp ??
    images?.top_bar_vertical_image ??
    images?.icon_image_small_webp ??
    images?.icon_image_small ??
    pickHeroImage(images)
  );
}

export function rgbFromApiColor(color?: number[], index = 0) {
  if (!color || color.length < 3) {
    return heroAccentFallbacks[index % heroAccentFallbacks.length];
  }

  return `rgb(${color[0]} ${color[1]} ${color[2]})`;
}
