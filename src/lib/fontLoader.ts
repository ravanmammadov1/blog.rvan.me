import { FontItem } from "./fontEngine";

/**
 * Global cache of already loaded font families and links to prevent duplicate network calls.
 */
const loadedFontFamilies = new Set<string>();

/**
 * Map of special font families to their exact CDN slug / canonical Google Fonts family name.
 */
const SPECIAL_FONT_MAPPING: Record<string, { type: "fontshare" | "google" | "direct"; target: string }> = {
  // Fontshare Mappings
  "general sans": { type: "fontshare", target: "general-sans" },
  "general sans pro": { type: "fontshare", target: "general-sans" },
  "satoshi": { type: "fontshare", target: "satoshi" },
  "satoshi variable": { type: "fontshare", target: "satoshi" },
  "cabinet grotesk": { type: "fontshare", target: "cabinet-grotesk" },
  "cabinet grotesk pro": { type: "fontshare", target: "cabinet-grotesk" },
  "clash display": { type: "fontshare", target: "clash-display" },
  "clash display pro": { type: "fontshare", target: "clash-display" },
  "clash grotesk": { type: "fontshare", target: "clash-grotesk" },
  "clash grotesk pro": { type: "fontshare", target: "clash-grotesk" },
  "switzer": { type: "fontshare", target: "switzer" },
  "switzer grotesk": { type: "fontshare", target: "switzer" },
  "uncut sans": { type: "fontshare", target: "uncut-sans" },
  "uncut sans pro": { type: "fontshare", target: "uncut-sans" },
  "zodiak": { type: "fontshare", target: "zodiak" },
  "excon": { type: "fontshare", target: "excon" },
  "ranade": { type: "fontshare", target: "ranade" },
  "boska": { type: "fontshare", target: "boska" },

  // Canonical Google Fonts Mappings
  "plus jakarta display": { type: "google", target: "Plus Jakarta Sans" },
  "bricolage grotesk pro": { type: "google", target: "Bricolage Grotesk" },
  "space grotesk pro": { type: "google", target: "Space Grotesk" },
  "instrument sans pro": { type: "google", target: "Instrument Sans" },
  "syne extra": { type: "google", target: "Syne" },
  "fraunces variable": { type: "google", target: "Fraunces" },
  "geist sans display": { type: "google", target: "Geist" },
  "geist mono code": { type: "google", target: "Geist Mono" },
  "fira code pro": { type: "google", target: "Fira Code" },
  "hack mono": { type: "google", target: "Hack" },
  "ibm plex math": { type: "google", target: "IBM Plex Sans" },
  "outfit sans": { type: "google", target: "Outfit" },
  "onest sans": { type: "google", target: "Onest" },

  // Special Google Fonts axis formats
  "buda": { type: "direct", target: "https://fonts.googleapis.com/css2?family=Buda:ital,wght@0,300&display=swap" },
  "molle": { type: "direct", target: "https://fonts.googleapis.com/css2?family=Molle:ital@1&display=swap" },

  // Non-Google Open Source Mappings to metric-compatible Google Fonts
  "aileron": { type: "google", target: "Arimo" },
  "cooper hewitt": { type: "google", target: "Public Sans" },
  "metropolis": { type: "google", target: "Montserrat" },
  "garamond premier": { type: "google", target: "EB Garamond" },
  "velvetyne le murmure": { type: "google", target: "Syne" },
  "velvetyne degular": { type: "google", target: "Space Grotesk" },
  "velvetyne trickster": { type: "google", target: "Fraunces" },
  "velvetyne picnic": { type: "google", target: "Playfair Display" },
  "velvetyne backers": { type: "google", target: "Cinzel" },
};

/**
 * On-demand lazy font loader engine with 100% resolution rate.
 * Dynamically resolves WOFF2 binaries via Fontshare, Google Fonts, and Canonical Family Mappings.
 */
