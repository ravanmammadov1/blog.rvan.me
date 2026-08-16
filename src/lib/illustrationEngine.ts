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

// ── PROCEDURAL VECTOR SVG TEMPLATES (unDraw / Open Doodles aesthetic) ──

function renderDesktopAnalytics(color: string, seed: number): string {
  const chartHeight = 100 + (seed % 60);
  const chartHeight2 = 140 - (seed % 50);
  return createUnDrawSvg(`
    <ellipse cx="400" cy="520" rx="340" ry="18" fill="#161b22"/>
    <!-- Monitor Base & Neck -->
    <rect x="360" y="440" width="80" height="70" rx="6" fill="#2f2e41"/>
    <ellipse cx="400" cy="505" rx="90" ry="12" fill="#3f3d56"/>
    <!-- Main Screen Frame -->
    <rect x="180" y="100" width="440" height="340" rx="20" fill="#2f2e41" stroke="#3f3d56" stroke-width="4"/>
    <rect x="195" y="115" width="410" height="310" rx="14" fill="#ffffff"/>
    <!-- Browser Top Bar -->
    <rect x="195" y="115" width="410" height="32" rx="14" fill="#f1f5f9"/>
    <circle cx="215" cy="131" r="5" fill="#ff5f56"/>
    <circle cx="230" cy="131" r="5" fill="#ffbd2e"/>
    <circle cx="245" cy="131" r="5" fill="#27c93f"/>
    <!-- Search / URL Bar -->
    <rect x="270" y="122" width="220" height="18" rx="9" fill="#e2e8f0"/>
    <!-- Chart Bars with Custom Brand Color -->
    <rect x="230" y="${380 - chartHeight}" width="36" height="${chartHeight}" rx="8" fill="${color}"/>
    <rect x="285" y="${380 - chartHeight2}" width="36" height="${chartHeight2}" rx="8" fill="#cbd5e1"/>
    <rect x="340" y="${380 - (chartHeight + 20)}" width="36" height="${chartHeight + 20}" rx="8" fill="${color}"/>
    <rect x="395" y="${380 - (chartHeight2 - 15)}" width="36" height="${chartHeight2 - 15}" rx="8" fill="#94a3b8"/>
    <!-- Floating KPI Badge -->
    <rect x="460" y="170" width="125" height="75" rx="12" fill="#0f172a" stroke="${color}" stroke-width="2"/>
    <circle cx="485" cy="195" r="10" fill="${color}"/>
    <rect x="505" y="190" width="60" height="10" rx="5" fill="#ffffff"/>
    <rect x="480" y="218" width="85" height="14" rx="4" fill="${color}" opacity="0.9"/>
    <!-- Line Graph Overlay -->
    <path d="M240 270 Q 320 220, 400 250 T 560 190" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="400" cy="250" r="6" fill="#ffffff" stroke="${color}" stroke-width="3"/>
    <circle cx="560" cy="190" r="6" fill="#ffffff" stroke="${color}" stroke-width="3"/>
  `);
}

