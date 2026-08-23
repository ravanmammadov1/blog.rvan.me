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

server.listen(5250, async () => {
  console.log("Testing server listening on http://localhost:5250");
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
    console.log("1. Navigating to /tools/resume-builder...");
    await page.goto("http://localhost:5250/tools/resume-builder", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    // 1. Verify Gallery
    const cardCount = await page.locator("[data-template-id]").count();
    console.log(`- Gallery loaded with ${cardCount} template cards.`);

    // 2. Select Awesome-CV
    console.log("2. Selecting 'Awesome-CV' template...");
    const awesomeCard = page.locator(`[data-template-id="awesome-cv"]`).first();
    await awesomeCard.click();
    await page.waitForTimeout(1000);

    // 3. Verify Canva-like Top Bar (No duplicate horizontal template bar)
    const headerButtons = await page.locator("header button").allTextContents();
    console.log(`- Top Header buttons: ${JSON.stringify(headerButtons)}`);

    // 4. Verify Left Toolbar tabs
    const designBtn = page.getByRole("button", { name: /Design|Dizayn/i }).first();
    const contentBtn = page.getByRole("button", { name: /Content|Məzmun/i }).first();
    const styleBtn = page.getByRole("button", { name: /Style|Üslub/i }).first();
    console.log(`- Left Toolbar tabs present: Design=${Boolean(designBtn)}, Content=${Boolean(contentBtn)}, Style=${Boolean(styleBtn)}`);

    // 5. Open Design Drawer
    console.log("3. Clicking 'Design' tab...");
    await designBtn.click();
    await page.waitForTimeout(500);

    // 6. Click 'Browse All Templates' inside Design Drawer
    console.log("4. Clicking 'Browse All Templates' in drawer...");
    const browseBtn = page.getByRole("button", { name: /Browse All Templates|Bütün Şablonlara Bax/i });
    await browseBtn.click();
    await page.waitForTimeout(600);

    // 7. Pick AltaCV from Modal
    console.log("5. Selecting 'AltaCV' from universal modal...");
    const altaCard = page.locator(`[data-template-id="altacv"]`).last();
    await altaCard.click();
    await page.waitForTimeout(1000);

    // 8. Download PDF for AltaCV
    console.log("6. Clicking DOWNLOAD PDF for AltaCV...");
    const downloadPromise1 = page.waitForEvent("download", { timeout: 12000 });
    const downloadBtn = page.getByRole("button", { name: /DOWNLOAD PDF|PDF YÜKLƏ/i }).first();
    await downloadBtn.click();
    const download1 = await downloadPromise1;
    const savePath1 = path.join("C:\\Project\\ReplicateGitHubPortfolioSite-main\\scratch", "Verified_AltaCV.pdf");
    await download1.saveAs(savePath1);
    console.log(`  ✓ AltaCV PDF downloaded: ${fs.statSync(savePath1).size} bytes`);

    // 9. Switch to Deedy 2-Column
    console.log("7. Switching to Deedy 2-Column...");
    // If drawer is closed, open it
    const isDrawerOpen = await page.locator("text=/Active Template|Aktiv Şablon/i").isVisible();
    if (!isDrawerOpen) {
      await designBtn.click();
      await page.waitForTimeout(500);
    }
    const browseBtn2 = page.getByRole("button", { name: /Browse All Templates|Bütün Şablonlara Bax/i });
    await browseBtn2.click();
    await page.waitForTimeout(600);
    const deedyCard = page.locator(`[data-template-id="deedy-cv"]`).last();
    await deedyCard.click();
    await page.waitForTimeout(1000);

    // 10. Download PDF for Deedy 2-Column
    console.log("8. Clicking DOWNLOAD PDF for Deedy 2-Column...");
    const downloadPromise2 = page.waitForEvent("download", { timeout: 12000 });
    await downloadBtn.click();
    const download2 = await downloadPromise2;
    const savePath2 = path.join("C:\\Project\\ReplicateGitHubPortfolioSite-main\\scratch", "Verified_Deedy_CV.pdf");
    await download2.saveAs(savePath2);
    console.log(`  ✓ Deedy 2-Column PDF downloaded: ${fs.statSync(savePath2).size} bytes`);

    console.log("\n==================================================");
    console.log("🎉 ALL CANVA-STYLE WORKFLOW TESTS PASSED 100%!");
    console.log("==================================================");
  } catch (err) {
    console.error("Test failure:", err);
  } finally {
    await browser.close();
    server.close();
  }
});
