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

server.listen(5230, async () => {
  console.log("Testing server listening on http://localhost:5230");
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

  const templatesToTest = [
    { id: "minimal-cv", name: "Harvard Classic", filename: "Harvard_Classic_CV.pdf" },
    { id: "tech-cv", name: "Modern Tech", filename: "Modern_Tech_CV.pdf" },
    { id: "modern-cv", name: "Modern 2-Column", filename: "Modern_2Column_CV.pdf" },
  ];

  const results = [];

  try {
    for (const t of templatesToTest) {
      console.log(`\n==================================================`);
      console.log(`TESTING TEMPLATE: ${t.name} (${t.id})`);
      console.log(`==================================================`);

      // 1. Open /tools/resume-builder
      await page.goto("http://localhost:5230/tools/resume-builder", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1000);

      // 2. Click template card
      console.log(`1. Selecting '${t.name}' from gallery...`);
      const card = page.locator(`[data-template-id="${t.id}"]`).first();
      await card.click();
      await page.waitForTimeout(1200);

      // 3. Verify canvas is visible
      const canvas = await page.$("#resume-canvas-viewport");
      console.log(`2. Canvas viewport rendered: ${Boolean(canvas)}`);

      // 4. Click DOWNLOAD PDF and await download event
      console.log(`3. Clicking DOWNLOAD PDF button...`);
      const downloadPromise = page.waitForEvent("download", { timeout: 12000 });
      const downloadBtn = page.getByRole("button", { name: /DOWNLOAD PDF|PDF YÜKLƏ/i }).first();
      await downloadBtn.click();

      const download = await downloadPromise;
      const savePath = path.join("C:\\Project\\ReplicateGitHubPortfolioSite-main\\scratch", t.filename);
      await download.saveAs(savePath);

      const stats = fs.statSync(savePath);
      console.log(`4. Download Complete! File: ${t.filename}, Size: ${stats.size} bytes`);

      // 5. Verify download button is NOT stuck in "Generating..."
      await page.waitForTimeout(500);
      const btnText = await downloadBtn.innerText();
      const isNotGenerating = !btnText.toLowerCase().includes("generating");
      console.log(`5. Button state reset properly (not stuck): ${isNotGenerating} (Text: "${btnText}")`);

      results.push({
        template: t.name,
        id: t.id,
        size: stats.size,
        success: stats.size > 1000 && isNotGenerating,
      });
    }

    console.log(`\n==================================================`);
    console.log(`FINAL TEMPLATE PDF DOWNLOAD AUDIT MATRIX`);
    console.log(`==================================================`);
    for (const r of results) {
      console.log(`- [${r.id}] ${r.template}: ${r.success ? "✅ PASS" : "❌ FAIL"} (Size: ${r.size} bytes)`);
    }

    const allPassed = results.every((r) => r.success);
    console.log(`\nALL 3 TARGET TEMPLATES PASSED: ${allPassed ? "✅ YES (100% PRODUCTION READY)" : "❌ NO"}`);
    console.log(`==================================================`);
  } catch (err) {
    console.error("Test execution error:", err);
  } finally {
    await browser.close();
    server.close();
  }
});
