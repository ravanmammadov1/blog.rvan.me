import fs from "fs/promises";
import path from "path";

// 10 Comprehensive Categories
const CATEGORIES = [
  {
    name: "Tech & Coding",
    themes: [
      { prefix: "cloud-api", title: "Cloud API Architecture", tags: ["cloud", "api", "backend", "server", "rest", "graphql", "developer"] },
      { prefix: "git-branch", title: "Git Branching & Merge Workflow", tags: ["git", "version control", "merge", "github", "devops", "code"] },
      { prefix: "debugger", title: "Code Debugger & Stack Trace", tags: ["debugging", "breakpoint", "terminal", "console", "software", "fix"] },
      { prefix: "neural-net", title: "Neural Network Model Training", tags: ["ai", "machine learning", "neural", "deep learning", "python", "tensor"] },
      { prefix: "microservices", title: "Microservices Cluster Network", tags: ["docker", "kubernetes", "containers", "cluster", "architecture"] },
      { prefix: "terminal-cli", title: "Command Line Terminal Workflow", tags: ["terminal", "bash", "zsh", "cli", "linux", "powershell"] },
      { prefix: "frontend-react", title: "Frontend Component Hierarchy", tags: ["react", "vue", "nextjs", "javascript", "typescript", "ui"] },
      { prefix: "database-cluster", title: "Distributed Database Sharding", tags: ["database", "sql", "postgres", "redis", "nosql", "sharding"] },
      { prefix: "mobile-dev", title: "Cross-Platform Mobile App Engine", tags: ["mobile", "ios", "android", "flutter", "react native", "app"] },
      { prefix: "graphql-schema", title: "GraphQL Query & Mutation Schema", tags: ["graphql", "apollo", "schema", "query", "endpoint"] },
      { prefix: "ci-cd-pipeline", title: "Automated CI/CD Build Pipeline", tags: ["cicd", "actions", "automation", "deploy", "build", "pipeline"] },
      { prefix: "algorithm-sort", title: "Algorithmic Data Processing", tags: ["algorithm", "sorting", "binary search", "data structures", "logic"] },
    ],
  },
  {
    name: "Design & Creative",
    themes: [
      { prefix: "wireframe-prototype", title: "Interactive Wireframe Prototyping", tags: ["wireframe", "figma", "prototype", "ux", "ui", "mockup"] },
      { prefix: "color-palette-lab", title: "Harmonious Color Palette Lab", tags: ["color", "palette", "swatches", "hsl", "contrast", "art"] },
      { prefix: "vector-bezier", title: "Vector Bezier Curve Drafting", tags: ["vector", "pen tool", "bezier", "illustrator", "svg", "paths"] },
      { prefix: "typography-grid", title: "Modular Typography & Grid Scale", tags: ["typography", "fonts", "typescale", "editorial", "baseline"] },
      { prefix: "design-system", title: "Design System Token Tokens", tags: ["design system", "tokens", "components", "styleguide", "library"] },
      { prefix: "3d-scene-render", title: "3D Spatial Scene Rendering", tags: ["3d", "blender", "spline", "render", "polygons", "mesh"] },
      { prefix: "motion-keyframes", title: "Motion Design & Keyframe Easing", tags: ["motion", "animation", "keyframes", "easing", "after effects"] },
      { prefix: "brand-guidelines", title: "Brand Identity Guidelines & Logo", tags: ["branding", "logo", "identity", "guidelines", "marketing"] },
      { prefix: "iconography-set", title: "Custom Iconography Set Design", tags: ["icons", "glyphs", "symbols", "minimalist", "pixel perfect"] },
      { prefix: "art-direction", title: "Creative Art Direction Moodboard", tags: ["moodboard", "creative", "direction", "visuals", "inspiration"] },
      { prefix: "mobile-ui-kit", title: "Mobile UI Kit & Design Tokens", tags: ["uikit", "mobile ui", "screens", "components", "app design"] },
    ],
  },
  {
    name: "Business & Startup",
    themes: [
      { prefix: "rocket-launch", title: "Startup Product Rocket Launch", tags: ["startup", "launch", "rocket", "growth", "mvp", "scale"] },
      { prefix: "pitch-deck", title: "Investor Pitch Deck Presentation", tags: ["pitch", "investor", "deck", "funding", "seed", "venture"] },
      { prefix: "agile-scrum-board", title: "Agile Scrum Sprint Board", tags: ["agile", "scrum", "sprint", "kanban", "tasks", "management"] },
      { prefix: "global-expansion", title: "Global Market Expansion Strategy", tags: ["global", "international", "expansion", "market", "reach"] },
      { prefix: "client-contract", title: "Enterprise Client Agreement Signing", tags: ["contract", "deal", "signing", "partnership", "b2b"] },
      { prefix: "co-founder-sync", title: "Co-Founder Strategic Alignment", tags: ["cofounder", "strategy", "planning", "vision", "leadership"] },
      { prefix: "roadmap-planning", title: "Quarterly Product Roadmap Vision", tags: ["roadmap", "planning", "milestones", "okrs", "goals"] },
      { prefix: "revenue-target", title: "Annual Revenue Target Achievement", tags: ["revenue", "target", "milestone", "kpi", "arr", "growth"] },
      { prefix: "team-all-hands", title: "Company All-Hands Meeting", tags: ["all hands", "company", "culture", "town hall", "team"] },
      { prefix: "venture-funding", title: "Series A Venture Funding Round", tags: ["funding", "series a", "capital", "valuation", "term sheet"] },
      { prefix: "business-canvas", title: "Lean Business Model Canvas", tags: ["business model", "canvas", "lean", "strategy", "value prop"] },
    ],
  },
  {
    name: "Data & Analytics",
    themes: [
      { prefix: "kpi-dashboard", title: "Executive KPI Metrics Dashboard", tags: ["kpi", "dashboard", "metrics", "analytics", "charts", "stats"] },
      { prefix: "conversion-funnel", title: "User Conversion Funnel Analysis", tags: ["funnel", "conversion", "cro", "dropoff", "retention"] },
      { prefix: "scatter-plot-ai", title: "Multivariate Data Scatter Plot", tags: ["data science", "scatter plot", "correlation", "statistics"] },
      { prefix: "big-data-stream", title: "Real-Time Big Data Stream Pipeline", tags: ["big data", "streaming", "kafka", "realtime", "telemetry"] },
      { prefix: "ab-test-insights", title: "A/B Testing Statistical Confidence", tags: ["ab testing", "experiment", "variant", "confidence", "stats"] },
      { prefix: "server-telemetry", title: "Server Cluster Health & Latency", tags: ["telemetry", "latency", "uptime", "monitoring", "prometheus"] },
      { prefix: "revenue-cohorts", title: "Monthly Cohort Retention Matrix", tags: ["cohort", "retention", "ltv", "churn", "saas metrics"] },
      { prefix: "geo-heatmap", title: "Geographical User Traffic Heatmap", tags: ["heatmap", "geo", "traffic", "world map", "demographics"] },
      { prefix: "user-journey-map", title: "Behavioral User Journey Tracker", tags: ["user journey", "events", "analytics", "mixpanel", "flow"] },
      { prefix: "financial-forecast", title: "Predictive Financial Forecasting", tags: ["forecasting", "predictive", "trends", "finance", "ai data"] },
    ],
  },
  {
    name: "Security & Cloud",
    themes: [
      { prefix: "biometric-auth", title: "Biometric Face & Fingerprint Unlock", tags: ["biometric", "faceid", "fingerprint", "security", "auth"] },
      { prefix: "firewall-shield", title: "Cloud Firewall & DDoS Defense", tags: ["firewall", "ddos", "shield", "cloud", "waf", "protection"] },
      { prefix: "ssl-encryption", title: "End-to-End SSL/TLS Encryption", tags: ["ssl", "tls", "encryption", "crypto", "security", "padlock"] },
      { prefix: "two-factor-2fa", title: "Two-Factor (2FA) Code Verification", tags: ["2fa", "mfa", "otp", "authentication", "security", "token"] },
      { prefix: "cloud-backup-sync", title: "Automated Cloud Disaster Recovery", tags: ["cloud", "backup", "disaster recovery", "aws", "storage"] },
      { prefix: "vpn-secure-tunnel", title: "Encrypted VPN Tunnel Gateway", tags: ["vpn", "tunnel", "privacy", "ipsec", "wireguard", "proxy"] },
      { prefix: "key-management", title: "Cryptographic Key Vault & HSM", tags: ["hsm", "keys", "vault", "secrets", "tokens", "access"] },
      { prefix: "zero-trust-access", title: "Zero Trust Identity Architecture", tags: ["zero trust", "iam", "access control", "rbac", "enterprise"] },
      { prefix: "vulnerability-scan", title: "Automated Penetration & Vuln Scan", tags: ["pentest", "vulnerability", "audit", "cve", "compliance"] },
      { prefix: "isolated-sandbox", title: "Isolated Container Sandbox Security", tags: ["sandbox", "isolation", "security", "virtualization"] },
    ],
  },
  {
    name: "People & Work",
    themes: [
      { prefix: "remote-workspace", title: "Remote Work & Home Office Haven", tags: ["remote work", "work from home", "desk", "laptop", "office"] },
      { prefix: "video-conference", title: "Global Team Video Conference", tags: ["zoom", "meet", "video call", "conference", "collaboration"] },
      { prefix: "pair-programming", title: "Collaborative Pair Programming", tags: ["pair programming", "peer review", "coding", "teamwork"] },
      { prefix: "brainstorm-session", title: "Creative Brainstorming Session", tags: ["brainstorm", "sticky notes", "whiteboard", "ideas", "workshop"] },
      { prefix: "coffee-break-recharge", title: "Espresso Coffee Break & Recharge", tags: ["coffee", "break", "chill", "coworking", "wellness"] },
      { prefix: "job-interview", title: "Talent Acquisition & Job Interview", tags: ["interview", "hiring", "talent", "hr", "resume", "career"] },
      { prefix: "presentation-speech", title: "Keynote Presentation & Public Speech", tags: ["keynote", "speech", "presentation", "audience", "talk"] },
      { prefix: "customer-success", title: "Delightful Customer Support Help", tags: ["customer success", "support", "helpdesk", "chat", "service"] },
      { prefix: "task-checklist", title: "Deep Focus Daily Task Completion", tags: ["todo", "productivity", "focus", "habits", "time management"] },
      { prefix: "onboarding-guide", title: "New Employee Team Onboarding", tags: ["onboarding", "welcome", "team member", "orientation"] },
    ],
  },
  {
    name: "Finance & E-Commerce",
    themes: [
      { prefix: "contactless-pay", title: "NFC Mobile Contactless Payment", tags: ["nfc", "apple pay", "contactless", "pos", "card", "payment"] },
      { prefix: "shopping-cart-checkout", title: "Frictionless Online Store Checkout", tags: ["ecommerce", "shopping", "cart", "checkout", "store"] },
      { prefix: "crypto-wallet-vault", title: "DeFi Crypto Hardware Wallet", tags: ["crypto", "bitcoin", "ethereum", "web3", "defi", "wallet"] },
      { prefix: "discount-coupon-promo", title: "Black Friday Discount & Promo Deal", tags: ["discount", "coupon", "promo", "sale", "voucher", "deal"] },
      { prefix: "investment-portfolio", title: "High-Yield Investment Portfolio", tags: ["investing", "stocks", "etf", "compound interest", "wealth"] },
      { prefix: "invoice-billing", title: "Automated Recurring SaaS Invoicing", tags: ["invoice", "billing", "stripe", "receipt", "accounting"] },
      { prefix: "global-logistics-truck", title: "Express Package Delivery & Logistics", tags: ["delivery", "shipping", "logistics", "package", "tracking"] },
      { prefix: "currency-exchange", title: "Multi-Currency Forex Conversion", tags: ["forex", "exchange", "currency", "usd", "eur", "trade"] },
      { prefix: "loyalty-rewards", title: "VIP Customer Loyalty Reward Points", tags: ["loyalty", "rewards", "points", "cashback", "vip"] },
      { prefix: "pos-terminal-store", title: "Retail Smart Point of Sale (POS)", tags: ["pos", "retail", "storefront", "merchant", "checkout"] },
    ],
  },
  {
    name: "Marketing & Growth",
    themes: [
      { prefix: "social-media-campaign", title: "Viral Social Media Growth Campaign", tags: ["social media", "instagram", "tiktok", "viral", "growth"] },
      { prefix: "seo-search-ranking", title: "Organic SEO Search Engine Rank #1", tags: ["seo", "google", "search", "ranking", "keywords", "serp"] },
      { prefix: "newsletter-broadcast", title: "Weekly Email Newsletter Broadcast", tags: ["email", "newsletter", "subscribers", "open rate", "broadcast"] },
      { prefix: "influencer-partnership", title: "Brand Influencer Sponsorship", tags: ["influencer", "sponsorship", "creator", "collab", "reach"] },
      { prefix: "megaphone-announcement", title: "Grand Product Launch Announcement", tags: ["megaphone", "broadcast", "press release", "news", "shout"] },
      { prefix: "ad-retargeting-pixel", title: "Targeted Ad Retargeting Pixel", tags: ["ads", "facebook ads", "google ads", "retargeting", "cpc"] },
      { prefix: "referral-invite", title: "Viral User Referral & Invite Loop", tags: ["referral", "invite", "word of mouth", "k-factor", "growth"] },
      { prefix: "content-creator-studio", title: "Digital Content Studio Production", tags: ["content", "podcast", "youtube", "studio", "creator"] },
      { prefix: "growth-flywheel", title: "Compound Product Growth Flywheel", tags: ["flywheel", "growth loop", "product led", "saas growth"] },
      { prefix: "brand-ambassador", title: "Community Brand Ambassador Guild", tags: ["ambassador", "community", "advocates", "guild", "fans"] },
    ],
  },
  {
    name: "Science & Education",
    themes: [
      { prefix: "online-course-degree", title: "Interactive Online University Course", tags: ["education", "course", "learning", "study", "degree"] },
      { prefix: "laboratory-chemistry", title: "Biotech Chemistry Lab Research", tags: ["science", "chemistry", "microscope", "research", "lab"] },
      { prefix: "astronomy-telescope", title: "Deep Space Telescope Exploration", tags: ["astronomy", "space", "stars", "telescope", "cosmos"] },
      { prefix: "library-book-archive", title: "Academic Knowledge Book Archive", tags: ["books", "library", "reading", "literature", "knowledge"] },
      { prefix: "quantum-physics", title: "Quantum Particle Physics Collider", tags: ["physics", "quantum", "atoms", "particles", "energy"] },
      { prefix: "stem-coding-camp", title: "STEM Youth Coding & Robotics Camp", tags: ["stem", "robotics", "kids coding", "hardware", "makers"] },
      { prefix: "medical-biotech", title: "Precision Medical Biotech Gene Lab", tags: ["medicine", "biotech", "dna", "genetics", "health tech"] },
      { prefix: "webinar-masterclass", title: "Live Expert Webinar Masterclass", tags: ["webinar", "masterclass", "lecture", "tutorial", "workshop"] },
    ],
  },
  {
    name: "Lifestyle & Wellness",
    themes: [
      { prefix: "yoga-meditation-zen", title: "Mindfulness Yoga & Zen Meditation", tags: ["yoga", "meditation", "mindfulness", "zen", "wellness"] },
      { prefix: "nature-trail-hike", title: "Mountain Wilderness Trail Hiking", tags: ["hiking", "mountains", "nature", "outdoor", "adventure"] },
      { prefix: "urban-cycling-eco", title: "Urban Eco-Friendly Bicycle Commute", tags: ["bicycle", "cycling", "eco", "green", "commute"] },
      { prefix: "music-headphones-flow", title: "Deep Focus Ambient Lo-Fi Beats", tags: ["music", "headphones", "sound", "beats", "focus"] },
      { prefix: "coffee-roastery-brew", title: "Artisanal Pour-Over Coffee Brewing", tags: ["coffee", "pour over", "barista", "brewing", "roastery"] },
      { prefix: "gaming-esports-arena", title: "Pro Esports Battle Arena Gaming", tags: ["gaming", "esports", "controller", "pc gaming", "streamer"] },
      { prefix: "pet-cat-companion", title: "Feline Pet Cuddle & Play Time", tags: ["cat", "pet", "animals", "companion", "home"] },
      { prefix: "healthy-plant-nutrition", title: "Organic Green Plant-Based Meal", tags: ["healthy", "nutrition", "salad", "diet", "green food"] },
    ],
  },
];

