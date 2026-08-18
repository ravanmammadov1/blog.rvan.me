import http from "http";
import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const distDir = path.resolve("dist");

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split("?")[0];
  if (urlPath.endsWith("/")) urlPath += "index.html";

  let filePath = path.join(distDir, urlPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    if (fs.existsSync(path.join(distDir, urlPath, "index.html"))) {
      filePath = path.join(distDir, urlPath, "index.html");
    } else if (fs.existsSync(path.join(distDir, `${urlPath}.html`))) {
      filePath = path.join(distDir, `${urlPath}.html`);
    } else {
      filePath = path.join(distDir, "index.html");
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end("Server Error");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
});

async function run() {
  await new Promise((resolve) => server.listen(4198, resolve));
  console.log("In-process static test server listening on http://localhost:4198");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log("\n=== 1. VERIFYING TOP POPULAR FONTS ON DEFAULT LOAD ===");
    await page.goto("http://localhost:4198/resources?category=fonts", { waitUntil: "networkidle" });

    // Top visible fonts on initial load
    const fontNames = await page.locator("article h3").allTextContents();
    console.log("Top visible font families on initial load:", fontNames);

    // Verify Inter, Geist, Roboto, Open Sans, etc. are prominent
    if (!fontNames.some(name => name.includes("Inter")) || !fontNames.some(name => name.includes("Roboto"))) {
      throw new Error("Popular flagship fonts missing from top ranks");
    }
    console.log("✅ Top popular fonts prominent on default page load!");

    console.log("\n=== 2. VERIFYING SEARCH FOR SPECIFIC POPULAR FAMILIES ===");
    const testQueries = [
      "Open Sans",
      "Roboto",
      "Lato",
      "Montserrat",
      "Poppins",
      "Oswald",
      "Merriweather",
      "Raleway",
      "Nunito",
      "Ubuntu",
      "Roboto Slab",
      "Calibri",
    ];

    for (const q of testQueries) {
      await page.goto(`http://localhost:4198/resources?category=fonts&q=${encodeURIComponent(q)}`, { waitUntil: "networkidle" });
      const results = await page.locator("article h3").allTextContents();
      console.log(`Search "${q}" -> Found: ${results.slice(0, 3).join(", ")}`);
      if (results.length === 0) {
        throw new Error(`Search failed for popular font: ${q}`);
      }
    }
    console.log("✅ All popular target fonts successfully discoverable via search!");

    console.log("\n=== 3. VERIFYING AZERBAIJANI (Ə) FILTER & BADGES ===");
    await page.goto("http://localhost:4198/resources?category=fonts", { waitUntil: "networkidle" });
    
    // Click Azerbaijani filter
    await page.getByRole("button", { name: /AZERBAIJANI/i }).click();
    await page.waitForTimeout(500);

    const azFontCards = await page.locator("article h3").allTextContents();
    console.log("Azerbaijani supported fonts sample:", azFontCards.slice(0, 6));

    // Verify AZ / Ə badges
    const azBadgeCount = await page.locator("article span:has-text('AZ / Ə')").count();
    console.log(`- Verified AZ / Ə badges on visible cards: ${azBadgeCount}`);
    if (azBadgeCount === 0) throw new Error("AZ / Ə badges not displayed on font cards");
    console.log("✅ Azerbaijani filter & capability badges functioning 100%!");

    console.log("\n=== 4. VERIFYING FONT DETAIL PAGES & GLYPH SPECIMENS ===");
    const testDetailSlugs = ["open-sans", "roboto", "inter", "poppins", "montserrat"];

    for (const slug of testDetailSlugs) {
      await page.goto(`http://localhost:4198/fonts/${slug}`, { waitUntil: "networkidle" });
      const heading = await page.locator("h1").first().textContent();
      console.log(`Detail page /fonts/${slug} -> H1: "${heading?.trim()}"`);
      if (!heading) throw new Error(`Font detail page failed to load for ${slug}`);

      // Verify Azerbaijani glyph section
      const azGlyphText = await page.locator("text=Ə ə · Ğ ğ · İ ı · Ö ö · Ş ş · Ü ü · Ç ç").count();
      if (azGlyphText === 0) throw new Error(`Azerbaijani glyph specimen missing on /fonts/${slug}`);
    }
    console.log("✅ Font detail pages & Azerbaijani glyph specimens render with full fidelity!");

    console.log("\n=== 5. VERIFYING AZERBAIJANI LOCALIZED ROUTE (/az/fonts/roboto) ===");
    await page.goto("http://localhost:4198/az/fonts/roboto", { waitUntil: "networkidle" });
    const azHeading = await page.locator("h1").first().textContent();
    console.log(`AZ Detail page /az/fonts/roboto -> H1: "${azHeading?.trim()}"`);
    if (!azHeading?.includes("Roboto")) throw new Error("AZ font detail page failed");

    console.log("\n🎉 ALL FONT CATALOG, POPULARITY RANKING, AND AZERBAIJANI TESTS PASSED!");
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
