import { isFuzzyMatch } from "./fuzzySearch";

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
  "Marketing & Growth",
  "Finance & E-Commerce",
] as const;

export type IllustrationCategory = typeof ILLUSTRATION_CATEGORIES[number];

// Helper to construct unDraw-style vector SVG illustrations with dynamic accent color
function createVectorIllustrationSvg(
  color: string,
  pathsSvg: string,
  viewBox = "0 0 800 600"
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%" fill="none">
  <defs>
    <linearGradient id="illGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color}" stop-opacity="1" />
      <stop offset="100%" stop-color="${color}" stop-opacity="0.75" />
    </linearGradient>
    <filter id="illGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  ${pathsSvg}
</svg>`;
}

export const ILLUSTRATION_CATALOG: IllustrationItem[] = [
  // ── 1. Tech & Coding ──
  {
    id: "ill-code-development",
    title: "Software Engineering & Code Editor",
    category: "Tech & Coding",
    tags: ["code", "development", "software", "programming", "terminal", "react", "typescript"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.4"/>
        <rect x="100" y="90" width="600" height="420" rx="20" fill="#161b22" stroke="#30363d" stroke-width="4"/>
        <circle cx="140" cy="130" r="8" fill="#ff5f56"/>
        <circle cx="165" cy="130" r="8" fill="#ffbd2e"/>
        <circle cx="190" cy="130" r="8" fill="#27c93f"/>
        <rect x="130" y="175" width="180" height="16" rx="8" fill="${color}"/>
        <rect x="130" y="210" width="240" height="14" rx="7" fill="#8b949e" opacity="0.6"/>
        <rect x="130" y="240" width="320" height="14" rx="7" fill="${color}" opacity="0.8"/>
        <rect x="130" y="270" width="160" height="14" rx="7" fill="#8b949e" opacity="0.5"/>
        <rect x="130" y="315" width="280" height="16" rx="8" fill="${color}"/>
        <rect x="130" y="350" width="200" height="14" rx="7" fill="#8b949e" opacity="0.6"/>
        <circle cx="560" cy="290" r="70" fill="url(#illGrad)" opacity="0.9" filter="url(#illGlow)"/>
        <path d="M530 290L550 310L590 270" stroke="#000" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`
      ),
  },
  {
    id: "ill-ai-neural",
    title: "AI Neural Brain & Automation",
    category: "Tech & Coding",
    tags: ["ai", "artificial intelligence", "brain", "neural", "robot", "bot"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <circle cx="400" cy="300" r="140" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="8 8"/>
        <path d="M300 240C300 200 340 180 400 180C460 180 500 200 500 240C500 280 460 300 400 300C340 300 300 320 300 360C300 400 340 420 400 420C460 420 500 400 500 360" stroke="${color}" stroke-width="6" fill="none"/>
        <circle cx="400" cy="180" r="16" fill="url(#illGrad)" filter="url(#illGlow)"/>
        <circle cx="400" cy="300" r="16" fill="url(#illGrad)" filter="url(#illGlow)"/>
        <circle cx="400" cy="420" r="16" fill="url(#illGrad)" filter="url(#illGlow)"/>
        <circle cx="300" cy="240" r="12" fill="${color}"/>
        <circle cx="500" cy="240" r="12" fill="${color}"/>
        <circle cx="300" cy="360" r="12" fill="${color}"/>
        <circle cx="500" cy="360" r="12" fill="${color}"/>`
      ),
  },
  {
    id: "ill-mobile-app",
    title: "Mobile App Wireframe & UI",
    category: "Tech & Coding",
    tags: ["mobile", "app", "phone", "smartphone", "ui", "screen"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <rect x="270" y="80" width="260" height="440" rx="36" fill="#161b22" stroke="#30363d" stroke-width="6"/>
        <rect x="350" y="100" width="100" height="12" rx="6" fill="#30363d"/>
        <rect x="300" y="140" width="200" height="140" rx="20" fill="url(#illGrad)" filter="url(#illGlow)"/>
        <rect x="300" y="300" width="200" height="20" rx="10" fill="#ffffff"/>
        <rect x="300" y="330" width="150" height="14" rx="7" fill="#8b949e" opacity="0.6"/>
        <rect x="300" y="370" width="200" height="45" rx="12" fill="${color}"/>
        <rect x="300" y="430" width="200" height="45" rx="12" fill="#21262d"/>`
      ),
  },
  {
    id: "ill-rocket-launch",
    title: "Rocket Launch & Startup Speed",
    category: "Business & Startup",
    tags: ["rocket", "launch", "startup", "growth", "speed", "fly"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <path d="M400 90C400 90 500 190 500 330C500 400 455 440 400 440C345 440 300 400 300 330C300 190 400 90 400 90Z" fill="url(#illGrad)" filter="url(#illGlow)"/>
        <circle cx="400" cy="240" r="32" fill="#000"/>
        <circle cx="400" cy="240" r="16" fill="${color}"/>
        <path d="M300 330L230 410V450H270L340 400" fill="${color}" opacity="0.7"/>
        <path d="M500 330L570 410V450H530L460 400" fill="${color}" opacity="0.7"/>
        <polygon points="360,440 400,530 440,440" fill="#ffbd2e"/>
        <polygon points="380,440 400,490 420,440" fill="#ff5f56"/>`
      ),
  },

  // ── 2. Design & Creative ──
  {
    id: "ill-design-system",
    title: "Design System Component Grid",
    category: "Design & Creative",
    tags: ["design", "ui", "ux", "components", "figma", "wireframe"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <rect x="120" y="100" width="260" height="180" rx="20" fill="#161b22" stroke="${color}" stroke-width="3"/>
        <rect x="145" y="130" width="120" height="14" rx="7" fill="${color}"/>
        <rect x="145" y="155" width="200" height="10" rx="5" fill="#8b949e" opacity="0.5"/>
        <rect x="145" y="175" width="150" height="10" rx="5" fill="#8b949e" opacity="0.5"/>
        <rect x="145" y="210" width="90" height="32" rx="16" fill="${color}"/>

        <rect x="420" y="100" width="260" height="180" rx="20" fill="#161b22" stroke="#30363d" stroke-width="3"/>
        <circle cx="470" cy="150" r="22" fill="url(#illGrad)"/>
        <rect x="510" y="140" width="130" height="10" rx="5" fill="#8b949e" opacity="0.6"/>
        <rect x="510" y="160" width="90" height="10" rx="5" fill="#8b949e" opacity="0.4"/>

        <rect x="120" y="310" width="560" height="190" rx="24" fill="#161b22" stroke="${color}" stroke-width="3"/>
        <circle cx="190" cy="405" r="50" fill="url(#illGrad)" opacity="0.9" filter="url(#illGlow)"/>
        <rect x="270" y="375" width="220" height="18" rx="9" fill="#ffffff"/>
        <rect x="270" y="405" width="370" height="12" rx="6" fill="#8b949e" opacity="0.6"/>`
      ),
  },
  {
    id: "ill-palette-brush",
    title: "Artist Palette & Vector Bezier",
    category: "Design & Creative",
    tags: ["palette", "art", "brush", "drawing", "paint", "vector"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <path d="M220 380C160 380 120 320 120 250C120 160 220 110 380 110C540 110 660 180 660 280C660 360 580 430 480 430C430 430 400 400 370 400C340 400 320 440 280 440C240 440 220 410 220 380Z" fill="#161b22" stroke="${color}" stroke-width="5"/>
        <circle cx="220" cy="200" r="28" fill="${color}"/>
        <circle cx="310" cy="170" r="28" fill="#3b82f6"/>
        <circle cx="410" cy="180" r="28" fill="#a855f7"/>
        <circle cx="510" cy="220" r="28" fill="#ec4899"/>
        <circle cx="570" cy="300" r="28" fill="#f59e0b"/>
        <circle cx="340" cy="340" r="32" fill="#000"/>`
      ),
  },

  // ── 3. Data & Analytics ──
  {
    id: "ill-analytics-chart",
    title: "Data Visualization & Metrics Graph",
    category: "Data & Analytics",
    tags: ["analytics", "chart", "graph", "data", "metrics", "dashboard"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <rect x="100" y="90" width="600" height="420" rx="24" fill="#161b22" stroke="#30363d" stroke-width="4"/>
        <rect x="140" y="370" width="55" height="90" rx="10" fill="#30363d"/>
        <rect x="215" y="290" width="55" height="170" rx="10" fill="${color}" opacity="0.6"/>
        <rect x="290" y="230" width="55" height="230" rx="10" fill="${color}"/>
        <rect x="365" y="320" width="55" height="140" rx="10" fill="#30363d"/>
        <rect x="440" y="170" width="55" height="290" rx="10" fill="url(#illGrad)" filter="url(#illGlow)"/>
        <rect x="515" y="250" width="55" height="210" rx="10" fill="${color}" opacity="0.8"/>
        <rect x="590" y="140" width="55" height="320" rx="10" fill="#ffffff"/>
        <path d="M140 330L242.5 260L317.5 190L392.5 280L467.5 130L542.5 210L617.5 110" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`
      ),
  },

  // ── 4. Security & Cloud ──
  {
    id: "ill-security-shield",
    title: "Cybersecurity Shield & Safe Vault",
    category: "Security & Cloud",
    tags: ["security", "shield", "protect", "lock", "cyber", "safe"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <path d="M400 100L560 170V300C560 410 490 480 400 520C310 480 240 410 240 300V170L400 100Z" fill="url(#illGrad)" filter="url(#illGlow)"/>
        <path d="M340 300L380 340L470 240" stroke="#000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`
      ),
  },

  // ── 5. People & Work ──
  {
    id: "ill-team-collaboration",
    title: "Teamwork & Collaborative Avatars",
    category: "People & Work",
    tags: ["teamwork", "people", "team", "collaboration", "user", "avatar"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <circle cx="270" cy="210" r="48" fill="${color}"/>
        <path d="M190 370C190 310 230 280 270 280C310 280 350 310 350 370V420H190V370Z" fill="${color}" opacity="0.8"/>

        <circle cx="530" cy="210" r="48" fill="url(#illGrad)" filter="url(#illGlow)"/>
        <path d="M450 370C450 310 490 280 530 280C570 280 610 310 610 370V420H450V370Z" fill="${color}"/>

        <circle cx="400" cy="270" r="38" fill="#ffffff"/>
        <path d="M330 430C330 380 360 350 400 350C440 350 470 380 470 430V460H330V430Z" fill="#ffffff"/>
        <path d="M270 290L400 340L530 290" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`
      ),
  },

  // ── 6. Finance & E-Commerce ──
  {
    id: "ill-ecommerce-card",
    title: "Credit Card & E-Commerce Checkout",
    category: "Finance & E-Commerce",
    tags: ["card", "credit", "money", "pay", "payment", "cart", "shop"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <rect x="180" y="160" width="440" height="280" rx="24" fill="url(#illGrad)" filter="url(#illGlow)"/>
        <rect x="180" y="220" width="440" height="50" fill="#000" opacity="0.6"/>
        <rect x="230" y="310" width="80" height="60" rx="12" fill="#ffbd2e"/>
        <circle cx="530" cy="340" r="24" fill="#ffffff" opacity="0.8"/>
        <circle cx="560" cy="340" r="24" fill="${color}"/>`
      ),
  },

  // ── 7. Search & Discovery ──
  {
    id: "ill-search-magnifier",
    title: "Search Magnifier & Inspection",
    category: "Tech & Coding",
    tags: ["search", "find", "magnifier", "glass", "lookup", "inspect"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <circle cx="350" cy="270" r="140" fill="none" stroke="${color}" stroke-width="14"/>
        <path d="M450 370L580 500" stroke="${color}" stroke-width="24" stroke-linecap="round"/>
        <circle cx="350" cy="270" r="110" fill="url(#illGrad)" opacity="0.7" filter="url(#illGlow)"/>
        <rect x="280" y="230" width="140" height="16" rx="8" fill="#ffffff"/>
        <rect x="280" y="260" width="100" height="12" rx="6" fill="#000" opacity="0.5"/>
        <rect x="280" y="285" width="120" height="12" rx="6" fill="#000" opacity="0.5"/>`
      ),
  },

  // ── 8. Notification & Bell ──
  {
    id: "ill-bell-notification",
    title: "Notification Bell & Alert System",
    category: "Marketing & Growth",
    tags: ["bell", "cowbell", "alert", "notification", "ring", "chime"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <path d="M400 120C310 120 270 200 270 320V380L220 430H580L530 380V320C530 200 490 120 400 120Z" fill="url(#illGrad)" filter="url(#illGlow)"/>
        <path d="M350 430C350 460 370 480 400 480C430 480 450 460 450 430" stroke="${color}" stroke-width="8" stroke-linecap="round"/>
        <circle cx="540" cy="180" r="32" fill="#ff5f56"/>
        <circle cx="540" cy="180" r="16" fill="#ffffff"/>`
      ),
  },

  // ── 9. Idea & Lightbulb ──
  {
    id: "ill-idea-lightbulb",
    title: "Innovation Lightbulb & Creative Rays",
    category: "Design & Creative",
    tags: ["idea", "lightbulb", "innovation", "creative", "brainstorm", "glow"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <circle cx="400" cy="250" r="110" fill="url(#illGrad)" filter="url(#illGlow)"/>
        <path d="M340 330H460V390C460 410 440 430 420 430H380C360 430 340 410 340 390V330Z" fill="#30363d"/>
        <rect x="360" y="440" width="80" height="16" rx="8" fill="${color}"/>
        <path d="M400 80V120M250 250H210M590 250H550M290 140L320 170M510 140L480 170" stroke="${color}" stroke-width="8" stroke-linecap="round"/>`
      ),
  },

  // ── 10. Kanban Workflow ──
  {
    id: "ill-kanban-workflow",
    title: "Kanban Task Board & Workflow",
    category: "People & Work",
    tags: ["kanban", "workflow", "tasks", "board", "agile", "scrum", "todo"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <rect x="120" y="100" width="160" height="380" rx="16" fill="#161b22" stroke="#30363d" stroke-width="3"/>
        <rect x="140" y="125" width="120" height="14" rx="7" fill="#ff5f56"/>
        <rect x="140" y="160" width="120" height="80" rx="12" fill="${color}"/>
        <rect x="140" y="255" width="120" height="60" rx="12" fill="#21262d"/>

        <rect x="320" y="100" width="160" height="380" rx="16" fill="#161b22" stroke="${color}" stroke-width="3"/>
        <rect x="340" y="125" width="120" height="14" rx="7" fill="#ffbd2e"/>
        <rect x="340" y="160" width="120" height="100" rx="12" fill="url(#illGrad)" filter="url(#illGlow)"/>

        <rect x="520" y="100" width="160" height="380" rx="16" fill="#161b22" stroke="#30363d" stroke-width="3"/>
        <rect x="540" y="125" width="120" height="14" rx="7" fill="#27c93f"/>
        <rect x="540" y="160" width="120" height="70" rx="12" fill="${color}"/>`
      ),
  },

  // ── 11. Mail & Inbox ──
  {
    id: "ill-mail-envelope",
    title: "Mail Envelope & Messaging Inbox",
    category: "Marketing & Growth",
    tags: ["mail", "email", "envelope", "inbox", "send", "letter", "contact"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <rect x="160" y="160" width="480" height="280" rx="24" fill="#161b22" stroke="${color}" stroke-width="4"/>
        <path d="M160 180L400 320L640 180" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="400" cy="320" r="40" fill="url(#illGrad)" filter="url(#illGlow)"/>
        <path d="M380 320L395 335L425 305" stroke="#000" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`
      ),
  },

  // ── 12. Settings & Gear ──
  {
    id: "ill-settings-gear",
    title: "Control Panel & Engine Gear",
    category: "Tech & Coding",
    tags: ["settings", "gear", "cog", "config", "engine", "control", "tune"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <circle cx="400" cy="300" r="100" fill="url(#illGrad)" filter="url(#illGlow)"/>
        <circle cx="400" cy="300" r="45" fill="#000"/>
        <path d="M400 150V200M400 400V450M150 300H200M400 300H450M220 180L260 220M540 380L580 420M580 180L540 220M260 380L220 420" stroke="${color}" stroke-width="20" stroke-linecap="round"/>`
      ),
  },
];

export function searchIllustrations(
  query: string,
  activeCategory: string = "All"
): IllustrationItem[] {
  let result = ILLUSTRATION_CATALOG;

  if (activeCategory !== "All") {
    result = result.filter((item) => item.category === activeCategory);
  }

  if (query.trim()) {
    result = result.filter((item) =>
      isFuzzyMatch(query, item.title, item.tags)
    );
  }

  return result;
}

export function getIllustrationCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = { All: ILLUSTRATION_CATALOG.length };
  ILLUSTRATION_CATALOG.forEach((item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
  });
  return counts;
}