function renderMobileApp(color: string, seed: number): string {
  return createUnDrawSvg(`
    <ellipse cx="400" cy="520" rx="300" ry="18" fill="#161b22"/>
    <!-- Left Floating Card -->
    <rect x="150" y="180" width="160" height="180" rx="18" fill="#1e293b" stroke="#334155" stroke-width="3"/>
    <circle cx="190" cy="220" r="18" fill="${color}"/>
    <rect x="220" y="215" width="70" height="12" rx="6" fill="#ffffff"/>
    <rect x="175" y="260" width="110" height="10" rx="5" fill="#64748b"/>
    <rect x="175" y="285" width="85" height="10" rx="5" fill="#475569"/>
    <rect x="175" y="315" width="110" height="24" rx="8" fill="${color}"/>
    <!-- Center Smartphone Frame -->
    <rect x="300" y="70" width="200" height="420" rx="32" fill="#2f2e41" stroke="#3f3d56" stroke-width="6"/>
    <rect x="315" y="90" width="170" height="380" rx="20" fill="#ffffff"/>
    <!-- Dynamic Island / Notch -->
    <rect x="365" y="98" width="70" height="14" rx="7" fill="#111827"/>
    <!-- App UI List Elements -->
    <rect x="335" y="130" width="130" height="45" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
    <circle cx="355" cy="152" r="12" fill="${color}"/>
    <rect x="375" y="146" width="70" height="12" rx="4" fill="#0f172a"/>
    <rect x="335" y="190" width="130" height="45" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
    <circle cx="355" cy="212" r="12" fill="#94a3b8"/>
    <rect x="375" y="206" width="70" height="12" rx="4" fill="#0f172a"/>
    <!-- Big Action Button on Phone -->
    <rect x="335" y="390" width="130" height="42" rx="12" fill="${color}"/>
    <rect x="365" y="405" width="70" height="12" rx="6" fill="#ffffff"/>
    <!-- Right Notification Bubble -->
    <rect x="480" y="220" width="170" height="90" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.2))"/>
    <circle cx="510" cy="250" r="12" fill="${color}"/>
    <rect x="535" y="245" width="90" height="10" rx="5" fill="#0f172a"/>
    <rect x="510" y="275" width="115" height="8" rx="4" fill="#94a3b8"/>
  `);
}

function renderTeamCollab(color: string, seed: number): string {
  return createUnDrawSvg(`
    <ellipse cx="400" cy="510" rx="340" ry="18" fill="#161b22"/>
    <!-- Character 1 (Left) -->
    <circle cx="220" cy="220" r="28" fill="#2f2e41"/>
    <path d="M180 300 C180 260 210 250 220 250 C230 250 260 260 260 300 V380 H180 Z" fill="${color}"/>
    <path d="M190 380 L180 490 H210 L220 420 L230 490 H260 L250 380 Z" fill="#1e293b"/>
    <!-- Center Collaboration Board -->
    <rect x="300" y="120" width="200" height="240" rx="16" fill="#ffffff" stroke="#3f3d56" stroke-width="4"/>
    <rect x="320" y="145" width="70" height="70" rx="8" fill="${color}" opacity="0.9"/>
    <rect x="410" y="145" width="70" height="70" rx="8" fill="#e2e8f0"/>
    <rect x="320" y="235" width="70" height="70" rx="8" fill="#e2e8f0"/>
    <rect x="410" y="235" width="70" height="70" rx="8" fill="${color}"/>
    <line x1="400" y1="360" x2="400" y2="480" stroke="#3f3d56" stroke-width="8"/>
    <ellipse cx="400" cy="485" rx="45" ry="10" fill="#2f2e41"/>
    <!-- Character 2 (Right) -->
    <circle cx="580" cy="220" r="28" fill="#3f3d56"/>
    <path d="M540 300 C540 260 570 250 580 250 C590 250 620 260 620 300 V380 H540 Z" fill="#ffffff"/>
    <path d="M550 380 L540 490 H570 L580 420 L590 490 H620 L610 380 Z" fill="#1e293b"/>
    <!-- Dynamic Connecting Arc -->
    <path d="M250 280 Q 400 200, 550 280" stroke="${color}" stroke-width="4" stroke-dasharray="8 8" fill="none"/>
  `);
}

