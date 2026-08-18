/**
 * RESPONSIVE TYPOGRAPHY SCALE & CSS CLAMP CALCULATION ENGINE
 * 
 * Mathematical solver for modular harmonic type scales with linear interpolation
 * and exact CSS clamp() expression generation.
 */

export interface ModularScalePreset {
  id: string;
  name: string;
  name_az: string;
  ratio: number;
  fraction?: string;
  description: string;
  description_az: string;
}

export const MODULAR_SCALE_PRESETS: ModularScalePreset[] = [
  {
    id: "minor-second",
    name: "Minor Second",
    name_az: "Kiçik Sekunda",
    ratio: 1.067,
    fraction: "15:16",
    description: "Subtle and compact. Ideal for data-dense dashboards and mobile-first utilities.",
    description_az: "İncə və yığcam. Məlumatla zəngin idarəetmə panelləri və mobil interfeyslər üçün idealdır.",
  },
  {
    id: "major-second",
    name: "Major Second",
    name_az: "Böyük Sekunda",
    ratio: 1.125,
    fraction: "8:9",
    description: "Modest, disciplined hierarchy for clean corporate and technical documentation.",
    description_az: "Təmiz korporativ və texniki sənədləşmə üçün nizamlı, təmkinli iyerarxiya.",
  },
  {
    id: "minor-third",
    name: "Minor Third",
    name_az: "Kiçik Tersiya",
    ratio: 1.200,
    fraction: "5:6",
    description: "Balanced and natural. The default baseline for web apps, blogs, and SaaS platforms.",
    description_az: "Balanslı və təbii. Veb tətbiqlər, bloqlar və SaaS platformaları üçün standart seçim.",
  },
  {
    id: "major-third",
    name: "Major Third",
    name_az: "Böyük Tersiya",
    ratio: 1.250,
    fraction: "4:5",
    description: "Crisp and expressive. Strong heading presence without overwhelming body copy.",
    description_az: "Dəqiq və ifadəli. Mətni kölgədə qoymadan güclü başlıq fərqi yaradır.",
  },
  {
    id: "perfect-fourth",
    name: "Perfect Fourth",
    name_az: "Xalis Kvarta",
    ratio: 1.333,
    fraction: "3:4",
    description: "Dynamic and bold. Great for marketing homepages, portfolios, and magazines.",
    description_az: "Dinamik və cəsarətli. Marketinq səhifələri, portfoliolar və jurnallar üçün əla seçimdir.",
  },
  {
    id: "augmented-fourth",
    name: "Augmented Fourth",
    name_az: "Artırılmış Kvarta",
    ratio: 1.414,
    fraction: "1:√2",
    description: "High drama and strong visual contrast. Inspired by classical European page proportions.",
    description_az: "Yüksək vizual kontrast. Klassik Avropa kitab nisbətlərindən ilhamlanmışdır.",
  },
  {
    id: "perfect-fifth",
    name: "Perfect Fifth",
    name_az: "Xalis Kvinta",
    ratio: 1.500,
    fraction: "2:3",
    description: "Commanding scale with massive headline contrast. Ideal for creative landing pages.",
    description_az: "Böyük başlıq kontrastına malik güclü miqyas. Kreativ açılış səhifələri üçün idealdır.",
  },
  {
    id: "golden-ratio",
    name: "Golden Ratio",
    name_az: "Qızıl Nisbət",
    ratio: 1.618,
    fraction: "1:1.618",
    description: "Monumental, organic growth proportion (φ). Creates extreme headline dominance.",
    description_az: "Monumental, orqanik böyümə nisbəti (φ). Maksimum başlıq üstünlüyü təmin edir.",
  },
];

export interface TypeScaleConfig {
  minViewport: number; // in px (e.g. 375)
  maxViewport: number; // in px (e.g. 1280)
  minBaseFontSize: number; // in px (e.g. 16)
  maxBaseFontSize: number; // in px (e.g. 18)
  minScaleRatio: number; // e.g. 1.200
  maxScaleRatio: number; // e.g. 1.333
  rootFontSize: number; // in px (standard: 16)
  fontFamily?: string;
}

export interface TypeScaleStep {
  name: string; // e.g. "text-3xl"
  tag: string; // e.g. "H1"
  label: string; // e.g. "Primary Heading"
  label_az: string;
  step: number; // e.g. 4
  minPx: number;
  maxPx: number;
  minRem: number;
  maxRem: number;
  clampCss: string;
  slopeVw: number;
  interceptRem: number;
  lineHeight: number;
  letterSpacing: string;
  sampleText: string;
  sampleText_az: string;
}