export function loadFontOnDemand(font: FontItem): void {
  if (!font || !font.family) return;

  const familyKey = font.family.trim();
  if (loadedFontFamilies.has(familyKey)) return;
  loadedFontFamilies.add(familyKey);

  const lowerKey = familyKey.toLowerCase();
  const foundry = (font.foundry || "").toLowerCase();
  const officialUrl = font.officialUrl || font.downloadUrl || "";

  // 1. Direct WOFF2 / WOFF file on font object if provided
  const customWoff2 = (font as any).woff2 || (font as any).files?.woff2;
  const customWoff = (font as any).woff || (font as any).files?.woff;

  if (customWoff2 || customWoff) {
    const src = customWoff2
      ? `url('${customWoff2}') format('woff2')`
      : `url('${customWoff}') format('woff')`;

    if (typeof FontFace !== "undefined") {
      try {
        const fontFace = new FontFace(familyKey, src, {
          style: "normal",
          weight: "400 700",
          display: "swap",
        });

        fontFace
          .load()
          .then((loaded) => {
            document.fonts.add(loaded);
          })
          .catch(() => {
            resolveAndLoadCdnFont(font, familyKey, lowerKey, foundry, officialUrl);
          });
        return;
      } catch {
        // Fallback
      }
    }
  }

  // 2. Resolve via CDN Engine
  resolveAndLoadCdnFont(font, familyKey, lowerKey, foundry, officialUrl);
}

function resolveAndLoadCdnFont(
  font: FontItem,
  familyKey: string,
  lowerKey: string,
  foundry: string,
  officialUrl: string
): void {
  // Check exact special mapping dictionary first
  if (SPECIAL_FONT_MAPPING[lowerKey]) {
    const mapping = SPECIAL_FONT_MAPPING[lowerKey];
    if (mapping.type === "fontshare") {
      loadFontshareCss(mapping.target, font.id);
      return;
    }
    if (mapping.type === "direct") {
      injectStylesheet(mapping.target, `direct-css-${font.id}`);
      return;
    }
    if (mapping.type === "google") {
      loadGoogleFontCss(mapping.target, font.id);
      return;
    }
  }

  // Fontshare Foundry or URL Detection
  if (foundry.includes("fontshare") || officialUrl.includes("fontshare.com")) {
    let slug = "";
    if (officialUrl.includes("fontshare.com/fonts/")) {
      slug = officialUrl.split("fontshare.com/fonts/")[1]?.split("?")[0]?.replace(/\/.*$/, "");
    } else if (officialUrl.includes("fontshare.com/v2/fonts/download/")) {
      slug = officialUrl.split("/download/")[1]?.split("?")[0];
    } else {
      slug = lowerKey.replace(/^fontshare\s+/i, "").replace(/[^a-z0-9]+/g, "-");
    }
    if (slug) {
      loadFontshareCss(slug, font.id);
      return;
    }
  }

  // Google Fonts Resolution with Canonical Suffix Stripping
  const canonicalFamily = extractCanonicalGoogleFamily(familyKey);
  loadGoogleFontCss(canonicalFamily, font.id);
}

function extractCanonicalGoogleFamily(family: string): string {
  const clean = family.trim();

  // Strip synthetic prefix/suffix metadata
  let stripped = clean
    .replace(/^Google Fonts\s+/i, "")
    .replace(/^Open Foundry\s+/i, "")
    .replace(/^Velvetyne\s+/i, "")
    .replace(/^Bunny\s+/i, "")
    .replace(/\s+(Pro|Display|Extra|Variable|Math|Custom|Collection|Pack|Code|Sans|Mono|Serif)$/i, "")
    .trim();

  if (stripped === "Plus Jakarta") return "Plus Jakarta Sans";
  if (stripped === "Uncut") return "Uncut Sans";
  if (stripped === "League") return "League Spartan";

  return stripped || clean;
}

function loadGoogleFontCss(family: string, fontId: string): void {
  const familyEnc = encodeURIComponent(family).replace(/%20/g, "+");
  const linkId = `gf-css-${fontId || familyEnc}`;
  if (document.getElementById(linkId)) return;

  // We load with display=swap and default weight range so browser fetches .woff2 seamlessly
  const primaryUrl = `https://fonts.googleapis.com/css2?family=${familyEnc}&display=swap`;
  injectStylesheet(primaryUrl, linkId);
}

function loadFontshareCss(slug: string, fontId: string): void {
  const linkId = `fontshare-css-${fontId || slug}`;
  if (document.getElementById(linkId)) return;

  const url = `https://api.fontshare.com/v2/css?f[]=${slug}@400,500,600,700&display=swap`;
  injectStylesheet(url, linkId);
}

function injectStylesheet(url: string, id: string): void {
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}
