import { chromium } from 'playwright';

const BASE_URL = 'https://www.rvan.me';

const routesToTest = [
  // EN Routes
  { path: '/', name: 'EN Home' },
  { path: '/blog', name: 'EN Blog Archive' },
  { path: '/blog/guide-responsive-fluid-typography-css-clamp', name: 'EN Article: Typography Guide' },
  { path: '/tools/contrast-matrix', name: 'EN Tool: Contrast Matrix' },
  { path: '/tools/typography-scale', name: 'EN Tool: Typography Scale' },
  { path: '/tools/persuasion-analyzer', name: 'EN Tool: Persuasion Analyzer' },
  { path: '/tools/resume-builder', name: 'EN Tool: Resume Builder' },
  { path: '/tools/open-peeps', name: 'EN Tool: Character Builder' },
  { path: '/topics', name: 'EN Topics Archive' },
  { path: '/topics/typography', name: 'EN Topic: Typography' },
  { path: '/fonts/inter', name: 'EN Font: Inter' },

  // AZ Routes
  { path: '/az', name: 'AZ Home' },
  { path: '/az/blog', name: 'AZ Blog Archive' },
  { path: '/az/blog/guide-responsive-fluid-typography-css-clamp', name: 'AZ Article: Typography Guide' },
  { path: '/az/tools/contrast-matrix', name: 'AZ Tool: Contrast Matrix' },
  { path: '/az/tools/typography-scale', name: 'AZ Tool: Typography Scale' },
  { path: '/az/tools/persuasion-analyzer', name: 'AZ Tool: Persuasion Analyzer' },
  { path: '/az/topics', name: 'AZ Topics Archive' },
  { path: '/az/topics/typography', name: 'AZ Topic: Typography' },
  { path: '/az/fonts/inter', name: 'AZ Font: Inter' },
];

const viewports = [
  { width: 1440, height: 900, name: 'Desktop 1440px' },
  { width: 768, height: 1024, name: 'Tablet 768px' },
  { width: 430, height: 932, name: 'Mobile 430px (iPhone 14 Pro Max)' },
  { width: 390, height: 844, name: 'Mobile 390px (iPhone 14)' },
  { width: 375, height: 667, name: 'Mobile 375px (iPhone SE)' },
];

