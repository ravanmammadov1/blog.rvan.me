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
] as const;

export type IllustrationCategory = typeof ILLUSTRATION_CATEGORIES[number];

// Helper to construct unDraw-style vector SVG illustrations (NO GLOW, CRISP FLAT VECTOR)
function createUnDrawSvg(
  color: string,
  pathsSvg: string,
  viewBox = "0 0 800 600"
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%" fill="none">
  <rect width="800" height="600" rx="24" fill="#0d1117" opacity="0.4"/>
  ${pathsSvg}
</svg>`;
}

export const ILLUSTRATION_CATALOG: IllustrationItem[] = [
  // 1. Winner
  {
    id: "ill-winner",
    title: "Winner & Celebration",
    category: "People & Work",
    tags: ["winner", "trophy", "success", "celebrate", "award", "person", "achievement"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        color,
        `<ellipse cx="400" cy="500" rx="300" ry="20" fill="#161b22"/>
        <!-- Trophy -->
        <path d="M440 280C440 340 400 370 400 370C400 370 360 340 360 280V200H440V280Z" fill="${color}"/>
        <rect x="385" y="370" width="30" height="60" fill="#3f3d56"/>
        <rect x="360" y="430" width="80" height="30" rx="6" fill="#2f2e41"/>
        <path d="M360 220H330C315 220 310 240 310 255C310 280 330 290 360 290V270C340 270 330 260 330 255C330 245 335 240 360 240V220Z" fill="${color}"/>
        <path d="M440 220H470C485 220 490 240 490 255C490 280 470 290 440 290V270C460 270 470 260 470 255C470 245 465 240 440 240V220Z" fill="${color}"/>
        <!-- Star on Trophy -->
        <polygon points="400,230 406,248 425,248 410,259 415,277 400,266 385,277 390,259 375,248 394,248" fill="#ffffff"/>
        <!-- Human Character Kneeling -->
        <circle cx="280" cy="270" r="24" fill="#3f3d56"/>
        <path d="M255 310C255 310 280 295 310 320C320 330 330 350 310 370L280 340" fill="${color}"/>
        <path d="M265 305L300 370L250 480H210L250 390L210 340Z" fill="#2f2e41"/>
        <path d="M260 320L360 350L350 370L270 340Z" fill="#3f3d56"/>`
      ),
  },

  // 2. Financial Advisor
  {
    id: "ill-financial-advisor",
    title: "Financial Advisor & Mobile App",
    category: "Finance & E-Commerce",
    tags: ["financial", "advisor", "mobile", "app", "phone", "money", "person"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        color,
        `<ellipse cx="400" cy="520" rx="280" ry="18" fill="#161b22"/>
        <!-- Phone Frame -->
        <rect x="310" y="100" width="180" height="380" rx="24" fill="#2f2e41" stroke="#3f3d56" stroke-width="4"/>
        <rect x="325" y="120" width="150" height="340" rx="12" fill="#ffffff"/>
        <rect x="345" y="140" width="110" height="12" rx="6" fill="${color}"/>
        <rect x="345" y="165" width="80" height="8" rx="4" fill="#e2e8f0"/>
        <!-- Chart Bars inside Phone -->
        <rect x="345" y="240" width="20" height="60" rx="4" fill="#e2e8f0"/>
        <rect x="375" y="210" width="20" height="90" rx="4" fill="${color}"/>
        <rect x="405" y="190" width="20" height="110" rx="4" fill="${color}"/>
        <rect x="435" y="230" width="20" height="70" rx="4" fill="#e2e8f0"/>
        <!-- Human Sitting in Phone -->
        <circle cx="400" cy="340" r="18" fill="#3f3d56"/>
        <path d="M375 365C375 365 400 355 425 365V410H375V365Z" fill="${color}"/>
        <path d="M380 410L360 480H385L400 430L415 480H440L420 410Z" fill="#2f2e41"/>`
      ),
  },

  // 3. Team
  {
    id: "ill-team",
    title: "Team & Avatars Grid",
    category: "People & Work",
    tags: ["team", "avatars", "people", "group", "work", "community", "members"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        color,
        `<ellipse cx="400" cy="510" rx="320" ry="18" fill="#161b22"/>
        <!-- Row 1 -->
        <circle cx="250" cy="180" r="28" fill="#3f3d56"/>
        <path d="M210 240C210 215 235 210 250 210C265 210 290 215 290 240V270H210V240Z" fill="${color}"/>

        <circle cx="400" cy="160" r="32" fill="#2f2e41"/>
        <path d="M350 230C350 200 380 195 400 195C420 195 450 200 450 230V260H350V230Z" fill="#ffffff"/>

        <circle cx="550" cy="180" r="28" fill="#3f3d56"/>
        <path d="M510 240C510 215 535 210 550 210C565 210 590 215 590 240V270H510V240Z" fill="${color}"/>

        <!-- Row 2 -->
        <circle cx="310" cy="330" r="30" fill="#2f2e41"/>
        <path d="M265 400C265 370 295 365 310 365C325 365 355 370 355 400V440H265V400Z" fill="${color}"/>

        <circle cx="490" cy="330" r="30" fill="#3f3d56"/>
        <path d="M445 400C445 370 475 365 490 365C505 365 535 370 535 400V440H445V400Z" fill="#ffffff"/>`
      ),
  },

  // 4. Online Transactions
  {
    id: "ill-online-transactions",
    title: "Online Transactions & Payments",
    category: "Finance & E-Commerce",
    tags: ["online", "transactions", "payment", "credit", "card", "mobile", "money"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        color,
        `<ellipse cx="400" cy="500" rx="300" ry="20" fill="#161b22"/>
        <!-- Central Credit Card -->
        <rect x="260" y="240" width="280" height="170" rx="18" fill="${color}"/>
        <rect x="260" y="275" width="280" height="35" fill="#2f2e41"/>
        <rect x="290" y="340" width="60" height="40" rx="8" fill="#ffbd2e"/>
        <circle cx="470" cy="360" r="16" fill="#ffffff" opacity="0.8"/>
        <circle cx="495" cy="360" r="16" fill="#3f3d56"/>

        <!-- Left Mobile Device -->
        <rect x="150" y="170" width="90" height="160" rx="16" fill="#2f2e41"/>
        <rect x="160" y="185" width="70" height="130" rx="8" fill="#ffffff"/>
        <circle cx="195" cy="250" r="16" fill="${color}"/>

        <!-- Right Server Unit -->
        <rect x="560" y="170" width="90" height="160" rx="16" fill="#2f2e41"/>
        <rect x="575" y="195" width="60" height="14" rx="4" fill="${color}"/>
        <rect x="575" y="220" width="60" height="14" rx="4" fill="#3f3d56"/>
        <rect x="575" y="245" width="60" height="14" rx="4" fill="${color}"/>

        <!-- Connection Lines -->
        <path d="M240 250H260M540 250H560" stroke="${color}" stroke-width="4" stroke-dasharray="6 6"/>`
      ),
  },

  // 5. Tight Deadline
  {
    id: "ill-tight-deadline",
    title: "Tight Deadline & Workspace",
    category: "People & Work",
    tags: ["deadline", "clock", "time", "work", "laptop", "desk", "person"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        color,
        `<ellipse cx="400" cy="510" rx="300" ry="18" fill="#161b22"/>
        <!-- Desk -->
        <rect x="180" y="400" width="440" height="16" rx="8" fill="#2f2e41"/>
        <rect x="220" y="416" width="16" height="90" fill="#3f3d56"/>
        <rect x="560" y="416" width="16" height="90" fill="#3f3d56"/>

        <!-- Giant Alarm Clock in background -->
        <circle cx="520" cy="240" r="80" fill="${color}"/>
        <circle cx="520" cy="240" r="65" fill="#ffffff"/>
        <path d="M520 240V190M520 240L550 270" stroke="#2f2e41" stroke-width="8" stroke-linecap="round"/>

        <!-- Laptop on Desk -->
        <rect x="250" y="320" width="140" height="85" rx="8" fill="#3f3d56"/>
        <rect x="260" y="330" width="120" height="65" fill="#ffffff"/>
        <polygon points="230,400 410,400 390,390 250,390" fill="#2f2e41"/>

        <!-- Person Sitting at Desk -->
        <circle cx="180" cy="300" r="22" fill="#3f3d56"/>
        <path d="M155 335C155 335 180 325 205 335V400H155V335Z" fill="${color}"/>`
      ),
  },

  // 6. Progress Bar
  {
    id: "ill-progress-bar",
    title: "Progress Bar & System Loading",
    category: "Tech & Coding",
    tags: ["progress", "bar", "loading", "laptop", "computer", "system", "gear"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        color,
        `<ellipse cx="400" cy="500" rx="280" ry="18" fill="#161b22"/>
        <!-- Laptop Frame -->
        <rect x="220" y="160" width="360" height="230" rx="16" fill="#2f2e41" stroke="#3f3d56" stroke-width="6"/>
        <rect x="240" y="180" width="320" height="190" rx="8" fill="#ffffff"/>
        <!-- Laptop Base -->
        <path d="M160 410L640 410L590 390L210 390Z" fill="#3f3d56"/>

        <!-- Loading Gear Icon -->
        <circle cx="400" cy="250" r="24" fill="${color}"/>
        <path d="M400 210V220M400 280V290M360 250H370M430 250H440" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>

        <!-- Progress Bar Background -->
        <rect x="280" y="310" width="240" height="16" rx="8" fill="#e2e8f0"/>
        <!-- Progress Bar Fill -->
        <rect x="280" y="310" width="160" height="16" rx="8" fill="${color}"/>`
      ),
  },

  // 7. Order Delivered
  {
    id: "ill-order-delivered",
    title: "Order Delivered & E-Commerce Box",
    category: "Finance & E-Commerce",
    tags: ["order", "delivered", "package", "box", "shipping", "ecommerce", "person"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        color,
        `<ellipse cx="400" cy="510" rx="300" ry="18" fill="#161b22"/>
        <!-- Stacked Boxes -->
        <rect x="420" y="320" width="140" height="120" rx="12" fill="${color}"/>
        <rect x="420" y="360" width="140" height="20" fill="#2f2e41" opacity="0.3"/>
        <rect x="460" y="240" width="100" height="80" rx="8" fill="#3f3d56"/>

        <!-- Verified Checkmark Badge -->
        <circle cx="250" cy="380" r="24" fill="${color}"/>
        <path d="M238 380L246 388L262 372" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>

        <!-- Delivery Person -->
        <circle cx="320" cy="240" r="24" fill="#3f3d56"/>
        <path d="M295 275C295 275 320 265 345 275V360H295V275Z" fill="#2f2e41"/>
        <path d="M300 360L280 480H310L325 420L340 480H370L345 360Z" fill="${color}"/>
        <!-- Box Carried -->
        <rect x="330" y="300" width="80" height="70" rx="8" fill="${color}"/>`
      ),
  },

  // 8. Looking for Answers
  {
    id: "ill-looking-for-answers",
    title: "Looking for Answers & Flashlight",
    category: "Design & Creative",
    tags: ["answers", "search", "flashlight", "question", "thought", "bubble", "person"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        color,
        `<ellipse cx="400" cy="510" rx="300" ry="18" fill="#161b22"/>
        <!-- Thought Cloud Bubble -->
        <path d="M250 200C220 200 200 230 210 260C190 280 200 310 220 320C220 340 240 360 270 350C290 360 330 350 340 320C360 310 370 270 350 240C350 210 310 190 280 200Z" fill="${color}"/>
        <text x="265" y="295" font-family="sans-serif" font-size="72" font-weight="bold" fill="#ffffff">?</text>

        <!-- Person holding flashlight -->
        <circle cx="560" cy="320" r="22" fill="#3f3d56"/>
        <path d="M535 355C535 355 560 345 585 355V440H535V355Z" fill="#2f2e41"/>
        <path d="M540 440L520 500H550L560 470L575 500H605L580 440Z" fill="#3f3d56"/>
        <!-- Flashlight Beam -->
        <polygon points="530,370 350,330 360,250" fill="${color}" opacity="0.3"/>`
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
        color,
        `<ellipse cx="400" cy="500" rx="280" ry="18" fill="#161b22"/>
        <!-- Photo Frame -->
        <rect x="220" y="140" width="360" height="260" rx="16" fill="#2f2e41"/>
        <rect x="240" y="160" width="320" height="220" rx="8" fill="#ffffff"/>
        <!-- Sun -->
        <circle cx="310" cy="220" r="28" fill="#ffbd2e"/>
        <!-- Mountains -->
        <polygon points="240,380 360,260 440,380" fill="${color}"/>
        <polygon points="360,380 460,280 560,380" fill="#3f3d56"/>`
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
        color,
        `<ellipse cx="400" cy="510" rx="320" ry="18" fill="#161b22"/>
        <!-- Rising Sun -->
        <circle cx="280" cy="220" r="60" fill="#ff5f56"/>
        <!-- Pagoda Architecture -->
        <rect x="240" y="380" width="80" height="60" fill="#2f2e41"/>
        <polygon points="200,380 360,380 340,350 220,350" fill="${color}"/>
        <rect x="250" y="300" width="60" height="50" fill="#2f2e41"/>
        <polygon points="210,300 350,300 330,270 230,270" fill="${color}"/>
        <polygon points="240,270 320,270 280,220" fill="#3f3d56"/>

        <!-- Traveler Character -->
        <circle cx="520" cy="340" r="20" fill="#3f3d56"/>
        <path d="M495 370C495 370 520 360 545 370V440H495V370Z" fill="${color}"/>
        <path d="M500 440L480 500H510L520 470L535 500H565L540 440Z" fill="#2f2e41"/>`
      ),
  },

  // 11. Code Typing
  {
    id: "ill-code-typing",
    title: "Software Developer & Dual Monitors",
    category: "Tech & Coding",
    tags: ["developer", "code", "programming", "monitors", "desktop", "setup", "person"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        color,
        `<ellipse cx="400" cy="510" rx="320" ry="18" fill="#161b22"/>
        <!-- Desk -->
        <rect x="140" y="390" width="520" height="16" rx="8" fill="#2f2e41"/>

        <!-- Left Monitor -->
        <rect x="180" y="200" width="200" height="150" rx="12" fill="#3f3d56"/>
        <rect x="190" y="210" width="180" height="130" fill="#0d1117"/>
        <rect x="210" y="230" width="80" height="10" rx="5" fill="${color}"/>
        <rect x="210" y="250" width="120" height="8" rx="4" fill="#8b949e" opacity="0.6"/>
        <rect x="210" y="265" width="100" height="8" rx="4" fill="${color}" opacity="0.8"/>
        <rect x="270" y="350" width="20" height="40" fill="#2f2e41"/>

        <!-- Right Monitor -->
        <rect x="420" y="200" width="200" height="150" rx="12" fill="#3f3d56"/>
        <rect x="430" y="210" width="180" height="130" fill="#0d1117"/>
        <rect x="450" y="230" width="120" height="10" rx="5" fill="#ffffff"/>
        <rect x="450" y="250" width="90" height="8" rx="4" fill="${color}"/>
        <rect x="510" y="350" width="20" height="40" fill="#2f2e41"/>

        <!-- Developer Character -->
        <circle cx="400" cy="320" r="24" fill="#3f3d56"/>
        <path d="M370 355C370 355 400 345 430 355V440H370V355Z" fill="${color}"/>`
      ),
  },

  // 12. Security Cloud Vault
  {
    id: "ill-security-cloud-vault",
    title: "Cyber Security & Padlock Vault",
    category: "Security & Cloud",
    tags: ["security", "cloud", "vault", "padlock", "lock", "cyber", "protection"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        color,
        `<ellipse cx="400" cy="500" rx="280" ry="18" fill="#161b22"/>
        <!-- Giant Padlock Body -->
        <rect x="280" y="240" width="240" height="200" rx="28" fill="${color}"/>
        <!-- Padlock Shackle Ring -->
        <path d="M330 240V170C330 130 360 100 400 100C440 100 470 130 470 170V240" stroke="#3f3d56" stroke-width="24" stroke-linecap="round" fill="none"/>
        <!-- Keyhole -->
        <circle cx="400" cy="320" r="20" fill="#2f2e41"/>
        <polygon points="390,320 410,320 415,380 385,380" fill="#2f2e41"/>`
      ),
  },

  // 13. Data Analytics Dashboard
  {
    id: "ill-data-analytics-dashboard",
    title: "Data Analytics & Growth Charts",
    category: "Data & Analytics",
    tags: ["analytics", "data", "dashboard", "charts", "metrics", "growth", "person"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        color,
        `<ellipse cx="400" cy="510" rx="300" ry="18" fill="#161b22"/>
        <!-- Main Dashboard Board -->
        <rect x="160" y="120" width="480" height="280" rx="20" fill="#2f2e41"/>
        <rect x="180" y="140" width="440" height="240" rx="12" fill="#ffffff"/>

        <!-- Bar Charts inside Board -->
        <rect x="220" y="260" width="40" height="100" rx="6" fill="#e2e8f0"/>
        <rect x="280" y="210" width="40" height="150" rx="6" fill="${color}"/>
        <rect x="340" y="170" width="40" height="190" rx="6" fill="${color}"/>
        <rect x="400" y="240" width="40" height="120" rx="6" fill="#e2e8f0"/>

        <!-- Pie Chart -->
        <circle cx="520" cy="240" r="50" fill="${color}"/>
        <path d="M520 240L570 240A50 50 0 0 0 520 190Z" fill="#ffbd2e"/>

        <!-- Analyst Character -->
        <circle cx="240" cy="380" r="22" fill="#3f3d56"/>
        <path d="M215 415C215 415 240 405 265 415V480H215V415Z" fill="${color}"/>`
      ),
  },

  // 14. Brainstorming Ideas
  {
    id: "ill-brainstorming-ideas",
    title: "Brainstorming & Sticky Notes Board",
    category: "Design & Creative",
    tags: ["brainstorming", "ideas", "board", "notes", "sticky", "creative", "team"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        color,
        `<ellipse cx="400" cy="510" rx="300" ry="18" fill="#161b22"/>
        <!-- Idea Board -->
        <rect x="180" y="110" width="440" height="280" rx="20" fill="#2f2e41"/>
        <rect x="200" y="130" width="400" height="240" rx="12" fill="#ffffff"/>

        <!-- Sticky Notes -->
        <rect x="230" y="160" width="70" height="70" rx="6" fill="${color}"/>
        <rect x="320" y="160" width="70" height="70" rx="6" fill="#ffbd2e"/>
        <rect x="410" y="160" width="70" height="70" rx="6" fill="#ff5f56"/>
        <rect x="500" y="160" width="70" height="70" rx="6" fill="${color}"/>

        <rect x="270" y="260" width="70" height="70" rx="6" fill="#3b82f6"/>
        <rect x="360" y="260" width="70" height="70" rx="6" fill="${color}"/>
        <rect x="450" y="260" width="70" height="70" rx="6" fill="#a855f7"/>

        <!-- Character 1 -->
        <circle cx="160" cy="380" r="22" fill="#3f3d56"/>
        <path d="M135 415C135 415 160 405 185 415V480H135V415Z" fill="${color}"/>

        <!-- Character 2 -->
        <circle cx="640" cy="380" r="22" fill="#2f2e41"/>
        <path d="M615 415C615 415 640 405 665 415V480H615V415Z" fill="#3f3d56"/>`
      ),
  },

  // 15. E-Commerce Shopping Cart
  {
    id: "ill-shopping-cart-checkout",
    title: "E-Commerce Shopping & Cart",
    category: "Finance & E-Commerce",
    tags: ["shopping", "cart", "store", "buy", "checkout", "ecommerce", "person"],
    svgTemplate: (color) =>
      createUnDrawSvg(
        color,
        `<ellipse cx="400" cy="510" rx="300" ry="18" fill="#161b22"/>
        <!-- Giant Shopping Cart -->
        <path d="M220 220H270L320 400H520L570 260H300" stroke="${color}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <circle cx="340" cy="450" r="24" fill="#2f2e41"/>
        <circle cx="490" cy="450" r="24" fill="#2f2e41"/>

        <!-- Products in Cart -->
        <rect x="330" y="220" width="70" height="70" rx="12" fill="#ffbd2e"/>
        <rect x="410" y="190" width="90" height="100" rx="12" fill="${color}"/>

        <!-- Customer Character -->
        <circle cx="180" cy="280" r="24" fill="#3f3d56"/>
        <path d="M155 315C155 315 180 305 205 315V440H155V315Z" fill="#2f2e41"/>
        <path d="M160 440L140 500H170L185 470L200 500H230L205 440Z" fill="${color}"/>`
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
