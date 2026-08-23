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
} from "../app/components/tools/openpeeps/peepsAssets";

// Curated Cheerful & Friendly Expressions (Only smiling, happy, cute, confident)
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

// Curated Soft Pastel & Vibrant Background Colors (No gloomy black or transparent)
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

// Gender-categorized Hair Styles
export const FEMININE_HAIR_IDS = [
  "straight_bob",
  "messy_bun",
  "pigtails",
  "curly_medium",
  "afro_headband",
  "headphones",
];

export const MASCULINE_HAIR_IDS = [
  "short_fade",
  "fedora_hat",
  "beanie_knit",
  "dreadlocks",
  "big_afro",
  "mohawk",
  "headphones",
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
 * Calculates aesthetic quality score (0-100) for an avatar configuration.
 */
export function calculateAvatarScore(config: PeepConfig): number {
  let score = 75;
  if (CHEERFUL_EXPRESSION_IDS.includes(config.headExpression)) score += 15;
  if (CHEERFUL_BACKGROUND_COLORS.includes(config.backgroundColor)) score += 10;
  if (config.accessory !== "none") score += 5;
  return Math.min(100, score);
}

/**
 * Generates a cheerful, deterministic character configuration from any input seed string.
 * Supports optional gender preference ('female' | 'male' | 'neutral').
 */
export function generateDeterministicPeep(
  seed: string,
  gender?: "female" | "male" | "neutral"
): PeepConfig {
  const seedString = (seed || "rvan_guest_creator").trim();
  const seedFn = xmur3(seedString);
  const rand = mulberry32(seedFn());

  const randomItem = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

  // Filter expressions to ONLY cheerful, smiling, quality faces
  const cheerfulExpressions = EXPRESSIONS.filter((e) =>
    CHEERFUL_EXPRESSION_IDS.includes(e.id)
  );
  const selectedExpression = cheerfulExpressions.length > 0
    ? randomItem(cheerfulExpressions).id
    : "big_smile";

  // Filter hair styles based on gender if specified
  let hairOptions = HAIR_STYLES;
  if (gender === "female") {
    hairOptions = HAIR_STYLES.filter((h) => FEMININE_HAIR_IDS.includes(h.id));
  } else if (gender === "male") {
    hairOptions = HAIR_STYLES.filter((h) => MASCULINE_HAIR_IDS.includes(h.id));
  }
  if (hairOptions.length === 0) hairOptions = HAIR_STYLES;
  const selectedHair = randomItem(hairOptions).id;

  // Filter friendly non-knife bodies
  const friendlyBodies = BODIES.filter((b) => !b.id.includes("knife"));
  const selectedBody = friendlyBodies.length > 0 ? randomItem(friendlyBodies).id : "tshirt_relaxed";

  // Friendly non-mask accessories
  const friendlyAccessories = ACCESSORIES.filter((a) => a.id !== "face_mask");
  const selectedAccessory = rand() > 0.4 ? randomItem(friendlyAccessories).id : "none";

  // Premium, harmonious color combinations
  const selectedSkin = randomItem(SKIN_TONES).value;
  const selectedHairCol = randomItem(HAIR_COLORS).value;
  const selectedClothing = randomItem(CLOTHING_COLORS).value;
  const selectedBg = randomItem(CHEERFUL_BACKGROUND_COLORS);

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
 * Converts a character configuration into a safe SVG Data URI.
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

const GUEST_SESSION_STORAGE_KEY = "rvan_guest_avatar_config";

/**
 * Retrieves or establishes a stable cheerful character avatar for guest visitors during this session.
 */
export function getGuestAvatarConfig(): PeepConfig {
  if (typeof window === "undefined") return DEFAULT_PEEP_CONFIG;

  try {
    const stored = sessionStorage.getItem(GUEST_SESSION_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.headExpression && parsed.hairStyle) {
        return parsed;
      }
    }

    // Initialize deterministic session character
    let sessionSeed = sessionStorage.getItem("rvan_guest_session_id");
    if (!sessionSeed) {
      sessionSeed = "guest_" + Math.random().toString(36).substring(2, 12);
      sessionStorage.setItem("rvan_guest_session_id", sessionSeed);
    }

    const config = generateDeterministicPeep(sessionSeed);
    sessionStorage.setItem(GUEST_SESSION_STORAGE_KEY, JSON.stringify(config));
    return config;
  } catch (err) {
    return DEFAULT_PEEP_CONFIG;
  }
}

/**
 * Saves guest avatar preferences for the current session.
 */
export function saveGuestAvatarConfig(config: PeepConfig) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(GUEST_SESSION_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {}
}

/**
 * Retrieves or initializes a persistent cheerful character avatar for authenticated users.
 */
export function getUserAvatarConfig(
  uid: string,
  fallbackSeed?: string,
  gender?: "female" | "male" | "neutral"
): PeepConfig {
  if (!uid || typeof window === "undefined") return getGuestAvatarConfig();

  const userKey = `rvan_user_avatar_config_${uid}`;
  try {
    const stored = localStorage.getItem(userKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.headExpression && parsed.hairStyle) {
        return parsed;
      }
    }

    // Deterministically assign avatar from user ID/email
    const config = generateDeterministicPeep(
      uid + (fallbackSeed ? "_" + fallbackSeed : ""),
      gender
    );
    localStorage.setItem(userKey, JSON.stringify(config));
    return config;
  } catch (err) {
    return generateDeterministicPeep(uid, gender);
  }
}

/**
 * Persists updated character avatar configuration for authenticated users.
 */
export function saveUserAvatarConfig(uid: string, config: PeepConfig) {
  if (!uid || typeof window === "undefined") return;
  try {
    localStorage.setItem(`rvan_user_avatar_config_${uid}`, JSON.stringify(config));
  } catch (e) {}
}