function renderCloudNodes(color: string, seed: number): string {
  return createUnDrawSvg(`
    <ellipse cx="400" cy="520" rx="320" ry="18" fill="#161b22"/>
    <!-- Central Cloud Core -->
    <g transform="translate(260, 140)">
      <path d="M70 120 H210 C240 120 260 95 255 65 C250 35 220 20 190 30 C175 -5 125 -10 95 15 C80 5 50 15 45 40 C15 45 5 75 25 100 C35 115 50 120 70 120 Z" fill="${color}"/>
      <circle cx="140" cy="65" r="24" fill="#ffffff"/>
      <path d="M130 65 L140 55 L150 65 M140 55 V75" stroke="#111" stroke-width="4" stroke-linecap="round"/>
    </g>
    <!-- Peripheral Devices / Nodes -->
    <rect x="140" y="320" width="120" height="90" rx="12" fill="#2f2e41" stroke="${color}" stroke-width="2"/>
    <rect x="155" y="335" width="90" height="60" rx="6" fill="#ffffff"/>
    <rect x="540" y="320" width="120" height="90" rx="12" fill="#2f2e41" stroke="${color}" stroke-width="2"/>
    <rect x="555" y="335" width="90" height="60" rx="6" fill="#ffffff"/>
    <!-- Server Stack Bottom Center -->
    <rect x="340" y="380" width="120" height="100" rx="12" fill="#1e293b" stroke="#334155" stroke-width="3"/>
    <line x1="355" y1="410" x2="445" y2="410" stroke="#334155" stroke-width="4"/>
    <line x1="355" y1="440" x2="445" y2="440" stroke="#334155" stroke-width="4"/>
    <circle cx="365" cy="395" r="4" fill="${color}"/>
    <circle cx="365" cy="425" r="4" fill="${color}"/>
    <circle cx="365" cy="455" r="4" fill="#22c55e"/>
    <!-- Dashed Network Links -->
    <line x1="320" y1="240" x2="210" y2="320" stroke="${color}" stroke-width="3" stroke-dasharray="6 6"/>
    <line x1="480" y1="240" x2="590" y2="320" stroke="${color}" stroke-width="3" stroke-dasharray="6 6"/>
    <line x1="400" y1="260" x2="400" y2="380" stroke="${color}" stroke-width="3" stroke-dasharray="6 6"/>
  `);
}

function renderIsometricGrid(color: string, seed: number): string {
  return createUnDrawSvg(`
    <ellipse cx="400" cy="510" rx="340" ry="18" fill="#161b22"/>
    <!-- 3D Isometric Stacked Cubes -->
    <!-- Base Platform -->
    <polygon points="400,280 580,370 400,460 220,370" fill="#1e293b" stroke="#334155" stroke-width="3"/>
    <polygon points="220,370 400,460 400,500 220,410" fill="#0f172a"/>
    <polygon points="580,370 400,460 400,500 580,410" fill="#090d16"/>
    <!-- Top Glowing Cube with Brand Color -->
    <polygon points="400,160 500,210 400,260 300,210" fill="${color}"/>
    <polygon points="300,210 400,260 400,320 300,270" fill="#1e293b" opacity="0.9"/>
    <polygon points="500,210 400,260 400,320 500,270" fill="#0f172a" opacity="0.9"/>
    <!-- Floating Data Spheres -->
    <circle cx="260" cy="180" r="16" fill="${color}"/>
    <circle cx="540" cy="220" r="20" fill="#ffffff" stroke="${color}" stroke-width="4"/>
    <circle cx="400" cy="100" r="12" fill="${color}"/>
  `);
}

function renderFloatingCards(color: string, seed: number): string {
  return createUnDrawSvg(`
    <ellipse cx="400" cy="510" rx="320" ry="18" fill="#161b22"/>
    <!-- Card 1 (Back Left) -->
    <rect x="180" y="140" width="220" height="260" rx="20" fill="#1e293b" stroke="#334155" stroke-width="3"/>
    <rect x="205" y="170" width="80" height="14" rx="7" fill="#64748b"/>
    <rect x="205" y="200" width="140" height="80" rx="10" fill="#0f172a"/>
    <!-- Card 2 (Front Center Hero) -->
    <rect x="280" y="180" width="260" height="300" rx="24" fill="#ffffff" stroke="${color}" stroke-width="4" filter="drop-shadow(0 20px 30px rgba(0,0,0,0.3))"/>
    <circle cx="330" cy="230" r="22" fill="${color}"/>
    <rect x="370" y="222" width="120" height="16" rx="8" fill="#0f172a"/>
    <!-- Progress Bar -->
    <rect x="320" y="280" width="180" height="18" rx="9" fill="#f1f5f9"/>
    <rect x="320" y="280" width="120" height="18" rx="9" fill="${color}"/>
    <rect x="320" y="330" width="180" height="110" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
    <path d="M340 410 L 380 370 L 420 390 L 480 350" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <!-- Card 3 (Right Accent Badge) -->
    <rect x="510" y="120" width="160" height="160" rx="18" fill="#0f172a" stroke="${color}" stroke-width="2"/>
    <circle cx="590" cy="180" r="28" fill="${color}" opacity="0.2"/>
    <circle cx="590" cy="180" r="16" fill="${color}"/>
    <rect x="540" y="230" width="100" height="12" rx="6" fill="#ffffff"/>
  `);
}

