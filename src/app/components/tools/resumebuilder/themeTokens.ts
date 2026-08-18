import { ResumeDensity, ResumeFont } from "./resumeTypes";

/**
 * Standard Density Layout Tokens for All Resume Templates
 */
export interface DensityTokens {
  containerPadding: string;
  sectionGap: string;
  itemGap: string;
  bulletGap: string;
  headerMargin: string;
  lineHeight: string;
  bodyFontSize: string;
}

export const DENSITY_CONFIG: Record<ResumeDensity, DensityTokens> = {
  compact: {
    containerPadding: "p-6 sm:p-7",
    sectionGap: "space-y-2.5",
    itemGap: "space-y-1",
    bulletGap: "space-y-0.5",
    headerMargin: "mb-1 pb-0.5",
    lineHeight: "leading-tight",
    bodyFontSize: "text-[11px]",
  },
  standard: {
    containerPadding: "p-8 sm:p-9",
    sectionGap: "space-y-4",
    itemGap: "space-y-1.5",
    bulletGap: "space-y-0.5",
    headerMargin: "mb-1.5 pb-1",
    lineHeight: "leading-snug",
    bodyFontSize: "text-xs",
  },
  relaxed: {
    containerPadding: "p-10",
    sectionGap: "space-y-6",
    itemGap: "space-y-2.5",
    bulletGap: "space-y-1",
    headerMargin: "mb-2 pb-1.5",
    lineHeight: "leading-relaxed",
    bodyFontSize: "text-xs",
  },
};

export const FONT_FAMILY_CONFIG: Record<ResumeFont, string> = {
  sans: "'Geist', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  serif: "'Merriweather', 'Georgia', Cambria, 'Times New Roman', serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Roboto Mono', Menlo, monospace",
};
