export interface PeepOption {
  id: string;
  name: string;
  category: "expression" | "hair" | "accessory" | "body";
  svgPath: string; // SVG inner XML string
}

export interface PeepConfig {
  headExpression: string;
  hairStyle: string;
  accessory: string;
  bodyPose: string;
  skinColor: string;
  hairColor: string;
  clothingColor: string;
  accessoryColor: string;
  backgroundColor: string;
  flipHorizontal: boolean;
  scale: number;
}

// ─── 1. HEAD EXPRESSIONS ───
export const EXPRESSIONS: { id: string; name: string; path: string }[] = [
  {
    id: "smile",
    name: "Classic Smile",
    path: `
      <!-- Head Contour -->
      <path d="M70,80 C70,120 130,120 130,80 C130,45 70,45 70,80 Z" fill="var(--skin-color)" stroke="#111" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Eyes -->
      <circle cx="88" cy="74" r="3.5" fill="#111" />
      <circle cx="112" cy="74" r="3.5" fill="#111" />
      <!-- Eyebrows -->
      <path d="M82,66 C86,63 92,64 94,66" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M106,66 C108,64 114,63 118,66" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <!-- Nose -->
      <path d="M100,74 C102,80 98,83 100,84" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <!-- Smile Mouth -->
      <path d="M88,92 C94,100 106,100 112,92" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
    `,
  },
  {
    id: "laugh",
    name: "Joyful Laugh",
    path: `
      <path d="M70,80 C70,120 130,120 130,80 C130,45 70,45 70,80 Z" fill="var(--skin-color)" stroke="#111" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Laugh Eyes (Arched) -->
      <path d="M84,74 C87,70 93,70 96,74" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M104,74 C107,70 113,70 116,74" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <!-- Eyebrows -->
      <path d="M82,64 C86,61 92,62 94,64" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M106,64 C108,62 114,61 118,64" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <!-- Nose -->
      <path d="M100,74 C102,79 98,82 100,83" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <!-- Open Laugh Mouth -->
      <path d="M86,90 C86,104 114,104 114,90 Z" fill="#b91c1c" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M90,92 C96,96 104,96 110,92" fill="#fff" stroke="#111" stroke-width="1.5" />
    `,
  },
  {
    id: "confident",
    name: "Confident Smirk",
    path: `
      <path d="M70,80 C70,120 130,120 130,80 C130,45 70,45 70,80 Z" fill="var(--skin-color)" stroke="#111" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Knowing Eyes -->
      <path d="M84,74 L94,74" stroke="#111" stroke-width="3" stroke-linecap="round" />
      <circle cx="89" cy="76" r="2.5" fill="#111" />
      <circle cx="111" cy="74" r="3.5" fill="#111" />
      <!-- Confident Eyebrow -->
      <path d="M82,66 L94,63" stroke="#111" stroke-width="3" stroke-linecap="round" />
      <path d="M106,66 C109,64 115,64 118,67" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <!-- Nose -->
      <path d="M100,74 C102,80 97,83 100,84" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <!-- Asymmetrical Smirk -->
      <path d="M90,94 C96,93 106,96 114,90" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
    `,
  },
  {
    id: "chill",
    name: "Chill & Relaxed",
    path: `
      <path d="M70,80 C70,120 130,120 130,80 C130,45 70,45 70,80 Z" fill="var(--skin-color)" stroke="#111" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Chill Eyes -->
      <path d="M84,75 C88,78 92,78 96,75" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M104,75 C108,78 112,78 116,75" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <!-- Soft Eyebrows -->
      <path d="M84,67 C88,66 93,66 96,68" stroke="#111" stroke-width="2" stroke-linecap="round" fill="none" />
      <path d="M104,68 C107,66 112,66 116,67" stroke="#111" stroke-width="2" stroke-linecap="round" fill="none" />
      <!-- Nose -->
      <circle cx="100" cy="81" r="1.5" fill="#111" />
      <!-- Soft Smile -->
      <path d="M92,93 C97,96 103,96 108,93" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
    `,
  },
  {
    id: "wink",
    name: "Playful Wink",
    path: `
      <path d="M70,80 C70,120 130,120 130,80 C130,45 70,45 70,80 Z" fill="var(--skin-color)" stroke="#111" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
      <!-- One Open Eye, One Wink -->
      <circle cx="88" cy="74" r="3.5" fill="#111" />
      <path d="M106,75 L116,72 L116,76" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <!-- Eyebrows -->
      <path d="M82,65 C86,63 92,64 94,66" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M106,64 L118,68" stroke="#111" stroke-width="3" stroke-linecap="round" />
      <!-- Nose -->
      <path d="M100,74 C102,80 98,83 100,84" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <!-- Playful Smile -->
      <path d="M88,92 C94,99 106,99 112,91" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
    `,
  },
  {
    id: "puzzled",
    name: "Curious / Puzzled",
    path: `
      <path d="M70,80 C70,120 130,120 130,80 C130,45 70,45 70,80 Z" fill="var(--skin-color)" stroke="#111" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Wide Wondering Eyes -->
      <circle cx="87" cy="73" r="4" fill="#111" />
      <circle cx="113" cy="75" r="3" fill="#111" />
      <!-- One High Eyebrow, One Low -->
      <path d="M82,60 C87,58 93,60 95,64" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M106,68 C110,69 115,69 118,68" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <!-- Nose -->
      <path d="M100,74 C103,80 97,83 100,84" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <!-- Wavy Mouth -->
      <path d="M90,94 C94,92 98,96 104,93 C108,91 112,93 112,94" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
    `,
  },
  {
    id: "serious",
    name: "Focused & Serious",
    path: `
      <path d="M70,80 C70,120 130,120 130,80 C130,45 70,45 70,80 Z" fill="var(--skin-color)" stroke="#111" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Focused Eyes -->
      <circle cx="88" cy="75" r="3.5" fill="#111" />
      <circle cx="112" cy="75" r="3.5" fill="#111" />
      <!-- Slanted Serious Eyebrows -->
      <path d="M82,68 L94,70" stroke="#111" stroke-width="3" stroke-linecap="round" />
      <path d="M106,70 L118,68" stroke="#111" stroke-width="3" stroke-linecap="round" />
      <!-- Nose -->
      <path d="M100,74 C102,80 98,83 100,84" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <!-- Straight Flat Mouth -->
      <path d="M90,94 L110,94" stroke="#111" stroke-width="3" stroke-linecap="round" />
    `,
  },
];

