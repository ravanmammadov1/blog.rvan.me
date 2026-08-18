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
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split("?")[0];
  if (urlPath.endsWith("/")) urlPath += "index.html";

  let filePath = path.join(distDir, urlPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // Check if html file exists (e.g. /blog/index.html or /blog.html)
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
  await new Promise((resolve) => server.listen(4199, resolve));
  console.log("In-process static test server listening on http://localhost:4199");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log("\n=== 1. VERIFYING BLOG ARCHIVE UI (/blog) ===");
    await page.goto("http://localhost:4199/blog", { waitUntil: "networkidle" });

    // Check if APCA promo card exists on blog archive
    const apcaPromoCount = await page.locator("section[aria-label*='APCA']").count();
    console.log(`- APCA Promo card count on /blog: ${apcaPromoCount} (Expected: 0)`);
    if (apcaPromoCount > 0) throw new Error("APCA promo card should NOT appear on /blog");

    // Check filter pills text
    const filterPills = await page.locator("[role='tablist'] button[role='tab']").allTextContents();
    console.log(`- Filter pills text on /blog:`, filterPills);

    for (const text of filterPills) {
      if (/\(\d+\)/.test(text)) {
        throw new Error(`Filter pill contains unwanted number count: "${text}"`);
      }
    }
    console.log("✅ Category filter pills cleanly render names without number counts!");

    console.log("\n=== 2. VERIFYING AZERBAIJANI BLOG ARCHIVE (/az/blog) ===");
    await page.goto("http://localhost:4199/az/blog", { waitUntil: "networkidle" });
    const azApcaPromoCount = await page.locator("section[aria-label*='APCA']").count();
    console.log(`- APCA Promo card count on /az/blog: ${azApcaPromoCount} (Expected: 0)`);
    if (azApcaPromoCount > 0) throw new Error("APCA promo card should NOT appear on /az/blog");

    const azFilterPills = await page.locator("[role='tablist'] button[role='tab']").allTextContents();
    console.log(`- AZ Filter pills text:`, azFilterPills);
    for (const text of azFilterPills) {
      if (/\(\d+\)/.test(text)) {
        throw new Error(`AZ Filter pill contains unwanted number count: "${text}"`);
      }
    }
    console.log("✅ Azerbaijani category filter pills cleanly rendered without numbers!");

    console.log("\n=== 3. VERIFYING APCA TOOL REMAINS INTACT AT /tools/contrast-matrix ===");
    await page.goto("http://localhost:4199/tools/contrast-matrix", { waitUntil: "networkidle" });
    const toolH1 = await page.locator("h1").first().textContent();
    console.log(`- Contrast Tool H1: "${toolH1?.trim()}"`);
    if (!toolH1?.toLowerCase().includes("contrast") && !toolH1?.toLowerCase().includes("apca")) {
      throw new Error(`Unexpected contrast tool H1: "${toolH1}"`);
    }
    console.log("✅ Dedicated /tools/contrast-matrix verified intact and functional!");

    console.log("\n=== 4. RESPONSIVE VIEWPORTS ===");
    const viewports = [
      { name: "Mobile", width: 375, height: 667 },
      { name: "Tablet", width: 768, height: 1024 },
      { name: "Desktop", width: 1440, height: 900 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("http://localhost:4199/blog", { waitUntil: "networkidle" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      console.log(`- [${vp.name} ${vp.width}px] Horizontal Overflow: ${overflow}`);
      if (overflow) throw new Error(`Horizontal overflow detected on ${vp.name}`);
    }

    console.log("\n🎉 ALL BLOG ARCHIVE & FILTER CLEANUP TESTS PASSED SUCCESSFULLY!");
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
