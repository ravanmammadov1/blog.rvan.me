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
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://vercel.live https://*.vercel-scripts.com https://*.vercel-insights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: http:; media-src 'self' blob: https:; connect-src 'self' https: wss:; frame-src 'self' https:; object-src 'none'; base-uri 'self'");

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

server.listen(5220, async () => {
  console.log("Server listening on http://localhost:5220");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const allLogs = [];
  page.on("console", (msg) => {
    const logItem = `[CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`;
    allLogs.push(logItem);
    console.log(logItem);
  });

  page.on("pageerror", (err) => {
    console.error(`[PAGE ERROR] ${err.toString()}`);
  });

  page.on("dialog", async (dialog) => {
    console.log(`[BROWSER DIALOG/ALERT] "${dialog.message()}"`);
    await dialog.dismiss();
  });

  try {
    console.log("1. Opening /tools/resume-builder...");
    await page.goto("http://localhost:5220/tools/resume-builder", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    // 2. Select Harvard Classic ('minimal-cv')
    console.log("2. Selecting 'minimal-cv' (Harvard Classic)...");
    const harvardCard = page.locator('[data-template-id="minimal-cv"]').first();
    await harvardCard.click();
    await page.waitForTimeout(1500);

    // 3. Click DOWNLOAD PDF
    console.log("3. Clicking 'DOWNLOAD PDF' button...");
    const downloadPromise = page.waitForEvent("download", { timeout: 10000 }).catch((e) => {
      console.log("[PLAYWRIGHT] Download event did not fire within 10s:", e.message);
      return null;
    });

    const downloadBtn = page.getByRole("button", { name: /DOWNLOAD PDF|PDF YÜKLƏ/i }).first();
    await downloadBtn.click();

    const download = await downloadPromise;
    if (download) {
      const downloadPath = path.join("C:\\Project\\ReplicateGitHubPortfolioSite-main\\scratch", download.suggestedFilename());
      await download.saveAs(downloadPath);
      console.log(`[SUCCESS] PDF downloaded and saved to: ${downloadPath} (size: ${fs.statSync(downloadPath).size} bytes)`);
    } else {
      console.log("[DIAGNOSIS] Download failed or was blocked.");
    }

    await page.waitForTimeout(3000);
  } catch (err) {
    console.error("Test script failure:", err);
  } finally {
    await browser.close();
    server.close();
  }
});
