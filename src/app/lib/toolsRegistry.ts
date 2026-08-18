export type ToolCategory = "Creative" | "Design" | "Marketing" | "Visual" | "Developer";

export interface InteractiveToolDefinition {
  id: string;
  slug: string;
  name: string;
  name_az?: string;
  category: ToolCategory;
  description: string;
  description_az?: string;
  icon: string;
  path: string;
  status: "live" | "beta" | "upcoming";
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
}

export const TOOL_CATEGORIES: { id: string; label: string; label_az: string }[] = [
  { id: "All", label: "All Tools", label_az: "Hamısı" },
  { id: "Marketing", label: "Marketing", label_az: "Marketinq" },
  { id: "Design", label: "Design", label_az: "Dizayn" },
  { id: "Developer", label: "Developer", label_az: "Developer" },
  { id: "Creative", label: "Creative", label_az: "Kreativ" },
  { id: "Visual", label: "Visual", label_az: "Vizual" },
];

export const INTERACTIVE_TOOLS: InteractiveToolDefinition[] = [
  {
    id: "visual-metaphor-canvas",
    slug: "visual-metaphor-canvas",
    name: "Gestalt & Visual Metaphor Canvas",
    name_az: "Gestalt və Görsel Metafora Kanvası",
    category: "Creative",
    description: "Synthesize abstract concepts into high-impact visual metaphors using Figure-Ground Inversion, Shared Contour, and Mental Closure. Export clean vector SVGs and editorial posters.",
    description_az: "Rubinin Şəkil-Zəmin, Ortaq Kontur və Sürreal Birləşmə prinsipləri ilə iki fərqli anlayışı tək bir ikonik vizual metaforada birləşdirin. Təmiz SVG və editoryal posterlər ixrac edin.",
    icon: "✨",
    path: "/tools/visual-metaphor-canvas",
    status: "live",
    featured: true,
    seoTitle: "Gestalt & Visual Metaphor Canvas — Cognitive Art Direction Studio",
    seoDescription: "Synthesize abstract values into iconic visual metaphors using Gestalt figure-ground inversion, negative space masking, and semantic closure. Free in-browser vector generator.",
    tags: ["visual-metaphor", "gestalt", "negative-space", "art-direction", "advertising", "vector-generator", "conceptual-design", "mental-closure"],
  },
  {
    id: "persuasion-analyzer",
    slug: "persuasion-analyzer",
    name: "Marketing & Persuasion Copy Analyzer",
    name_az: "Marketinq və Persuasiya Mətn Analizatoru",
    category: "Marketing",
    description: "Evaluate headlines, value propositions, and CTA buttons across 8 cognitive marketing psychology dimensions. Get instant clarity scores, friction reduction tips, and empirical rewrite levers.",
    description_az: "Başlıqlar, dəyər təklifləri və CTA düymələrini 8 koqnitiv marketinq psixologiyası meyarı üzrə analiz edin. Dəqiq təsir xalları, müqavimət azaldılması və aydın tövsiyələr əldə edin.",
    icon: "🧠",
    path: "/tools/persuasion-analyzer",
    status: "live",
    featured: true,
    seoTitle: "Marketing & Persuasion Copy Analyzer — Cognitive Conversion Heuristics",
    seoDescription: "Analyze marketing headlines, value propositions, and CTA buttons for cognitive fluency, empirical specificity, risk reversal, and loss aversion. 100% private in-browser copywriting analyzer.",
    tags: ["persuasion-analyzer", "copywriting-tool", "conversion-rate-optimization", "cro", "headline-analyzer", "marketing-psychology", "cta-optimizer", "value-proposition"],
  },
  {
    id: "contrast-matrix",
    slug: "contrast-matrix",
    name: "APCA Contrast Matrix & Accessibility Checker",
    name_az: "APCA Kontrast Matrisi və Əlçatanlıq Aləti",
    category: "Design",
    description: "Evaluate perceptual color contrast with mathematical precision using the APCA-0.98G algorithm and WCAG 2.1 ratios. Features a 2D typography compliance matrix and design token evaluator.",
    description_az: "APCA-0.98G alqoritmi və WCAG 2.1 nisbətləri ilə perseptual rəng kontrastını yoxlayın. 2D şrift matrisi, canlı interfeys nümunəsi və dizayn sistemi tokenləri auditi.",
    icon: "👁️",
    path: "/tools/contrast-matrix",
    status: "live",
    featured: true,
    seoTitle: "APCA Contrast Matrix & Color Accessibility Checker — W3C Silver Calculator",
    seoDescription: "Calculate perceptual lightness contrast (Lc) using APCA 0.98G and compare with WCAG 2.1 ratios. Features live typography compliance matrix, UI component sandbox, and design system token audits.",
    tags: ["apca-contrast", "color-contrast-checker", "contrast-matrix", "accessible-colors", "wcag-contrast", "apca-calculator", "ui-accessibility", "design-system-tokens"],
  },
  {
    id: "typography-scale",
    slug: "typography-scale",
    name: "Typography Scale & Clamp Calculator",
    name_az: "Tipoqrafiya Miqyası və Clamp Kalkulyatoru",
    category: "Design",
    description: "Generate harmonious responsive typography hierarchies with exact mathematical modular scales and instant CSS clamp() code tokens. Free in-browser generator with live viewport testing.",
    description_az: "Riyazi modul miqyaslar və CSS clamp() ilə tam elastik tipoqrafiya iyerarxiyaları qurun. Canlı ekran simulyatoru və bir kliklə CSS dəyişənlərini kopyalama imkanı.",
    icon: "📐",
    path: "/tools/typography-scale",
    status: "live",
    featured: true,
    seoTitle: "Fluid Typography Scale & CSS Clamp Calculator — Responsive Type Generator",
    seoDescription: "Calculate harmonic modular typography scales and generate instant, copyable CSS clamp() values. Features live viewport simulation, rem conversions, and multi-format CSS/Tailwind exports.",
    tags: ["typography-scale", "type-scale", "css-clamp", "fluid-typography", "responsive-font-size", "modular-scale", "tailwind-typography", "css-generator"],
  },
  {
    id: "resume-builder",
    slug: "resume-builder",
    name: "ATS Resume & CV Builder",
    name_az: "ATS Resume və CV Quraşdırıcı",
    category: "Developer",
    description: "Free, in-browser ATS-friendly resume and CV builder. Choose from HR-approved templates, customize live with split-screen preview, and export high-resolution ATS-compliant PDF.",
    description_az: "Pulsuz, brauzerdaxili ATS-uyğun rezyume və CV quraşdırıcısı. HR təsdiqli şablonlar, canlı bölünmüş ekran redaktoru və 100% ATS-oxunaqlı PDF ixracı.",
    icon: "📄",
    path: "/tools/resume-builder",
    status: "live",
    featured: true,
    seoTitle: "Free ATS Resume & CV Builder — HR-Approved Vector PDF Generator",
    seoDescription: "Create professional ATS-compliant resumes with real-time preview, ATS score checker, and instant high-quality PDF download. Designed for software engineers, designers, and professionals.",
    tags: ["resume-builder", "cv-maker", "ats-resume", "developer-cv", "career", "pdf-export", "templates"],
  },
  {
    id: "open-peeps",
    slug: "open-peeps",
    name: "Character Builder Tool",
    name_az: "Personaj Quraşdırıcı Aləti",
    category: "Creative",
    description: "Modular hand-drawn vector illustration and character generator. Customize facial expressions, hair styles, accessories, clothing, and export clean SVG or high-res PNG.",
    description_az: "Modul əl ilə çəkilmiş vektor illüstrasiya və personaj generatoru. Üz ifadələrini, saç düzümlərini, aksesuarları və geyimləri fərdiləşdirin, canlı SVG və PNG ixrac edin.",
    icon: "🧑‍🎨",
    path: "/tools/open-peeps",
    status: "live",
    featured: true,
    seoTitle: "Character Builder Tool — Free Vector Avatar & Illustration Generator",
    seoDescription: "Create custom hand-drawn character illustrations with the modular character builder. Mix facial expressions, hairstyles, poses, clothing, and export clean SVG or high-res PNG.",
    tags: ["character-builder", "open-peeps", "avatar-generator", "illustrations", "svg", "vector", "creative"],
  },
];

