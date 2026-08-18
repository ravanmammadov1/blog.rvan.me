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
  { id: "Design", label: "Design", label_az: "Dizayn" },
  { id: "Developer", label: "Developer", label_az: "Developer" },
  { id: "Creative", label: "Creative", label_az: "Kreativ" },
  { id: "Marketing", label: "Marketing", label_az: "Marketinq" },
  { id: "Visual", label: "Visual", label_az: "Vizual" },
];

export const INTERACTIVE_TOOLS: InteractiveToolDefinition[] = [
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