// ─── 2. HAIR & HEADWEAR ───
export const HAIR_STYLES: { id: string; name: string; path: string }[] = [
  {
    id: "short_clean",
    name: "Short Clean Cut",
    path: `
      <path d="M66,74 C64,48 80,30 100,30 C120,30 136,48 134,74 C130,62 120,54 100,54 C80,54 70,62 66,74 Z" fill="var(--hair-color)" stroke="#111" stroke-width="3.5" stroke-linejoin="round" />
    `,
  },
  {
    id: "afro",
    name: "Voluminous Afro",
    path: `
      <path d="M52,78 C40,40 70,12 100,12 C130,12 160,40 148,78 C154,95 142,110 132,106 C136,80 130,58 100,58 C70,58 64,80 68,106 C58,110 46,95 52,78 Z" fill="var(--hair-color)" stroke="#111" stroke-width="3.5" stroke-linejoin="round" />
    `,
  },
  {
    id: "curly",
    name: "Curly Waves",
    path: `
      <path d="M64,76 C58,55 68,36 84,32 C92,25 108,25 116,32 C132,36 142,55 136,76 C130,62 120,52 100,52 C80,52 70,62 64,76 Z" fill="var(--hair-color)" stroke="#111" stroke-width="3.5" stroke-linejoin="round" />
      <path d="M72,46 C76,40 82,42 84,48" stroke="#111" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <path d="M116,48 C118,42 124,40 128,46" stroke="#111" stroke-width="2.5" fill="none" stroke-linecap="round" />
    `,
  },
  {
    id: "bun",
    name: "Top Knot Bun",
    path: `
      <!-- Bun on Top -->
      <circle cx="100" cy="20" r="16" fill="var(--hair-color)" stroke="#111" stroke-width="3.5" />
      <!-- Base Head Hair -->
      <path d="M66,74 C64,48 80,32 100,32 C120,32 136,48 134,74 C130,60 120,52 100,52 C80,52 70,60 66,74 Z" fill="var(--hair-color)" stroke="#111" stroke-width="3.5" stroke-linejoin="round" />
    `,
  },
  {
    id: "long_straight",
    name: "Long Flowing Hair",
    path: `
      <path d="M64,75 C60,40 80,30 100,30 C120,30 140,40 136,75 C142,110 145,145 138,155 C132,130 130,80 126,60 C118,52 82,52 74,60 C70,80 68,130 62,155 C55,145 58,110 64,75 Z" fill="var(--hair-color)" stroke="#111" stroke-width="3.5" stroke-linejoin="round" />
    `,
  },
  {
    id: "mohawk",
    name: "Punk Mohawk",
    path: `
      <path d="M92,54 L88,24 L100,12 L112,24 L108,54 Z" fill="var(--hair-color)" stroke="#111" stroke-width="3.5" stroke-linejoin="round" />
      <path d="M68,76 C66,66 70,58 74,58 C78,58 80,68 80,76 Z" fill="var(--hair-color)" opacity="0.3" />
      <path d="M120,76 C120,68 122,58 126,58 C130,58 134,66 132,76 Z" fill="var(--hair-color)" opacity="0.3" />
    `,
  },
  {
    id: "beanie",
    name: "Winter Beanie",
    path: `
      <path d="M62,64 C60,34 76,20 100,20 C124,20 140,34 138,64 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="3.5" stroke-linejoin="round" />
      <!-- Beanie Fold -->
      <rect x="58" y="56" width="84" height="14" rx="7" fill="var(--clothing-color)" stroke="#111" stroke-width="3.5" />
      <line x1="100" y1="20" x2="100" y2="34" stroke="#111" stroke-width="2" opacity="0.4" />
    `,
  },
  {
    id: "cap_forward",
    name: "Baseball Cap",
    path: `
      <path d="M66,66 C64,40 80,28 100,28 C120,28 136,40 134,66 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="3.5" stroke-linejoin="round" />
      <!-- Cap Visor -->
      <path d="M60,64 C80,60 120,60 148,68 C130,72 80,72 60,64 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="3.5" stroke-linejoin="round" />
    `,
  },
  {
    id: "bald",
    name: "Clean Shaved / Bald",
    path: `
      <!-- No hair overlay, head base shines -->
      <path d="M80,48 C85,44 95,44 100,45" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.6" fill="none" />
    `,
  },
];

