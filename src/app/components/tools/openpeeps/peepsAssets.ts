export interface PeepConfig {
  mode: "bust" | "standing" | "sitting";
  headExpression: string;
  hairStyle: string;
  accessory: string;
  bodyPose: string;
  skinColor: string;
  hairColor: string;
  clothingColor: string;
  backgroundColor: string;
  inkStyle: "bw" | "color";
  flipHorizontal: boolean;
  scale: number;
}

export interface PremadePeep {
  id: string;
  name: string;
  category: "busts" | "standing" | "sitting";
  config: PeepConfig;
}

// ─── 1. EXPRESSIVE FACIAL PATHS (Pablo Stanley Style) ───
export const EXPRESSIONS = [
  {
    id: "knife_intense",
    name: "Intense / Knife Wielder",
    svg: `
      <path d="M68,76 C65,118 135,118 132,76 C130,42 70,42 68,76 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M82,72 L94,76" stroke="#111" stroke-width="4" stroke-linecap="round" />
      <circle cx="88" cy="78" r="3.5" fill="#111" />
      <path d="M118,72 L106,76" stroke="#111" stroke-width="4" stroke-linecap="round" />
      <circle cx="112" cy="78" r="3.5" fill="#111" />
      <path d="M80,64 L96,70" stroke="#111" stroke-width="4" stroke-linecap="round" />
      <path d="M120,64 L104,70" stroke="#111" stroke-width="4" stroke-linecap="round" />
      <path d="M100,74 L104,84 L98,86" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M88,96 L112,96" stroke="#111" stroke-width="4" stroke-linecap="round" />
      <line x1="94" y1="93" x2="94" y2="99" stroke="#111" stroke-width="2" />
      <line x1="100" y1="93" x2="100" y2="99" stroke="#111" stroke-width="2" />
      <line x1="106" y1="93" x2="106" y2="99" stroke="#111" stroke-width="2" />
    `,
  },
  {
    id: "three_eyed",
    name: "Three-Eyed Alien",
    svg: `
      <path d="M68,76 C65,118 135,118 132,76 C130,42 70,42 68,76 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="86" cy="76" r="4" fill="#111" />
      <circle cx="114" cy="76" r="4" fill="#111" />
      <circle cx="100" cy="58" r="5" fill="#fff" stroke="#111" stroke-width="3" />
      <circle cx="100" cy="58" r="2.5" fill="#111" />
      <path d="M80,66 C86,63 92,65 94,67" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M106,67 C108,65 114,63 120,66" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M100,74 C103,80 97,84 100,86" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M88,96 C94,92 100,100 106,94 C110,92 114,96 114,96" stroke="#111" stroke-width="3.5" stroke-linecap="round" fill="none" />
    `,
  },
  {
    id: "pattern_sweater_smirk",
    name: "Confident Smirk",
    svg: `
      <path d="M68,76 C65,118 135,118 132,76 C130,42 70,42 68,76 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="88" cy="74" r="3.5" fill="#111" />
      <circle cx="112" cy="74" r="3.5" fill="#111" />
      <path d="M82,64 L94,62" stroke="#111" stroke-width="3.5" stroke-linecap="round" />
      <path d="M106,66 C110,64 116,65 118,68" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M100,74 C102,80 98,84 100,85" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M90,95 C98,95 106,98 114,90" stroke="#111" stroke-width="3.5" stroke-linecap="round" fill="none" />
    `,
  },
  {
    id: "joyful_laugh",
    name: "Joyful Big Laugh",
    svg: `
      <path d="M68,76 C65,118 135,118 132,76 C130,42 70,42 68,76 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M82,74 C86,68 92,68 96,74" stroke="#111" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M104,74 C108,68 114,68 118,74" stroke="#111" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M80,64 C86,60 92,61 94,64" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M106,64 C108,61 114,60 120,64" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M100,74 C102,79 98,82 100,84" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M84,90 C84,106 116,106 116,90 Z" fill="#b91c1c" stroke="#111" stroke-width="3.5" stroke-linejoin="round" />
      <path d="M88,92 C96,96 104,96 112,92" fill="#fff" stroke="#111" stroke-width="2" />
    `,
  },
  {
    id: "chill_beard_smile",
    name: "Chill & Relaxed",
    svg: `
      <path d="M68,76 C65,118 135,118 132,76 C130,42 70,42 68,76 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M82,75 C86,78 92,78 96,75" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M104,75 C108,78 114,78 118,75" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M82,66 C86,64 92,65 94,67" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M106,67 C108,65 114,64 118,66" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <circle cx="100" cy="82" r="2" fill="#111" />
      <path d="M90,94 C96,98 104,98 110,94" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
    `,
  },
  {
    id: "skeptical_pout",
    name: "Skeptical / Curious",
    svg: `
      <path d="M68,76 C65,118 135,118 132,76 C130,42 70,42 68,76 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="86" cy="74" r="4.5" fill="#111" />
      <line x1="106" y1="74" x2="118" y2="74" stroke="#111" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="112" cy="76" r="2.5" fill="#111" />
      <path d="M80,58 C86,56 94,58 96,62" stroke="#111" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M106,68 L118,70" stroke="#111" stroke-width="3" stroke-linecap="round" />
      <path d="M100,74 C103,80 97,84 100,85" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M88,96 C94,94 102,98 112,93" stroke="#111" stroke-width="3.5" stroke-linecap="round" fill="none" />
    `,
  },
  {
    id: "big_smile",
    name: "Big Happy Smile 😊",
    svg: `
      <path d="M68,76 C65,118 135,118 132,76 C130,42 70,42 68,76 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="86" cy="74" r="4" fill="#111" />
      <circle cx="114" cy="74" r="4" fill="#111" />
      <circle cx="86" cy="72" r="1.5" fill="#fff" />
      <circle cx="114" cy="72" r="1.5" fill="#fff" />
      <path d="M82,66 C86,62 92,63 94,66" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M106,66 C108,63 114,62 118,66" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M100,76 C102,80 98,82 100,84" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M84,92 C90,102 110,102 116,92" stroke="#111" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M86,93 C92,99 108,99 114,93" fill="#b91c1c" />
    `,
  },
  {
    id: "wink_tongue",
    name: "Playful Wink 😜",
    svg: `
      <path d="M68,76 C65,118 135,118 132,76 C130,42 70,42 68,76 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="86" cy="74" r="4" fill="#111" />
      <path d="M106,74 C110,70 118,74" stroke="#111" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M82,66 C86,62 92,63 94,66" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M100,76 C102,80 98,82 100,84" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M88,92 C96,100 104,100 112,92" stroke="#111" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M100,102 C102,108 98,112 96,108" fill="#e74c4c" stroke="#111" stroke-width="2" />
    `,
  },
  {
    id: "cute_blush",
    name: "Cute Blushing 🥰",
    svg: `
      <path d="M68,76 C65,118 135,118 132,76 C130,42 70,42 68,76 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="86" cy="74" r="3" fill="#111" />
      <circle cx="114" cy="74" r="3" fill="#111" />
      <circle cx="86" cy="72" r="1.2" fill="#fff" />
      <circle cx="114" cy="72" r="1.2" fill="#fff" />
      <ellipse cx="78" cy="86" rx="8" ry="4" fill="#f5a0a0" opacity="0.5" />
      <ellipse cx="122" cy="86" rx="8" ry="4" fill="#f5a0a0" opacity="0.5" />
      <path d="M82,66 C86,63 92,64 94,66" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M106,66 C108,64 114,63 118,66" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M100,76 C102,79 98,82 100,83" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M92,94 C96,100 104,100 108,94" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
    `,
  },
  {
    id: "surprised_wow",
    name: "Surprised Wow 😮",
    svg: `
      <path d="M68,76 C65,118 135,118 132,76 C130,42 70,42 68,76 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="86" cy="72" r="6" fill="#fff" stroke="#111" stroke-width="3" />
      <circle cx="86" cy="72" r="3" fill="#111" />
      <circle cx="114" cy="72" r="6" fill="#fff" stroke="#111" stroke-width="3" />
      <circle cx="114" cy="72" r="3" fill="#111" />
      <path d="M80,60 C86,54 92,56 96,60" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M104,60 C108,56 114,54 120,60" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <ellipse cx="100" cy="96" rx="8" ry="10" fill="#b91c1c" stroke="#111" stroke-width="3" />
    `,
  },
  {
    id: "cool_sunglasses",
    name: "Cool & Confident 😎",
    svg: `
      <path d="M68,76 C65,118 135,118 132,76 C130,42 70,42 68,76 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <rect x="76" y="66" width="22" height="16" rx="4" fill="#111" stroke="#111" stroke-width="2" />
      <rect x="102" y="66" width="22" height="16" rx="4" fill="#111" stroke="#111" stroke-width="2" />
      <line x1="98" y1="72" x2="102" y2="72" stroke="#111" stroke-width="3" />
      <line x1="76" y1="72" x2="72" y2="68" stroke="#111" stroke-width="2.5" stroke-linecap="round" />
      <line x1="124" y1="72" x2="128" y2="68" stroke="#111" stroke-width="2.5" stroke-linecap="round" />
      <path d="M100,78 C102,82 98,84 100,86" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M90,96 C96,100 104,100 110,96" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
    `,
  },
  {
    id: "sleepy_zzz",
    name: "Sleepy & Tired 😴",
    svg: `
      <path d="M68,76 C65,118 135,118 132,76 C130,42 70,42 68,76 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M80,74 C86,72 92,72 96,74" stroke="#111" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M104,74 C110,72 116,72 120,74" stroke="#111" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M100,78 C101,82 99,84 100,85" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M94,96 C98,98 102,98 106,96" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <text x="126" y="58" font-size="12" font-weight="bold" fill="#111">z</text>
      <text x="134" y="48" font-size="16" font-weight="bold" fill="#111">z</text>
      <text x="144" y="36" font-size="20" font-weight="bold" fill="#111">Z</text>
    `,
  },
  {
    id: "heart_eyes",
    name: "Heart Eyes 😍",
    svg: `
      <path d="M68,76 C65,118 135,118 132,76 C130,42 70,42 68,76 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M80,70 C80,64 86,62 88,66 C90,62 96,64 96,70 C96,76 88,82 88,82 C88,82 80,76 80,70 Z" fill="#e74c4c" stroke="#111" stroke-width="2" />
      <path d="M106,70 C106,64 112,62 114,66 C116,62 122,64 122,70 C122,76 114,82 114,82 C114,82 106,76 106,70 Z" fill="#e74c4c" stroke="#111" stroke-width="2" />
      <path d="M100,78 C102,82 98,84 100,86" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M86,94 C92,102 108,102 114,94" stroke="#111" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M88,95 C94,100 106,100 112,95" fill="#b91c1c" />
    `,
  },
  {
    id: "angry_grumpy",
    name: "Angry Grumpy 😠",
    svg: `
      <path d="M68,76 C65,118 135,118 132,76 C130,42 70,42 68,76 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="88" cy="76" r="3.5" fill="#111" />
      <circle cx="112" cy="76" r="3.5" fill="#111" />
      <path d="M78,62 L98,70" stroke="#111" stroke-width="4" stroke-linecap="round" />
      <path d="M122,62 L102,70" stroke="#111" stroke-width="4" stroke-linecap="round" />
      <path d="M100,76 L102,84 L98,86" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M88,98 L112,98" stroke="#111" stroke-width="4" stroke-linecap="round" />
    `,
  },
];

