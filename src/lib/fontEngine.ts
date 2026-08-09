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

// Load the large catalog only when the Resources route is opened. Keeping it
// out of the route's initial JavaScript improves the homepage and core routes.
export const STATIC_FONT_CATALOG: FontItem[] = [];
let staticCatalogPromise: Promise<FontItem[]> | null = null;

export function loadStaticFontCatalog(): Promise<FontItem[]> {
  if (!staticCatalogPromise) {
    staticCatalogPromise = import("./googleFontsCatalog.json").then(
      (module) => module.default as FontItem[]
    );
  }
  return staticCatalogPromise;
}

export function getFontSlug(font: FontItem): string {
  if (!font || !font.family) return "";
  return font.family
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findFontBySlug(slug: string, catalog: FontItem[]): FontItem | undefined {
  if (!slug || !Array.isArray(catalog)) return undefined;
  const cleanSlug = slug.toLowerCase().trim();

  return catalog.find((font) => {
    const s = getFontSlug(font);
    const idSlug = font.id?.toLowerCase().replace(/^(font-|gf-)/, "");
    return s === cleanSlug || idSlug === cleanSlug || font.family.toLowerCase().replace(/[^a-z0-9]+/g, "-") === cleanSlug;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// DIRECT DOWNLOAD URL RESOLVER
// Resolves GitHub, Google Fonts, and Foundry URLs directly to ZIP release files
// ─────────────────────────────────────────────────────────────────────────────

export function resolveDirectFontDownloadUrl(font: FontItem): string {
  const url = font.downloadUrl || font.officialUrl || "";
  const familyEnc = encodeURIComponent(font.family);

  // 1. Google Fonts Direct ZIP Download Endpoint
  if (font.foundry === "Google Fonts" || url.includes("fonts.google.com")) {
    return `https://fonts.google.com/download?family=${familyEnc}`;
  }

  // 2. GitHub Repositories & Releases -> Direct ZIP Release / Source Archive
  if (url.includes("github.com")) {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      const owner = match[1];
      const repo = match[2].replace(/\.git$/, "").replace(/\/.*$/, "");

      if (owner === "rsms" && repo === "inter") {
        return "https://github.com/rsms/inter/releases/download/v4.0/Inter-4.0.zip";
      }
      if (owner === "vercel" && repo === "geist-font") {
        return "https://github.com/vercel/geist-font/archive/refs/heads/main.zip";
      }
      if (owner === "floriankarsten" && repo === "space-grotesk") {
        return "https://github.com/floriankarsten/space-grotesk/archive/refs/heads/master.zip";
      }
      if (owner === "tokotype" && repo === "Plus-Jakarta-Sans") {
        return "https://github.com/tokotype/Plus-Jakarta-Sans/archive/refs/heads/master.zip";
      }
      if (owner === "instrument" && repo === "instrument-serif") {
        return "https://github.com/instrument/instrument-serif/archive/refs/heads/main.zip";
      }
      if (owner === "bonjour-monde" && repo === "syne-font") {
        return "https://github.com/bonjour-monde/syne-font/archive/refs/heads/master.zip";
      }
      if (owner === "undercasetype" && repo === "Fraunces") {
        return "https://github.com/undercasetype/Fraunces/archive/refs/heads/master.zip";
      }
      if (owner === "mathieutriay" && repo === "bricolage-grotesk") {
        return "https://github.com/mathieutriay/bricolage-grotesk/archive/refs/heads/main.zip";
      }

      // Default GitHub source ZIP archive for any repository
      return `https://github.com/${owner}/${repo}/archive/refs/heads/main.zip`;
    }
  }

  // 3. Fontshare Direct API Download Endpoint
  if (url.includes("fontshare.com/fonts/")) {
    const slug = url.split("/fonts/")[1]?.replace(/\/.*$/, "");
    if (slug) {
      return `https://api.fontshare.com/v2/fonts/download/${slug}`;
    }
  }

  return url;
}

export function triggerDirectFontDownload(font: FontItem) {
  const directUrl = resolveDirectFontDownloadUrl(font);
  const link = document.createElement("a");
  link.href = directUrl;
  link.setAttribute("download", `${font.family}.zip`);
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noopener noreferrer");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ─────────────────────────────────────────────────────────────────────────────
// DYNAMIC GOOGLE FONTS & OPEN SOURCE CATALOG DISCOVERY ENGINE (2,000+ FONTS)
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchLiveFontCatalog(): Promise<FontItem[]> {
  const catalogMap = new Map<string, FontItem>();

  // 1. Seed with the full catalog after the Resources route requests it.
  const staticCatalog = await loadStaticFontCatalog();
  staticCatalog.forEach((f) => catalogMap.set(f.family.toLowerCase().trim(), f));

  // 2. Background sync live Google Fonts Metadata feed for newly added families
  try {
    const res = await fetch("https://api.allorigins.win/get?url=" + encodeURIComponent("https://fonts.google.com/metadata/fonts"), { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const json = await res.json();
      const parsedData = JSON.parse(json.contents);
      if (parsedData && Array.isArray(parsedData.familyMetadataList)) {
        parsedData.familyMetadataList.forEach((meta: any) => {
          const name = meta.family || meta.name;
          if (!name) return;
          const key = name.toLowerCase().trim();

          if (catalogMap.has(key)) return; // Deduplicate

          let cat: FontItem["category"] = "Sans Serif";
          const catStr = (meta.category || "").toLowerCase();
          if (catStr.includes("serif") && !catStr.includes("sans")) cat = "Serif";
          else if (catStr.includes("display")) cat = "Display";
          else if (catStr.includes("monospace")) cat = "Monospace";
          else if (catStr.includes("handwriting")) cat = "Handwriting";

          const isVar = Boolean(meta.axes && meta.axes.length > 0);
          const designers = meta.designers ? meta.designers.join(", ") : "Google Fonts Contributor";
          const directZipUrl = `https://fonts.google.com/download?family=${encodeURIComponent(name)}`;

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
            downloadUrl: directZipUrl,
            officialUrl: `https://fonts.google.com/specimen/${encodeURIComponent(name)}`,
            useCases: [cat, "Web Design", "UI/UX", "Typography"],
            sampleText: "Grumpy wizards make toxic brew for the evil Queen and Jack.",
            description: `${name} is an open-source ${cat.toLowerCase()} typeface family hosted on Google Fonts, free for both commercial and personal digital projects.`,
            trendingScore: 75,
            createdAt: new Date().toISOString(),
          });
        });
      }
    }
  } catch (e) {
    // Rely on static baseline
  }

  return Array.from(catalogMap.values());
}
