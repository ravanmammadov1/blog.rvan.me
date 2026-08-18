/**
 * APCA (Advanced Perceptual Contrast Algorithm) & WCAG 2.1 CONTRAST ENGINE
 * 
 * Implementation of APCA 0.98G (W3C Silver / AGWG Candidate) and WCAG 2.1
 * mathematical contrast ratio solvers with typography compliance matrix.
 * 
 * Reference: APCA 0.98G / 0.1.17 by Andrew Somers (Myndex Research / W3C AGWG)
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ApcaEvaluation {
  fgHex: string;
  bgHex: string;
  fgRgb: RGB;
  bgRgb: RGB;
  lc: number; // Raw Lc value with polarity sign (-108 to +106)
  absLc: number; // Absolute magnitude (0 to 108)
  polarity: "normal" | "reverse" | "none"; // normal = dark on light (+), reverse = light on dark (-)
  rating: {
    level: "preferred" | "standard" | "subhead" | "headline" | "ui_only" | "disabled" | "fail";
    label: string;
    label_az: string;
    description: string;
    description_az: string;
    badgeColor: string;
  };
  wcag: {
    ratio: number; // 1:1 to 21:1
    formattedRatio: string;
    aaNormalText: boolean; // >= 4.5:1
    aaLargeText: boolean; // >= 3:1
    aaaNormalText: boolean; // >= 7:1
    aaaLargeText: boolean; // >= 4.5:1
    uiComponent: boolean; // >= 3:1
  };
}

export interface MatrixCell {
  fontSize: number;
  fontWeight: number;
  status: "optimal" | "pass" | "large_only" | "fail";
  minRequiredLc: number;
  actualLc: number;
}

// APCA 0.98G Constants (W3C AGWG Silver Candidate standard)
const sRco = 0.2126729;
const sGco = 0.7151522;
const sBco = 0.072175;

const normBG = 0.56;
const normTXT = 0.57;
const revTXT = 0.62;
const revBG = 0.65;

const blkThrs = 0.022;
const blkClmp = 1.414;
const scaleBoW = 1.14;
const scaleWoB = 1.14;
const offsetExp = 0.027;
const deltaYmin = 0.0005;

/**
 * Validates a HEX color string (supports 3-digit and 6-digit hex with optional #).
 */