function renderCharacterScene(color: string, seed: number): string {
  return createUnDrawSvg(`
    <ellipse cx="400" cy="520" rx="340" ry="18" fill="#161b22"/>
    <!-- Giant Glowing Symbol in Background -->
    <circle cx="480" cy="260" r="140" fill="${color}" opacity="0.15"/>
    <circle cx="480" cy="260" r="90" fill="#ffffff" stroke="${color}" stroke-width="6"/>
    <!-- Character Standing on Left -->
    <circle cx="280" cy="180" r="32" fill="#2f2e41"/>
    <!-- Hair -->
    <path d="M260 170 C250 140 300 130 310 160 Z" fill="#111827"/>
    <!-- Hoodie/Shirt with Accent Color -->
    <path d="M230 250 C230 220 270 215 280 215 C290 215 330 220 330 250 V370 H230 Z" fill="${color}"/>
    <!-- Left Hand Holding Coffee -->
    <path d="M230 280 L200 320" stroke="#2f2e41" stroke-width="12" stroke-linecap="round"/>
    <rect x="185" y="315" width="20" height="24" rx="4" fill="#ffffff" stroke="#111" stroke-width="2"/>
    <!-- Legs & Shoes -->
    <path d="M245 370 L235 490 H265 L275 410 L285 490 H315 L305 370 Z" fill="#1e293b"/>
    <!-- Floating Idea Bubbles -->
    <circle cx="340" cy="140" r="10" fill="${color}"/>
    <circle cx="370" cy="110" r="18" fill="${color}"/>
  `);
}

function renderMinimalConcept(color: string, seed: number): string {
  return createUnDrawSvg(`
    <ellipse cx="400" cy="510" rx="320" ry="18" fill="#161b22"/>
    <!-- Overlapping Abstract Circles & Geometric Vectors -->
    <circle cx="340" cy="280" r="130" fill="${color}" opacity="0.8"/>
    <circle cx="460" cy="280" r="130" fill="#1e293b" stroke="#334155" stroke-width="4"/>
    <path d="M260 400 Q 400 120, 540 400" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="400" cy="260" r="28" fill="#ffffff" stroke="${color}" stroke-width="6"/>
    <!-- Orbiting Accent Stars -->
    <polygon points="400,100 405,115 420,115 408,125 412,140 400,130 388,140 392,125 380,115 395,115" fill="${color}"/>
    <circle cx="560" cy="180" r="8" fill="${color}"/>
    <circle cx="240" cy="200" r="12" fill="#ffffff"/>
  `);
}

// Master style renderer dispatcher
function renderSvgByStyle(style: string, color: string, seed: number): string {
  switch (style) {
    case "desktop-analytics":
    case "metric-charts":
      return renderDesktopAnalytics(color, seed);
    case "mobile-app":
      return renderMobileApp(color, seed);
    case "team-collab":
      return renderTeamCollab(color, seed);
    case "cloud-nodes":
      return renderCloudNodes(color, seed);
    case "isometric-grid":
      return renderIsometricGrid(color, seed);
    case "floating-cards":
    case "flow-diagram":
      return renderFloatingCards(color, seed);
    case "character-scene":
      return renderCharacterScene(color, seed);
    case "minimal-concept":
    case "dark-futuristic":
    default:
      return renderMinimalConcept(color, seed);
  }
}

// ── BUILD COMPLETE CATALOG (1,000+ ITEMS) ──
export const ILLUSTRATION_CATALOG: IllustrationItem[] = RAW_ILLUSTRATION_CATALOG.map((raw) => ({
  id: raw.id,
  title: raw.title,
  category: raw.category,
  tags: raw.tags,
  svgTemplate: (color: string) => renderSvgByStyle(raw.style, color, raw.seed),
}));

/**
 * Searches the 1,000+ vector illustration catalog by query and category filter.
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
