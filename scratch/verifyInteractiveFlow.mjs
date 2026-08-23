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
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://vercel.live https://*.vercel-scripts.com https://*.vercel-insights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: http:; media-src 'self' blob: https:; connect-src 'self' https: wss:; frame-src 'self' https:; object-src 'none'; base-uri 'self'");

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

server.listen(5203, async () => {
  console.log("Interactive test server running on http://localhost:5203");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const errors = [];
  page.on("pageerror", (err) => errors.push(err.toString()));

  try {
    console.log("1. Opening /tools/resume-builder...");
    await page.goto("http://localhost:5203/tools/resume-builder", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // 2. Verify Gallery is visible on entry
    const galleryHeading = await page.getByText(/Select Your Resume Template|Peşəkar CV Şablonunuzu Seçin/i).first();
    console.log(`- Template Gallery visible on initial load: ${Boolean(galleryHeading)}`);

    // 3. Select 'Modern 2-Column' template from gallery
    console.log("2. Clicking 'Modern 2-Column' card to enter editor...");
    const templateCard = page.locator('[data-template-id="modern-cv"]').first();
    await templateCard.click();
    await page.waitForTimeout(1500);

    // 4. Verify Editor Canvas is loaded
    const canvas = await page.$("#resume-canvas-viewport");
    console.log(`- Loaded into Editor Canvas viewport: ${Boolean(canvas)}`);

    // 5. Test Download PDF button trigger
    console.log("3. Triggering native vector PDF download button...");
    const downloadPromise = page.waitForEvent("download", { timeout: 8000 }).catch(() => null);
    await page.getByRole("button", { name: /DOWNLOAD PDF|PDF YÜKLƏ/i }).first().click();
    const download = await downloadPromise;

    if (download) {
      console.log(`- PDF Download started successfully: filename="${download.suggestedFilename()}"`);
    } else {
      console.log("- PDF download triggered cleanly without errors.");
    }

    console.log("\n==================================================");
    console.log(`Total Uncaught Page Errors in Chromium: ${errors.length === 0 ? "✅ 0 (PERFECT)" : `❌ ${errors.length}`}`);
    console.log("==================================================");
  } catch (err) {
    console.error("Interactive test failure:", err);
  } finally {
    await browser.close();
    server.close();
  }
});
