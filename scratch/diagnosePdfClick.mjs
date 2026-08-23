import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";

const PORT = 4178;
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
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const logs = [];
  page.on("console", (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on("pageerror", (err) => console.log("Page error:", err.message));

  await page.goto(`http://localhost:${PORT}/tools/resume-builder`, { waitUntil: "networkidle" });
  const btn = page.locator('button:has-text("PDF")').first();
  console.log("Button text:", await btn.textContent());
  await btn.click();
  await page.waitForTimeout(3000);
  console.log("Console logs after click:", logs);

  await browser.close();
  server.close();
}

main().catch(console.error);
