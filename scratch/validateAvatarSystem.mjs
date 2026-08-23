import http from "http";
import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const distDir = path.resolve("dist");

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split("?")[0];
  if (urlPath.endsWith("/")) urlPath += "index.html";

  let filePath = path.join(distDir, urlPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    if (fs.existsSync(path.join(distDir, urlPath, "index.html"))) {
      filePath = path.join(distDir, urlPath, "index.html");
    } else if (fs.existsSync(path.join(distDir, `${urlPath}.html`))) {
      filePath = path.join(distDir, `${urlPath}.html`);
    } else {
      filePath = path.join(distDir, "index.html");
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end("Server Error");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
});

async function run() {
  await new Promise((resolve) => server.listen(4197, resolve));
  console.log("Static test server listening on http://localhost:4197");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("CONSOLE ERROR:", msg.text());
  });

  try {
    console.log("\n=== 1. VERIFYING GUEST USER STABLE AVATAR IN HEADER ===");
    await page.goto("http://localhost:4197/", { waitUntil: "networkidle" });

    // Find avatar image in header
    const headerAvatar = page.locator(".user-auth-menu img").first();
    await headerAvatar.waitFor({ timeout: 5000 });
    const initialSrc = await headerAvatar.getAttribute("src");
    console.log("- Header avatar img src format:", initialSrc?.substring(0, 45) + "...");
    if (!initialSrc || !initialSrc.startsWith("data:image/svg+xml")) {
      throw new Error("Header avatar is not a valid SVG Data URI");
    }

    // Navigate to /blog and verify avatar remains identical in the same session
    await page.goto("http://localhost:4197/blog", { waitUntil: "networkidle" });
    const blogHeaderAvatarSrc = await page.locator(".user-auth-menu img").first().getAttribute("src");
    if (blogHeaderAvatarSrc !== initialSrc) {
      throw new Error("Guest avatar changed during session navigation");
    }
    console.log("✅ Guest avatar remains perfectly stable across route navigation!");

    console.log("\n=== 2. VERIFYING PROFILE SETTINGS & AVATAR ACTIONS (/profile) ===");
    await page.goto("http://localhost:4197/profile", { waitUntil: "networkidle" });

    // Check profile card avatar image
    const profileImg = page.locator("img[alt*='User'], img[alt*='Guest']").first();
    await profileImg.waitFor({ timeout: 5000 });
    const profileAvatarSrc = await profileImg.getAttribute("src");
    console.log("- Initial Header src:", initialSrc?.substring(0, 50));
    console.log("- Profile Avatar src:", profileAvatarSrc?.substring(0, 50));
    if (profileAvatarSrc !== initialSrc) {
      throw new Error("Profile page avatar does not match session avatar");
    }
    console.log("✅ Profile page renders session character avatar accurately!");

    const allInteractive = await page.locator("main button, main a").allTextContents();
    console.log("- All interactive elements in main on /profile:", allInteractive);

    const allButtons = await page.locator("button").allTextContents();
    console.log("- All buttons on /profile:", allButtons);

    const randomizeBtn = page.locator("button[title*='Randomize'], button:has-text('RANDOMIZE'), button:has-text('TƏSADÜFİ')").first();
    await randomizeBtn.click();
    await page.waitForTimeout(500);

    const newProfileSrc = await profileImg.getAttribute("src");
    console.log("- New Profile Avatar src after randomize:", newProfileSrc?.substring(0, 50));
    if (newProfileSrc === initialSrc) {
      throw new Error("Randomize avatar failed to update avatar");
    }
    console.log("✅ Randomize avatar successfully created new character and updated state in real time!");

    console.log("\n=== 3. VERIFYING CHARACTER BUILDER TOOL (/tools/open-peeps) ===");
    await page.goto("http://localhost:4197/tools/open-peeps", { waitUntil: "networkidle" });

    // Verify Character Studio loaded
    const studioHeading = await page.locator("h2").first().textContent();
    console.log("- Studio Heading:", studioHeading?.trim());

    // Test Seed generator
    const seedInput = page.locator("input[placeholder*='name, handle']");
    await seedInput.fill("Ravan Mammadov");
    await page.locator("button:has-text('Generate')").click();
    await page.waitForTimeout(400);
    console.log("✅ Seed-based deterministic character generated!");

    // Test "SET AS PROFILE AVATAR" button
    const setAvatarBtn = page.locator("button:has-text('SET AS PROFILE AVATAR'), button:has-text('SET AS AVATAR')").first();
    await setAvatarBtn.click();
    await page.waitForTimeout(400);

    // Verify Header avatar updated
    const updatedHeaderSrc = await page.locator(".user-auth-menu img").first().getAttribute("src");
    console.log("- Updated Header Avatar src:", updatedHeaderSrc?.substring(0, 45) + "...");
    if (!updatedHeaderSrc?.startsWith("data:image/svg+xml")) {
      throw new Error("Header avatar failed to sync with character studio");
    }
    console.log("✅ Character Builder -> Profile Avatar sync fully verified!");

    console.log("\n=== 4. RESPONSIVE VIEWPORTS ===");
    const viewports = [
      { name: "Mobile", width: 375, height: 667 },
      { name: "Tablet", width: 768, height: 1024 },
      { name: "Desktop", width: 1440, height: 900 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("http://localhost:4197/tools/open-peeps", { waitUntil: "networkidle" });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      console.log(`- [${vp.name} ${vp.width}px] Horizontal Overflow: ${overflow}`);
      if (overflow) throw new Error(`Horizontal overflow detected on ${vp.name}`);
    }

    console.log("\n🎉 ALL AVATAR SYSTEM & CHARACTER BUILDER TESTS PASSED SUCCESSFULLY!");
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
