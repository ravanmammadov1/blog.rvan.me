export interface FontItem {
  id: string;
  name: string;
  family: string;
  designer: string;
  foundry: string;
  license: string;
  category: "Sans Serif" | "Serif" | "Display" | "Monospace" | "Handwriting" | "Variable";
  stylesCount: number;
  isVariable: boolean;
  isCommercialFree: boolean;
  downloadUrl: string;
  officialUrl: string;
  useCases: string[];
  sampleText?: string;
  description: string;
  trendingScore?: number;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// TOP POPULAR CURATED OPEN SOURCE & COMMERCIAL FREE FONT DATABASE
// ─────────────────────────────────────────────────────────────────────────────

export const TOP_CURATED_FONTS: FontItem[] = [
  {
    id: "font-geist",
    name: "Geist & Geist Mono",
    family: "Geist",
    designer: "Vercel & Bas Schillmans",
    foundry: "Vercel",
    license: "SIL Open Font License 1.1",
    category: "Sans Serif",
    stylesCount: 18,
    isVariable: true,
    isCommercialFree: true,
    downloadUrl: "https://github.com/vercel/geist-font/releases",
    officialUrl: "https://vercel.com/font",
    useCases: ["UI/UX", "Developer Tools", "Branding", "Editorial"],
    sampleText: "Design systems engineered for precision & readability.",
    description: "Designed by Vercel for high-legibility developer dashboards, modern SaaS landing pages, and technical typography systems.",
    trendingScore: 99,
    createdAt: "2025-07-28T00:00:00Z",
  },
  {
    id: "font-inter",
    name: "Inter",
    family: "Inter",
    designer: "Rasmus Andersson",
    foundry: "Rasmus Andersson Studio",
    license: "SIL Open Font License 1.1",
    category: "Sans Serif",
    stylesCount: 36,
    isVariable: true,
    isCommercialFree: true,
    downloadUrl: "https://github.com/rsms/inter/releases",
    officialUrl: "https://rsms.me/inter/",
    useCases: ["UI/UX", "Mobile Apps", "Design Systems", "Web Products"],
    sampleText: "The gold standard variable typeface for digital interfaces.",
    description: "Worldwide benchmark typeface engineered specifically for computer screens, featuring tall x-height and optical corrections.",
    trendingScore: 100,
    createdAt: "2025-07-25T00:00:00Z",
  },
  {
    id: "font-general-sans",
    name: "General Sans",
    family: "General Sans",
    designer: "Frode Bo Helland",
    foundry: "Fontshare (Indian Type Foundry)",
    license: "Fontshare Free License (Commercial)",
    category: "Sans Serif",
    stylesCount: 12,
    isVariable: true,
    isCommercialFree: true,
    downloadUrl: "https://www.fontshare.com/fonts/general-sans",
    officialUrl: "https://www.fontshare.com/fonts/general-sans",
    useCases: ["Branding", "UI/UX", "Editorial", "Websites"],
    sampleText: "Clean geometric proportions with Neo-Grotesque elegance.",
    description: "Modern neo-grotesque sans-serif with rationalized proportions and warm geometric details for contemporary visual identities.",
    trendingScore: 96,
    createdAt: "2025-07-26T00:00:00Z",
  },
  {
    id: "font-satoshi",
    name: "Satoshi",
    family: "Satoshi",
    designer: "Deniz Akerman",
    foundry: "Fontshare (Indian Type Foundry)",
    license: "Fontshare Free License (Commercial)",
    category: "Sans Serif",
    stylesCount: 10,
    isVariable: true,
    isCommercialFree: true,
    downloadUrl: "https://www.fontshare.com/fonts/satoshi",
    officialUrl: "https://www.fontshare.com/fonts/satoshi",
    useCases: ["Branding", "UI Design", "Logos", "Headlines"],
    sampleText: "Sleek geometric sans with distinct modernist stroke contrast.",
    description: "Geometric sans-serif combining structural geometry with subtle humanist touches, perfect for modern tech and design brands.",
    trendingScore: 97,
    createdAt: "2025-07-24T00:00:00Z",
  },
  {
    id: "font-space-grotesk",
    name: "Space Grotesk",
    family: "Space Grotesk",
    designer: "Florian Karsten",
    foundry: "Florian Karsten Type",
    license: "SIL Open Font License 1.1",
    category: "Display",
    stylesCount: 5,
    isVariable: true,
    isCommercialFree: true,
    downloadUrl: "https://github.com/floriankarsten/space-grotesk",
    officialUrl: "https://fonts.google.com/specimen/Space+Grotesk",
    useCases: ["Headlines", "Posters", "Branding", "Creative Tech"],
    sampleText: "Proportional tech sans derived from Space Mono geometry.",
    description: "Proportional sans-serif variant based on Space Mono, preserving quirky technical details while providing excellent headline impact.",
    trendingScore: 94,
    createdAt: "2025-07-22T00:00:00Z",
  },
  {
    id: "font-cabinet-grotesk",
    name: "Cabinet Grotesk",
    family: "Cabinet Grotesk",
    designer: "ITF Design Team",
    foundry: "Fontshare (Indian Type Foundry)",
    license: "Fontshare Free License (Commercial)",
    category: "Display",
    stylesCount: 8,
    isVariable: true,
    isCommercialFree: true,
    downloadUrl: "https://www.fontshare.com/fonts/cabinet-grotesk",
    officialUrl: "https://www.fontshare.com/fonts/cabinet-grotesk",
    useCases: ["Display", "Editorial", "Posters", "High-Impact Headlines"],
    sampleText: "Bold, expressive display grotesque with dramatic ink traps.",
    description: "Expressive display typeface designed for posters, editorial covers, and high-impact branding with distinct character shapes.",
    trendingScore: 95,
    createdAt: "2025-07-23T00:00:00Z",
  },
  {
    id: "font-clash-display",
    name: "Clash Display",
    family: "Clash Display",
    designer: "Indian Type Foundry",
    foundry: "Fontshare (Indian Type Foundry)",
    license: "Fontshare Free License (Commercial)",
    category: "Display",
    stylesCount: 6,
    isVariable: true,
    isCommercialFree: true,
    downloadUrl: "https://www.fontshare.com/fonts/clash-display",
    officialUrl: "https://www.fontshare.com/fonts/clash-display",
    useCases: ["Branding", "Hero Headers", "Posters", "Magazines"],
    sampleText: "Unapologetically bold display sans with high visual drama.",
    description: "High-contrast display family where small details create powerful visual tension across massive headline scales.",
    trendingScore: 98,
    createdAt: "2025-07-27T00:00:00Z",
  },
  {
    id: "font-plus-jakarta-sans",
    name: "Plus Jakarta Sans",
    family: "Plus Jakarta Sans",
    designer: "GDM Type Foundry",
    foundry: "Tokotype / GDM Studio",
    license: "SIL Open Font License 1.1",
    category: "Sans Serif",
    stylesCount: 16,
    isVariable: true,
    isCommercialFree: true,
    downloadUrl: "https://github.com/tokotype/Plus-Jakarta-Sans",
    officialUrl: "https://fonts.google.com/specimen/Plus+Jakarta+Sans",
    useCases: ["UI/UX", "Dashboard", "Landing Pages", "Brand Systems"],
    sampleText: "Warm humanist geometric sans for modern web applications.",
    description: "Fresh geometric sans-serif with subtle humanist curves, widely adopted by contemporary tech startups and design systems.",
    trendingScore: 96,
    createdAt: "2025-07-21T00:00:00Z",
  },
  {
    id: "font-poppins",
    name: "Poppins",
    family: "Poppins",
    designer: "Ninad Kale & Jonny Pinhorn",
    foundry: "Indian Type Foundry",
    license: "SIL Open Font License 1.1",
    category: "Sans Serif",
    stylesCount: 18,
    isVariable: false,
    isCommercialFree: true,
    downloadUrl: "https://fonts.google.com/specimen/Poppins",
    officialUrl: "https://fonts.google.com/specimen/Poppins",
    useCases: ["Websites", "Mobile Apps", "Corporate Branding"],
    sampleText: "Geometric sans-serif with pure circular curves & balance.",
    description: "One of the world's most popular geometric sans-serif font families, supporting both Devanagari and Latin color harmonies.",
    trendingScore: 97,
    createdAt: "2025-07-20T00:00:00Z",
  },
  {
    id: "font-instrument-serif",
    name: "Instrument Serif",
    family: "Instrument Serif",
    designer: "Rodrigo Fuenzalida & Instrument",
    foundry: "Instrument Studio",
    license: "SIL Open Font License 1.1",
    category: "Serif",
    stylesCount: 2,
    isVariable: false,
    isCommercialFree: true,
    downloadUrl: "https://github.com/instrument/instrument-serif",
    officialUrl: "https://fonts.google.com/specimen/Instrument+Serif",
    useCases: ["Editorial", "Luxury Branding", "Headlines", "Posters"],
    sampleText: "Graceful high-contrast serif with timeless editorial warmth.",
    description: "Refined, high-contrast display serif commissioned by design agency Instrument for modern digital and print publications.",
    trendingScore: 95,
    createdAt: "2025-07-19T00:00:00Z",
  },
  {
    id: "font-jetbrains-mono",
    name: "JetBrains Mono",
    family: "JetBrains Mono",
    designer: "Philipp Nurullin & JetBrains",
    foundry: "JetBrains",
    license: "SIL Open Font License 1.1",
    category: "Monospace",
    stylesCount: 16,
    isVariable: true,
    isCommercialFree: true,
    downloadUrl: "https://www.jetbrains.com/lp/mono/",
    officialUrl: "https://www.jetbrains.com/lp/mono/",
    useCases: ["Code Editors", "Technical Docs", "Developer Websites"],
    sampleText: "const font = 'Engineered for developers & code clarity';",
    description: "Monospaced font family crafted specifically for developers, featuring increased letter height, clear ligatures, and zero eye fatigue.",
    trendingScore: 99,
    createdAt: "2025-07-28T00:00:00Z",
  },
  {
    id: "font-syne",
    name: "Syne",
    family: "Syne",
    designer: "Bonjour Monde & Lucas Descroix",
    foundry: "Synesthésie Studio",
    license: "SIL Open Font License 1.1",
    category: "Display",
    stylesCount: 5,
    isVariable: true,
    isCommercialFree: true,
    downloadUrl: "https://github.com/bonjour-monde/syne-font",
    officialUrl: "https://fonts.google.com/specimen/Syne",
    useCases: ["Art Direction", "Posters", "Fashion", "Avant-Garde Design"],
    sampleText: "Avant-garde display font ranging from tight to ultra-wide.",
    description: "Experimental display family designed for art centers and creative publications, featuring radical character width expansion.",
    trendingScore: 93,
    createdAt: "2025-07-18T00:00:00Z",
  },
  {
    id: "font-fraunces",
    name: "Fraunces",
    family: "Fraunces",
    designer: "Phaedra Charles & Flavia Zimbardi",
    foundry: "Undercase Type",
    license: "SIL Open Font License 1.1",
    category: "Serif",
    stylesCount: 72,
    isVariable: true,
    isCommercialFree: true,
    downloadUrl: "https://github.com/undercasetype/Fraunces",
    officialUrl: "https://fraunces.undercasetype.com/",
    useCases: ["Editorial", "Packaging", "Branding", "Websites"],
    sampleText: "Wonky, expressive variable serif with optical size axes.",
    description: "Variable oldstyle serif inspired by early 20th century advertising typography, equipped with Weight, Optical Size, and Wonkiness axes.",
    trendingScore: 94,
    createdAt: "2025-07-17T00:00:00Z",
  },
  {
    id: "font-bricolage-grotesk",
    name: "Bricolage Grotesk",
    family: "Bricolage Grotesk",
    designer: "Mathieu Triay",
    foundry: "Mathieu Triay Studio",
    license: "SIL Open Font License 1.1",
    category: "Display",
    stylesCount: 48,
    isVariable: true,
    isCommercialFree: true,
    downloadUrl: "https://github.com/mathieutriay/bricolage-grotesk",
    officialUrl: "https://fonts.google.com/specimen/Bricolage+Grotesk",
    useCases: ["Headlines", "Posters", "Logos", "Interactive Websites"],
    sampleText: "Quirky collision of French grotesque and British eccentricities.",
    description: "Variable font blending historical grotesque structures with exaggerated ink traps and playful width transformations.",
    trendingScore: 96,
    createdAt: "2025-07-26T00:00:00Z",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DYNAMIC GOOGLE FONTS & OPEN SOURCE CATALOG DISCOVERY ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchLiveFontCatalog(): Promise<FontItem[]> {
  const cacheKey = "font_catalog_cache_v1";

  try {
    const cachedStr = localStorage.getItem(cacheKey);
    if (cachedStr) {
      const cached = JSON.parse(cachedStr);
      if (Date.now() - cached.timestamp < 24 * 60 * 60 * 1000 && Array.isArray(cached.fonts) && cached.fonts.length > 50) {
        return cached.fonts;
      }
    }
  } catch (e) {
    // Continue
  }

  const catalogMap = new Map<string, FontItem>();

  // 1. Seed with verified top curated fonts
  TOP_CURATED_FONTS.forEach((f) => catalogMap.set(f.family.toLowerCase(), f));

  // 2. Fetch live Google Fonts Metadata feed (1,500+ font families)
  try {
    const res = await fetch("https://api.allorigins.win/get?url=" + encodeURIComponent("https://fonts.google.com/metadata/fonts"), { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const json = await res.json();
      const parsedData = JSON.parse(json.contents);
      if (parsedData && Array.isArray(parsedData.familyMetadataList)) {
        parsedData.familyMetadataList.slice(0, 1000).forEach((meta: any, idx: number) => {
          const name = meta.family || meta.name;
          if (!name) return;
          const key = name.toLowerCase();
          if (catalogMap.has(key)) return;

          let cat: FontItem["category"] = "Sans Serif";
          const catStr = (meta.category || "").toLowerCase();
          if (catStr.includes("serif") && !catStr.includes("sans")) cat = "Serif";
          else if (catStr.includes("display")) cat = "Display";
          else if (catStr.includes("monospace")) cat = "Monospace";
          else if (catStr.includes("handwriting")) cat = "Handwriting";

          const isVar = Boolean(meta.axes && meta.axes.length > 0);
          const designers = meta.designers ? meta.designers.join(", ") : "Google Fonts Contributor";

          catalogMap.set(key, {
            id: `gf-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            name,
            family: name,
            designer: designers,
            foundry: "Google Fonts",
            license: "SIL Open Font License 1.1",
            category: cat,
            stylesCount: meta.fonts ? Object.keys(meta.fonts).length : 6,
            isVariable: isVar,
            isCommercialFree: true,
            downloadUrl: `https://fonts.google.com/specimen/${encodeURIComponent(name)}`,
            officialUrl: `https://fonts.google.com/specimen/${encodeURIComponent(name)}`,
            useCases: [cat, "Web Design", "UI/UX", "Typography"],
            sampleText: "Grumpy wizards make toxic brew for the evil Queen and Jack.",
            description: `${name} is an open-source ${cat.toLowerCase()} typeface family hosted on Google Fonts, free for both commercial and personal digital projects.`,
            trendingScore: 80 - (idx % 30),
            createdAt: new Date(Date.now() - (idx * 3600 * 1000)).toISOString(),
          });
        });
      }
    }
  } catch (e) {
    // Ignore offline/cors error and rely on baseline
  }

  const result = Array.from(catalogMap.values());

  try {
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), fonts: result }));
  } catch (e) {
    // Ignore quota
  }

  return result;
}