// ─── 3. ACCESSORIES & FACIAL DETAILS ───
export const ACCESSORIES: { id: string; name: string; path: string }[] = [
  {
    id: "none",
    name: "None",
    path: ``,
  },
  {
    id: "glasses_round",
    name: "Round Wire Glasses",
    path: `
      <circle cx="88" cy="74" r="10" fill="rgba(255,255,255,0.2)" stroke="#111" stroke-width="3" />
      <circle cx="112" cy="74" r="10" fill="rgba(255,255,255,0.2)" stroke="#111" stroke-width="3" />
      <line x1="98" y1="74" x2="102" y2="74" stroke="#111" stroke-width="3" />
      <line x1="78" y1="74" x2="70" y2="72" stroke="#111" stroke-width="2.5" />
      <line x1="122" y1="74" x2="130" y2="72" stroke="#111" stroke-width="2.5" />
    `,
  },
  {
    id: "glasses_sun",
    name: "Dark Sunglasses",
    path: `
      <path d="M76,68 L98,68 L96,82 C96,85 92,87 88,87 C80,87 76,82 76,78 Z" fill="#18181b" stroke="#111" stroke-width="3" />
      <path d="M102,68 L124,68 L124,78 C124,82 120,87 112,87 C108,87 104,85 104,82 Z" fill="#18181b" stroke="#111" stroke-width="3" />
      <line x1="98" y1="70" x2="102" y2="70" stroke="#111" stroke-width="3" />
      <!-- Glare highlight -->
      <line x1="80" y1="72" x2="88" y2="80" stroke="#fff" stroke-width="1.5" opacity="0.7" />
      <line x1="106" y1="72" x2="114" y2="80" stroke="#fff" stroke-width="1.5" opacity="0.7" />
    `,
  },
  {
    id: "mustache",
    name: "Classic Mustache",
    path: `
      <path d="M88,88 C94,84 99,88 100,89 C101,88 106,84 112,88 C115,92 108,95 100,92 C92,95 85,92 88,88 Z" fill="var(--hair-color)" stroke="#111" stroke-width="2.5" stroke-linejoin="round" />
    `,
  },
  {
    id: "beard_full",
    name: "Full Beard",
    path: `
      <path d="M72,84 C70,118 84,136 100,136 C116,136 130,118 128,84 C124,96 116,104 100,104 C84,104 76,96 72,84 Z" fill="var(--hair-color)" stroke="#111" stroke-width="3.5" stroke-linejoin="round" />
    `,
  },
  {
    id: "eyepatch",
    name: "Pirate Eyepatch",
    path: `
      <line x1="68" y1="62" x2="132" y2="84" stroke="#111" stroke-width="2.5" />
      <circle cx="88" cy="74" r="9" fill="#18181b" stroke="#111" stroke-width="3" />
    `,
  },
];

