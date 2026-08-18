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

async function main() {
  server.listen(PORT);
  console.log(`Preview server running at http://localhost:${PORT}`);

  const browser = await chromium.launch({ headless: true });
  const routesToTest = [
    { path: "/blog", expectedText: "Design & Editorial Essays" },
    { path: "/az/blog", expectedText: "Dizayn və redaksiya" },
    { path: "/blog/why-changing-a-font-changes-brand-personality", expectedText: "Why Does Changing a Font" },
    { path: "/az/blog/srift-deyisikliyi-ve-brend-xarakteri", expectedText: "Şrifti Dəyişmək Bir Brendin" },
    { path: "/blog/fomo-loss-aversion-scarcity-psychology", expectedText: "FOMO & Loss Aversion" },
    { path: "/az/blog/fomo-itirmek-qorxusu-psixologiyasi", expectedText: "FOMO və İtkidən Qorxma" },
    { path: "/blog/why-luxury-brands-use-so-much-empty-space", expectedText: "Why Do Luxury Brands Use So Much Empty Space?" },
    { path: "/az/blog/luks-brendler-ve-bos-mekan-psixologiyasi", expectedText: "Lüks Brendlər Niyə Bu Qədər Çox Boş Məkandan İstifadə Edirlər?" },
  ];

  let testPassed = true;

  for (const { path: route, expectedText } of routesToTest) {
    // Test Desktop
    const contextDesktop = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const pageDesktop = await contextDesktop.newPage();
    const runtimeErrorsDesktop = [];
    pageDesktop.on("pageerror", (err) => {
      runtimeErrorsDesktop.push(err.message);
    });

    await pageDesktop.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle" });
    const contentDesktop = await pageDesktop.content();
    const h1Desktop = await pageDesktop.locator("h1").first().textContent().catch(() => null);
    const hasExpectedText = contentDesktop.includes(expectedText) || (h1Desktop && h1Desktop.includes(expectedText));

    console.log(`[DESKTOP 1440px] ${route} -> H1: "${h1Desktop?.trim()}" | Matched: ${Boolean(hasExpectedText)} | JS Errors: ${runtimeErrorsDesktop.length}`);
    if (runtimeErrorsDesktop.length > 0 || !hasExpectedText) {
      console.error(`  Failure on desktop ${route}`);
      testPassed = false;
    }
    await contextDesktop.close();

    // Test Mobile
    const contextMobile = await browser.newContext({
      viewport: { width: 375, height: 812 },
      isMobile: true,
    });
    const pageMobile = await contextMobile.newPage();
    const runtimeErrorsMobile = [];
    pageMobile.on("pageerror", (err) => {
      runtimeErrorsMobile.push(err.message);
    });

    await pageMobile.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle" });
    const contentMobile = await pageMobile.content();
    const h1Mobile = await pageMobile.locator("h1").first().textContent().catch(() => null);
    const hasExpectedTextMobile = contentMobile.includes(expectedText) || (h1Mobile && h1Mobile.includes(expectedText));

    console.log(`[MOBILE 375px]   ${route} -> H1: "${h1Mobile?.trim()}" | Matched: ${Boolean(hasExpectedTextMobile)} | JS Errors: ${runtimeErrorsMobile.length}`);
    if (runtimeErrorsMobile.length > 0 || !hasExpectedTextMobile) {
      console.error(`  Failure on mobile ${route}`);
      testPassed = false;
    }
    await contextMobile.close();
  }

  await browser.close();
  server.close();

  if (!testPassed) {
    console.error("\n❌ Playwright verification encountered errors!");
    process.exit(1);
  } else {
    console.log("\n✅ All routes verified successfully in Playwright with ZERO runtime exceptions and perfect DOM content matching!");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(err);
  server.close();
  process.exit(1);
});
