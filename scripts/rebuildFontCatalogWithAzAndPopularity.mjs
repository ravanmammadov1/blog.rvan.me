import fs from "node:fs";
import path from "node:path";

// Top global typefaces ranked by international usage and design authority
const TOP_POPULAR_FAMILIES = [
  "Inter",
  "Geist",
  "Geist Mono",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Poppins",
  "Lato",
  "Oswald",
  "Raleway",
  "Merriweather",
  "Nunito",
  "Nunito Sans",
  "Ubuntu",
  "Ubuntu Sans",
  "Ubuntu Mono",
  "Roboto Slab",
  "Roboto Mono",
  "Roboto Flex",
  "Roboto Serif",
  "Playfair Display",
  "Satoshi",
  "General Sans",
  "Cabinet Grotesk",
  "Clash Display",
  "Clash Grotesk",
  "Switzer",
  "Plus Jakarta Sans",
  "Space Grotesk",
  "Space Mono",
  "DM Sans",
  "DM Serif Display",
  "DM Mono",
  "Fira Code",
  "Fira Sans",
  "Source Sans 3",
  "Source Serif 4",
  "Source Code Pro",
  "Lora",
  "Rubik",
  "Work Sans",
  "Manrope",
  "Outfit",
  "Urbanist",
  "Onest",
  "Public Sans",
  "IBM Plex Sans",
  "IBM Plex Serif",
  "IBM Plex Mono",
  "Bebas Neue",
  "Anton",
  "Archivo",
  "Archivo Black",
  "Barlow",
  "Barlow Condensed",
  "Cinzel",
  "Cormorant Garamond",
  "Libre Baskerville",
  "Libre Franklin",
  "Syne",
  "Fraunces",
  "Bricolage Grotesk",
  "Instrument Sans",
  "Instrument Serif",
  "Epilogue",
  "Sora",
  "Bitter",
  "Karla",
  "Inconsolata",
  "JetBrains Mono",
  "PT Sans",
  "PT Serif",
  "Jost",
  "Mulish",
  "Overpass",
  "Quicksand",
  "Comfortaa",
  "Righteous",
  "Pacifico",
  "Dancing Script",
  "Caveat",
  "Great Vibes",
  "Sacramento",
  "Satisfy",
  "Shadows Into Light",
  "Amatic SC",
  "Permanent Marker",
  "Abril Fatface",
  "Alfa Slab One",
  "Lobster",
  "Fredoka",
  "Zilla Slab",
  "Cinzel Decorative",
];

// Curated list of font families verified to support the complete Azerbaijani Latin alphabet (including Ə, ə, Ğ, ğ, İ, ı, Ö, ö, Ş, ş, Ü, ü, Ç, ç)
const AZERBAIJANI_SUPPORTED_FAMILIES = new Set([
  "inter",
  "geist",
  "geist mono",
  "roboto",
  "roboto slab",
  "roboto mono",
  "roboto flex",
  "roboto serif",
  "open sans",
  "montserrat",
  "poppins",
  "lato",
  "oswald",
  "raleway",
  "merriweather",
  "nunito",
  "nunito sans",
  "ubuntu",
  "ubuntu sans",
  "ubuntu mono",
  "playfair display",
  "satoshi",
  "general sans",
  "switzer",
  "plus jakarta sans",
  "space grotesk",
  "dm sans",
  "fira sans",
  "fira code",
  "source sans 3",
  "source serif 4",
  "source code pro",
  "lora",
  "rubik",
  "work sans",
  "manrope",
  "outfit",
  "urbanist",
  "onest",
  "public sans",
  "ibm plex sans",
  "ibm plex serif",
  "ibm plex mono",
  "archivo",
  "archivo black",
  "barlow",
  "barlow condensed",
  "cinzel",
  "cormorant garamond",
  "libre baskerville",
  "libre franklin",
  "syne",
  "fraunces",
  "bricolage grotesk",
  "instrument sans",
  "instrument serif",
  "epilogue",
  "sora",
  "bitter",
  "karla",
  "inconsolata",
  "pt sans",
  "pt serif",
  "jost",
  "mulish",
  "overpass",
  "quicksand",
  "noto sans",
  "noto serif",
  "noto sans mono",
  "noto sans display",
  "noto serif display",
  "alegreya",
  "alegreya sans",
  "alegreya sans sc",
  "alegreya sc",
  "cabin",
  "cantarell",
  "chivo",
  "chivo mono",
  "cooper hewitt",
  "crimson pro",
  "exo",
  "exo 2",
  "faustina",
  "frank ruhl libre",
  "glory",
  "golos text",
  "hepta slab",
  "inter tight",
  "league spartan",
  "lexend",
  "lexend deca",
  "literata",
  "marcellus",
  "markazi text",
  "merriweather sans",
  "montserrat alternates",
  "newsreader",
  "petrona",
  "piazzolla",
  "podkova",
  "prata",
  "proza libre",
  "readex pro",
  "red hat display",
  "red hat text",
  "red hat mono",
  "rokkitt",
  "rosario",
  "rubik mono one",
  "rubik bubbles",
  "rubik dirt",
  "rubik maze",
  "rubik wet paint",
  "rubik beastly",
  "spectral",
  "spectral sc",
  "stix two text",
  "taviraj",
  "tenor sans",
  "trirong",
  "vollkorn",
  "vollkorn sc",
  "yanone kaffeesatz",
  "ysabeau",
  "ysabeau infant",
  "ysabeau office",
  "ysabeau sc",
]);

