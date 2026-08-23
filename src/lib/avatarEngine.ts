import {
  PeepConfig,
  DEFAULT_PEEP_CONFIG,
  EXPRESSIONS,
  HAIR_STYLES,
  ACCESSORIES,
  BODIES,
  SKIN_TONES,
  HAIR_COLORS,
  CLOTHING_COLORS,
  buildPeepSvg,
} from "./peepsAssets";

// Curated Cheerful & Friendly Expressions
export const CHEERFUL_EXPRESSION_IDS = [
  "big_smile",
  "joyful_laugh",
  "cute_blush",
  "wink_tongue",
  "cool_sunglasses",
  "heart_eyes",
  "chill_beard_smile",
  "pattern_sweater_smirk",
];

// Curated Soft Pastel & Vibrant Background Colors
export const CHEERFUL_BACKGROUND_COLORS = [
  "#e0f2fe", // Soft Sky Blue
  "#fef3c7", // Warm Amber Sunlight
  "#fce7f3", // Soft Rose
  "#d1fae5", // Fresh Mint Emerald
  "#ede9fe", // Soft Violet Lavender
  "#fee2e2", // Gentle Peach Coral
  "#fed7aa", // Warm Apricot
  "#dbeafe", // Powder Blue
  "#f3e8ff", // Lilac Mist
  "#ecfdf5", // Spring Leaf
];

// PRNG Seed Hash Function (xmur3)
function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

// PRNG Generator (mulberry32)
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates a deterministic vector avatar configuration from any seed.
 */
export function generateDeterministicPeep(seed: string): PeepConfig {
  const seedFn = xmur3(seed || "default_user");
  const rand = mulberry32(seedFn());

  const pick = <T>(arr: readonly T[] | T[]): T => {
    const idx = Math.floor(rand() * arr.length);
    return arr[idx];
  };

  const selectedExpression = pick(CHEERFUL_EXPRESSION_IDS);
  const selectedHair = pick(HAIR_STYLES).id;
  const selectedAccessory = rand() > 0.4 ? pick(ACCESSORIES).id : "none";
  const selectedBody = pick(BODIES).id;
  const selectedSkin = pick(SKIN_TONES).value;
  const selectedHairCol = pick(HAIR_COLORS).value;
  const selectedClothing = pick(CLOTHING_COLORS).value;
  const selectedBg = pick(CHEERFUL_BACKGROUND_COLORS);

  return {
    mode: "bust",
    headExpression: selectedExpression,
    hairStyle: selectedHair,
    accessory: selectedAccessory,
    bodyPose: selectedBody,
    skinColor: selectedSkin,
    hairColor: selectedHairCol,
    clothingColor: selectedClothing,
    backgroundColor: selectedBg,
    inkStyle: "color",
    flipHorizontal: rand() > 0.7,
    scale: 1,
  };
}

/**
 * Converts a vector character configuration into a safe SVG Data URI.
 */
export function peepConfigToSvgDataUri(config: PeepConfig, size: number = 200): string {
  try {
    const svg = buildPeepSvg(config || DEFAULT_PEEP_CONFIG, size);
    const encoded = encodeURIComponent(svg)
      .replace(/'/g, "%27")
      .replace(/"/g, "%22");
    return `data:image/svg+xml;charset=utf-8,${encoded}`;
  } catch (e) {
    return "";
  }
}

/**
 * Retrieves persistent vector avatar config for authenticated users.
 */
export function getUserAvatarConfig(uid: string): PeepConfig {
  if (!uid || typeof window === "undefined") return DEFAULT_PEEP_CONFIG;

  const userKey = `rvan_user_avatar_config_${uid}`;
  try {
    const stored = localStorage.getItem(userKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.headExpression && parsed.hairStyle) {
        return parsed;
      }
    }
    return generateDeterministicPeep(uid);
  } catch (err) {
    return generateDeterministicPeep(uid);
  }
}

/**
 * Persists updated vector avatar configuration for authenticated users.
 */
export function saveUserAvatarConfig(uid: string, config: PeepConfig) {
  if (!uid || typeof window === "undefined") return;
  try {
    localStorage.setItem(`rvan_user_avatar_config_${uid}`, JSON.stringify(config));
  } catch (e) {}
}
