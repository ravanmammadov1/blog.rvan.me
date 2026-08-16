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
  { id: "Creative", label: "Creative", label_az: "Kreativ" },
  { id: "Design", label: "Design", label_az: "Dizayn" },
  { id: "Marketing", label: "Marketing", label_az: "Marketinq" },
  { id: "Visual", label: "Visual", label_az: "Vizual" },
  { id: "Developer", label: "Developer", label_az: "Developer" },
];

export const INTERACTIVE_TOOLS: InteractiveToolDefinition[] = [
  {
    id: "open-peeps",
    slug: "open-peeps",
    name: "Open Peeps Character Builder",
    name_az: "Open Peeps Personaj Quraşdırıcısı",
    category: "Creative",
    description: "Modular hand-drawn vector illustration and character generator. Customize facial expressions, hair styles, accessories, clothing, and export clean SVG or high-res PNG.",
    description_az: "Modul əl ilə çəkilmiş vektor illüstrasiya və personaj generatoru. Üz ifadələrini, saç düzümlərini, aksesuarları və geyimləri fərdiləşdirin, canlı SVG və PNG ixrac edin.",
    icon: "🎨",
    path: "/tools/open-peeps",
    status: "live",
    featured: true,
    seoTitle: "Open Peeps Character Builder — Free Vector Avatar & Illustration Generator",
    seoDescription: "Create custom hand-drawn character illustrations with Open Peeps. Mix facial expressions, hairstyles, poses, clothing, and export clean SVG or high-res PNG.",
    tags: ["open-peeps", "character-builder", "illustrations", "svg", "avatar-generator", "vector", "creative"],
  },
  {
    id: "grapesjs-web-builder",
    slug: "grapesjs-web-builder",
    name: "GrapesJS Visual Web & Landing Page Builder",
    name_az: "GrapesJS Vizual Veb və Açılış Səhifəsi Quraşdırıcısı",
    category: "Design",
    description: "Professional in-browser drag-and-drop HTML5 & CSS website builder. Design responsive pages, manage styles, inspect layers, and export clean code or standalone ZIP packages.",
    description_az: "Brauzerdaxili peşəkar drag-and-drop HTML5 və CSS veb sayt quraşdırıcısı. Responsiv səhifələr dizayn edin, üslubları idarə edin və təmiz kod və ya ZIP paketi ixrac edin.",
    icon: "⚡",
    path: "/tools/grapesjs-web-builder",
    status: "live",
    featured: false,
    seoTitle: "GrapesJS Visual Web Builder — Free Online Drag & Drop HTML/CSS Editor",
    seoDescription: "Build responsive web pages and landing pages visually with GrapesJS. Drag components, edit typography, customize styles, and export clean HTML/CSS code.",
    tags: ["grapesjs", "web-builder", "html-editor", "css-builder", "drag-and-drop", "landing-page", "design"],
  },
];

export function getToolById(id: string): InteractiveToolDefinition | undefined {
  const cleanId = (id || "").toLowerCase().trim();
  if (cleanId === "openpeeps" || cleanId === "peeps") return INTERACTIVE_TOOLS.find((t) => t.id === "open-peeps");
  if (cleanId === "grapesjs" || cleanId === "web-builder") return INTERACTIVE_TOOLS.find((t) => t.id === "grapesjs-web-builder");
  return INTERACTIVE_TOOLS.find((t) => t.id === cleanId || t.slug === cleanId);
}

export function getFeaturedTools(): InteractiveToolDefinition[] {
  return INTERACTIVE_TOOLS.filter((t) => t.featured);
}