async function rebuild() {
  console.log("Fetching authoritative Google Fonts catalog...");
  const catalogMap = new Map();

  // Read existing catalog to retain custom URLs, licenses, and foundry info
  const existingPath = path.resolve("src/lib/googleFontsCatalog.json");
  const existingCatalog = fs.existsSync(existingPath)
    ? JSON.parse(fs.readFileSync(existingPath, "utf8"))
    : [];

  existingCatalog.forEach((f) => {
    catalogMap.set(f.family.toLowerCase().trim(), f);
  });

  // Fetch fresh Google Fonts metadata
  try {
    const gfRes = await fetch("https://fonts.google.com/metadata/fonts");
    if (gfRes.ok) {
      const gfData = await gfRes.json();
      if (gfData && Array.isArray(gfData.familyMetadataList)) {
        console.log(`Processing ${gfData.familyMetadataList.length} Google Fonts families...`);

        gfData.familyMetadataList.forEach((meta) => {
          const name = meta.family || meta.name;
          if (!name) return;
          const key = name.toLowerCase().trim();

          let cat = "Sans Serif";
          const catStr = (meta.category || "").toLowerCase();
          if (catStr.includes("serif") && !catStr.includes("sans")) cat = "Serif";
          else if (catStr.includes("display")) cat = "Display";
          else if (catStr.includes("monospace")) cat = "Monospace";
          else if (catStr.includes("handwriting")) cat = "Handwriting";

          const isVar = Boolean(meta.axes && meta.axes.length > 0);
          const designers = meta.designers ? meta.designers.join(", ") : "Google Fonts Contributor";
          const directZipUrl = `https://fonts.google.com/download?family=${encodeURIComponent(name)}`;

          // Check if existing record exists to preserve custom fields
          const existing = catalogMap.get(key) || {};

          catalogMap.set(key, {
            ...existing,
            id: existing.id || `gf-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            name,
            family: name,
            designer: existing.designer || designers,
            foundry: existing.foundry || "Google Fonts",
            license: existing.license || "SIL Open Font License 1.1",
            category: existing.category || cat,
            stylesCount: meta.fonts ? Object.keys(meta.fonts).length : existing.stylesCount || 6,
            isVariable: existing.isVariable !== undefined ? existing.isVariable : isVar,
            isCommercialFree: true,
            downloadUrl: existing.downloadUrl || directZipUrl,
            officialUrl: existing.officialUrl || `https://fonts.google.com/specimen/${encodeURIComponent(name)}`,
            useCases: existing.useCases || [cat, "Web Design", "UI/UX", "Typography"],
            sampleText: existing.sampleText || "Grumpy wizards make toxic brew for the evil Queen and Jack.",
            description: existing.description || `${name} is an open-source ${cat.toLowerCase()} typeface family hosted on Google Fonts, free for both commercial and personal digital projects.`,
          });
        });
      }
    }
  } catch (err) {
    console.error("Google Fonts fetch error (falling back to existing):", err.message);
  }

  // Calculate popularity scores and Azerbaijani language support
  const allFonts = Array.from(catalogMap.values()).map((font) => {
    const key = font.family.toLowerCase().trim();
    const isAzSupported =
      AZERBAIJANI_SUPPORTED_FAMILIES.has(key) ||
      key.startsWith("noto ") ||
      key.startsWith("ibm plex ") ||
      key.startsWith("ubuntu ") ||
      key.startsWith("roboto ") ||
      key.startsWith("source ") ||
      key.startsWith("fira ");

    // Determine popularity index
    const popularIndex = TOP_POPULAR_FAMILIES.findIndex(
      (pop) => pop.toLowerCase().trim() === key
    );

    let score = 50;
    if (popularIndex !== -1) {
      score = 1000 - popularIndex * 10; // Top popular fonts get scores 1000, 990, 980...
    } else if (font.trendingScore) {
      score = font.trendingScore;
    }

    return {
      ...font,
      supportsAzerbaijani: isAzSupported,
      trendingScore: score,
    };
  });

  // Sort catalog: Tier 1 Popular fonts first, then by trendingScore descending, then alphabetically
  allFonts.sort((a, b) => {
    if ((b.trendingScore || 0) !== (a.trendingScore || 0)) {
      return (b.trendingScore || 0) - (a.trendingScore || 0);
    }
    return a.family.localeCompare(b.family);
  });

  console.log(`\nRebuilt catalog with ${allFonts.length} font families.`);
  console.log(`Fonts supporting Azerbaijani (Ə, ğ, ı, ö, ş, ü, ç): ${allFonts.filter((f) => f.supportsAzerbaijani).length}`);
  console.log(`Top 15 ranked fonts:`, allFonts.slice(0, 15).map((f) => `${f.family} (Score: ${f.trendingScore}, AZ: ${f.supportsAzerbaijani})`));

  fs.writeFileSync(existingPath, JSON.stringify(allFonts, null, 2), "utf8");
  console.log(`\nSuccessfully saved updated catalog to ${existingPath}`);
}

rebuild().catch(console.error);