// ─── 2. DETAILED HAIR & HEADWEAR (Pablo Stanley Art) ───
export const HAIR_STYLES = [
  {
    id: "big_afro",
    name: "Voluminous Big Afro",
    svg: `
      <path d="M48,80 C32,35 68,8 100,8 C132,8 168,35 152,80 C160,105 145,120 134,112 C138,82 132,56 100,56 C68,56 62,82 66,112 C55,120 40,105 48,80 Z" fill="var(--hair-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <path d="M60,40 C65,30 75,32 80,38" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M120,38 C125,32 135,30 140,40" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M95,20 C100,16 108,16 112,22" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
    `,
  },
  {
    id: "straight_bob",
    name: "Straight Bob with Bangs",
    svg: `
      <path d="M62,70 C58,35 80,24 100,24 C120,24 142,35 138,70 C144,115 136,132 126,132 C120,105 120,64 100,64 C80,64 80,105 74,132 C64,132 56,115 62,70 Z" fill="var(--hair-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <path d="M68,58 L132,58 L130,64 L100,64 L70,64 Z" fill="var(--hair-color)" stroke="#111" stroke-width="3.5" />
    `,
  },
  {
    id: "afro_headband",
    name: "Afro with Knotted Headband",
    svg: `
      <circle cx="100" cy="30" r="28" fill="var(--hair-color)" stroke="#111" stroke-width="4" />
      <path d="M66,74 C64,48 80,32 100,32 C120,32 136,48 134,74 C130,60 120,52 100,52 C80,52 70,60 66,74 Z" fill="var(--hair-color)" stroke="#111" stroke-width="4" />
      <path d="M62,60 C80,52 120,52 138,60 L134,68 C120,60 80,60 66,68 Z" fill="#ffffff" stroke="#111" stroke-width="3.5" />
      <path d="M96,48 L104,48 L108,54 L92,54 Z" fill="#ffffff" stroke="#111" stroke-width="3" />
      <path d="M92,44 C90,38 98,36 100,44" stroke="#111" stroke-width="3" fill="#ffffff" />
      <path d="M108,44 C110,38 102,36 100,44" stroke="#111" stroke-width="3" fill="#ffffff" />
    `,
  },
  {
    id: "fedora_hat",
    name: "Fedora / Sun Hat",
    svg: `
      <path d="M72,54 C72,25 90,20 100,20 C110,20 128,25 128,54 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <path d="M72,50 C85,46 115,46 128,50 L128,54 C115,50 85,50 72,54 Z" fill="#111" stroke="#111" stroke-width="2" />
      <path d="M50,56 C70,48 130,48 150,56 C155,62 145,66 100,60 C55,66 45,62 50,56 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
    `,
  },
  {
    id: "dreadlocks",
    name: "Textured Dreadlocks",
    svg: `
      <path d="M64,70 C60,40 80,28 100,28 C120,28 140,40 136,70 Z" fill="var(--hair-color)" stroke="#111" stroke-width="4" />
      <path d="M62,65 C54,80 56,105 60,125 C64,128 70,126 68,115 C66,95 68,75 70,68" fill="var(--hair-color)" stroke="#111" stroke-width="3.5" />
      <path d="M72,60 C68,85 70,110 74,130 C78,132 82,128 80,115 C78,95 78,75 80,64" fill="var(--hair-color)" stroke="#111" stroke-width="3.5" />
      <path d="M128,60 C132,85 130,110 126,130 C122,132 118,128 120,115 C122,95 122,75 120,64" fill="var(--hair-color)" stroke="#111" stroke-width="3.5" />
      <path d="M138,65 C146,80 144,105 140,125 C136,128 130,126 132,115 C134,95 132,75 130,68" fill="var(--hair-color)" stroke="#111" stroke-width="3.5" />
    `,
  },
  {
    id: "short_fade",
    name: "Short Textured Crop",
    svg: `
      <path d="M66,74 C64,48 80,28 100,28 C120,28 136,48 134,74 C130,62 120,54 100,54 C80,54 70,62 66,74 Z" fill="var(--hair-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <path d="M80,38 C84,32 94,34 96,40" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
      <path d="M104,36 C108,30 116,32 120,38" stroke="#111" stroke-width="3" stroke-linecap="round" fill="none" />
    `,
  },
  {
    id: "beanie_knit",
    name: "Folded Winter Beanie",
    svg: `
      <path d="M62,64 C60,30 76,16 100,16 C124,16 140,30 138,64 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <rect x="58" y="54" width="84" height="16" rx="8" fill="var(--clothing-color)" stroke="#111" stroke-width="4" />
      <line x1="80" y1="54" x2="80" y2="70" stroke="#111" stroke-width="2" />
      <line x1="100" y1="54" x2="100" y2="70" stroke="#111" stroke-width="2" />
      <line x1="120" y1="54" x2="120" y2="70" stroke="#111" stroke-width="2" />
    `,
  },
  {
    id: "messy_bun",
    name: "Messy Top Bun",
    svg: `
      <circle cx="100" cy="18" r="18" fill="var(--hair-color)" stroke="#111" stroke-width="4" />
      <path d="M65,56 C55,28 72,8 100,8 C128,8 145,28 135,56 C135,44 120,32 100,32 C80,32 65,44 65,56 Z" fill="var(--hair-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
    `,
  },
  {
    id: "mohawk",
    name: "Punk Mohawk",
    svg: `
      <path d="M92,56 L88,6 L96,14 L100,0 L104,14 L112,6 L108,56" fill="var(--hair-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <path d="M70,56 C60,32 75,16 88,14" stroke="#111" stroke-width="3" fill="none" />
      <path d="M130,56 C140,32 125,16 112,14" stroke="#111" stroke-width="3" fill="none" />
    `,
  },
  {
    id: "pigtails",
    name: "Cute Pigtails",
    svg: `
      <path d="M65,56 C55,28 72,8 100,8 C128,8 145,28 135,56 C135,44 120,32 100,32 C80,32 65,44 65,56 Z" fill="var(--hair-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <path d="M62,56 C52,60 48,80 54,100 C56,106 60,108 62,104 C58,88 60,72 66,62" fill="var(--hair-color)" stroke="#111" stroke-width="3" />
      <path d="M138,56 C148,60 152,80 146,100 C144,106 140,108 138,104 C142,88 140,72 134,62" fill="var(--hair-color)" stroke="#111" stroke-width="3" />
    `,
  },
  {
    id: "curly_medium",
    name: "Curly Medium",
    svg: `
      <path d="M58,66 C48,30 72,6 100,6 C128,6 152,30 142,66" fill="var(--hair-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <circle cx="58" cy="70" r="8" fill="var(--hair-color)" stroke="#111" stroke-width="3" />
      <circle cx="66" cy="82" r="7" fill="var(--hair-color)" stroke="#111" stroke-width="3" />
      <circle cx="142" cy="70" r="8" fill="var(--hair-color)" stroke="#111" stroke-width="3" />
      <circle cx="134" cy="82" r="7" fill="var(--hair-color)" stroke="#111" stroke-width="3" />
    `,
  },
  {
    id: "headphones",
    name: "With Headphones 🎧",
    svg: `
      <path d="M65,56 C55,28 72,8 100,8 C128,8 145,28 135,56 C135,44 120,32 100,32 C80,32 65,44 65,56 Z" fill="var(--hair-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <path d="M58,70 C52,40 68,18 100,18 C132,18 148,40 142,70" stroke="#555" stroke-width="5" fill="none" stroke-linecap="round" />
      <rect x="50" y="64" width="14" height="22" rx="6" fill="#333" stroke="#111" stroke-width="3" />
      <rect x="136" y="64" width="14" height="22" rx="6" fill="#333" stroke="#111" stroke-width="3" />
    `,
  },
];