// ─── 4. BODY POSES & CLOTHING ───
export const BODIES: { id: string; name: string; path: string }[] = [
  {
    id: "tshirt",
    name: "Classic Crewneck Tee",
    path: `
      <!-- Neck -->
      <path d="M88,110 L88,124 C88,128 112,128 112,124 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="3.5" />
      <!-- Torso & Shoulders -->
      <path d="M50,140 C56,126 78,124 88,124 C94,130 106,130 112,124 C122,124 144,126 150,140 L156,200 L44,200 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="3.5" stroke-linejoin="round" />
      <!-- Collar -->
      <path d="M88,124 C94,130 106,130 112,124" stroke="#111" stroke-width="3" fill="none" />
    `,
  },
  {
    id: "hoodie",
    name: "Streetwear Hoodie",
    path: `
      <!-- Neck -->
      <path d="M88,110 L88,122 L112,122 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="3.5" />
      <!-- Hoodie Shape with Big Hood Ring -->
      <path d="M46,140 C52,122 74,118 84,118 C80,126 82,136 100,136 C118,136 120,126 116,118 C126,118 148,122 154,140 L158,200 L42,200 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="3.5" stroke-linejoin="round" />
      <!-- Drawstrings -->
      <line x1="92" y1="136" x2="90" y2="158" stroke="#111" stroke-width="2.5" stroke-linecap="round" />
      <line x1="108" y1="136" x2="110" y2="158" stroke="#111" stroke-width="2.5" stroke-linecap="round" />
      <!-- Pocket pouch outline -->
      <path d="M70,175 L130,175 L124,195 L76,195 Z" fill="none" stroke="#111" stroke-width="2.5" />
    `,
  },
  {
    id: "blazer",
    name: "Smart Casual Blazer",
    path: `
      <!-- Shirt Underneath -->
      <path d="M88,110 L88,124 L112,124 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="3.5" />
      <polygon points="88,124 100,150 112,124" fill="#ffffff" stroke="#111" stroke-width="2.5" />
      <!-- Blazer Jacket -->
      <path d="M48,138 C56,124 76,122 88,122 L100,165 L112,122 C124,122 144,124 152,138 L156,200 L44,200 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="3.5" stroke-linejoin="round" />
      <!-- Lapels -->
      <path d="M88,122 L98,155 L78,136" stroke="#111" stroke-width="2.5" fill="none" />
      <path d="M112,122 L102,155 L122,136" stroke="#111" stroke-width="2.5" fill="none" />
    `,
  },
  {
    id: "pose_coffee",
    name: "Holding Coffee Mug",
    path: `
      <!-- Neck & Torso -->
      <path d="M88,110 L88,124 C88,128 112,128 112,124 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="3.5" />
      <path d="M50,140 C56,126 78,124 88,124 C94,130 106,130 112,124 C122,124 144,126 150,140 L156,200 L44,200 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="3.5" stroke-linejoin="round" />
      <!-- Hand holding coffee -->
      <path d="M130,160 C136,155 142,165 138,175" stroke="#111" stroke-width="3" fill="var(--skin-color)" />
      <!-- Coffee Mug -->
      <rect x="134" y="152" width="22" height="24" rx="4" fill="#61c5ad" stroke="#111" stroke-width="3" />
      <path d="M156,158 C162,158 162,168 156,168" stroke="#111" stroke-width="2.5" fill="none" />
      <!-- Steam -->
      <path d="M140,146 C140,140 144,138 144,134" stroke="#111" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6" />
      <path d="M148,146 C148,140 152,138 152,134" stroke="#111" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6" />
    `,
  },
  {
    id: "pose_peace",
    name: "Peace Sign Gesture",
    path: `
      <!-- Neck & Torso -->
      <path d="M88,110 L88,124 C88,128 112,128 112,124 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="3.5" />
      <path d="M50,140 C56,126 78,124 88,124 C94,130 106,130 112,124 C122,124 144,126 150,140 L156,200 L44,200 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="3.5" stroke-linejoin="round" />
      <!-- Arm raised & Peace fingers -->
      <path d="M140,150 L146,125" stroke="#111" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Hand & 2 fingers -->
      <path d="M142,122 L140,105 M147,122 L151,107" stroke="#111" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="145" cy="122" r="5" fill="var(--skin-color)" stroke="#111" stroke-width="2.5" />
    `,
  },
];

// ─── 5. COLOR PALETTES ───
export const SKIN_TONES = [
  { label: "Fair", value: "#fde2d2" },
  { label: "Peach", value: "#fed5be" },
  { label: "Warm Tan", value: "#e4b590" },
  { label: "Bronze", value: "#bf8658" },
  { label: "Rich Dark", value: "#7c4b2a" },
  { label: "Deep Umber", value: "#4d2912" },
  { label: "Alien Mint", value: "#86efac" },
  { label: "Cyber Neon", value: "#f472b6" },
];

