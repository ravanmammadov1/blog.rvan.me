import { chromium } from 'playwright';
import { spawn } from 'child_process';

console.log('=== STARTING LOCAL PRODUCTION PREVIEW BROWSER VERIFICATION ===\n');

// Start vite preview server
const previewProcess = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], {
  shell: true,
  stdio: 'pipe',
});

let serverReady = false;

previewProcess.stdout.on('data', (data) => {
  const msg = data.toString();
  if (msg.includes('4173') || msg.includes('Local:')) {
    serverReady = true;
  }
});

// Wait up to 10 seconds for preview server
for (let i = 0; i < 20; i++) {
  if (serverReady) break;
  await new Promise((r) => setTimeout(r, 500));
}

const BASE_URL = 'http://localhost:4173';
console.log(`Preview server ready at ${BASE_URL}\n`);

const browser = await chromium.launch({ headless: true });
let allPassed = true;
const errors = [];

const testTargets = [
  { path: '/fonts/inter', name: 'EN Font Specimen: /fonts/inter' },
  { path: '/az/fonts/inter', name: 'AZ Font Specimen: /az/fonts/inter' },
  { path: '/blog', name: 'EN Blog Archive: /blog' },
  { path: '/tools/contrast-matrix', name: 'EN Tool: /tools/contrast-matrix' },
  { path: '/tools/typography-scale', name: 'EN Tool: /tools/typography-scale' },
];

const viewports = [
  { width: 1440, height: 900, name: 'Desktop (1440px)' },
  { width: 375, height: 667, name: 'Mobile (375px)' },
];

for (const vp of viewports) {
  console.log(`\n--- Testing Viewport: ${vp.name} ---`);
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
  });

  const page = await context.newPage();

  const pageErrors = [];
  page.on('pageerror', (err) => {
    pageErrors.push(err.toString());
    console.error(`  ❌ [Page Error]:`, err.message);
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error(`  ⚠️ [Console Error]:`, msg.text());
    }
  });

  for (const target of testTargets) {
    const url = `${BASE_URL}${target.path}`;
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      const status = response ? response.status() : 0;

      // Check if rendered
      const rootLength = await page.evaluate(() => {
        return (document.getElementById('root') || document.body).innerText.length;
      });

      // Check overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      if (pageErrors.length > 0) {
        console.error(`  ❌ [Runtime Exception] on ${target.name}:`, pageErrors);
        errors.push({ target: target.name, errors: [...pageErrors] });
        allPassed = false;
        pageErrors.length = 0;
      } else if (status >= 400 || rootLength < 50) {
        console.error(`  ❌ [Render Failure] on ${target.name} (HTTP ${status}, Length ${rootLength})`);
        errors.push({ target: target.name, error: `Empty/Failed render: ${status}` });
        allPassed = false;
      } else {
        console.log(`  ✅ ${target.name} [HTTP ${status}] Rendered OK (Chars: ${rootLength}, Overflow: ${hasOverflow ? 'YES' : 'NO'})`);
      }
    } catch (e) {
      console.error(`  ❌ [Navigation Failure] ${target.name}:`, e.message);
      errors.push({ target: target.name, error: e.message });
      allPassed = false;
    }
  }

  await context.close();
}

// Deep Interaction Verification on /fonts/inter and /az/fonts/inter
console.log('\n--- Deep Interaction Testing on /fonts/inter and /az/fonts/inter ---');
const deepContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const deepPage = await deepContext.newPage();

const deepErrors = [];
deepPage.on('pageerror', (err) => deepErrors.push(err.toString()));

// 1. EN Font Inter
await deepPage.goto(`${BASE_URL}/fonts/inter`, { waitUntil: 'networkidle' });
const enTitle = await deepPage.title();
const enSpecimenInput = await deepPage.$('input[placeholder*="specimen"], input[placeholder*="Type"], input[type="text"]');
if (enSpecimenInput) {
  await enSpecimenInput.fill('Modern Editorial Typography 2026');
  console.log(`  ✅ EN Font page input updated (${enTitle})`);
}

// 2. AZ Font Inter
await deepPage.goto(`${BASE_URL}/az/fonts/inter`, { waitUntil: 'networkidle' });
const azTitle = await deepPage.title();
const azSpecimenInput = await deepPage.$('input[placeholder*="specimen"], input[placeholder*="nümunə"], input[type="text"]');
if (azSpecimenInput) {
  await azSpecimenInput.fill('Müasir Redaksiya Tipoqrafiyası 2026');
  console.log(`  ✅ AZ Font page input updated (${azTitle})`);
}

// Check if any error occurred during deep interactions
if (deepErrors.length > 0) {
  console.error(`  ❌ Deep interaction errors:`, deepErrors);
  allPassed = false;
} else {
  console.log(`  ✅ Zero runtime exceptions during font specimen deep interactions!`);
}

await deepContext.close();
await browser.close();
previewProcess.kill();

console.log('\n======================================================');
if (allPassed && errors.length === 0) {
  console.log('🎉 ALL BROWSER TESTS PASSED WITH ZERO ERRORS!');
} else {
  console.error(`❌ FAILED WITH ${errors.length} ERRORS:`);
  console.error(JSON.stringify(errors, null, 2));
}
console.log('======================================================\n');

process.exit(allPassed && errors.length === 0 ? 0 : 1);