// ─── 3. ACCESSORIES & PROPS ───
export const ACCESSORIES = [
  { id: "none", name: "None", svg: `` },
  {
    id: "round_glasses",
    name: "Round Wire Glasses",
    svg: `
      <circle cx="86" cy="74" r="11" fill="rgba(255,255,255,0.25)" stroke="#111" stroke-width="3.5" />
      <circle cx="114" cy="74" r="11" fill="rgba(255,255,255,0.25)" stroke="#111" stroke-width="3.5" />
      <line x1="97" y1="74" x2="103" y2="74" stroke="#111" stroke-width="3.5" />
      <line x1="75" y1="74" x2="68" y2="72" stroke="#111" stroke-width="3" />
      <line x1="125" y1="74" x2="132" y2="72" stroke="#111" stroke-width="3" />
    `,
  },
  {
    id: "dark_sunglasses",
    name: "Dark Wayfarer Shades",
    svg: `
      <path d="M74,68 L98,68 L96,84 C96,87 90,89 86,89 C78,89 74,84 74,78 Z" fill="#111" stroke="#111" stroke-width="3.5" />
      <path d="M102,68 L126,68 L126,78 C126,84 122,89 114,89 C110,89 104,87 104,84 Z" fill="#111" stroke="#111" stroke-width="3.5" />
      <line x1="98" y1="70" x2="102" y2="70" stroke="#111" stroke-width="3.5" />
      <line x1="78" y1="72" x2="86" y2="80" stroke="#fff" stroke-width="2" />
      <line x1="108" y1="72" x2="116" y2="80" stroke="#fff" stroke-width="2" />
    `,
  },
  {
    id: "mustache_beard",
    name: "Full Hipster Beard",
    svg: `
      <path d="M70,84 C68,122 84,142 100,142 C116,142 132,122 130,84 C124,98 116,106 100,106 C84,106 76,98 70,84 Z" fill="var(--hair-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <path d="M86,88 C94,84 99,88 100,89 C101,88 106,84 114,88 C118,93 108,97 100,93 C92,97 82,93 86,88 Z" fill="var(--hair-color)" stroke="#111" stroke-width="3" />
    `,
  },
  {
    id: "face_mask",
    name: "Face Mask 😷",
    svg: `
      <path d="M74,84 C74,78 80,76 100,76 C120,76 126,78 126,84 L126,100 C126,110 116,116 100,116 C84,116 74,110 74,100 Z" fill="#b8d8e8" stroke="#111" stroke-width="3" />
      <line x1="74" y1="84" x2="62" y2="78" stroke="#111" stroke-width="2.5" stroke-linecap="round" />
      <line x1="126" y1="84" x2="138" y2="78" stroke="#111" stroke-width="2.5" stroke-linecap="round" />
      <path d="M82,90 L118,90" stroke="#8abbd4" stroke-width="1.5" opacity="0.6" />
      <path d="M82,96 L118,96" stroke="#8abbd4" stroke-width="1.5" opacity="0.6" />
    `,
  },
  {
    id: "bow_tie",
    name: "Fancy Bow Tie 🎀",
    svg: `
      <path d="M84,128 L100,120 L116,128 L100,136 Z" fill="#e74c4c" stroke="#111" stroke-width="3" stroke-linejoin="round" />
      <circle cx="100" cy="128" r="4" fill="#c0392b" stroke="#111" stroke-width="2" />
    `,
  },
  {
    id: "earrings",
    name: "Hoop Earrings 💍",
    svg: `
      <circle cx="62" cy="96" r="8" stroke="#daa520" stroke-width="3" fill="none" />
      <circle cx="138" cy="96" r="8" stroke="#daa520" stroke-width="3" fill="none" />
    `,
  },
  {
    id: "bandana",
    name: "Head Bandana",
    svg: `
      <path d="M62,60 C62,54 80,50 100,50 C120,50 138,54 138,60 L140,66 L60,66 Z" fill="#e74c4c" stroke="#111" stroke-width="3" stroke-linejoin="round" />
      <path d="M136,58 C142,62 148,70 146,78" stroke="#e74c4c" stroke-width="4" stroke-linecap="round" fill="none" />
    `,
  },
  {
    id: "monocle",
    name: "Gentleman's Monocle 🧐",
    svg: `
      <circle cx="112" cy="74" r="12" stroke="#daa520" stroke-width="3" fill="none" />
      <line x1="124" y1="74" x2="132" y2="68" stroke="#daa520" stroke-width="2" stroke-linecap="round" />
      <line x1="112" y1="86" x2="112" y2="110" stroke="#daa520" stroke-width="1.5" />
    `,
  },
];

