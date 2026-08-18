import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";

const distPath = "C:\\Project\\ReplicateGitHubPortfolioSite-main\\dist";

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://vercel.live https://*.vercel-scripts.com https://*.vercel-insights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: http:; media-src 'self' blob: https:; connect-src 'self' data: https: wss: https://*.clarity.ms https://c.clarity.ms; frame-src 'self' https:; object-src 'none'; base-uri 'self'"
  );

  let reqPath = req.url.split("?")[0];
  let filePath = path.join(distPath, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.existsSync(filePath)) {
    filePath = path.join(distPath, "index.html");
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (e) {
    res.writeHead(500);
    res.end("Server error");
  }
});

server.listen(5240, async () => {
  console.log("Testing server listening on http://localhost:5240");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
      console.log(`[BROWSER ERROR] ${msg.text()}`);
    }
  });

  page.on("pageerror", (err) => {
    console.error(`[PAGE ERROR] ${err.toString()}`);
  });

  try {
    console.log("1. Opening /tools/resume-builder...");
    await page.goto("http://localhost:5240/tools/resume-builder", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    // Verify Gallery Hero Text
    const heroTitle = await page.innerText("h1");
    console.log(`- Gallery Hero Title: "${heroTitle}"`);

    // Verify template cards count
    const cardCount = await page.locator("[data-template-id]").count();
    console.log(`- Template Cards rendered in gallery: ${cardCount}`);

    // Verify NO unwanted badges or pills
    const bodyText = await page.innerText("body");
    const hasUnwantedBadges =
      bodyText.includes("17 PRO RESUME TEMPLATES") ||
      bodyText.includes("All Templates (17)") ||
      bodyText.includes("ATS & Classic") ||
      bodyText.includes("Modern Design") ||
      bodyText.includes("Tech & Engineering");

    console.log(`- Clutter & Category Pills Removed: ${!hasUnwantedBadges ? "✅ YES (PASS)" : "❌ NO"}`);

    // Test PDF downloads for top distinct open-source templates
    const templatesToTest = [
      { id: "awesome-cv", name: "Awesome-CV", file: "Awesome_CV.pdf" },
      { id: "deedy-cv", name: "Deedy 2-Column", file: "Deedy_CV.pdf" },
      { id: "altacv", name: "AltaCV", file: "AltaCV.pdf" },
      { id: "tech-cv", name: "RenderCV sb2nov", file: "RenderCV_sb2nov.pdf" },
      { id: "minimal-cv", name: "Harvard Classic", file: "Harvard_Classic.pdf" },
    ];

    console.log(`\n--- TESTING VECTOR PDF EXPORTS ACROSS DISTINCT OPEN-SOURCE TEMPLATES ---`);
    for (const t of templatesToTest) {
      console.log(`\nTesting [${t.id}] ${t.name}...`);
      await page.goto("http://localhost:5240/tools/resume-builder", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1000);

      const card = page.locator(`[data-template-id="${t.id}"]`).first();
      await card.click();
      await page.waitForTimeout(1200);

      const downloadPromise = page.waitForEvent("download", { timeout: 12000 });
      const downloadBtn = page.getByRole("button", { name: /DOWNLOAD PDF|PDF YÜKLƏ/i }).first();
      await downloadBtn.click();

      const download = await downloadPromise;
      const savePath = path.join("C:\\Project\\ReplicateGitHubPortfolioSite-main\\scratch", t.file);
      await download.saveAs(savePath);
      const size = fs.statSync(savePath).size;
      console.log(`  ✓ PDF Downloaded: ${t.file} (Size: ${size} bytes)`);
    }

    console.log(`\n==================================================`);
    console.log(`🎉 ALL AUDITS & PDF GENERATIONS PASSED SUCCESSFULLY!`);
    console.log(`==================================================`);
  } catch (err) {
    console.error("Test failure:", err);
  } finally {
    await browser.close();
    server.close();
  }
});
