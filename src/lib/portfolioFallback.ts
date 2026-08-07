import coverWuling1200 from "@/imports/466885252088463.6a4df53862539-1200.webp";
import coverWuling800 from "@/imports/466885252088463.6a4df53862539-800.webp";
import coverLimitless1200 from "@/imports/cbfd4b251276815.6a33abf0bf48e-1200.webp";
import coverLimitless800 from "@/imports/cbfd4b251276815.6a33abf0bf48e-800.webp";
import coverOmoda from "@/imports/063f86251210609.6a4670b82b027.png";

export interface PortfolioFallbackProject {
  title: string;
  slug: string;
  type: string;
  description: string;
  year: string;
  accent: string;
  image: string;
  mobileImage?: string;
  tags: string[];
}

export const PORTFOLIO_FALLBACK_PROJECTS: PortfolioFallbackProject[] = [
  {
    title: "Wuling / Creative Campaign",
    slug: "wuling-creative-campaign",
    type: "Art direction · Motion · Campaign",
    description:
      "A creative campaign system combining automotive art direction, motion graphics, and digital campaign assets for a consistent brand experience.",
    year: "2024",
    accent: "#e8fd52",
    image: coverWuling1200,
    mobileImage: coverWuling800,
    tags: ["Art Direction", "Motion Design", "Campaign Creative"],
  },
  {
    title: "Limitless Drive",
    slug: "limitless-drive",
    type: "Brand identity · 3D · Automotive",
    description:
      "A 3D-led automotive visual direction built around a bold identity, cinematic product presentation, and campaign-ready brand assets.",
    year: "2024",
    accent: "#ff764b",
    image: coverLimitless1200,
    mobileImage: coverLimitless800,
    tags: ["Brand Identity", "3D Design", "Automotive"],
  },
  {
    title: "Omoda & Jaecoo",
    slug: "omoda-jaecoo",
    type: "Creative suite · Motion system",
    description:
      "A flexible creative suite and motion system for automotive brands, designed to keep launch, social, and performance assets visually connected.",
    year: "2025",
    accent: "#5ce1e6",
    image: coverOmoda,
    tags: ["Motion Design", "Creative Systems", "Marketing Design"],
  },
];

export function getFallbackProject(slug?: string) {
  return PORTFOLIO_FALLBACK_PROJECTS.find((project) => project.slug === slug) || null;
}
