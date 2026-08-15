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
  // 1. Tech & Coding
  {
    id: "ill-code-development",
    title: "Software Engineering & Code",
    category: "Tech & Coding",
    tags: ["code", "development", "software", "programming", "terminal", "react", "typescript"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.4"/>
        <rect x="120" y="100" width="560" height="380" rx="20" fill="#161b22" stroke="#30363d" stroke-width="4"/>
        <circle cx="160" cy="135" r="8" fill="#ff5f56"/>
        <circle cx="185" cy="135" r="8" fill="#ffbd2e"/>
        <circle cx="210" cy="135" r="8" fill="#27c93f"/>
        <rect x="150" y="180" width="180" height="16" rx="8" fill="${color}"/>
        <rect x="150" y="215" width="240" height="14" rx="7" fill="#8b949e" opacity="0.6"/>
        <rect x="150" y="245" width="320" height="14" rx="7" fill="${color}" opacity="0.8"/>
        <rect x="150" y="275" width="140" height="14" rx="7" fill="#8b949e" opacity="0.5"/>
        <rect x="150" y="320" width="280" height="16" rx="8" fill="${color}"/>
        <rect x="150" y="355" width="200" height="14" rx="7" fill="#8b949e" opacity="0.6"/>
        <circle cx="560" cy="280" r="70" fill="url(#illGrad)" opacity="0.9" filter="url(#illGlow)"/>
        <path d="M530 280L550 300L590 260" stroke="#000" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`
      ),
  },

  {
    id: "ill-ai-automation",
    title: "AI Neural Network & Automation",
    category: "Tech & Coding",
    tags: ["ai", "artificial intelligence", "neural", "automation", "robotics", "machine learning"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <circle cx="400" cy="300" r="140" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="8 8" opacity="0.6"/>
        <circle cx="400" cy="300" r="90" fill="url(#illGrad)" opacity="0.85" filter="url(#illGlow)"/>
        <path d="M400 160V440M260 300H540M300 200L500 400M500 200L300 400" stroke="${color}" stroke-width="2" opacity="0.4"/>
        <circle cx="400" cy="160" r="12" fill="${color}"/>
        <circle cx="400" cy="440" r="12" fill="${color}"/>
        <circle cx="260" cy="300" r="12" fill="${color}"/>
        <circle cx="540" cy="300" r="12" fill="${color}"/>
        <circle cx="300" cy="200" r="10" fill="#ffffff"/>
        <circle cx="500" cy="400" r="10" fill="#ffffff"/>
        <path d="M370 290C370 273.431 383.431 260 400 260C416.569 260 430 273.431 430 290V310C430 326.569 416.569 340 400 340C383.431 340 370 326.569 370 310V290Z" fill="#000" opacity="0.8"/>
        <circle cx="390" cy="295" r="5" fill="${color}"/>
        <circle cx="410" cy="295" r="5" fill="${color}"/>`
      ),
  },

  // 2. Design & Creative
  {
    id: "ill-design-system",
    title: "Design System & Component Architecture",
    category: "Design & Creative",
    tags: ["design", "ui", "ux", "components", "wireframe", "figma", "layout"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <rect x="140" y="120" width="240" height="160" rx="16" fill="#161b22" stroke="${color}" stroke-width="3"/>
        <rect x="165" y="145" width="100" height="12" rx="6" fill="${color}"/>
        <rect x="165" y="170" width="190" height="10" rx="5" fill="#8b949e" opacity="0.5"/>
        <rect x="165" y="190" width="140" height="10" rx="5" fill="#8b949e" opacity="0.5"/>
        <rect x="165" y="220" width="80" height="28" rx="14" fill="${color}"/>

        <rect x="420" y="120" width="240" height="160" rx="16" fill="#161b22" stroke="#30363d" stroke-width="3"/>
        <circle cx="465" cy="165" r="20" fill="url(#illGrad)"/>
        <rect x="500" y="155" width="120" height="10" rx="5" fill="#8b949e" opacity="0.6"/>
        <rect x="500" y="175" width="80" height="10" rx="5" fill="#8b949e" opacity="0.4"/>
        <rect x="445" y="215" width="190" height="35" rx="10" fill="#21262d"/>

        <rect x="140" y="310" width="520" height="170" rx="20" fill="#161b22" stroke="${color}" stroke-width="3"/>
        <circle cx="200" cy="395" r="45" fill="url(#illGrad)" opacity="0.9" filter="url(#illGlow)"/>
        <rect x="270" y="365" width="200" height="16" rx="8" fill="#ffffff"/>
        <rect x="270" y="395" width="340" height="12" rx="6" fill="#8b949e" opacity="0.6"/>
        <rect x="270" y="420" width="220" height="12" rx="6" fill="#8b949e" opacity="0.4"/>`
      ),
  },

  {
    id: "ill-creative-process",
    title: "Creative Strategy & Motion Design",
    category: "Design & Creative",
    tags: ["creative", "motion", "animation", "art", "palette", "drawing", "vector"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <path d="M150 420C200 300 300 200 400 300C500 400 600 300 650 180" stroke="${color}" stroke-width="8" stroke-linecap="round"/>
        <circle cx="400" cy="300" r="80" fill="url(#illGrad)" opacity="0.9" filter="url(#illGlow)"/>
        <polygon points="400,240 450,330 350,330" fill="#ffffff"/>
        <circle cx="150" cy="420" r="16" fill="${color}"/>
        <circle cx="650" cy="180" r="16" fill="${color}"/>
        <rect x="200" y="120" width="100" height="100" rx="20" fill="#161b22" stroke="#30363d" stroke-width="4"/>
        <rect x="500" y="380" width="120" height="120" rx="24" fill="#161b22" stroke="${color}" stroke-width="4"/>
        <circle cx="560" cy="440" r="24" fill="${color}"/>`
      ),
  },

  // 3. Data & Analytics
  {
    id: "ill-analytics-dashboard",
    title: "Data Visualization & Metrics Dashboard",
    category: "Data & Analytics",
    tags: ["analytics", "data", "metrics", "chart", "graph", "dashboard", "growth"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <rect x="120" y="110" width="560" height="380" rx="24" fill="#161b22" stroke="#30363d" stroke-width="4"/>
        <rect x="160" y="350" width="50" height="100" rx="10" fill="#30363d"/>
        <rect x="230" y="280" width="50" height="170" rx="10" fill="${color}" opacity="0.6"/>
        <rect x="300" y="220" width="50" height="230" rx="10" fill="${color}"/>
        <rect x="370" y="310" width="50" height="140" rx="10" fill="#30363d"/>
        <rect x="440" y="180" width="50" height="270" rx="10" fill="url(#illGrad)" filter="url(#illGlow)"/>
        <rect x="510" y="250" width="50" height="200" rx="10" fill="${color}" opacity="0.8"/>
        <rect x="580" y="150" width="50" height="300" rx="10" fill="#ffffff"/>
        <path d="M160 320L255 250L325 190L395 270L465 140L535 210L605 110" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`
      ),
  },

  // 4. Business & Startup
  {
    id: "ill-startup-launch",
    title: "Startup Launch & Product Growth",
    category: "Business & Startup",
    tags: ["startup", "launch", "rocket", "growth", "business", "innovation", "product"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <path d="M400 120C400 120 490 220 490 350C490 410 450 450 400 450C350 450 310 410 310 350C310 220 400 120 400 120Z" fill="url(#illGrad)" filter="url(#illGlow)"/>
        <circle cx="400" cy="270" r="32" fill="#000"/>
        <circle cx="400" cy="270" r="16" fill="${color}"/>
        <path d="M310 350L240 420V460H280L350 410" fill="${color}" opacity="0.7"/>
        <path d="M490 350L560 420V460H520L450 410" fill="${color}" opacity="0.7"/>
        <polygon points="360,450 400,530 440,450" fill="#ffbd2e"/>
        <polygon points="380,450 400,500 420,450" fill="#ff5f56"/>`
      ),
  },

  // 5. Security & Cloud
  {
    id: "ill-security-cloud",
    title: "Cloud Infrastructure & Cybersecurity",
    category: "Security & Cloud",
    tags: ["security", "cloud", "cyber", "lock", "shield", "server", "protection"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <path d="M260 360C226.863 360 200 333.137 200 300C200 270.767 220.893 246.402 248.868 241.139C260.672 195.12 302.261 160 352 160C403.491 160 446.331 197.643 453.308 246.223C488.75 251.272 516 281.82 516 318.5C516 358.541 483.541 391 443.5 391H260" stroke="${color}" stroke-width="8" stroke-linecap="round" fill="none"/>
        <rect x="340" y="270" width="120" height="150" rx="20" fill="url(#illGrad)" filter="url(#illGlow)"/>
        <path d="M370 270V230C370 213.431 383.431 200 400 200C416.569 200 430 213.431 430 230V270" stroke="${color}" stroke-width="8" stroke-linecap="round" fill="none"/>
        <circle cx="400" cy="335" r="12" fill="#000"/>
        <rect x="396" y="335" width="8" height="24" rx="4" fill="#000"/>`
      ),
  },

  // 6. People & Work
  {
    id: "ill-teamwork-collaboration",
    title: "Teamwork & Remote Collaboration",
    category: "People & Work",
    tags: ["people", "team", "collaboration", "work", "community", "remote", "office"],
    svgTemplate: (color) =>
      createVectorIllustrationSvg(
        color,
        `<rect width="800" height="600" rx="32" fill="#0d1117" opacity="0.3"/>
        <circle cx="280" cy="220" r="45" fill="${color}"/>
        <path d="M200 370C200 310 240 280 280 280C320 280 360 310 360 370V420H200V370Z" fill="${color}" opacity="0.8"/>

        <circle cx="520" cy="220" r="45" fill="url(#illGrad)" filter="url(#illGlow)"/>
        <path d="M440 370C440 310 480 280 520 280C560 280 600 310 600 370V420H440V370Z" fill="${color}"/>

        <circle cx="400" cy="280" r="35" fill="#ffffff"/>
        <path d="M340 430C340 380 370 350 400 350C430 350 460 380 460 430V460H340V430Z" fill="#ffffff"/>
        <path d="M280 300L400 350L520 300" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`
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
    const q = query.toLowerCase();
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
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