export interface TypeScaleResult {
  config: TypeScaleConfig;
  steps: TypeScaleStep[];
  cssVariables: string;
  utilityClasses: string;
  tailwindConfig: string;
}

export const DEFAULT_TYPE_CONFIG: TypeScaleConfig = {
  minViewport: 375,
  maxViewport: 1280,
  minBaseFontSize: 16,
  maxBaseFontSize: 18,
  minScaleRatio: 1.200, // Minor Third
  maxScaleRatio: 1.333, // Perfect Fourth
  rootFontSize: 16,
  fontFamily: "Geist",
};

const STEP_DEFINITIONS = [
  { step: 6, name: "text-5xl", tag: "Display", label: "Display Hero", label_az: "Böyük Baner", sampleText: "Architectural Clarity", sampleText_az: "Memarlıq Dəqiqliyi" },
  { step: 5, name: "text-4xl", tag: "H1", label: "Primary Heading", label_az: "Əsas Başlıq", sampleText: "Design Systems with Mathematical Harmony", sampleText_az: "Riyazi Ahəngə Malik Dizayn Sistemləri" },
  { step: 4, name: "text-3xl", tag: "H2", label: "Section Header", label_az: "Bölmə Başlığı", sampleText: "Fluid Typography for Resilient Layouts", sampleText_az: "Elastik Tipoqrafiya və Dayanıqlı Strukturlar" },
  { step: 3, name: "text-2xl", tag: "H3", label: "Subsection Title", label_az: "Yarımbaşlıq", sampleText: "Eliminating Breakpoint Jitter with CSS Clamp", sampleText_az: "CSS Clamp ilə Sıçrayışların Aradan Qaldırılması" },
  { step: 2, name: "text-xl", tag: "H4", label: "Component Title", label_az: "Komponent Başlığı", sampleText: "Modular Scales and Perception", sampleText_az: "Modul Miqyaslar və Qavrayış Qanunları" },
  { step: 1, name: "text-lg", tag: "H5", label: "Lead Paragraph / Subhead", label_az: "Giriş Mətni / Alt Başlıq", sampleText: "Responsive typography ensures effortless reading across phones, tablets, and wide screens.", sampleText_az: "Həssas tipoqrafiya telefon, planşet və böyük ekranlarda rahat oxunuşu təmin edir." },
  { step: 0, name: "text-base", tag: "Body", label: "Body Copy", label_az: "Əsas Mətn", sampleText: "A fluid type scale calculates font size based on the active viewport width, interpolating between minimum and maximum bounds continuously.", sampleText_az: "Axıcı şrift miqyası cari ekran ölçüsünə əsasən şrift ölçüsünü minimum və maksimum hüdudlar arasında fasiləsiz hesablayır." },
  { step: -1, name: "text-sm", tag: "Small", label: "Secondary / Meta Text", label_az: "İkinci Dərəcəli / Meta Mətn", sampleText: "Published in Design Systems · 5 min read · Updated August 2026", sampleText_az: "Dizayn Sistemlərində dərc edildi · 5 dəq oxu · Avqust 2026" },
  { step: -2, name: "text-xs", tag: "Caption", label: "Caption / Badge", label_az: "İmza / Nişan", sampleText: "FIGURE 2.1 — LINEAR INTERPOLATION CURVE", sampleText_az: "ŞƏKİL 2.1 — XƏTTİ İNTERPOLYASİYA ƏYRİSİ" },
];

/**
 * Rounds a number to a specific number of decimal places for clean CSS output.
 */
export function roundTo(value: number, decimals = 4): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calculates line height recommendation based on font size step
 * Larger display headings need tighter line-heights; body text needs comfortable breathing room.
 */
function getRecommendedLineHeight(step: number): number {
  if (step >= 5) return 1.08;
  if (step === 4) return 1.15;
  if (step === 3) return 1.25;
  if (step === 2) return 1.35;
  if (step === 1) return 1.45;
  if (step === 0) return 1.6;
  return 1.4;
}

/**
 * Calculates letter spacing (tracking) recommendation based on font size step
 */
function getRecommendedLetterSpacing(step: number): string {
  if (step >= 5) return "-0.04em";
  if (step === 4) return "-0.03em";
  if (step === 3) return "-0.02em";
  if (step === 2) return "-0.01em";
  if (step === 1) return "0em";
  if (step === 0) return "0em";
  return "0.01em";
}

/**
 * Core mathematical solver: generates full TypeScaleResult with CSS clamp() tokens.
 */
