import React from "react";
import { Palette, Megaphone, ShieldCheck, Sparkles, Briefcase, Compass } from "lucide-react";

export interface TopicItem {
  id: string;
  slug: string;
  name: {
    en: string;
    az: string;
  };
  tag: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accentColor: string;
  description: {
    en: string;
    az: string;
  };
}

export const TOPICS_CATALOG: TopicItem[] = [
  {
    id: "design",
    slug: "design",
    name: {
      en: "Design",
      az: "Dizayn",
    },
    tag: "DESIGN",
    icon: Palette,
    accentColor: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    description: {
      en: "Visual systems, typography, grid architecture, UI/UX, and creative craft.",
      az: "Vizual sistemlər, tipoqrafiya, şəbəkə arxitekturası, UI/UX və dizayn sənətkarlığı.",
    },
  },
  {
    id: "marketing",
    slug: "marketing",
    name: {
      en: "Marketing",
      az: "Marketinq",
    },
    tag: "MARKETING",
    icon: Megaphone,
    accentColor: "border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    description: {
      en: "Conversion heuristics, positioning, messaging psychology, and growth loops.",
      az: "Konversiya hevristikası, pozisionlaşdırma, mesajlaşma psixologiyası və böyümə modelləri.",
    },
  },
  {
    id: "branding",
    slug: "branding",
    name: {
      en: "Branding",
      az: "Brendinq",
    },
    tag: "BRANDING",
    icon: ShieldCheck,
    accentColor: "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400",
    description: {
      en: "Visual identity, brand strategy, design tokens, and market differentiation.",
      az: "Vizual kimlik, brend strategiyası, dizayn tokenləri və bazarda fərqlənmə.",
    },
  },
  {
    id: "ai-creativity",
    slug: "ai-creativity",
    name: {
      en: "AI & Creativity",
      az: "Süni İntellekt və Yaradıcılıq",
    },
    tag: "AI & CREATIVITY",
    icon: Sparkles,
    accentColor: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    description: {
      en: "Generative workflows, prompt engineering, AI art ethics, and synthetic media.",
      az: "Generativ iş axınları, promt mühəndisliyi, Sİ incəsənət etikası və sintetik media.",
    },
  },
  {
    id: "creative-industry",
    slug: "creative-industry",
    name: {
      en: "Creative Industry",
      az: "Kreativ Sənaye",
    },
    tag: "INDUSTRY",
    icon: Briefcase,
    accentColor: "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    description: {
      en: "Career dynamics, multidisciplinary workflows, and agency business models.",
      az: "Karyera dinamikası, çoxsahəli iş axınları və agentlik biznes modelləri.",
    },
  },
  {
    id: "strategy",
    slug: "strategy",
    name: {
      en: "Strategy",
      az: "Strategiya",
    },
    tag: "STRATEGY",
    icon: Compass,
    accentColor: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    description: {
      en: "Brand strategy, marketing decisions, positioning, audience thinking, and strategic approaches to creative business.",
      az: "Brend strategiyası, marketinq qərarları, mövqeləndirmə, auditoriya düşüncəsi və yaradıcı biznes yanaşmaları.",
    },
  },
];

export function getTopicBySlug(slug: string): TopicItem | undefined {
  const normalized = (slug || "").toLowerCase().trim();
  return TOPICS_CATALOG.find(
    (t) => t.slug.toLowerCase() === normalized || t.id.toLowerCase() === normalized
  );
}
