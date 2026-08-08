export interface InteractiveToolDefinition {
  id: string;
  name: string;
  category: "Color" | "Typography" | "Spacing & Grid" | "SVG & Code" | "Shadows" | "SEO";
  description: string;
  icon: string;
  path: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
}

export const INTERACTIVE_TOOLS: InteractiveToolDefinition[] = [
  {
    id: "css-grid-generator",
    name: "Interactive CSS Grid Generator",
    category: "Spacing & Grid",
    description: "Visual CSS Grid layout builder. Drag, configure columns, rows, and gaps, then copy clean CSS grid code.",
    icon: "📐",
    path: "/tools/css-grid-generator",
    seoTitle: "Free Visual CSS Grid Generator — Online Layout Builder",
    seoDescription: "Create responsive CSS Grid layouts visually. Adjust columns, rows, gaps, and export clean CSS grid template code instantly.",
    tags: ["css-grid", "layout", "flexbox", "responsive"]
  },
  {
    id: "svg-wave-generator",
    name: "Gradient SVG Wave Generator",
    category: "SVG & Code",
    description: "Create smooth, customizable SVG background waves and dividers with custom gradients and wave complexity.",
    icon: "🌊",
    path: "/tools/svg-wave-generator",
    seoTitle: "Free Gradient SVG Wave Generator — Customizable Wave Dividers",
    seoDescription: "Generate smooth SVG wave dividers for website heroes and section breaks with customizable colors, gradients, and curve complexity.",
    tags: ["svg", "wave-generator", "gradients", "hero-divider"]
  },
  {
    id: "fluid-typography-generator",
    name: "Fluid Typography clamp() Generator",
    category: "Typography",
    description: "Generate responsive CSS clamp() font-size rules for perfectly scaled fluid typography across viewport widths.",
    icon: "🔤",
    path: "/tools/fluid-typography-generator",
    seoTitle: "Fluid Typography clamp() Generator — Responsive CSS Type Scale",
    seoDescription: "Calculate smooth fluid typography using CSS clamp(). Input min/max font sizes and viewports for responsive type scaling without media queries.",
    tags: ["typography", "clamp", "fluid-type", "css"]
  },
  {
    id: "box-shadow-generator",
    name: "Multi-Layered Smooth Box-Shadow Generator",
    category: "Shadows",
    description: "Craft ultra-smooth, realistic multi-layered CSS box shadows with natural blur falloff and depth.",
    icon: "✨",
    path: "/tools/box-shadow-generator",
    seoTitle: "Smooth Multi-Layer Box-Shadow Generator — Realistic Elevation CSS",
    seoDescription: "Generate layered, realistic CSS box shadows for cards and modals with smooth opacity falloff, blur radius, and offset control.",
    tags: ["box-shadow", "css-shadow", "elevation", "ui-design"]
  },
  {
    id: "color-converter-palette",
    name: "Color Converter & Contrast Checker",
    category: "Color",
    description: "Real-time HEX, RGB, HSL converter with WCAG AA/AAA color contrast scoring and palette generator.",
    icon: "🎨",
    path: "/tools/color-converter-palette",
    seoTitle: "Color Converter & WCAG Contrast Checker — HEX, RGB, HSL",
    seoDescription: "Convert HEX, RGB, and HSL colors instantly while checking WCAG 2.1 AA and AAA contrast compliance for text and UI elements.",
    tags: ["color-converter", "wcag", "contrast-checker", "palette"]
  },
  {
    id: "seo-meta-generator",
    name: "SEO Meta Tag & OpenGraph Card Generator",
    category: "SEO",
    description: "Generate complete HTML meta tags, OpenGraph cards, Twitter Cards, and live Google search snippet previews.",
    icon: "🔍",
    path: "/tools/seo-meta-generator",
    seoTitle: "SEO Meta Tag Generator — OpenGraph & Twitter Card Preview",
    seoDescription: "Generate production-ready HTML SEO meta tags, OpenGraph protocol tags, and Twitter Cards with real-time Google search snippet previews.",
    tags: ["seo", "meta-tags", "opengraph", "twitter-cards"]
  }
];

export function getToolById(id: string): InteractiveToolDefinition | undefined {
  return INTERACTIVE_TOOLS.find((t) => t.id === id);
}
