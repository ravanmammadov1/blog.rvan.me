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
  generateRandomPeep,
} from "../app/components/tools/openpeeps/peepsAssets";

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
 * Generates a deterministic character configuration from any input seed string.
 */
export function generateDeterministicPeep(seed: string): PeepConfig {
  if (!seed) return generateRandomPeep();
  const seedFn = xmur3(seed.trim());
  const rand = mulberry32(seedFn());

  const randomItem = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const isBw = rand() > 0.45;

  return {
    mode: "bust",
    headExpression: randomItem(EXPRESSIONS).id,
    hairStyle: randomItem(HAIR_STYLES).id,
    accessory: rand() > 0.45 ? randomItem(ACCESSORIES).id : "none",
    bodyPose: randomItem(BODIES).id,
    skinColor: isBw ? "#ffffff" : randomItem(SKIN_TONES).value,
    hairColor: isBw ? "#111111" : randomItem(HAIR_COLORS).value,
    clothingColor: isBw
      ? rand() > 0.5
        ? "#111111"
        : "#ffffff"
      : randomItem(CLOTHING_COLORS).value,
    backgroundColor: isBw ? "#ffffff" : "transparent",
    inkStyle: isBw ? "bw" : "color",
    flipHorizontal: rand() > 0.75,
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
 * Retrieves or establishes a stable character avatar for guest visitors during this session.
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
 * Retrieves or initializes a persistent character avatar for authenticated users.
 */
export function getUserAvatarConfig(uid: string, fallbackSeed?: string): PeepConfig {
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
    const config = generateDeterministicPeep(uid + (fallbackSeed ? "_" + fallbackSeed : ""));
    localStorage.setItem(userKey, JSON.stringify(config));
    return config;
  } catch (err) {
    return generateDeterministicPeep(uid);
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
