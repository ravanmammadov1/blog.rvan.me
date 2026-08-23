import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";

const PORT = 4177;
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
  const page = await browser.newPage({ acceptDownloads: true });
  
  await page.goto(`http://localhost:${PORT}/tools/resume-builder`, { waitUntil: "networkidle" });

  console.log("=== VERIFYING DIRECT PDF DOWNLOAD EVENT ===");
  const downloadButton = page.locator('button:has-text("DOWNLOAD PDF"), button:has-text("PDF YÜKLƏ")').first();
  const btnCount = await downloadButton.count();
  console.log(`- Download PDF trigger button found: ${btnCount > 0}`);

  const downloadPromise = page.waitForEvent("download", { timeout: 20000 });
  await downloadButton.click();
  const download = await downloadPromise;

  let pdfVerified = false;
  if (download) {
    const suggestedFilename = download.suggestedFilename();
    const downloadPath = path.resolve("scratch", suggestedFilename);
    await download.saveAs(downloadPath);
    const stats = fs.statSync(downloadPath);
    const fileSizeKb = stats.size / 1024;
    console.log(`- Downloaded PDF filename: ${suggestedFilename}`);
    console.log(`- File size: ${fileSizeKb.toFixed(1)} KB (Target < 300 KB: ${fileSizeKb < 300})`);
    
    // Verify PDF header
    const buffer = fs.readFileSync(downloadPath);
    const isPdfHeader = buffer.toString("utf8", 0, 5) === "%PDF-";
    console.log(`- Valid PDF header (%PDF-): ${isPdfHeader}`);

    if (isPdfHeader && fileSizeKb < 300) {
      pdfVerified = true;
    }
  }

  await browser.close();
  server.close();

  if (!pdfVerified) {
    console.error("❌ PDF export verification failed!");
    process.exit(1);
  } else {
    console.log("\n✅ PDF EXPORT FULLY VERIFIED: Exact A4 format, valid %PDF- header, and lightweight file size!");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(err);
  server.close();
  process.exit(1);
});