// ─── 4. RICH POSES & CLOTHING (Busts, Standing, Sitting) ───
export const BODIES = [
  // ── 1. BUSTS ──
  {
    id: "knife_pose",
    name: "Bust: Knife in Hand",
    type: "bust",
    svg: `
      <path d="M88,110 L88,124 C88,128 112,128 112,124 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" />
      <path d="M50,140 C56,126 78,124 88,124 C94,130 106,130 112,124 C122,124 144,126 150,140 L156,200 L44,200 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <path d="M88,124 C94,130 106,130 112,124" stroke="#111" stroke-width="3.5" fill="none" />
      <g transform="translate(-10, 0)">
        <path d="M60,155 C54,145 66,135 74,142 L74,165 L60,165 Z" fill="var(--skin-color)" stroke="#111" stroke-width="3.5" />
        <path d="M72,146 L108,125 C114,120 116,130 106,138 L72,156 Z" fill="#e2e8f0" stroke="#111" stroke-width="3.5" stroke-linejoin="round" />
        <rect x="58" y="148" width="16" height="6" rx="2" fill="#78350f" stroke="#111" stroke-width="2.5" />
      </g>
    `,
  },
  {
    id: "patterned_sweater",
    name: "Bust: Patterned Sweater",
    type: "bust",
    svg: `
      <path d="M88,110 L88,124 L112,124 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" />
      <path d="M48,140 C54,124 76,122 88,122 C94,128 106,128 112,122 C124,122 146,124 152,140 L156,200 L44,200 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <path d="M64,146 L68,144 M80,150 L84,148 M120,146 L124,144 M136,152 L140,150" stroke="#fff" stroke-width="2.5" stroke-linecap="round" />
      <path d="M72,165 L76,163 M92,160 L96,158 M112,165 L116,163 M130,170 L134,168" stroke="#fff" stroke-width="2.5" stroke-linecap="round" />
      <path d="M60,185 L64,183 M80,180 L84,178 M100,185 L104,183 M124,182 L128,180 M144,188 L148,186" stroke="#fff" stroke-width="2.5" stroke-linecap="round" />
      <path d="M88,122 C94,128 106,128 112,122" stroke="#111" stroke-width="3.5" fill="none" />
    `,
  },
  {
    id: "arms_crossed",
    name: "Bust: Folded Arms",
    type: "bust",
    svg: `
      <path d="M88,110 L88,124 L112,124 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" />
      <path d="M48,140 C56,124 76,122 88,122 C94,128 106,128 112,122 C124,122 144,124 152,140 L156,200 L44,200 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <path d="M52,156 C60,175 100,178 148,156" stroke="#111" stroke-width="4" fill="none" />
      <path d="M56,168 C80,185 120,185 144,168" stroke="#111" stroke-width="4" fill="none" />
      <path d="M136,158 C144,158 146,168 138,172" stroke="#111" stroke-width="3.5" fill="var(--skin-color)" />
    `,
  },
  {
    id: "holding_coffee",
    name: "Bust: Steaming Coffee Mug",
    type: "bust",
    svg: `
      <path d="M88,110 L88,124 L112,124 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" />
      <path d="M50,140 C56,126 78,124 88,124 C94,130 106,130 112,124 C122,124 144,126 150,140 L156,200 L44,200 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <path d="M125,165 C132,155 142,165 138,176" stroke="#111" stroke-width="3.5" fill="var(--skin-color)" />
      <rect x="130" y="152" width="22" height="24" rx="4" fill="#ffffff" stroke="#111" stroke-width="3.5" />
      <path d="M152,158 C158,158 158,168 152,168" stroke="#111" stroke-width="3" fill="none" />
      <path d="M136,145 C136,138 140,136 140,130" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M144,145 C144,138 148,136 148,130" stroke="#111" stroke-width="2.5" stroke-linecap="round" fill="none" />
    `,
  },
  {
    id: "pocket_tee",
    name: "Bust: Pocket T-Shirt",
    type: "bust",
    svg: `
      <path d="M88,110 L88,124 L112,124 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" />
      <path d="M50,140 C56,126 78,124 88,124 C94,130 106,130 112,124 C122,124 144,126 150,140 L156,200 L44,200 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <rect x="120" y="145" width="18" height="20" rx="3" fill="#ffffff" stroke="#111" stroke-width="3" />
      <path d="M123,152 C126,150 129,154 132,152 C135,150 138,154 138,152" stroke="#111" stroke-width="2" fill="none" />
      <path d="M123,158 C126,156 129,160 132,158 C135,156 138,160 138,158" stroke="#111" stroke-width="2" fill="none" />
    `,
  },
  {
    id: "tank_top",
    name: "Bust: Sleeveless Tank Top",
    type: "bust",
    svg: `
      <path d="M88,110 L88,124 L112,124 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" />
      <path d="M48,145 C55,124 75,124 88,124 L112,124 C125,124 145,124 152,145 L156,200 L44,200 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" />
      <path d="M68,135 L78,135 L80,200 L64,200 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="3" />
      <path d="M132,135 L122,135 L120,200 L136,200 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="3" />
      <path d="M78,155 C90,165 110,165 122,155 L122,200 L78,200 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="3.5" />
    `,
  },

  // ── 2. STANDING POSES ──
  {
    id: "standing_hands_pockets",
    name: "Standing: Hands in Pockets",
    type: "standing",
    svg: `
      <path d="M88,110 L88,124 L112,124 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" />
      <path d="M54,136 C60,124 78,122 88,122 C94,128 106,128 112,122 C122,122 140,124 146,136 L144,168 L56,168 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <path d="M58,168 L142,168 L146,200 L115,200 L102,175 L89,200 L54,200 Z" fill="#111" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <path d="M54,136 L48,158 L60,172" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round" />
      <path d="M146,136 L152,158 L140,172" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round" />
    `,
  },
  {
    id: "standing_skater",
    name: "Standing: Holding Skateboard",
    type: "standing",
    svg: `
      <path d="M88,110 L88,124 L112,124 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" />
      <path d="M52,136 C60,124 78,122 88,122 L112,122 C122,122 140,124 148,136 L144,168 L56,168 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="4" />
      <!-- Baggy Jeans -->
      <path d="M56,168 L144,168 L148,200 L114,200 L100,175 L86,200 L52,200 Z" fill="#111" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <!-- Skateboard held vertically under arm -->
      <g transform="translate(-10, 0)">
        <rect x="42" y="135" width="12" height="60" rx="6" fill="#61c5ad" stroke="#111" stroke-width="3.5" />
        <circle cx="48" cy="142" r="3" fill="#111" />
        <circle cx="48" cy="188" r="3" fill="#111" />
        <path d="M54,145 C58,140 64,148 60,155" stroke="#111" stroke-width="3.5" fill="var(--skin-color)" />
      </g>
    `,
  },
  {
    id: "standing_coffee_walk",
    name: "Standing: Coffee & Tote Bag",
    type: "standing",
    svg: `
      <path d="M88,110 L88,124 L112,124 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" />
      <path d="M52,136 C60,124 78,122 88,122 L112,122 C122,122 140,124 148,136 L144,168 L56,168 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="4" />
      <path d="M56,168 L144,168 L148,200 L114,200 L100,175 L86,200 L52,200 Z" fill="#111" stroke="#111" stroke-width="4" />
      <!-- Tote Bag on shoulder -->
      <rect x="46" y="150" width="20" height="26" rx="3" fill="#ffffff" stroke="#111" stroke-width="3" />
      <path d="M50,150 C50,138 62,138 62,150" stroke="#111" stroke-width="2.5" fill="none" />
      <!-- Hand holding coffee -->
      <path d="M140,150 C146,145 152,155 146,162" stroke="#111" stroke-width="3" fill="var(--skin-color)" />
      <rect x="144" y="142" width="14" height="16" rx="2" fill="#fff" stroke="#111" stroke-width="2.5" />
    `,
  },
  {
    id: "standing_phone_scroll",
    name: "Standing: Phone Scroller",
    type: "standing",
    svg: `
      <path d="M88,110 L88,124 L112,124 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" />
      <path d="M52,136 C60,124 78,122 88,122 L112,122 C122,122 140,124 148,136 L144,168 L56,168 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="4" />
      <path d="M56,168 L144,168 L148,200 L114,200 L100,175 L86,200 L52,200 Z" fill="#111" stroke="#111" stroke-width="4" />
      <!-- Both arms forward holding phone -->
      <path d="M58,142 L92,155 M142,142 L108,155" stroke="#111" stroke-width="6" stroke-linecap="round" />
      <!-- Smartphone -->
      <rect x="92" y="145" width="16" height="24" rx="3" fill="#111" stroke="#fff" stroke-width="1.5" />
      <circle cx="100" cy="165" r="1.5" fill="#fff" />
    `,
  },

  // ── 3. SITTING POSES ──
  {
    id: "sitting_laptop",
    name: "Sitting: Desk Laptop Coder",
    type: "sitting",
    svg: `
      <path d="M88,110 L88,124 L112,124 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" />
      <path d="M52,136 C60,124 78,122 88,122 C94,128 106,128 112,122 C122,122 140,124 148,136 L146,165 L54,165 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="4" stroke-linejoin="round" />
      <polygon points="70,165 130,165 140,150 80,150" fill="#cbd5e1" stroke="#111" stroke-width="3.5" />
      <polygon points="80,150 140,150 136,130 76,130" fill="#0f172a" stroke="#111" stroke-width="3.5" />
      <circle cx="106" cy="140" r="3" fill="#61c5ad" />
      <path d="M68,158 C75,152 82,160 86,162" stroke="#111" stroke-width="3.5" fill="var(--skin-color)" />
      <path d="M132,158 C125,152 118,160 114,162" stroke="#111" stroke-width="3.5" fill="var(--skin-color)" />
      <path d="M50,175 L150,175 L145,200 L55,200 Z" fill="#334155" stroke="#111" stroke-width="4" />
    `,
  },
  {
    id: "sitting_armchair_book",
    name: "Sitting: Armchair Reader",
    type: "sitting",
    svg: `
      <!-- Armchair Back Cushion -->
      <rect x="42" y="125" width="116" height="50" rx="12" fill="#1e293b" stroke="#111" stroke-width="4" />
      <path d="M88,110 L88,124 L112,124 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" />
      <path d="M54,136 C60,124 78,122 88,122 L112,122 C122,122 140,124 146,136 L144,170 L56,170 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="4" />
      <!-- Open Book in hands -->
      <polygon points="80,165 100,168 120,165 124,152 100,154 76,152" fill="#ffffff" stroke="#111" stroke-width="3" />
      <line x1="100" y1="154" x2="100" y2="168" stroke="#111" stroke-width="2" />
      <!-- Cozy Chair Base -->
      <path d="M46,172 L154,172 L150,200 L50,200 Z" fill="#0f172a" stroke="#111" stroke-width="4" />
    `,
  },
  {
    id: "sitting_coffee_lounge",
    name: "Sitting: Coffee Lounge Thinker",
    type: "sitting",
    svg: `
      <path d="M88,110 L88,124 L112,124 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" />
      <path d="M54,136 C60,124 78,122 88,122 L112,122 C122,122 140,124 146,136 L144,168 L56,168 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="4" />
      <!-- Cross legged cushion -->
      <ellipse cx="100" cy="180" rx="55" ry="18" fill="#334155" stroke="#111" stroke-width="4" />
      <!-- Mug in two hands -->
      <rect x="92" y="152" width="16" height="18" rx="3" fill="#ffffff" stroke="#111" stroke-width="3" />
      <path d="M86,156 C90,152 94,158 92,166" stroke="#111" stroke-width="3" fill="var(--skin-color)" />
      <path d="M114,156 C110,152 106,158 108,166" stroke="#111" stroke-width="3" fill="var(--skin-color)" />
    `,
  },
  {
    id: "sitting_floor_meditation",
    name: "Sitting: Floor Meditation",
    type: "sitting",
    svg: `
      <path d="M88,110 L88,124 L112,124 L112,110 Z" fill="var(--skin-color)" stroke="#111" stroke-width="4" />
      <path d="M54,136 C60,124 78,122 88,122 L112,122 C122,122 140,124 146,136 L144,168 L56,168 Z" fill="var(--clothing-color)" stroke="#111" stroke-width="4" />
      <!-- Folded knees yoga base -->
      <path d="M44,180 C44,165 60,165 75,175 L125,175 C140,165 156,165 156,180 C156,198 44,198 44,180 Z" fill="#1e293b" stroke="#111" stroke-width="4" />
      <!-- Hands resting open on knees -->
      <circle cx="58" cy="172" r="5" fill="var(--skin-color)" stroke="#111" stroke-width="2.5" />
      <circle cx="142" cy="172" r="5" fill="var(--skin-color)" stroke="#111" stroke-width="2.5" />
    `,
  },
];

