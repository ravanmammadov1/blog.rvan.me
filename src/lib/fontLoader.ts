import { FontItem } from "./fontEngine";

/**
 * Global cache of already requested font families to prevent duplicate network calls.
 */
const loadedFontFamilies = new Set<string>();

/**
 * On-demand lazy font loader.
 * Loads a font's .woff2 binary or CSS stylesheet ONLY when its card enters the viewport.
 * Prioritizes .woff2 format over .woff.
 */
export function loadFontOnDemand(font: FontItem): void {
  if (!font || !font.family) return;

  const familyKey = font.family.trim();
  if (loadedFontFamilies.has(familyKey)) return;
  loadedFontFamilies.add(familyKey);

  // 1. Check for explicit WOFF2 / WOFF file URLs on the font object
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
            // Fallback to CDN if custom load fails
            loadFontFromCdn(font);
          });
        return;
      } catch {
        // Fallback
      }
    }
  }

  // 2. Load via CDN
  loadFontFromCdn(font);
}

function loadFontFromCdn(font: FontItem): void {
  const officialUrl = font.officialUrl || font.downloadUrl || "";

  // Fontshare Fonts API
  if (officialUrl.includes("fontshare.com/fonts/")) {
    const slug = officialUrl.split("/fonts/")[1]?.split("?")[0]?.replace(/\/.*$/, "");
    if (slug) {
      loadFontshareCss(slug, font.id);
      return;
    }
  }

  // Default Google Fonts API
  loadGoogleFontCss(font);
}

function loadGoogleFontCss(font: FontItem): void {
  const familyEnc = encodeURIComponent(font.family.trim()).replace(/%20/g, "+");
  const linkId = `gf-css-${font.id || familyEnc}`;
  if (document.getElementById(linkId)) return;

  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  // Load standard weights with display=swap so .woff2 files download on-demand
  link.href = `https://fonts.googleapis.com/css2?family=${familyEnc}:wght@400;600;700&display=swap`;
  document.head.appendChild(link);
}

function loadFontshareCss(slug: string, fontId: string): void {
  const linkId = `fontshare-css-${fontId || slug}`;
  if (document.getElementById(linkId)) return;

  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "stylesheet";
  link.href = `https://api.fontshare.com/v2/css?f[]=${slug}@400,500,600,700&display=swap`;
  document.head.appendChild(link);
}
