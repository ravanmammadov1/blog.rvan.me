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
  "Finance & E-Commerce",
  "Marketing & Growth",
] as const;

export type IllustrationCategory = typeof ILLUSTRATION_CATEGORIES[number];

// Helper to wrap vector paths in standard unDraw SVG container
function createUnDrawSvg(
  pathsSvg: string,
  viewBox = "0 0 800 600"
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%" fill="none">
  <rect width="800" height="600" rx="24" fill="#0d1117" opacity="0.4"/>
  ${pathsSvg}
</svg>`;
}

// Master unDraw SVG Illustration Blueprints
export const ILLUSTRATION_CATALOG: IllustrationItem[] = [
  // 1. Winner
  {
    id: "ill-winner",
    title: "Winner & Trophy Celebration",
    category: "People & Work",
    tags: ["winner", "trophy", "success", "celebrate", "award", "person", "achievement"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        `<ellipse cx="400" cy="520" rx="320" ry="20" fill="#161b22"/>
        <path d="M440 280C440 340 400 370 400 370C400 370 360 340 360 280V200H440V280Z" fill="${color}"/>
        <rect x="385" y="370" width="30" height="60" fill="#3f3d56"/>
        <rect x="350" y="430" width="100" height="30" rx="8" fill="#2f2e41"/>
        <path d="M360 220H320C300 220 290 240 290 260C290 290 320 300 360 300V280C330 280 310 275 310 260C310 245 320 240 360 240V220Z" fill="${color}"/>
        <path d="M440 220H480C500 220 510 240 510 260C510 290 480 300 440 300V280C470 280 490 275 490 260C490 245 480 240 440 240V220Z" fill="${color}"/>
        <polygon points="400,230 407,248 426,248 411,259 416,277 400,266 384,277 389,259 374,248 393,248" fill="#ffffff"/>
        <circle cx="260" cy="260" r="26" fill="#3f3d56"/>
        <path d="M235 300C235 300 260 285 290 310C300 320 310 340 290 360L260 330" fill="${color}"/>
        <path d="M245 295L280 360L230 480H190L230 390L190 330Z" fill="#2f2e41"/>`
      ),
  },

  // 2. Financial Advisor
  {
    id: "ill-financial-advisor",
    title: "Financial Advisor & Mobile Analytics",
    category: "Finance & E-Commerce",
    tags: ["financial", "advisor", "mobile", "app", "phone", "money", "person", "chart"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        `<ellipse cx="400" cy="520" rx="300" ry="18" fill="#161b22"/>
        <rect x="300" y="90" width="200" height="400" rx="28" fill="#2f2e41" stroke="#3f3d56" stroke-width="6"/>
        <rect x="315" y="110" width="170" height="360" rx="16" fill="#ffffff"/>
        <rect x="335" y="135" width="130" height="14" rx="7" fill="${color}"/>
        <rect x="335" y="160" width="90" height="8" rx="4" fill="#e2e8f0"/>
        <rect x="340" y="240" width="24" height="70" rx="6" fill="#e2e8f0"/>
        <rect x="375" y="200" width="24" height="110" rx="6" fill="${color}"/>
        <rect x="410" y="170" width="24" height="140" rx="6" fill="${color}"/>
        <rect x="445" y="220" width="24" height="90" rx="6" fill="#e2e8f0"/>
        <circle cx="400" cy="350" r="20" fill="#3f3d56"/>
        <path d="M370 380C370 380 400 365 430 380V430H370V380Z" fill="${color}"/>
        <path d="M375 430L355 490H380L395 440L410 490H435L415 430Z" fill="#2f2e41"/>`
      ),
  },

  // 3. Team
  {
    id: "ill-team",
    title: "Team Collaboration & Guild",
    category: "People & Work",
    tags: ["team", "avatars", "people", "group", "work", "community", "members"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        `<ellipse cx="400" cy="510" rx="340" ry="18" fill="#161b22"/>
        <circle cx="230" cy="180" r="30" fill="#3f3d56"/>
        <path d="M190 245C190 215 215 210 230 210C245 210 270 215 270 245V280H190V245Z" fill="${color}"/>
        <circle cx="400" cy="150" r="36" fill="#2f2e41"/>
        <path d="M345 225C345 190 380 185 400 185C420 185 455 190 455 225V265H345V225Z" fill="#ffffff"/>
        <circle cx="570" cy="180" r="30" fill="#3f3d56"/>
        <path d="M530 245C530 215 555 210 570 210C585 210 610 215 610 245V280H530V245Z" fill="${color}"/>
        <circle cx="300" cy="340" r="32" fill="#2f2e41"/>
        <path d="M250 415C250 380 280 375 300 375C320 375 350 380 350 415V460H250V415Z" fill="${color}"/>
        <circle cx="500" cy="340" r="32" fill="#3f3d56"/>
        <path d="M450 415C450 380 480 375 500 375C520 375 550 380 550 415V460H450V415Z" fill="#ffffff"/>`
      ),
  },

  // 4. Online Transactions
  {
    id: "ill-online-transactions",
    title: "Online Transactions & Gateway",
    category: "Finance & E-Commerce",
    tags: ["online", "transactions", "payment", "credit", "card", "mobile", "money"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        `<ellipse cx="400" cy="500" rx="320" ry="20" fill="#161b22"/>
        <rect x="250" y="230" width="300" height="180" rx="20" fill="${color}"/>
        <rect x="250" y="270" width="300" height="40" fill="#2f2e41"/>
        <rect x="280" y="340" width="70" height="45" rx="8" fill="#ffbd2e"/>
        <circle cx="470" cy="360" r="18" fill="#ffffff" opacity="0.8"/>
        <circle cx="498" cy="360" r="18" fill="#3f3d56"/>
        <rect x="130" y="160" width="100" height="180" rx="18" fill="#2f2e41"/>
        <rect x="142" y="175" width="76" height="150" rx="10" fill="#ffffff"/>
        <circle cx="180" cy="250" r="18" fill="${color}"/>
        <rect x="570" y="160" width="100" height="180" rx="18" fill="#2f2e41"/>
        <rect x="585" y="190" width="70" height="16" rx="4" fill="${color}"/>
        <rect x="585" y="220" width="70" height="16" rx="4" fill="#3f3d56"/>
        <path d="M230 250H250M550 250H570" stroke="${color}" stroke-width="4" stroke-dasharray="6 6"/>`
      ),
  },

  // 5. Tight Deadline
  {
    id: "ill-tight-deadline",
    title: "Tight Deadline & Work Desk",
    category: "People & Work",
    tags: ["deadline", "clock", "time", "work", "laptop", "desk", "person"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        `<ellipse cx="400" cy="510" rx="320" ry="18" fill="#161b22"/>
        <rect x="160" y="400" width="480" height="18" rx="9" fill="#2f2e41"/>
        <rect x="200" y="418" width="18" height="90" fill="#3f3d56"/>
        <rect x="580" y="418" width="18" height="90" fill="#3f3d56"/>
        <circle cx="530" cy="230" r="90" fill="${color}"/>
        <circle cx="530" cy="230" r="72" fill="#ffffff"/>
        <path d="M530 230V175M530 230L565 265" stroke="#2f2e41" stroke-width="9" stroke-linecap="round"/>
        <rect x="240" y="315" width="160" height="95" rx="10" fill="#3f3d56"/>
        <rect x="252" y="327" width="136" height="73" fill="#ffffff"/>
        <circle cx="170" cy="290" r="24" fill="#3f3d56"/>
        <path d="M142 330C142 330 170 318 198 330V400H142V330Z" fill="${color}"/>`
      ),
  },

  // 6. Progress Bar
  {
    id: "ill-progress-bar",
    title: "Progress Bar & System Work",
    category: "Tech & Coding",
    tags: ["progress", "bar", "loading", "laptop", "computer", "system", "gear"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        `<ellipse cx="400" cy="500" rx="300" ry="18" fill="#161b22"/>
        <rect x="200" y="150" width="400" height="250" rx="18" fill="#2f2e41" stroke="#3f3d56" stroke-width="6"/>
        <rect x="222" y="172" width="356" height="206" rx="10" fill="#ffffff"/>
        <path d="M140 410L660 410L605 388L195 388Z" fill="#3f3d56"/>
        <circle cx="400" cy="245" r="28" fill="${color}"/>
        <rect x="260" y="315" width="280" height="18" rx="9" fill="#e2e8f0"/>
        <rect x="260" y="315" width="190" height="18" rx="9" fill="${color}"/>`
      ),
  },

  // 7. Order Delivered
  {
    id: "ill-order-delivered",
    title: "Order Delivered & Logistics",
    category: "Finance & E-Commerce",
    tags: ["order", "delivered", "package", "box", "shipping", "ecommerce", "person"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        `<ellipse cx="400" cy="510" rx="320" ry="18" fill="#161b22"/>
        <rect x="430" y="310" width="150" height="130" rx="14" fill="${color}"/>
        <circle cx="240" cy="370" r="26" fill="${color}"/>
        <path d="M227 370L236 379L253 362" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="320" cy="230" r="26" fill="#3f3d56"/>
        <path d="M292 268C292 268 320 256 348 268V360H292V268Z" fill="#2f2e41"/>
        <rect x="330" y="295" width="90" height="75" rx="10" fill="${color}"/>`
      ),
  },

  // 8. Looking for Answers
  {
    id: "ill-looking-for-answers",
    title: "Looking for Answers & Knowledge",
    category: "Design & Creative",
    tags: ["answers", "search", "flashlight", "question", "thought", "bubble", "person"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        `<ellipse cx="400" cy="510" rx="320" ry="18" fill="#161b22"/>
        <path d="M240 190C205 190 185 222 195 255C172 277 185 310 205 322C205 344 228 365 262 355C284 365 330 355 342 322C365 310 375 268 352 235C352 202 308 180 272 190Z" fill="${color}"/>
        <text x="255" y="290" font-family="sans-serif" font-size="80" font-weight="bold" fill="#ffffff">?</text>
        <circle cx="570" cy="310" r="24" fill="#3f3d56"/>
        <path d="M542 348C542 348 570 336 598 348V440H542V348Z" fill="#2f2e41"/>
        <polygon points="535,365 330,320 340,230" fill="${color}" opacity="0.3"/>`
      ),
  },

  // 9. Photo Landscape
  {
    id: "ill-photo-landscape",
    title: "Photo Landscape & Gallery",
    category: "Design & Creative",
    tags: ["photo", "landscape", "picture", "image", "gallery", "frame", "mountains"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        `<ellipse cx="400" cy="500" rx="300" ry="18" fill="#161b22"/>
        <rect x="200" y="130" width="400" height="280" rx="18" fill="#2f2e41"/>
        <rect x="222" y="152" width="356" height="236" rx="10" fill="#ffffff"/>
        <circle cx="300" cy="220" r="30" fill="#ffbd2e"/>
        <polygon points="222,388 350,250 440,388" fill="${color}"/>
        <polygon points="350,388 460,270 578,388" fill="#3f3d56"/>`
      ),
  },

  // 10. Visiting Japan
  {
    id: "ill-visiting-japan",
    title: "Visiting Japan & Pagoda Temple",
    category: "People & Work",
    tags: ["japan", "travel", "pagoda", "temple", "culture", "person", "sun"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        `<ellipse cx="400" cy="510" rx="340" ry="18" fill="#161b22"/>
        <circle cx="270" cy="210" r="65" fill="#ff5f56"/>
        <rect x="230" y="380" width="90" height="60" fill="#2f2e41"/>
        <polygon points="180,380 370,380 345,350 205,350" fill="${color}"/>
        <rect x="242" y="295" width="66" height="55" fill="#2f2e41"/>
        <polygon points="195,295 355,295 332,265 218,265" fill="${color}"/>
        <circle cx="540" cy="330" r="22" fill="#3f3d56"/>
        <path d="M512 365C512 365 540 353 568 365V440H512V365Z" fill="${color}"/>`
      ),
  },

  // 11. Developer Code Setup
  {
    id: "ill-code-typing",
    title: "Software Developer & Workstation",
    category: "Tech & Coding",
    tags: ["developer", "code", "programming", "monitors", "desktop", "setup", "person"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        `<ellipse cx="400" cy="510" rx="340" ry="18" fill="#161b22"/>
        <rect x="130" y="390" width="540" height="18" rx="9" fill="#2f2e41"/>
        <rect x="170" y="190" width="220" height="160" rx="14" fill="#3f3d56"/>
        <rect x="182" y="202" width="196" height="136" fill="#0d1117"/>
        <rect x="205" y="225" width="90" height="12" rx="6" fill="${color}"/>
        <rect x="410" y="190" width="220" height="160" rx="14" fill="#3f3d56"/>
        <rect x="422" y="202" width="196" height="136" fill="#0d1117"/>
        <rect x="445" y="225" width="130" height="12" rx="6" fill="#ffffff"/>
        <circle cx="400" cy="315" r="26" fill="#3f3d56"/>
        <path d="M368 353C368 353 400 341 432 353V440H368V353Z" fill="${color}"/>`
      ),
  },

  // 12. Cyber Security Vault
  {
    id: "ill-security-cloud-vault",
    title: "Cyber Security & Padlock Vault",
    category: "Security & Cloud",
    tags: ["security", "cloud", "vault", "padlock", "lock", "cyber", "protection"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        `<ellipse cx="400" cy="500" rx="300" ry="18" fill="#161b22"/>
        <rect x="260" y="230" width="280" height="220" rx="32" fill="${color}"/>
        <path d="M315 230V160C315 115 350 80 400 80C450 80 485 115 485 160V230" stroke="#3f3d56" stroke-width="28" stroke-linecap="round" fill="none"/>
        <circle cx="400" cy="315" r="24" fill="#2f2e41"/>
        <polygon points="388,315 412,315 418,385 382,385" fill="#2f2e41"/>`
      ),
  },

  // 13. Data Analytics Dashboard
  {
    id: "ill-data-analytics-dashboard",
    title: "Data Analytics & KPI Board",
    category: "Data & Analytics",
    tags: ["analytics", "data", "dashboard", "charts", "metrics", "growth", "person"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        `<ellipse cx="400" cy="510" rx="320" ry="18" fill="#161b22"/>
        <rect x="150" y="110" width="500" height="300" rx="22" fill="#2f2e41"/>
        <rect x="172" y="132" width="456" height="256" rx="14" fill="#ffffff"/>
        <rect x="210" y="255" width="45" height="110" rx="7" fill="#e2e8f0"/>
        <rect x="275" y="200" width="45" height="165" rx="7" fill="${color}"/>
        <rect x="340" y="160" width="45" height="205" rx="7" fill="${color}"/>
        <circle cx="530" cy="235" r="55" fill="${color}"/>
        <circle cx="230" cy="375" r="24" fill="#3f3d56"/>
        <path d="M202 413C202 413 230 401 258 413V480H202V413Z" fill="${color}"/>`
      ),
  },

  // 14. Brainstorming Notes
  {
    id: "ill-brainstorming-ideas",
    title: "Brainstorming & Sticky Notes Board",
    category: "Design & Creative",
    tags: ["brainstorming", "ideas", "board", "notes", "sticky", "creative", "team"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        `<ellipse cx="400" cy="510" rx="320" ry="18" fill="#161b22"/>
        <rect x="170" y="100" width="460" height="300" rx="22" fill="#2f2e41"/>
        <rect x="192" y="122" width="416" height="256" rx="14" fill="#ffffff"/>
        <rect x="225" y="155" width="75" height="75" rx="8" fill="${color}"/>
        <rect x="320" y="155" width="75" height="75" rx="8" fill="#ffbd2e"/>
        <rect x="415" y="155" width="75" height="75" rx="8" fill="#ff5f56"/>
        <circle cx="150" cy="375" r="24" fill="#3f3d56"/>
        <path d="M122 413C122 413 150 401 178 413V480H122V413Z" fill="${color}"/>`
      ),
  },

  // 15. E-Commerce Cart
  {
    id: "ill-shopping-cart-checkout",
    title: "E-Commerce Cart & Shopping",
    category: "Finance & E-Commerce",
    tags: ["shopping", "cart", "store", "buy", "checkout", "ecommerce", "person"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        `<ellipse cx="400" cy="510" rx="320" ry="18" fill="#161b22"/>
        <path d="M210 210H265L320 400H540L590 250H295" stroke="${color}" stroke-width="14" stroke-linecap="round" fill="none"/>
        <circle cx="340" cy="455" r="26" fill="#2f2e41"/>
        <circle cx="510" cy="455" r="26" fill="#2f2e41"/>
        <rect x="325" y="210" width="80" height="80" rx="14" fill="#ffbd2e"/>
        <rect x="415" y="175" width="100" height="115" rx="14" fill="${color}"/>
        <circle cx="170" cy="270" r="26" fill="#3f3d56"/>
        <path d="M142 308C142 308 170 296 198 308V440H142V308Z" fill="#2f2e41"/>`
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