export function calculateTypeScale(config: TypeScaleConfig = DEFAULT_TYPE_CONFIG): TypeScaleResult {
  const {
    minViewport,
    maxViewport,
    minBaseFontSize,
    maxBaseFontSize,
    minScaleRatio,
    maxScaleRatio,
    rootFontSize,
  } = config;

  const validMinW = Math.max(200, minViewport);
  const validMaxW = Math.max(validMinW + 50, maxViewport);
  const validMinBase = Math.max(8, minBaseFontSize);
  const validMaxBase = Math.max(8, maxBaseFontSize);
  const validRoot = Math.max(1, rootFontSize);

  const steps: TypeScaleStep[] = STEP_DEFINITIONS.map((def) => {
    // S_min = minBase * (minRatio ^ step)
    const minPxRaw = validMinBase * Math.pow(minScaleRatio, def.step);
    // S_max = maxBase * (maxRatio ^ step)
    const maxPxRaw = validMaxBase * Math.pow(maxScaleRatio, def.step);

    const minPx = roundTo(minPxRaw, 2);
    const maxPx = roundTo(maxPxRaw, 2);

    const minRem = roundTo(minPx / validRoot, 4);
    const maxRem = roundTo(maxPx / validRoot, 4);

    // Linear Interpolation: y = slope * x + intercept
    // slope = (maxPx - minPx) / (maxW - minW)
    // intercept = minPx - slope * minW
    const slope = (maxPx - minPx) / (validMaxW - validMinW);
    const interceptPx = minPx - slope * validMinW;

    const slopeVw = roundTo(slope * 100, 4);
    const interceptRem = roundTo(interceptPx / validRoot, 4);

    let clampCss = "";
    if (minPx === maxPx || validMinW >= validMaxW) {
      clampCss = `${minRem}rem`;
    } else {
      const sign = interceptRem >= 0 ? "+" : "-";
      const absIntercept = Math.abs(interceptRem);
      clampCss = `clamp(${minRem}rem, ${absIntercept}rem ${sign} ${Math.abs(slopeVw)}vw, ${maxRem}rem)`;
      // Standardize formatting if intercept is 0
      if (absIntercept === 0) {
        clampCss = `clamp(${minRem}rem, ${slopeVw}vw, ${maxRem}rem)`;
      } else {
        clampCss = `clamp(${minRem}rem, ${interceptRem}rem + ${slopeVw}vw, ${maxRem}rem)`;
      }
    }

    return {
      name: def.name,
      tag: def.tag,
      label: def.label,
      label_az: def.label_az,
      step: def.step,
      minPx,
      maxPx,
      minRem,
      maxRem,
      clampCss,
      slopeVw,
      interceptRem,
      lineHeight: getRecommendedLineHeight(def.step),
      letterSpacing: getRecommendedLetterSpacing(def.step),
      sampleText: def.sampleText,
      sampleText_az: def.sampleText_az,
    };
  });

  // Generate CSS Variables Code
  const cssVarsLines = steps.map((s) => `  --font-size-${s.name.replace("text-", "")}: ${s.clampCss}; /* ${s.minPx}px -> ${s.maxPx}px */`);
  const cssVariables = `:root {\n  /* Fluid Typography Scale (${validMinW}px -> ${validMaxW}px) */\n${cssVarsLines.join("\n")}\n}`;

  // Generate Utility Classes Code
  const utilityLines = steps.map((s) => `.${s.name} {\n  font-size: ${s.clampCss};\n  line-height: ${s.lineHeight};\n  letter-spacing: ${s.letterSpacing};\n}`);
  const utilityClasses = `/* Fluid Typography Utilities */\n${utilityLines.join("\n\n")}`;

  // Generate Tailwind Configuration Code
  const tailwindLines = steps.map((s) => `      '${s.name.replace("text-", "")}': ['${s.clampCss}', { lineHeight: '${s.lineHeight}', letterSpacing: '${s.letterSpacing}' }],`);
  const tailwindConfig = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      fontSize: {\n${tailwindLines.join("\n")}\n      },\n    },\n  },\n};`;

  return {
    config: {
      minViewport: validMinW,
      maxViewport: validMaxW,
      minBaseFontSize: validMinBase,
      maxBaseFontSize: validMaxBase,
      minScaleRatio,
      maxScaleRatio,
      rootFontSize: validRoot,
      fontFamily: config.fontFamily || "Geist",
    },
    steps,
    cssVariables,
    utilityClasses,
    tailwindConfig,
  };
}

/**
 * Computes exact pixel size for a step at any simulated viewport width.
 */
export function calculateComputedSize(
  minPx: number,
  maxPx: number,
  minW: number,
  maxW: number,
  currentW: number
): number {
  if (currentW <= minW) return minPx;
  if (currentW >= maxW) return maxPx;
  const progress = (currentW - minW) / (maxW - minW);
  return roundTo(minPx + progress * (maxPx - minPx), 2);
}