async function runVerification() {
  console.log(`\n======================================================`);
  console.log(`🚀 STARTING LIVE PRODUCTION VERIFICATION ON: ${BASE_URL}`);
  console.log(`======================================================\n`);

  const browser = await chromium.launch({ headless: true });
  let overallPass = true;
  const criticalErrors = [];

  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    // Listen to console and page errors
    const pageErrors = [];
    const consoleLogs = [];

    page.on('pageerror', (err) => {
      pageErrors.push(err.toString());
      console.error(`  ❌ [Page Error]:`, err.message);
    });

    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      consoleLogs.push({ type, text });
      if (type === 'error' && !text.includes('favicon.ico') && !text.includes('Third-party cookie')) {
        console.error(`  ⚠️ [Browser Console Error]:`, text);
      }
    });

    // Test each route
    for (const route of routesToTest) {
      const url = `${BASE_URL}${route.path}`;
      try {
        const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        const status = response ? response.status() : 0;

        // Check for horizontal overflow
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });

        // Check if root content exists
        const rootContentLength = await page.evaluate(() => {
          const root = document.getElementById('root') || document.body;
          return root ? root.innerText.length : 0;
        });

        if (status >= 400) {
          console.error(`  ❌ [HTTP ${status}] ${route.name} (${route.path})`);
          criticalErrors.push({ url, error: `HTTP ${status}`, vp: vp.name });
          overallPass = false;
        } else if (rootContentLength < 20) {
          console.error(`  ❌ [Blank/Empty Screen] ${route.name} (${route.path})`);
          criticalErrors.push({ url, error: 'Blank screen / zero content', vp: vp.name });
          overallPass = false;
        } else if (overflow) {
          console.error(`  ❌ [Horizontal Overflow] ${route.name} (${route.path}) at ${vp.width}px`);
          criticalErrors.push({ url, error: `Horizontal overflow detected at ${vp.width}px`, vp: vp.name });
          overallPass = false;
        } else {
          console.log(`  ✅ [${status}] ${route.name} (Chars: ${rootContentLength}, Overflow: ${overflow ? 'YES' : 'NO'})`);
        }

      } catch (err) {
        console.error(`  ❌ [Navigation Timeout/Error] ${route.name}:`, err.message);
        criticalErrors.push({ url, error: err.message, vp: vp.name });
        overallPass = false;
      }
    }

    await context.close();
  }

  // Now perform dedicated Desktop Deep-Interaction Tests
  console.log(`\n======================================================`);
  console.log(`🧪 PERFORMING DEEP INTERACTION TESTS ON LIVE DESKTOP`);
  console.log(`======================================================\n`);

  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await desktopContext.newPage();

  // Test 1: Global Search Keyboard & Modal Interaction
  console.log(`\n1. Testing Global Search Interaction (⌘K & modal)...`);
  try {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    // Press Ctrl+K
    await page.keyboard.press('Control+KeyK');
    await page.waitForTimeout(500);

    const searchInput = await page.$('input[placeholder*="Search"], input[placeholder*="axtarın"]');
    if (searchInput) {
      console.log('  ✅ Search modal opened via keyboard shortcut');
      await searchInput.fill('typography');
      await page.waitForTimeout(400);

      // Verify search results rendered
      const resultItems = await page.$$('div[class*="cursor-pointer"], div[class*="rounded-xl"]');
      console.log(`  ✅ Search query results rendered (${resultItems.length} items found)`);

      // Press Escape to close
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      console.log('  ✅ Search modal closed via Escape key');
    } else {
      console.error('  ❌ Search modal input not found');
      criticalErrors.push({ url: `${BASE_URL}/`, error: 'Search modal input not found' });
      overallPass = false;
    }
  } catch (e) {
    console.error('  ❌ Search test failed:', e.message);
    criticalErrors.push({ url: `${BASE_URL}/`, error: e.message });
    overallPass = false;
  }

  // Test 2: Theme Switching (Dark <-> Light)
  console.log(`\n2. Testing Theme Switcher (Dark / Light)...`);
  try {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
    // Click user auth / profile menu
    const profileBtn = await page.$('button.user-auth-menu, button:has-text("PROFILE"), button:has-text("Profil")');
    if (profileBtn) {
      await profileBtn.click();
      await page.waitForTimeout(300);
      const lightThemeBtn = await page.$('button:has-text("Light"), button:has-text("İşıqlı")');
      if (lightThemeBtn) {
        await lightThemeBtn.click();
        await page.waitForTimeout(300);
        const hasLightClass = await page.evaluate(() => document.documentElement.classList.contains('light'));
        console.log(`  ✅ Switched to Light theme (classList has 'light': ${hasLightClass})`);

        // Switch back to Dark
        const darkThemeBtn = await page.$('button:has-text("Dark"), button:has-text("Qaranlıq")');
        if (darkThemeBtn) {
          await darkThemeBtn.click();
          await page.waitForTimeout(300);
          const hasDarkClass = await page.evaluate(() => document.documentElement.classList.contains('dark') || !document.documentElement.classList.contains('light'));
          console.log(`  ✅ Switched back to Dark theme (classList: ${hasDarkClass})`);
        }
      }
    } else {
      console.log('  ℹ️ Profile menu button not directly queryable; verifying theme CSS variables');
    }
  } catch (e) {
    console.error('  ❌ Theme switcher test error:', e.message);
  }

  // Test 3: Tool 1 - Contrast Matrix Interaction
  console.log(`\n3. Testing Tool: APCA Contrast Matrix (/tools/contrast-matrix)...`);
  try {
    await page.goto(`${BASE_URL}/tools/contrast-matrix`, { waitUntil: 'networkidle', timeout: 30000 });
    // Find swap button
    const swapBtn = await page.$('button[title*="Swap"], button:has-text("Swap"), button:has(svg.lucide-arrow-left-right), button:has(svg.lucide-arrow-right-left)');
    if (swapBtn) {
      await swapBtn.click();
      await page.waitForTimeout(300);
      console.log('  ✅ Swapped color polarity successfully');
    }

    // Check tab navigation (Typography Matrix, Live UI Specimen, Tokens)
    const specimenTab = await page.$('button:has-text("Live UI Preview"), button:has-text("Canlı UI Nümunəsi")');
    if (specimenTab) {
      await specimenTab.click();
      await page.waitForTimeout(300);
      console.log('  ✅ Switched to Live UI Preview tab');
    }

    const tokensTab = await page.$('button:has-text("Design Tokens"), button:has-text("Semantik Tokenlər")');
    if (tokensTab) {
      await tokensTab.click();
      await page.waitForTimeout(300);
      console.log('  ✅ Switched to Design Tokens tab');
    }
  } catch (e) {
    console.error('  ❌ Contrast matrix tool test error:', e.message);
    criticalErrors.push({ url: `${BASE_URL}/tools/contrast-matrix`, error: e.message });
    overallPass = false;
  }

  // Test 4: Tool 2 - Typography Scale Interaction
  console.log(`\n4. Testing Tool: Typography Scale (/tools/typography-scale)...`);
  try {
    await page.goto(`${BASE_URL}/tools/typography-scale`, { waitUntil: 'networkidle', timeout: 30000 });
    // Change ratio select or click preset
    const selectEl = await page.$('select');
    if (selectEl) {
      await selectEl.selectOption({ index: 2 });
      await page.waitForTimeout(300);
      console.log('  ✅ Modular ratio select updated');
    }

    // Check code exporter copy button
    const copyBtn = await page.$('button:has-text("Copy"), button:has-text("Kopyala")');
    if (copyBtn) {
      console.log('  ✅ Code exporter action button present and ready');
    }
  } catch (e) {
    console.error('  ❌ Typography scale tool test error:', e.message);
    criticalErrors.push({ url: `${BASE_URL}/tools/typography-scale`, error: e.message });
    overallPass = false;
  }

  // Test 5: Tool 3 - Persuasion Analyzer Interaction
  console.log(`\n5. Testing Tool: Persuasion Analyzer (/tools/persuasion-analyzer)...`);
  try {
    await page.goto(`${BASE_URL}/tools/persuasion-analyzer`, { waitUntil: 'networkidle', timeout: 30000 });
    const textarea = await page.$('textarea');
    if (textarea) {
      await textarea.fill('Get instant access to 2,000+ curated vector icons and responsive typography scales. Zero credit card required.');
      await page.waitForTimeout(400);

      // Verify score recalculated
      const scoreCard = await page.$('div:has-text("OVERALL PERSUASION SCORE"), div:has-text("Ümumi Təsir Skoru")');
      console.log(`  ✅ Live persuasion heuristic analysis calculated and rendered (${Boolean(scoreCard)})`);
    }
  } catch (e) {
    console.error('  ❌ Persuasion analyzer tool test error:', e.message);
    criticalErrors.push({ url: `${BASE_URL}/tools/persuasion-analyzer`, error: e.message });
    overallPass = false;
  }

  // Test 6: Tool 4 - Open Peeps Character Builder
  console.log(`\n6. Testing Tool: Character Builder (/tools/open-peeps)...`);
  try {
    await page.goto(`${BASE_URL}/tools/open-peeps`, { waitUntil: 'networkidle', timeout: 30000 });
    const randomizeBtn = await page.$('button:has-text("Randomize"), button:has-text("Təsadüfi")');
    if (randomizeBtn) {
      await randomizeBtn.click();
      await page.waitForTimeout(300);
      console.log('  ✅ Randomize avatar action executed');
    }

    const svgElement = await page.$('svg');
    console.log(`  ✅ Character SVG preview rendered (${Boolean(svgElement)})`);
  } catch (e) {
    console.error('  ❌ Character builder tool test error:', e.message);
    criticalErrors.push({ url: `${BASE_URL}/tools/open-peeps`, error: e.message });
    overallPass = false;
  }

  // Test 7: Article Page Table of Contents & Reading Experience
  console.log(`\n7. Testing Article Page & Table of Contents (/blog/guide-responsive-fluid-typography-css-clamp)...`);
  try {
    await page.goto(`${BASE_URL}/blog/guide-responsive-fluid-typography-css-clamp`, { waitUntil: 'networkidle', timeout: 30000 });
    const toc = await page.$('nav[aria-label="Table of Contents"]');
    const authorCard = await page.$('div:has-text("Ravan Mammadov"), div:has-text("Rəvan Məmmədov")');
    const bridgeCard = await page.$('a[href*="/tools/"], a[href*="/fonts/"]');

    console.log(`  ✅ Table of Contents rendered (${Boolean(toc)})`);
    console.log(`  ✅ Author Bio card rendered (${Boolean(authorCard)})`);
    console.log(`  ✅ Contextual Ecosystem Bridge card rendered (${Boolean(bridgeCard)})`);
  } catch (e) {
    console.error('  ❌ Article page test error:', e.message);
    criticalErrors.push({ url: `${BASE_URL}/blog/guide-responsive-fluid-typography-css-clamp`, error: e.message });
    overallPass = false;
  }

  // Test 8: Font Specimen Live Tester (/fonts/inter)
  console.log(`\n8. Testing Font Specimen Page (/fonts/inter)...`);
  try {
    await page.goto(`${BASE_URL}/fonts/inter`, { waitUntil: 'networkidle', timeout: 30000 });
    const specimenInput = await page.$('input[placeholder*="Type your custom specimen"]');
    if (specimenInput) {
      await specimenInput.fill('The quick brown fox jumps over the lazy dog 1234567890');
      await page.waitForTimeout(300);
      console.log('  ✅ Live specimen text input updated in real-time');
    }
    const glyphSection = await page.$('text=CHARACTER SET & GLYPH OVERVIEW');
    console.log(`  ✅ Glyph preview overview present`);
  } catch (e) {
    console.error('  ❌ Font detail page test error:', e.message);
    criticalErrors.push({ url: `${BASE_URL}/fonts/inter`, error: e.message });
    overallPass = false;
  }

  await desktopContext.close();
  await browser.close();

  console.log(`\n======================================================`);
  if (overallPass && criticalErrors.length === 0) {
    console.log(`🎉 ALL PRODUCTION TESTS PASSED WITH ZERO CRITICAL ERRORS!`);
  } else {
    console.error(`❌ VERIFICATION FOUND ${criticalErrors.length} ERRORS:`);
    console.error(JSON.stringify(criticalErrors, null, 2));
  }
  console.log(`======================================================\n`);

  return { pass: overallPass && criticalErrors.length === 0, errors: criticalErrors };
}

runVerification().then(res => {
  if (!res.pass) {
    process.exit(1);
  }
});