// ─── 5. 24+ CURATED PRE-MADE "GRAB AND GO!" CHARACTERS ───
export const PREMADE_PEEPS: PremadePeep[] = [
  // ── BUSTS (8 Models) ──
  {
    id: "peep_knife",
    name: "The Knife Wielder",
    category: "busts",
    config: {
      mode: "bust",
      headExpression: "knife_intense",
      hairStyle: "afro_headband",
      accessory: "none",
      bodyPose: "knife_pose",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_sweater",
    name: "Patterned Knit Sweater",
    category: "busts",
    config: {
      mode: "bust",
      headExpression: "pattern_sweater_smirk",
      hairStyle: "straight_bob",
      accessory: "none",
      bodyPose: "patterned_sweater",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_big_afro",
    name: "The Big Afro Look",
    category: "busts",
    config: {
      mode: "bust",
      headExpression: "skeptical_pout",
      hairStyle: "big_afro",
      accessory: "round_glasses",
      bodyPose: "tank_top",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_folded_arms",
    name: "Folded Arms & Bandana",
    category: "busts",
    config: {
      mode: "bust",
      headExpression: "chill_beard_smile",
      hairStyle: "afro_headband",
      accessory: "none",
      bodyPose: "arms_crossed",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_three_eye",
    name: "The Three-Eyed Alien",
    category: "busts",
    config: {
      mode: "bust",
      headExpression: "three_eyed",
      hairStyle: "short_fade",
      accessory: "none",
      bodyPose: "pocket_tee",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_fedora_coffee",
    name: "Fedora Hat & Coffee",
    category: "busts",
    config: {
      mode: "bust",
      headExpression: "joyful_laugh",
      hairStyle: "fedora_hat",
      accessory: "mustache_beard",
      bodyPose: "holding_coffee",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#ffffff",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_dreadlocks",
    name: "Dreadlocks & Sunglasses",
    category: "busts",
    config: {
      mode: "bust",
      headExpression: "chill_beard_smile",
      hairStyle: "dreadlocks",
      accessory: "dark_sunglasses",
      bodyPose: "patterned_sweater",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_beanie",
    name: "Winter Beanie Peep",
    category: "busts",
    config: {
      mode: "bust",
      headExpression: "skeptical_pout",
      hairStyle: "beanie_knit",
      accessory: "round_glasses",
      bodyPose: "pocket_tee",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },

  // ── STANDING (8 Models) ──
  {
    id: "peep_standing_casual",
    name: "Casual Hands in Pockets",
    category: "standing",
    config: {
      mode: "standing",
      headExpression: "pattern_sweater_smirk",
      hairStyle: "short_fade",
      accessory: "none",
      bodyPose: "standing_hands_pockets",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_standing_skater",
    name: "Skateboarder Peep",
    category: "standing",
    config: {
      mode: "standing",
      headExpression: "joyful_laugh",
      hairStyle: "big_afro",
      accessory: "none",
      bodyPose: "standing_skater",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_standing_coffee",
    name: "Coffee & Tote Bag Walker",
    category: "standing",
    config: {
      mode: "standing",
      headExpression: "chill_beard_smile",
      hairStyle: "fedora_hat",
      accessory: "round_glasses",
      bodyPose: "standing_coffee_walk",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_standing_phone",
    name: "Smartphone Scroller",
    category: "standing",
    config: {
      mode: "standing",
      headExpression: "skeptical_pout",
      hairStyle: "straight_bob",
      accessory: "dark_sunglasses",
      bodyPose: "standing_phone_scroll",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_standing_alien",
    name: "Three-Eyed Skater",
    category: "standing",
    config: {
      mode: "standing",
      headExpression: "three_eyed",
      hairStyle: "beanie_knit",
      accessory: "none",
      bodyPose: "standing_skater",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_standing_dreads",
    name: "Dreadlocks Coffee Walker",
    category: "standing",
    config: {
      mode: "standing",
      headExpression: "knife_intense",
      hairStyle: "dreadlocks",
      accessory: "none",
      bodyPose: "standing_coffee_walk",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_standing_beanie_phone",
    name: "Beanie Phone Texter",
    category: "standing",
    config: {
      mode: "standing",
      headExpression: "chill_beard_smile",
      hairStyle: "beanie_knit",
      accessory: "round_glasses",
      bodyPose: "standing_phone_scroll",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_standing_afro_pockets",
    name: "Afro Pocket Stance",
    category: "standing",
    config: {
      mode: "standing",
      headExpression: "pattern_sweater_smirk",
      hairStyle: "afro_headband",
      accessory: "dark_sunglasses",
      bodyPose: "standing_hands_pockets",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },

  // ── SITTING (8 Models) ──
  {
    id: "peep_sitting_coder",
    name: "Desk Laptop Coder",
    category: "sitting",
    config: {
      mode: "sitting",
      headExpression: "chill_beard_smile",
      hairStyle: "beanie_knit",
      accessory: "round_glasses",
      bodyPose: "sitting_laptop",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_sitting_creative",
    name: "Creative Director Sitting",
    category: "sitting",
    config: {
      mode: "sitting",
      headExpression: "three_eyed",
      hairStyle: "fedora_hat",
      accessory: "mustache_beard",
      bodyPose: "sitting_laptop",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_sitting_armchair",
    name: "Armchair Book Reader",
    category: "sitting",
    config: {
      mode: "sitting",
      headExpression: "joyful_laugh",
      hairStyle: "straight_bob",
      accessory: "round_glasses",
      bodyPose: "sitting_armchair_book",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_sitting_lounge",
    name: "Coffee Lounge Thinker",
    category: "sitting",
    config: {
      mode: "sitting",
      headExpression: "pattern_sweater_smirk",
      hairStyle: "big_afro",
      accessory: "none",
      bodyPose: "sitting_coffee_lounge",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_sitting_meditation",
    name: "Floor Meditation Peep",
    category: "sitting",
    config: {
      mode: "sitting",
      headExpression: "chill_beard_smile",
      hairStyle: "short_fade",
      accessory: "none",
      bodyPose: "sitting_floor_meditation",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_sitting_dreads_laptop",
    name: "Dreadlocks Laptop Artist",
    category: "sitting",
    config: {
      mode: "sitting",
      headExpression: "knife_intense",
      hairStyle: "dreadlocks",
      accessory: "dark_sunglasses",
      bodyPose: "sitting_laptop",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_sitting_afro_reader",
    name: "Afro Bandana Reader",
    category: "sitting",
    config: {
      mode: "sitting",
      headExpression: "skeptical_pout",
      hairStyle: "afro_headband",
      accessory: "none",
      bodyPose: "sitting_armchair_book",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
  {
    id: "peep_sitting_zen_alien",
    name: "Three-Eyed Zen Master",
    category: "sitting",
    config: {
      mode: "sitting",
      headExpression: "three_eyed",
      hairStyle: "big_afro",
      accessory: "none",
      bodyPose: "sitting_floor_meditation",
      skinColor: "#ffffff",
      hairColor: "#111111",
      clothingColor: "#111111",
      backgroundColor: "#ffffff",
      inkStyle: "bw",
      flipHorizontal: false,
      scale: 1,
    },
  },
];

// ─── 6. COLOR PRESETS ───
export const SKIN_TONES = [
  { label: "B&W Clean", value: "#ffffff" },
  { label: "Fair", value: "#fde2d2" },
  { label: "Peach", value: "#fed5be" },
  { label: "Warm Tan", value: "#e4b590" },
  { label: "Bronze", value: "#bf8658" },
  { label: "Deep Rich", value: "#7c4b2a" },
  { label: "Alien Mint", value: "#86efac" },
  { label: "Cyber Neon", value: "#f472b6" },
];

export const HAIR_COLORS = [
  { label: "Jet Black", value: "#111111" },
  { label: "Dark Brown", value: "#3f2e27" },
  { label: "Golden Blonde", value: "#e6be8a" },
  { label: "Ginger", value: "#b94723" },
  { label: "Silver Grey", value: "#94a3b8" },
  { label: "Electric Mint", value: "#61c5ad" },
];

export const CLOTHING_COLORS = [
  { label: "Pitch Black", value: "#111111" },
  { label: "Clean White", value: "#ffffff" },
  { label: "RVAN Mint", value: "#61c5ad" },
  { label: "Dark Slate", value: "#1e293b" },
  { label: "Ocean Blue", value: "#3b82f6" },
  { label: "Crimson Red", value: "#ef4444" },
];

export const BACKGROUND_PRESETS = [
  { id: "transparent", label: "Transparent", value: "transparent" },
  { id: "clean_white", label: "Clean White", value: "#ffffff" },
  { id: "dark_glass", label: "Dark Glass", value: "#111114" },
  { id: "mint_glow", label: "Mint Glow", value: "radial-gradient(circle at 50% 50%, rgba(97,197,173,0.25) 0%, #09090b 75%)" },
  { id: "purple_glow", label: "Purple Glow", value: "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.25) 0%, #09090b 75%)" },
];

/**
 * Builds the complete standalone SVG markup string for a Peep character.
 */
export function buildPeepSvg(config: PeepConfig, size: number = 400): string {
  const expression = EXPRESSIONS.find((e) => e.id === config.headExpression) || EXPRESSIONS[0];
  const hair = HAIR_STYLES.find((h) => h.id === config.hairStyle) || HAIR_STYLES[0];
  const accessory = ACCESSORIES.find((a) => a.id === config.accessory) || ACCESSORIES[0];
  const body = BODIES.find((b) => b.id === config.bodyPose) || BODIES[0];

  const skin = config.inkStyle === "bw" ? "#ffffff" : config.skinColor;
  const hairCol = config.inkStyle === "bw" ? "#111111" : config.hairColor;
  const clothing = config.inkStyle === "bw" ? config.clothingColor : config.clothingColor;

  const transform = `scale(${config.scale || 1}) ${config.flipHorizontal ? "scale(-1, 1) translate(-200, 0)" : ""}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}" style="background: ${config.backgroundColor}; border-radius: 24px;">
  <style>
    :root {
      --skin-color: ${skin};
      --hair-color: ${hairCol};
      --clothing-color: ${clothing};
    }
  </style>
  <g transform="${transform}">
    <!-- 1. Body & Pose -->
    <g id="peep-body">
      ${body.svg}
    </g>

    <!-- 2. Head & Expression -->
    <g id="peep-head">
      ${expression.svg}
    </g>

    <!-- 3. Hair & Headwear -->
    <g id="peep-hair">
      ${hair.svg}
    </g>

    <!-- 4. Facial Accessories -->
    <g id="peep-accessory">
      ${accessory.svg}
    </g>
  </g>
</svg>`;
}

/**
 * Generates a completely randomized character configuration.
 */
export function generateRandomPeep(): PeepConfig {
  const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const isBw = Math.random() > 0.4;

  return {
    mode: "bust",
    headExpression: randomItem(EXPRESSIONS).id,
    hairStyle: randomItem(HAIR_STYLES).id,
    accessory: Math.random() > 0.4 ? randomItem(ACCESSORIES).id : "none",
    bodyPose: randomItem(BODIES).id,
    skinColor: isBw ? "#ffffff" : randomItem(SKIN_TONES).value,
    hairColor: isBw ? "#111111" : randomItem(HAIR_COLORS).value,
    clothingColor: isBw ? (Math.random() > 0.5 ? "#111111" : "#ffffff") : randomItem(CLOTHING_COLORS).value,
    backgroundColor: isBw ? "#ffffff" : "transparent",
    inkStyle: isBw ? "bw" : "color",
    flipHorizontal: Math.random() > 0.7,
    scale: 1,
  };
}

export const DEFAULT_PEEP_CONFIG: PeepConfig = {
  mode: "bust",
  headExpression: "knife_intense",
  hairStyle: "afro_headband",
  accessory: "none",
  bodyPose: "knife_pose",
  skinColor: "#ffffff",
  hairColor: "#111111",
  clothingColor: "#111111",
  backgroundColor: "transparent",
  inkStyle: "bw",
  flipHorizontal: false,
  scale: 1,
};