export const HAIR_COLORS = [
  { label: "Jet Black", value: "#18181b" },
  { label: "Dark Brown", value: "#3f2e27" },
  { label: "Golden Blonde", value: "#e6be8a" },
  { label: "Ginger", value: "#b94723" },
  { label: "Silver Grey", value: "#94a3b8" },
  { label: "Electric Mint", value: "#61c5ad" },
  { label: "Royal Purple", value: "#a855f7" },
];

export const CLOTHING_COLORS = [
  { label: "RVAN Mint", value: "#61c5ad" },
  { label: "Dark Slate", value: "#1e293b" },
  { label: "Charcoal", value: "#27272a" },
  { label: "Pure White", value: "#ffffff" },
  { label: "Ocean Blue", value: "#3b82f6" },
  { label: "Royal Violet", value: "#8b5cf6" },
  { label: "Crimson Red", value: "#ef4444" },
  { label: "Warm Amber", value: "#f59e0b" },
];

export const BACKGROUND_PRESETS = [
  { id: "transparent", label: "Transparent", value: "transparent" },
  { id: "dark_glass", label: "Dark Glass", value: "#111114" },
  { id: "mint_glow", label: "Mint Glow", value: "radial-gradient(circle at 50% 50%, rgba(97,197,173,0.25) 0%, #09090b 75%)" },
  { id: "purple_glow", label: "Purple Glow", value: "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.25) 0%, #09090b 75%)" },
  { id: "blue_glow", label: "Blue Glow", value: "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.25) 0%, #09090b 75%)" },
  { id: "solid_mint", label: "Solid Mint", value: "#61c5ad" },
  { id: "solid_white", label: "Clean White", value: "#ffffff" },
];

/**
 * Builds the complete standalone SVG markup string for a Peep character.
 */
export function buildPeepSvg(config: PeepConfig, size: number = 400): string {
  const expression = EXPRESSIONS.find((e) => e.id === config.headExpression) || EXPRESSIONS[0];
  const hair = HAIR_STYLES.find((h) => h.id === config.hairStyle) || HAIR_STYLES[0];
  const accessory = ACCESSORIES.find((a) => a.id === config.accessory) || ACCESSORIES[0];
  const body = BODIES.find((b) => b.id === config.bodyPose) || BODIES[0];

  const transform = `scale(${config.scale || 1}) ${config.flipHorizontal ? "scale(-1, 1) translate(-200, 0)" : ""}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}" style="background: ${config.backgroundColor}; border-radius: 24px;">
  <style>
    :root {
      --skin-color: ${config.skinColor};
      --hair-color: ${config.hairColor};
      --clothing-color: ${config.clothingColor};
    }
  </style>
  <g transform="${transform}">
    <!-- 1. Body & Pose -->
    <g id="peep-body">
      ${body.path}
    </g>

    <!-- 2. Head & Expression -->
    <g id="peep-head">
      ${expression.path}
    </g>

    <!-- 3. Hair & Headwear -->
    <g id="peep-hair">
      ${hair.path}
    </g>

    <!-- 4. Facial Accessories -->
    <g id="peep-accessory">
      ${accessory.path}
    </g>
  </g>
</svg>`;
}

/**
 * Generates a completely randomized character configuration.
 */
export function generateRandomPeep(): PeepConfig {
  const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  return {
    headExpression: randomItem(EXPRESSIONS).id,
    hairStyle: randomItem(HAIR_STYLES).id,
    accessory: Math.random() > 0.4 ? randomItem(ACCESSORIES).id : "none",
    bodyPose: randomItem(BODIES).id,
    skinColor: randomItem(SKIN_TONES).value,
    hairColor: randomItem(HAIR_COLORS).value,
    clothingColor: randomItem(CLOTHING_COLORS).value,
    accessoryColor: "#111111",
    backgroundColor: "transparent",
    flipHorizontal: Math.random() > 0.7,
    scale: 1,
  };
}

export const DEFAULT_PEEP_CONFIG: PeepConfig = {
  headExpression: "smile",
  hairStyle: "short_clean",
  accessory: "none",
  bodyPose: "tshirt",
  skinColor: "#fde2d2",
  hairColor: "#18181b",
  clothingColor: "#61c5ad",
  accessoryColor: "#111111",
  backgroundColor: "transparent",
  flipHorizontal: false,
  scale: 1,
};
