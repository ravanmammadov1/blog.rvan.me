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
  let allPassed = true;

  // 1. Verify CV Builder UI & PDF Export
  console.log("\n=== 1. VERIFYING RESUME BUILDER UI & EXPORT CONTROLS ===");
  const pageBuilder = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageBuilder.goto(`http://localhost:${PORT}/tools/resume-builder`, { waitUntil: "networkidle" });

  const hasDownloadPdf = (await pageBuilder.locator('button:has-text("DOWNLOAD PDF"), button:has-text("PDF YÜKLƏ")').count()) > 0;
  const hasYamlExport = (await pageBuilder.locator('text=RenderCV YAML').count()) > 0;
  const hasJsonExport = (await pageBuilder.locator('text=Reactive Resume v4').count()) > 0;
  const hasSharePublic = (await pageBuilder.locator('button:has-text("SHARE / CLOUD"), button:has-text("PUBLIC LINK"), button:has-text("LİNK YARAT")').count()) > 0;

  console.log(`- Download PDF primary button present: ${hasDownloadPdf} (Expected: true)`);
  console.log(`- RenderCV YAML menu present: ${hasYamlExport} (Expected: false)`);
  console.log(`- Reactive Resume JSON menu present: ${hasJsonExport} (Expected: false)`);
  console.log(`- Share / Public link button present: ${hasSharePublic} (Expected: true)`);

  if (!hasDownloadPdf || hasYamlExport || hasJsonExport || !hasSharePublic) {
    console.error("❌ CV Builder export controls verification failed!");
    allPassed = false;
  } else {
    console.log("✅ CV Builder cleanly streamlined: Single 'Download PDF' export + Public Web link sharing.");
  }
  await pageBuilder.close();

  // 2. Verify Public CV Web Page & SEO noindex Guardrail
  console.log("\n=== 2. VERIFYING PUBLIC CV PAGE & SEO SAFETY ===");
  const pageCv = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageCv.goto(`http://localhost:${PORT}/cv/sample`, { waitUntil: "networkidle" });

  const cvTitle = await pageCv.locator("h1").textContent().catch(() => "");
  const hasPdfDownloadOnPublic = (await pageCv.locator('button:has-text("DOWNLOAD PDF"), button:has-text("PDF ENDİR")').count()) > 0;
  const robotsMeta = await pageCv.locator('meta[name="robots"]').getAttribute("content").catch(() => "");

  console.log(`- Public CV H1: "${cvTitle?.trim()}"`);
  console.log(`- Public PDF Download button present: ${hasPdfDownloadOnPublic} (Expected: true)`);
  console.log(`- Robots Meta tag on default public CV: "${robotsMeta}" (Expected: contains noindex)`);

  if (!hasPdfDownloadOnPublic || !robotsMeta?.includes("noindex")) {
    console.error("❌ Public CV page verification failed (missing download or missing noindex guardrail)!");
    allPassed = false;
  } else {
    console.log("✅ Public CV page verified: Full on-screen CV render + PDF download + Strict SEO noindex protection.");
  }
  await pageCv.close();

  // 3. Verify Azerbaijani Localization on Public CV
  console.log("\n=== 3. VERIFYING AZERBAIJANI PUBLIC CV ROUTE ===");
  const pageCvAz = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageCvAz.goto(`http://localhost:${PORT}/az/cv/sample`, { waitUntil: "networkidle" });

  const hasAzDownloadBtn = (await pageCvAz.locator('button:has-text("PDF ENDİR")').count()) > 0;
  const hasAzShareBtn = (await pageCvAz.locator('button:has-text("LİNKİ PAYLAŞ")').count()) > 0;

  console.log(`- AZ PDF Download Button present: ${hasAzDownloadBtn}`);
  console.log(`- AZ Share Link Button present: ${hasAzShareBtn}`);

  if (!hasAzDownloadBtn || !hasAzShareBtn) {
    console.error("❌ Azerbaijani public CV route verification failed!");
    allPassed = false;
  } else {
    console.log("✅ Azerbaijani public CV route verified successfully!");
  }
  await pageCvAz.close();

  // 4. Responsive Viewport Checks
  console.log("\n=== 4. VERIFYING RESPONSIVE VIEWPORTS ===");
  const viewports = [
    { name: "Mobile (375px)", width: 375, height: 812, isMobile: true },
    { name: "Tablet (768px)", width: 768, height: 1024, isMobile: false },
    { name: "Desktop (1440px)", width: 1440, height: 900, isMobile: false },
  ];

  for (const vp of viewports) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile });
    const p = await ctx.newPage();
    await p.goto(`http://localhost:${PORT}/cv/sample`, { waitUntil: "networkidle" });

    const hasHorizontalOverflow = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`[${vp.name}] /cv/sample -> Horizontal Overflow: ${hasHorizontalOverflow}`);

    if (hasHorizontalOverflow) {
      console.error(`❌ Horizontal overflow on ${vp.name}!`);
      allPassed = false;
    }
    await ctx.close();
  }

  await browser.close();
  server.close();

  if (!allPassed) {
    console.error("\n❌ CV Builder & Public CV verification failed!");
    process.exit(1);
  } else {
    console.log("\n🎉 ALL CV BUILDER, PDF EXPORT, PUBLIC CV, AND SEO SAFETY TESTS PASSED!");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(err);
  server.close();
  process.exit(1);
});
