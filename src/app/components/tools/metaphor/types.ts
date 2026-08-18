export type GestaltMode = "figure-ground" | "shared-contour" | "typographic" | "juxtaposition";

export interface SemanticConcept {
  id: string;
  name: string;
  name_az: string;
  category: "Security" | "Velocity" | "Vision" | "Cognition" | "Nature" | "Commerce" | "Communication" | "Abstract";
  symbolName: string;
  symbolName_az: string;
  description: string;
  description_az: string;
  icon: string;
  // Precision SVG path centered in a 100x100 box
  primaryPath: string;
  // Alternative cutout / negative shape path
  cutoutPath: string;
  // Default scale & offset adjustments
  defaultScale?: number;
  tags: string[];
}

export interface MetaphorPreset {
  id: string;
  name: string;
  name_az: string;
  conceptAId: string;
  conceptBId: string;
  mode: GestaltMode;
  headline: string;
  headline_az: string;
  subhead: string;
  subhead_az: string;
  paletteId: string;
  rationale: string;
  rationale_az: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  name_az: string;
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  isDark: boolean;
}

export interface SemioticReport {
  primaryConcept: string;
  secondaryConcept: string;
  gestaltMode: string;
  mentalClosureMs: number;
  memorabilityScore: number;
  cognitiveFriction: "Low (Instant)" | "Optimal (Discovery)" | "High (Complex)";
  cognitiveMechanism: string;
  cognitiveMechanism_az: string;
  artDirectionCritique: string;
  artDirectionCritique_az: string;
  suggestedIndustries: string[];
}

export interface CanvasTransformConfig {
  scaleA: number;
  scaleB: number;
  offsetX: number;
  offsetY: number;
  rotationA: number;
  rotationB: number;
  negativeSpaceDepth: number; // 0 to 100
  cornerRadius: number; // 0 (sharp) to 24 (squircle)
  strokeWidth: number; // 0 to 8
  contrastInversion: boolean;
  gridVisible: boolean;
  gutenbergGuideVisible: boolean;
  aspectRatio: "1:1" | "16:9" | "4:5" | "A4";
}

export interface TypographyConfig {
  enabled: boolean;
  headline: string;
  subhead: string;
  fontFamily: "sans" | "serif" | "mono" | "geometric";
  tracking: number; // 0 to 0.4em
  alignment: "left" | "center" | "right" | "gutenberg";
  case: "uppercase" | "titlecase" | "lowercase";
  position: "top" | "bottom" | "split";
}
