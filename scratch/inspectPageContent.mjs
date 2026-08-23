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

server.listen(5205, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto("http://localhost:5205/tools/resume-builder", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const text = await page.innerText("body");
  console.log("=== BODY TEXT DUMP ===");
  console.log(text.substring(0, 1500));
  console.log("======================");

  const html = await page.innerHTML("body");
  console.log("=== DATA-TEMPLATE-ID IN HTML? ===");
  console.log(html.includes("data-template-id"));

  await browser.close();
  server.close();
});