export function getToolById(id: string): InteractiveToolDefinition | undefined {
  const cleanId = (id || "").toLowerCase().trim();
  if (cleanId === "persuasion-analyzer" || cleanId === "headline-analyzer" || cleanId === "persuasion" || cleanId === "copy-analyzer" || cleanId === "headline") {
    return INTERACTIVE_TOOLS.find((t) => t.id === "persuasion-analyzer");
  }
  if (cleanId === "contrast-matrix" || cleanId === "apca" || cleanId === "contrast" || cleanId === "apca-contrast" || cleanId === "contrast-checker") {
    return INTERACTIVE_TOOLS.find((t) => t.id === "contrast-matrix");
  }
  if (cleanId === "typography-scale" || cleanId === "type-scale" || cleanId === "clamp" || cleanId === "typographyscale" || cleanId === "clamp-calculator") {
    return INTERACTIVE_TOOLS.find((t) => t.id === "typography-scale");
  }
  if (cleanId === "openpeeps" || cleanId === "peeps" || cleanId === "character-builder") {
    return INTERACTIVE_TOOLS.find((t) => t.id === "open-peeps");
  }
  if (cleanId === "resumebuilder" || cleanId === "resume" || cleanId === "cv-builder" || cleanId === "cv") {
    return INTERACTIVE_TOOLS.find((t) => t.id === "resume-builder");
  }
  return INTERACTIVE_TOOLS.find((t) => t.id === cleanId || t.slug === cleanId);
}

export function getFeaturedTools(): InteractiveToolDefinition[] {
  return INTERACTIVE_TOOLS.filter((t) => t.featured);
}
