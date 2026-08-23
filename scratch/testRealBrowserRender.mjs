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

server.listen(5210, async () => {
  console.log("Server listening on port 5210...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleLogs = [];
  const errors = [];

  page.on("console", (msg) => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === "error") {
      console.log(`[CONSOLE ERROR] ${msg.text()}`);
    }
  });

  page.on("pageerror", (err) => {
    errors.push(err.toString());
    console.error(`[PAGE ERROR] ${err.toString()}`);
  });

  try {
    console.log("Loading http://localhost:5210/tools/resume-builder...");
    await page.goto("http://localhost:5210/tools/resume-builder", { waitUntil: "domcontentloaded" });
    
    // Wait for the main tool heading to appear
    await page.waitForSelector("h1", { timeout: 10000 });
    const h1 = await page.innerText("h1");
    console.log(`Rendered H1: "${h1}"`);

    // Check if Resume Builder Gallery or Canvas rendered
    const hasGallery = await page.getByText(/Select Your Resume Template|Peşəkar CV Şablonunuzu Seçin/i).first().isVisible();
    console.log(`- Template Gallery visible: ${hasGallery}`);

    const hasCards = await page.locator('[data-template-id]').count();
    console.log(`- Template Cards rendered in DOM: ${hasCards}`);

    const hasReact306 = consoleLogs.some((l) => l.text.includes("306") || l.text.includes("Element type is invalid"));
    const hasCspError = consoleLogs.some((l) => l.text.toLowerCase().includes("eval") && l.text.toLowerCase().includes("content security policy"));

    console.log("\n==================================================");
    console.log(`React #306: ${hasReact306 ? "❌ FAIL" : "✅ PASS (0 errors)"}`);
    console.log(`CSP eval: ${hasCspError ? "❌ FAIL" : "✅ PASS (0 violations)"}`);
    console.log(`Uncaught Errors: ${errors.length === 0 ? "✅ PASS (0 errors)" : `❌ FAIL (${errors.length})`}`);
    console.log(`Template Cards Count: ${hasCards} templates`);
    console.log("==================================================");

    if (!hasReact306 && !hasCspError && errors.length === 0 && hasCards > 0) {
      console.log("🚀 REAL BROWSER AUDIT: 100% SUCCESSFUL!");
    } else {
      console.error("❌ AUDIT FAILED!");
    }
  } catch (err) {
    console.error("Error running test:", err);
  } finally {
    await browser.close();
    server.close();
  }
});
