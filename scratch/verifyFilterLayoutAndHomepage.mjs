import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";

const PORT = 4173;
const DIST_DIR = path.resolve("dist");

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
  };
  return types[ext] || "application/octet-stream";
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split("?")[0];
  let filePath = path.join(DIST_DIR, urlPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, "index.html");
  }

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": getContentType(filePath) });
    res.end(data);
  } catch (err) {
    res.writeHead(404);
    res.end("Not Found");
  }
});

const VIEWPORTS = [
  { name: "Mobile Small", width: 375, height: 812, isMobile: true },
  { name: "iPhone 14", width: 390, height: 844, isMobile: true },
  { name: "iPhone Pro Max", width: 430, height: 932, isMobile: true },
  { name: "Tablet 768px", width: 768, height: 1024, isMobile: false },
  { name: "Tablet 1024px", width: 1024, height: 768, isMobile: false },
  { name: "Desktop 1440px", width: 1440, height: 900, isMobile: false },
];

async function main() {
  server.listen(PORT);
  console.log(`Preview server running at http://localhost:${PORT}`);

  const browser = await chromium.launch({ headless: true });
  let allPassed = true;

  // 1. Verify Homepage Structure (No WorkSection)
  console.log("\n=== 1. VERIFYING HOMEPAGE STRUCTURE ===");
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });

  const bodyText = await page.textContent("body");
  const hasTools = bodyText.includes("EXPLORE TOOLS") || bodyText.includes("ALƏTLƏRİ KƏŞF ET") || bodyText.includes("Alətlər");
  const hasEssays = bodyText.includes("READ THE ESSAYS") || bodyText.includes("ESSERLƏRİ OXU") || bodyText.includes("Bloq");
  const hasWorkSection = bodyText.includes("SELECTED WORK") || bodyText.includes("SEÇİLMİŞ İŞLƏR") || bodyText.includes("Graphic Case Studies");

  console.log(`- Tools Section / CTA present: ${hasTools}`);
  console.log(`- Essays Section / CTA present: ${hasEssays}`);
  console.log(`- Primary WorkSection present on Homepage: ${hasWorkSection} (Expected: false)`);

  if (!hasTools || !hasEssays || hasWorkSection) {
    console.error("❌ Homepage structure verification failed!");
    allPassed = false;
  } else {
    console.log("✅ Homepage positioning verified: Tools & Editorial prioritized, Work section removed from home flow.");
  }
  await page.close();

  // 2. Verify Filter & Search Overlap across Viewports
  console.log("\n=== 2. VERIFYING FILTER / SEARCH OVERLAP ACROSS VIEWPORTS ===");
  const testRoutes = [
    "/blog",
    "/az/blog",
    "/resources?category=fonts",
    "/resources?category=icons",
  ];

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
    });
    const p = await context.newPage();

    for (const route of testRoutes) {
      await p.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle" });

      // Check for horizontal page overflow
      const hasHorizontalScroll = await p.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      // Check overlap between search input and category filter buttons
      const overlapData = await p.evaluate(() => {
        const searchInput = document.querySelector('input[type="search"]');
        const filterButtons = Array.from(document.querySelectorAll('button[role="tab"]'));

        if (!searchInput || filterButtons.length === 0) {
          return { hasOverlap: false, buttonCount: filterButtons.length, hasSearch: Boolean(searchInput) };
        }

        const sRect = searchInput.getBoundingClientRect();
        let overlapFound = false;
        let overlappingButtonText = "";

        for (const btn of filterButtons) {
          const bRect = btn.getBoundingClientRect();
          // Check intersection
          const xOverlap = Math.max(0, Math.min(sRect.right, bRect.right) - Math.max(sRect.left, bRect.left));
          const yOverlap = Math.max(0, Math.min(sRect.bottom, bRect.bottom) - Math.max(sRect.top, bRect.top));
          const area = xOverlap * yOverlap;

          if (area > 10) { // More than 10px squared intersection
            overlapFound = true;
            overlappingButtonText = btn.textContent || "";
            break;
          }
        }

        return {
          hasOverlap: overlapFound,
          overlappingButtonText,
          buttonCount: filterButtons.length,
          hasSearch: true,
        };
      });

      console.log(`[${vp.width}px] ${route} -> Filters: ${overlapData.buttonCount} | Search: ${overlapData.hasSearch} | Overlap: ${overlapData.hasOverlap} | Overflow: ${hasHorizontalScroll}`);

      if (overlapData.hasOverlap) {
        console.error(`  ❌ Overlap detected between search bar and filter button "${overlapData.overlappingButtonText}" on ${route} at ${vp.width}px!`);
        allPassed = false;
      }
      if (hasHorizontalScroll) {
        console.error(`  ❌ Horizontal page overflow detected on ${route} at ${vp.width}px!`);
        allPassed = false;
      }
    }
    await context.close();
  }

  await browser.close();
  server.close();

  if (!allPassed) {
    console.error("\n❌ Layout verification failed!");
    process.exit(1);
  } else {
    console.log("\n🎉 ALL RESPONSIVE LAYOUT AND HOMEPAGE TESTS PASSED WITH 0 OVERLAPS!");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(err);
  server.close();
  process.exit(1);
});