export function isValidHex(hex: string): boolean {
  if (!hex) return false;
  const clean = hex.replace(/^#/, "").trim();
  return /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(clean);
}

/**
 * Normalizes HEX string to 6-character uppercase with leading #.
 */
export function normalizeHex(hex: string, fallback = "#000000"): string {
  if (!isValidHex(hex)) return fallback;
  let clean = hex.replace(/^#/, "").trim();
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  return `#${clean.toUpperCase()}`;
}

/**
 * Converts a HEX string to RGB object.
 */
export function hexToRgb(hex: string): RGB {
  const norm = normalizeHex(hex);
  const num = parseInt(norm.replace("#", ""), 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Converts RGB numbers to 6-digit HEX.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * APCA 0.98G: Converts sRGB channel values (0-255) to Luminance (Y) with black soft flare.
 */
export function sRGBtoY(rgb: RGB): number {
  const rLin = Math.pow(Math.max(0, Math.min(255, rgb.r)) / 255.0, 2.4);
  const gLin = Math.pow(Math.max(0, Math.min(255, rgb.g)) / 255.0, 2.4);
  const bLin = Math.pow(Math.max(0, Math.min(255, rgb.b)) / 255.0, 2.4);

  let Y = sRco * rLin + sGco * gLin + sBco * bLin;

  // Soft clamp for dark colors (black level flare)
  if (Y < blkThrs) {
    Y += Math.pow(blkThrs - Y, blkClmp);
  }

  return Y;
}

/**
 * Deterministic APCA 0.98G Solver: Calculates Lightness Contrast (Lc).
 * Returns a signed value between -108 and +106.
 * Positive = Normal Polarity (dark text on light BG).
 * Negative = Reverse Polarity (light text on dark BG).
 */
export function calcAPCA(txtRgb: RGB, bgRgb: RGB): number {
  const yTxt = sRGBtoY(txtRgb);
  const yBg = sRGBtoY(bgRgb);

  // Insufficient delta Y clamp
  if (Math.abs(yBg - yTxt) < deltaYmin) {
    return 0;
  }

  let sapca = 0;
  let outputLc = 0;

  if (yBg > yTxt) {
    // Normal Polarity: Dark text on Light background (Black on White)
    const sBg = Math.pow(yBg, normBG);
    const sTxt = Math.pow(yTxt, normTXT);
    sapca = (sBg - sTxt) * scaleBoW;
    outputLc = sapca > offsetExp ? (sapca - offsetExp) * 100 : 0;
  } else {
    // Reverse Polarity: Light text on Dark background (White on Black)
    const sBg = Math.pow(yBg, revBG);
    const sTxt = Math.pow(yTxt, revTXT);
    sapca = (sBg - sTxt) * scaleWoB;
    outputLc = sapca < -offsetExp ? (sapca + offsetExp) * 100 : 0;
  }

  // Round to 1 decimal place
  return Math.round(outputLc * 10) / 10;
}

/**
 * WCAG 2.1 Relative Luminance Solver.
 */
function getWcagLuminance(rgb: RGB): number {
  const srgb = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
  const linear = srgb.map((c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

/**
 * WCAG 2.1 Mathematical Contrast Ratio (1:1 to 21:1).
 */
export function calcWcagRatio(rgb1: RGB, rgb2: RGB): number {
  const lum1 = getWcagLuminance(rgb1);
  const lum2 = getWcagLuminance(rgb2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

/**
 * Maps APCA Lc value to qualitative rating tier.
 */
function getApcaRating(absLc: number) {
  if (absLc >= 90) {
    return {
      level: "preferred" as const,
      label: "Preferred Body Text",
      label_az: "Optimal Əsas Mətn",
      description: "Optimal readability for body copy across all standard text sizes (≥14px at regular weight 400).",
      description_az: "Bütün standart ölçülərdə əsas mətnlər üçün optimal oxunaqlıq (14px+ standart çəkidə).",
      badgeColor: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
    };
  }
  if (absLc >= 75) {
    return {
      level: "standard" as const,
      label: "Standard Body Text",
      label_az: "Standart Əsas Mətn",
      description: "Minimum acceptable contrast for standard content text (≥16px regular 400 / ≥14px bold 700).",
      description_az: "Standart mətnlər üçün minimal qəbul olunan kontrast (16px+ standart / 14px+ qalın).",
      badgeColor: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
    };
  }
  if (absLc >= 60) {
    return {
      level: "subhead" as const,
      label: "Large & Subhead Text",
      label_az: "Böyük Mətn və Yarımbaşlıq",
      description: "Suitable for large content and subheadings (≥24px regular 400 / ≥18px bold 700).",
      description_az: "Böyük mətnlər və yarımbaşlıqlar üçün uyğundur (24px+ standart / 18px+ qalın).",
      badgeColor: "text-sky-400 border-sky-400/30 bg-sky-400/10",
    };
  }
  if (absLc >= 45) {
    return {
      level: "headline" as const,
      label: "Headings & Primary UI",
      label_az: "Başlıqlar və Əsas UI Düymələri",
      description: "Suitable for large display headlines (≥36px regular / ≥24px bold) and primary interactive buttons.",
      description_az: "Böyük displey başlıqları (36px+ standart / 24px+ qalın) və əsas interaktiv düymələr üçün uyğundur.",
      badgeColor: "text-amber-400 border-amber-400/30 bg-amber-400/10",
    };
  }
  if (absLc >= 30) {
    return {
      level: "ui_only" as const,
      label: "Non-Text UI & Icons",
      label_az: "Qeyri-Mətn UI və İkonlar",
      description: "Suitable for non-text UI components, borders, placeholders, and large decorative text (≥48px).",
      description_az: "Qeyri-mətn interfeys elementləri, sərhədlər, ikonlar və böyük dekorativ mətnlər (48px+) üçün uyğundur.",
      badgeColor: "text-orange-400 border-orange-400/30 bg-orange-400/10",
    };
  }
  if (absLc >= 15) {
    return {
      level: "disabled" as const,
      label: "Subtle / Disabled Only",
      label_az: "Qeyri-Aktiv / Zəif Elementlər",
      description: "Insufficient for functional text. Only suitable for disabled states or subtle background separation.",
      description_az: "Funksional mətnlər üçün yetərsizdir. Yalnız qeyri-aktiv düymələr və zəif fon ayrılması üçün uyğundur.",
      badgeColor: "text-rose-400 border-rose-400/30 bg-rose-400/10",
    };
  }
  return {
    level: "fail" as const,
    label: "Insufficient Contrast",
    label_az: "Kifayət Etməyən Kontrast",
    description: "Invisible or unreadable. Fails all accessibility standards for interactive UI and text.",
    description_az: "Görünməz və ya oxunmazdır. İnteraktiv interfeys və mətnlər üçün bütün əlçatanlıq standartlarından kəsilir.",
    badgeColor: "text-red-500 border-red-500/30 bg-red-500/10",
  };
}

/**
 * Full Evaluation Suite for any foreground and background color pair.
 */
export function evaluateContrast(fgInput: string, bgInput: string): ApcaEvaluation {
  const fgHex = normalizeHex(fgInput, "#FFFFFF");
  const bgHex = normalizeHex(bgInput, "#000000");

  const fgRgb = hexToRgb(fgHex);
  const bgRgb = hexToRgb(bgHex);

  const lc = calcAPCA(fgRgb, bgRgb);
  const absLc = Math.abs(lc);
  const polarity = lc > 0 ? "normal" : lc < 0 ? "reverse" : "none";

  const rating = getApcaRating(absLc);

  const wcagRatio = calcWcagRatio(fgRgb, bgRgb);

  return {
    fgHex,
    bgHex,
    fgRgb,
    bgRgb,
    lc,
    absLc,
    polarity,
    rating,
    wcag: {
      ratio: wcagRatio,
      formattedRatio: `${wcagRatio.toFixed(2)}:1`,
      aaNormalText: wcagRatio >= 4.5,
      aaLargeText: wcagRatio >= 3.0,
      aaaNormalText: wcagRatio >= 7.0,
      aaaLargeText: wcagRatio >= 4.5,
      uiComponent: wcagRatio >= 3.0,
    },
  };
}

/**
 * Standard font sizes and weights for APCA Matrix evaluation.
 */
export const MATRIX_FONT_SIZES = [12, 14, 16, 18, 24, 32, 48];
export const MATRIX_FONT_WEIGHTS = [
  { weight: 300, label: "300 Light" },
  { weight: 400, label: "400 Regular" },
  { weight: 500, label: "500 Medium" },
  { weight: 600, label: "600 SemiBold" },
  { weight: 700, label: "700 Bold" },
];

/**
 * Minimum required Lc lookup matrix for font size & weight pairs based on APCA guidelines.
 */
export function getMinRequiredLc(fontSize: number, fontWeight: number): number {
  if (fontSize >= 48) {
    if (fontWeight >= 600) return 30;
    if (fontWeight >= 400) return 35;
    return 40;
  }
  if (fontSize >= 32) {
    if (fontWeight >= 700) return 40;
    if (fontWeight >= 500) return 45;
    return 50;
  }
  if (fontSize >= 24) {
    if (fontWeight >= 700) return 45;
    if (fontWeight >= 600) return 50;
    if (fontWeight >= 400) return 55;
    return 60;
  }
  if (fontSize >= 18) {
    if (fontWeight >= 700) return 55;
    if (fontWeight >= 600) return 60;
    if (fontWeight >= 400) return 65;
    return 75;
  }
  if (fontSize >= 16) {
    if (fontWeight >= 700) return 65;
    if (fontWeight >= 500) return 70;
    if (fontWeight >= 400) return 75;
    return 85;
  }
  if (fontSize >= 14) {
    if (fontWeight >= 700) return 75;
    if (fontWeight >= 600) return 80;
    if (fontWeight >= 400) return 85;
    return 95;
  }
  // 12px and below
  if (fontWeight >= 700) return 85;
  if (fontWeight >= 500) return 90;
  return 95;
}

/**
 * Generates the full 2D Typography Contrast Compliance Matrix.
 */
export function generateTypographyMatrix(absLc: number): MatrixCell[][] {
  return MATRIX_FONT_SIZES.map((fontSize) => {
    return MATRIX_FONT_WEIGHTS.map((fw) => {
      const minRequiredLc = getMinRequiredLc(fontSize, fw.weight);
      let status: "optimal" | "pass" | "large_only" | "fail" = "fail";

      if (absLc >= minRequiredLc + 15) {
        status = "optimal";
      } else if (absLc >= minRequiredLc) {
        status = "pass";
      } else if (absLc >= minRequiredLc - 10 && fontSize >= 24) {
        status = "large_only";
      } else {
        status = "fail";
      }

      return {
        fontSize,
        fontWeight: fw.weight,
        status,
        minRequiredLc,
        actualLc: absLc,
      };
    });
  });
}

/**
 * Preset Color Combinations for quick testing.
 */
export interface ContrastPreset {
  id: string;
  name: string;
  name_az: string;
  fg: string;
  bg: string;
  category: "High Contrast" | "Dark Theme" | "Light Theme" | "Brand Accent" | "Challenging";
}

export const CONTRAST_PRESETS: ContrastPreset[] = [
  {
    id: "oled-white",
    name: "Pure White on OLED Black",
    name_az: "OLED Qara Üzərində Ağ",
    fg: "#FFFFFF",
    bg: "#000000",
    category: "High Contrast",
  },
  {
    id: "editorial-dark",
    name: "Obsidian Slate on Paper White",
    name_az: "Ağ Kağız Üzərində Qara Mətn",
    fg: "#0F172A",
    bg: "#FFFFFF",
    category: "Light Theme",
  },
  {
    id: "modern-dark-surface",
    name: "Soft Light Grey on Charcoal Surface",
    name_az: "Kömür Fon Üzərində Açıq Boz",
    fg: "#E2E8F0",
    bg: "#0F172A",
    category: "Dark Theme",
  },
  {
    id: "primary-electric-blue",
    name: "Pure Blue on White (APCA vs WCAG test)",
    name_az: "Ağ Üzərində Saf Mavi",
    fg: "#0000FF",
    bg: "#FFFFFF",
    category: "Brand Accent",
  },
  {
    id: "amber-accent",
    name: "Amber Gold on Deep Void",
    name_az: "Dərin Qara Üzərində Kəhrəba Qızılı",
    fg: "#F59E0B",
    bg: "#09090B",
    category: "Brand Accent",
  },
  {
    id: "subtle-muted-grey",
    name: "Muted Placeholder Grey on Dark Card",
    name_az: "Qaranlıq Kart Üzərində Solğun Boz",
    fg: "#71717A",
    bg: "#18181B",
    category: "Challenging",
  },
];

/**
 * Semantic Design System Tokens Evaluator.
 */
export interface SemanticToken {
  id: string;
  name: string;
  name_az: string;
  hex: string;
  role: "background" | "surface" | "text" | "accent" | "danger";
}

export const DEFAULT_DESIGN_TOKENS: SemanticToken[] = [
  { id: "bg-root", name: "Background (Root)", name_az: "Əsas Fon", hex: "#0A0A0A", role: "background" },
  { id: "bg-surface", name: "Surface (Card)", name_az: "Kart Səthi", hex: "#141414", role: "surface" },
  { id: "text-primary", name: "Text Primary", name_az: "Əsas Mətn", hex: "#F8FAFC", role: "text" },
  { id: "text-secondary", name: "Text Secondary", name_az: "İkinci Mətn", hex: "#94A3B8", role: "text" },
  { id: "text-muted", name: "Text Muted", name_az: "Solğun Mətn", hex: "#64748B", role: "text" },
  { id: "brand-primary", name: "Brand Primary", name_az: "Brend Rəngi", hex: "#38BDF8", role: "accent" },
  { id: "danger-error", name: "Error / Danger", name_az: "Xəta / Təhlükə", hex: "#F43F5E", role: "danger" },
];
