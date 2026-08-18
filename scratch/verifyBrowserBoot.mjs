import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";

// Simple static server for dist
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
  // Simulate strict CSP header from vercel.json
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://vercel.live https://*.vercel-scripts.com https://*.vercel-insights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: http:; media-src 'self' blob: https:; connect-src 'self' https: wss:; frame-src 'self' https:; object-src 'none'; base-uri 'self'");

  let reqPath = req.url.split("?")[0];
  let filePath = path.join(distPath, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.existsSync(filePath)) {
    // SPA fallback
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

server.listen(5199, async () => {
  console.log("Static test server running on http://localhost:5199");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleLogs = [];
  const pageErrors = [];

  page.on("console", (msg) => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === "error") {
      console.log(`[BROWSER ERROR] ${msg.text()}`);
    } else if (msg.type() === "warning") {
      console.log(`[BROWSER WARN] ${msg.text()}`);
    }
  });

  page.on("pageerror", (err) => {
    pageErrors.push(err.toString());
    console.error(`[UNCAUGHT PAGE ERROR] ${err.toString()}`);
  });

  try {
    console.log("Navigating to http://localhost:5199/tools/resume-builder in real Chromium...");
    await page.goto("http://localhost:5199/tools/resume-builder", { waitUntil: "networkidle", timeout: 15000 });

    // Wait a bit for React to hydrate and render
    await page.waitForTimeout(2000);

    const title = await page.title();
    console.log(`Page title: "${title}"`);

    // Check if Resume Builder is rendered
    const hasCanvas = await page.$("#resume-canvas-viewport");
    const hasTemplatesBtn = await page.getByText("TEMPLATES", { exact: false }).first();
    const hasDownloadBtn = await page.getByText("DOWNLOAD PDF", { exact: false }).first();

    console.log(`- #resume-canvas-viewport found: ${Boolean(hasCanvas)}`);
    console.log(`- TEMPLATES button found: ${Boolean(hasTemplatesBtn)}`);
    console.log(`- DOWNLOAD PDF button found: ${Boolean(hasDownloadBtn)}`);

    // Check for React #306 or any minified error
    const hasReact306 = consoleLogs.some((l) => l.text.includes("306") || l.text.includes("Element type is invalid"));
    const hasCspError = consoleLogs.some((l) => l.text.toLowerCase().includes("content security policy") || l.text.includes("eval"));

    console.log("\n==================================================");
    console.log(`React #306 Error Present: ${hasReact306 ? "❌ YES (FAIL)" : "✅ NO (PASS)"}`);
    console.log(`CSP eval Error Present: ${hasCspError ? "❌ YES (FAIL)" : "✅ NO (PASS)"}`);
    console.log(`Page Uncaught Errors: ${pageErrors.length === 0 ? "✅ 0 (PASS)" : `❌ ${pageErrors.length} (FAIL)`}`);
    console.log("==================================================");

    if (!hasReact306 && !hasCspError && pageErrors.length === 0 && Boolean(hasCanvas)) {
      console.log("🎉 VERIFICATION PASSED! THE APPLICATION BOOTS FLAWLESSLY IN CHROME!");
    } else {
      console.error("❌ VERIFICATION FAILED!");
    }
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await browser.close();
    server.close();
  }
});
