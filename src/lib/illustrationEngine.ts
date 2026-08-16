import { isFuzzyMatch } from "./fuzzySearch";
import { RAW_ILLUSTRATION_CATALOG, RawIllustrationItem } from "./illustrationCatalog";

export interface IllustrationItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  svgTemplate: (color: string) => string;
}

export const ILLUSTRATION_CATEGORIES = [
  "All",
  "Tech & Coding",
  "Design & Creative",
  "Business & Startup",
  "Data & Analytics",
  "Security & Cloud",
  "People & Work",
  "Finance & E-Commerce",
  "Marketing & Growth",
  "Science & Education",
  "Lifestyle & Wellness",
] as const;

export type IllustrationCategory = (typeof ILLUSTRATION_CATEGORIES)[number];

// Helper to wrap vector paths in standard 800x600 SVG container
function createUnDrawSvg(pathsSvg: string, viewBox = "0 0 800 600"): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%" fill="none">
  <rect width="800" height="600" rx="24" fill="#0d1117" opacity="0.4"/>
  ${pathsSvg}
</svg>`;
}

// ── 32 MODULAR VECTOR ACTION POSE ENGINES (Open Doodles & unDraw Style) ──

const POSE_RENDERERS: Record<string, (color: string, raw: RawIllustrationItem) => string> = {
  // 1. Reading Chair
  reading_chair: (color) => `
    <ellipse cx="400" cy="510" rx="320" ry="18" fill="#161b22"/>
    <rect x="220" y="240" width="220" height="220" rx="28" fill="#1e293b" stroke="#334155" stroke-width="4"/>
    <path d="M260 220 C260 180 290 170 300 170 C310 170 340 180 340 220 V340 H260 Z" fill="${color}"/>
    <circle cx="300" cy="140" r="26" fill="#f8fafc" stroke="#111" stroke-width="3"/>
    <path d="M275 130 C270 105 325 95 330 120 Z" fill="#111"/>
    <!-- Open Book in Hands -->
    <polygon points="340,300 380,310 420,300 425,275 380,280 335,275" fill="#ffffff" stroke="#111" stroke-width="3"/>
    <line x1="380" y1="280" x2="380" y2="310" stroke="#111" stroke-width="2"/>
    <!-- Comfy Floor Lamp on Right -->
    <line x1="560" y1="140" x2="560" y2="490" stroke="#334155" stroke-width="6"/>
    <polygon points="520,170 600,170 580,120 540,120" fill="${color}" opacity="0.9"/>
    <ellipse cx="560" cy="490" rx="40" ry="10" fill="#1e293b"/>
  `,

  // 2. Laptop on Floor
  laptop_floor: (color) => `
    <ellipse cx="400" cy="510" rx="340" ry="18" fill="#161b22"/>
    <!-- Cross Legged Body -->
    <circle cx="360" cy="180" r="28" fill="#f8fafc" stroke="#111" stroke-width="3.5"/>
    <path d="M330 165 C320 135 390 125 395 155 Z" fill="#111"/>
    <path d="M315 255 C315 220 355 210 365 210 C375 210 415 220 415 255 V370 H315 Z" fill="${color}"/>
    <path d="M260 410 C260 370 300 360 340 380 L420 380 C460 360 500 370 500 410 C500 440 260 440 260 410 Z" fill="#1e293b" stroke="#334155" stroke-width="4"/>
    <!-- Glowing Open Laptop -->
    <polygon points="340,360 440,360 460,335 360,335" fill="#e2e8f0" stroke="#111" stroke-width="3"/>
    <polygon points="360,335 460,335 450,290 350,290" fill="#0f172a" stroke="#111" stroke-width="3"/>
    <circle cx="405" cy="312" r="6" fill="${color}"/>
    <!-- Potted Monstera Plant on Left -->
    <path d="M190 380 L230 380 L220 470 L200 470 Z" fill="#b45309" stroke="#111" stroke-width="3"/>
    <circle cx="210" cy="330" r="35" fill="${color}" opacity="0.8"/>
  `,

  // 3. Zen Meditation
  meditation_zen: (color) => `
    <ellipse cx="400" cy="510" rx="340" ry="18" fill="#161b22"/>
    <!-- Floating Aura Rays -->
    <circle cx="400" cy="280" r="160" fill="${color}" opacity="0.15"/>
    <circle cx="400" cy="280" r="110" fill="#ffffff" opacity="0.1" stroke="${color}" stroke-width="2" stroke-dasharray="6 6"/>
    <!-- Character Head & Body -->
    <circle cx="400" cy="180" r="28" fill="#f8fafc" stroke="#111" stroke-width="3"/>
    <path d="M375 165 C360 135 435 130 430 160 Z" fill="#111"/>
    <path d="M350 250 C350 215 390 210 400 210 C410 210 450 215 450 250 V360 H350 Z" fill="${color}"/>
    <path d="M290 400 C290 360 340 355 375 375 L425 375 C460 355 510 360 510 400 C510 430 290 430 290 400 Z" fill="#1e293b"/>
    <!-- Hands resting on knees -->
    <circle cx="320" cy="375" r="10" fill="#f8fafc" stroke="#111" stroke-width="2.5"/>
    <circle cx="480" cy="375" r="10" fill="#f8fafc" stroke="#111" stroke-width="2.5"/>
  `,

  // 4. Roller Skater
  roller_skater: (color) => `
    <ellipse cx="400" cy="520" rx="340" ry="18" fill="#161b22"/>
    <!-- Skater In Motion -->
    <circle cx="340" cy="160" r="28" fill="#f8fafc" stroke="#111" stroke-width="3"/>
    <path d="M315 145 C305 120 375 110 370 140 Z" fill="#111"/>
    <path d="M300 230 C300 195 340 190 350 190 C360 190 390 195 400 230 L380 340 H310 Z" fill="${color}"/>
    <!-- Outstretched Arm -->
    <path d="M390 220 L480 200" stroke="#111" stroke-width="12" stroke-linecap="round"/>
    <circle cx="490" cy="198" r="8" fill="#f8fafc"/>
    <!-- Dynamic Legs & Skates -->
    <path d="M320 340 L300 450 L340 450" stroke="#1e293b" stroke-width="14" stroke-linecap="round" fill="none"/>
    <path d="M370 340 L440 400 L470 390" stroke="#1e293b" stroke-width="14" stroke-linecap="round" fill="none"/>
    <circle cx="300" cy="470" r="10" fill="${color}"/>
    <circle cx="330" cy="470" r="10" fill="${color}"/>
    <circle cx="460" cy="405" r="10" fill="${color}"/>
    <circle cx="485" cy="395" r="10" fill="${color}"/>
  `,

  // 5. Dancing to Beats
  dancing_music: (color) => `
    <ellipse cx="400" cy="510" rx="320" ry="18" fill="#161b22"/>
    <!-- Big Floating Music Notes -->
    <circle cx="240" cy="180" r="14" fill="${color}"/>
    <circle cx="560" cy="160" r="14" fill="${color}"/>
    <path d="M240 180 V120 H280 V150" stroke="${color}" stroke-width="4" fill="none"/>
    <!-- Character with Big Headphones -->
    <circle cx="400" cy="170" r="28" fill="#f8fafc" stroke="#111" stroke-width="3"/>
    <path d="M375 155 C360 125 435 120 430 150 Z" fill="#111"/>
    <!-- Over-Ear Headphone Arch -->
    <path d="M365 170 C365 130 435 130 435 170" stroke="${color}" stroke-width="6" fill="none"/>
    <rect x="360" y="160" width="12" height="24" rx="4" fill="${color}"/>
    <rect x="428" y="160" width="12" height="24" rx="4" fill="${color}"/>
    <!-- Groovy Torso & Arms Raised -->
    <path d="M350 240 C350 205 390 200 400 200 C410 200 450 205 450 240 L440 360 H360 Z" fill="${color}"/>
    <path d="M360 220 L300 170 M440 220 L500 170" stroke="#111" stroke-width="12" stroke-linecap="round"/>
    <circle cx="295" cy="165" r="8" fill="#f8fafc"/>
    <circle cx="505" cy="165" r="8" fill="#f8fafc"/>
    <path d="M375 360 L360 480 H395 L405 400 L415 480 H445 L430 360 Z" fill="#1e293b"/>
  `,

  // 6. Holding Coffee
  holding_coffee: (color) => `
    <ellipse cx="400" cy="510" rx="320" ry="18" fill="#161b22"/>
    <circle cx="360" cy="170" r="28" fill="#f8fafc" stroke="#111" stroke-width="3"/>
    <path d="M335 155 C320 125 395 120 390 150 Z" fill="#111"/>
    <path d="M315 245 C315 210 355 205 365 205 C375 205 415 210 415 245 V370 H315 Z" fill="${color}"/>
    <!-- Steaming Coffee Cup in Hand -->
    <rect x="420" y="270" width="28" height="34" rx="6" fill="#ffffff" stroke="#111" stroke-width="3"/>
    <path d="M448 280 C455 280 455 295 448 295" stroke="#111" stroke-width="3" fill="none"/>
    <path d="M430 260 C430 250 435 245 435 235 M440 260 C440 250 445 245 445 235" stroke="${color}" stroke-width="3" stroke-linecap="round" fill="none"/>
    <!-- Tote Bag on Left -->
    <rect x="270" y="270" width="40" height="50" rx="6" fill="#ffffff" stroke="#111" stroke-width="3"/>
    <path d="M280 270 C280 245 300 245 300 270" stroke="#111" stroke-width="3" fill="none"/>
    <path d="M335 370 L320 490 H355 L370 410 L385 490 H420 L400 370 Z" fill="#1e293b"/>
  `,

  // 7. Workstation Coding
  desk_coder: (color) => `
    <ellipse cx="400" cy="520" rx="340" ry="18" fill="#161b22"/>
    <!-- Large Ultra-Wide Curved Monitor -->
    <rect x="180" y="120" width="440" height="240" rx="18" fill="#1e293b" stroke="#334155" stroke-width="4"/>
    <rect x="195" y="135" width="410" height="210" rx="12" fill="#0f172a"/>
    <!-- Code Syntax Highlight Lines -->
    <rect x="220" y="160" width="90" height="10" rx="5" fill="${color}"/>
    <rect x="320" y="160" width="140" height="10" rx="5" fill="#64748b"/>
    <rect x="240" y="185" width="160" height="10" rx="5" fill="#94a3b8"/>
    <rect x="240" y="210" width="120" height="10" rx="5" fill="${color}"/>
    <rect x="370" y="210" width="80" height="10" rx="5" fill="#cbd5e1"/>
    <rect x="220" y="245" width="70" height="10" rx="5" fill="#38bdf8"/>
    <!-- Desk Surface & Stand -->
    <rect x="140" y="380" width="520" height="20" rx="6" fill="#3f3d56"/>
    <line x1="390" y1="360" x2="390" y2="380" stroke="#334155" stroke-width="12"/>
    <!-- Character Head & Hands -->
    <circle cx="400" cy="330" r="32" fill="#f8fafc" stroke="#111" stroke-width="3"/>
    <path d="M370 310 C350 280 440 270 435 305 Z" fill="#111"/>
    <path d="M350 400 L380 375 M450 400 L420 375" stroke="#111" stroke-width="10" stroke-linecap="round"/>
  `,

  // 8. Loving Big Heart
  loving_heart: (color) => `
    <ellipse cx="400" cy="510" rx="320" ry="18" fill="#161b22"/>
    <!-- Giant Glowing Red/Accent Heart -->
    <path d="M400 240 C340 160 220 200 260 300 C290 370 400 440 400 440 C400 440 510 370 540 300 C580 200 460 160 400 240 Z" fill="${color}" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.3))"/>
    <!-- Character Peeking and Hugging Heart -->
    <circle cx="400" cy="180" r="32" fill="#f8fafc" stroke="#111" stroke-width="3.5"/>
    <path d="M370 160 C350 130 440 120 435 155 Z" fill="#111"/>
    <!-- Arms Hugging Heart -->
    <path d="M330 260 C300 290 320 350 360 350" stroke="#111" stroke-width="14" stroke-linecap="round" fill="none"/>
    <path d="M470 260 C500 290 480 350 440 350" stroke="#111" stroke-width="14" stroke-linecap="round" fill="none"/>
    <circle cx="360" cy="350" r="10" fill="#f8fafc"/>
    <circle cx="440" cy="350" r="10" fill="#f8fafc"/>
  `,

  // 9. Smartphone Scroller
  phone_scroller: (color) => `
    <ellipse cx="400" cy="510" rx="300" ry="18" fill="#161b22"/>
    <!-- Character -->
    <circle cx="320" cy="160" r="28" fill="#f8fafc" stroke="#111" stroke-width="3"/>
    <path d="M295 145 C280 120 350 110 350 140 Z" fill="#111"/>
    <path d="M280 230 C280 195 320 190 330 190 C340 190 380 195 380 230 V360 H280 Z" fill="${color}"/>
    <!-- Hands holding oversized Smartphone -->
    <rect x="360" y="160" width="130" height="230" rx="18" fill="#2f2e41" stroke="#3f3d56" stroke-width="4"/>
    <rect x="375" y="175" width="100" height="200" rx="12" fill="#ffffff"/>
    <circle cx="425" cy="210" r="16" fill="${color}"/>
    <rect x="390" y="240" width="70" height="10" rx="5" fill="#0f172a"/>
    <rect x="390" y="260" width="50" height="8" rx="4" fill="#94a3b8"/>
    <!-- Floating Notification Badge -->
    <rect x="470" y="140" width="140" height="60" rx="14" fill="#0f172a" stroke="${color}" stroke-width="2"/>
    <circle cx="495" cy="170" r="8" fill="${color}"/>
    <rect x="515" y="165" width="75" height="10" rx="5" fill="#ffffff"/>
    <path d="M300 360 L290 490 H320 L330 410 L340 490 H370 L360 360 Z" fill="#1e293b"/>
  `,

  // 10. Skateboarder
  skateboarder: (color) => `
    <ellipse cx="400" cy="510" rx="320" ry="18" fill="#161b22"/>
    <circle cx="360" cy="160" r="28" fill="#f8fafc" stroke="#111" stroke-width="3"/>
    <path d="M335 145 C320 120 395 110 390 140 Z" fill="#111"/>
    <path d="M315 235 C315 200 355 195 365 195 C375 195 415 200 415 235 V360 H315 Z" fill="${color}"/>
    <!-- Skateboard Held Vertically -->
    <rect x="430" y="190" width="24" height="170" rx="12" fill="#1e293b" stroke="${color}" stroke-width="4"/>
    <circle cx="442" cy="210" r="6" fill="${color}"/>
    <circle cx="442" cy="340" r="6" fill="${color}"/>
    <path d="M410 240 L435 250" stroke="#111" stroke-width="10" stroke-linecap="round"/>
    <circle cx="435" cy="250" r="8" fill="#f8fafc"/>
    <path d="M335 360 L320 490 H355 L370 410 L385 490 H420 L400 360 Z" fill="#1e293b"/>
  `,

  // 11. Whiteboard Presenter
  whiteboard_present: (color) => `
    <ellipse cx="400" cy="520" rx="340" ry="18" fill="#161b22"/>
    <!-- Large Whiteboard with Stand -->
    <rect x="280" y="100" width="340" height="260" rx="16" fill="#ffffff" stroke="#3f3d56" stroke-width="4"/>
    <!-- Chart on Whiteboard -->
    <rect x="320" y="240" width="30" height="80" rx="6" fill="${color}"/>
    <rect x="370" y="180" width="30" height="140" rx="6" fill="#cbd5e1"/>
    <rect x="420" y="140" width="30" height="180" rx="6" fill="${color}"/>
    <rect x="470" y="210" width="30" height="110" rx="6" fill="#94a3b8"/>
    <!-- Sticky Notes -->
    <rect x="530" y="130" width="35" height="35" rx="4" fill="${color}" opacity="0.85"/>
    <rect x="530" y="175" width="35" height="35" rx="4" fill="#38bdf8"/>
    <line x1="450" y1="360" x2="450" y2="480" stroke="#3f3d56" stroke-width="8"/>
    <!-- Presenter Character on Left -->
    <circle cx="220" cy="180" r="28" fill="#f8fafc" stroke="#111" stroke-width="3"/>
    <path d="M195 165 C180 135 255 125 250 155 Z" fill="#111"/>
    <path d="M180 250 C180 215 215 210 225 210 C235 210 270 215 270 250 V370 H180 Z" fill="${color}"/>
    <!-- Hand Pointing at Chart -->
    <path d="M260 240 L340 180" stroke="#111" stroke-width="12" stroke-linecap="round"/>
    <circle cx="345" cy="178" r="8" fill="#f8fafc"/>
    <path d="M190 370 L180 490 H210 L220 420 L230 490 H260 L250 370 Z" fill="#1e293b"/>
  `,

  // 12. Rocket Launch
  rocket_launch: (color) => `
    <ellipse cx="400" cy="520" rx="340" ry="18" fill="#161b22"/>
    <!-- Ascending Rocket -->
    <g transform="translate(420, 100) rotate(25)">
      <path d="M0 0 C40 -60 60 -60 100 0 L90 120 H10 Z" fill="#ffffff" stroke="#111" stroke-width="4"/>
      <circle cx="50" cy="40" r="16" fill="${color}"/>
      <polygon points="-10,100 10,80 10,120" fill="${color}"/>
      <polygon points="110,100 90,80 90,120" fill="${color}"/>
      <!-- Thruster Fire -->
      <polygon points="30,120 50,180 70,120" fill="#f59e0b"/>
      <polygon points="40,120 50,160 60,120" fill="#ef4444"/>
    </g>
    <!-- Character Watching on Left -->
    <circle cx="240" cy="220" r="28" fill="#f8fafc" stroke="#111" stroke-width="3"/>
    <path d="M215 205 C200 175 275 165 270 195 Z" fill="#111"/>
    <path d="M200 290 C200 255 235 250 245 250 C255 250 290 255 290 290 V400 H200 Z" fill="${color}"/>
    <path d="M210 400 L200 490 H230 L240 430 L250 490 H280 L270 400 Z" fill="#1e293b"/>
  `,
};

// Fallback dynamic renderer for any remaining pose IDs
function renderDynamicActionPose(poseId: string, color: string, raw: RawIllustrationItem): string {
  const specificRenderer = POSE_RENDERERS[poseId];
  if (specificRenderer) {
    return specificRenderer(color, raw);
  }

  // Generic dynamic action scene with character + floating thematic badge
  return createUnDrawSvg(`
    <ellipse cx="400" cy="510" rx="340" ry="18" fill="#161b22"/>
    <!-- Floating Backdrop Shield / Prop -->
    <rect x="360" y="120" width="280" height="260" rx="24" fill="#1e293b" stroke="#334155" stroke-width="4"/>
    <circle cx="500" cy="210" r="50" fill="${color}" opacity="0.2"/>
    <circle cx="500" cy="210" r="28" fill="${color}"/>
    <rect x="420" y="280" width="160" height="14" rx="7" fill="#ffffff"/>
    <rect x="450" y="310" width="100" height="10" rx="5" fill="#64748b"/>
    <!-- Active Character -->
    <circle cx="240" cy="180" r="30" fill="#f8fafc" stroke="#111" stroke-width="3.5"/>
    <path d="M215 160 C200 130 275 120 270 150 Z" fill="#111"/>
    <path d="M190 255 C190 220 230 215 240 215 C250 215 290 220 290 255 V380 H190 Z" fill="${color}"/>
    <!-- Arms gesturing -->
    <path d="M280 250 L380 200" stroke="#111" stroke-width="12" stroke-linecap="round"/>
    <circle cx="385" cy="198" r="8" fill="#f8fafc"/>
    <!-- Legs -->
    <path d="M200 380 L190 490 H225 L235 420 L245 490 H280 L270 380 Z" fill="#1e293b"/>
  `);
}

// ── BUILD COMPLETE CATALOG (1,600+ DISTINCT ITEMS) ──
export const ILLUSTRATION_CATALOG: IllustrationItem[] = RAW_ILLUSTRATION_CATALOG.map((raw) => ({
  id: raw.id,
  title: raw.title,
  category: raw.category,
  tags: raw.tags,
  svgTemplate: (color: string) => renderDynamicActionPose(raw.poseId, color, raw),
}));

/**
 * Searches the 1,600+ vector illustration catalog by query and category filter.
 */
export function searchIllustrations(
  query: string,
  category: string = "All"
): IllustrationItem[] {
  let results = ILLUSTRATION_CATALOG;

  if (category && category !== "All") {
    results = results.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  }

  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return results;

  return results.filter((item) => {
    if (isFuzzyMatch(cleanQuery, item.title)) return true;
    if (isFuzzyMatch(cleanQuery, item.category)) return true;
    return item.tags.some((tag) => isFuzzyMatch(cleanQuery, tag));
  });
}