// Stylistic Variations per theme to reach 1000+ entries
const VARIATIONS = [
  { suffix: "pro", label: "Pro Edition", style: "desktop-analytics" },
  { suffix: "mobile", label: "Mobile View", style: "mobile-app" },
  { suffix: "team", label: "Team Dynamic", style: "team-collab" },
  { suffix: "minimal", label: "Minimalist Outline", style: "minimal-concept" },
  { suffix: "isometric", label: "Isometric Architecture", style: "isometric-grid" },
  { suffix: "dashboard", label: "Dashboard Cards", style: "floating-cards" },
  { suffix: "character", label: "Character Focus", style: "character-scene" },
  { suffix: "cloud-sync", label: "Cloud Sync Engine", style: "cloud-nodes" },
  { suffix: "night-mode", label: "Dark Surface Contrast", style: "dark-futuristic" },
  { suffix: "creative-flow", label: "Creative Flow Concept", style: "flow-diagram" },
  { suffix: "analytics-kpi", label: "Analytics Metric Insight", style: "metric-charts" },
];

console.log("Generating 1,000+ Illustration Items...");

const allIllustrations = [];

CATEGORIES.forEach((cat) => {
  cat.themes.forEach((theme) => {
    VARIATIONS.forEach((v, vIndex) => {
      const id = `ill-${theme.prefix}-${v.suffix}`;
      const title = `${theme.title} (${v.label})`;
      const tags = Array.from(new Set([...theme.tags, v.suffix, v.style, cat.name.toLowerCase()]));

      allIllustrations.push({
        id,
        title,
        category: cat.name,
        tags,
        style: v.style,
        seed: (vIndex * 37 + theme.prefix.length * 19) % 100,
      });
    });
  });
});

console.log(`Total generated illustration blueprints: ${allIllustrations.length}`);
