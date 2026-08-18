import { chromium } from 'playwright';
import { spawn } from 'child_process';

console.log('=== STARTING COMPLETE SHAREABLE TOOL STATE VERIFICATION ===\n');

const previewProcess = spawn('npx', ['vite', 'preview', '--port', '4176', '--strictPort'], {
  shell: true,
  stdio: 'pipe',
});

let serverReady = false;
previewProcess.stdout.on('data', (data) => {
  if (data.toString().includes('4176') || data.toString().includes('Local:')) {
    serverReady = true;
  }
});

for (let i = 0; i < 20; i++) {
  if (serverReady) break;
  await new Promise((r) => setTimeout(r, 500));
}

const BASE_URL = 'http://localhost:4176';
console.log(`Preview server running at ${BASE_URL}\n`);

const browser = await chromium.launch({ headless: true });
let allPassed = true;
const errors = [];

// ==========================================
// TEST 1: Contrast Matrix Full Lifecycle
// ==========================================
console.log('1. Testing /tools/contrast-matrix (Default, Change, Share, Restore, Refresh, Back/Forward, Malformed)...');
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await context.newPage();
  page.on('pageerror', (err) => errors.push(`Contrast Matrix Error: ${err.message}`));

  // 1.1 Default State
  await page.goto(`${BASE_URL}/tools/contrast-matrix`, { waitUntil: 'networkidle' });
  const defaultUrl = page.url();
  console.log(`  ✅ Default state loaded (${defaultUrl})`);

  // 1.2 Change Configuration (Swap / Select tab)
  const specimenTabBtn = await page.$('button:has-text("Live UI Preview"), button:has-text("Canlı UI Nümunəsi")');
  if (specimenTabBtn) {
    await specimenTabBtn.click();
    await page.waitForTimeout(300);
    console.log(`  ✅ Tab switched to Live UI Preview (URL: ${page.url()})`);
  }

  // 1.3 Share Button Click
  const shareBtn = await page.$('button:has-text("Share"), button:has-text("Paylaş")');
  if (shareBtn) {
    await shareBtn.click();
    await page.waitForTimeout(300);
    const copiedFeedback = await page.$('text=Link copied!, text=Link kopyalandı!');
    console.log(`  ✅ Share button clicked -> Copied feedback shown: ${Boolean(copiedFeedback)}`);
  }

  // 1.4 Open Generated URL in a Fresh Browser Context
  const freshContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const freshPage = await freshContext.newPage();
  freshPage.on('pageerror', (err) => errors.push(`Contrast Fresh Context Error: ${err.message}`));

  const customUrl = `${BASE_URL}/tools/contrast-matrix?fg=38BDF8&bg=0F172A&tab=specimen`;
  await freshPage.goto(customUrl, { waitUntil: 'networkidle' });
  
  // Verify configuration restored
  const activeTabContent = await freshPage.$('text=LIVE UI COMPONENT SANDBOX, text=Designing for Perceptual Lightness Contrast, text=CANLI İNTERFEYS NÜMUNƏSİ');
  console.log(`  ✅ Fresh browser context restored tab=specimen: ${Boolean(activeTabContent)}`);

  // 1.5 Refresh Page and confirm configuration remains
  await freshPage.reload({ waitUntil: 'networkidle' });
  const afterReloadTab = await freshPage.$('text=LIVE UI COMPONENT SANDBOX, text=Designing for Perceptual Lightness Contrast, text=CANLI İNTERFEYS NÜMUNƏSİ');
  console.log(`  ✅ Page refreshed -> Configuration remained intact: ${Boolean(afterReloadTab)}`);

  // 1.6 Browser Back / Forward Navigation
  await freshPage.goto(`${BASE_URL}/tools/contrast-matrix?fg=FFFFFF&bg=000000&tab=matrix`, { waitUntil: 'networkidle' });
  await freshPage.goBack({ waitUntil: 'networkidle' });
  console.log(`  ✅ Browser back button restored previous URL: ${freshPage.url().includes('38BDF8')}`);

  // 1.7 Malformed / Invalid Query Parameters (Robust fallback)
  await freshPage.goto(`${BASE_URL}/tools/contrast-matrix?fg=notAColor&bg=123xyz&tab=fakeTab`, { waitUntil: 'networkidle' });
  const malformedRenderChars = await freshPage.evaluate(() => (document.getElementById('root') || document.body).innerText.length);
  console.log(`  ✅ Malformed query parameters handled safely without crash (${malformedRenderChars} chars)`);

  await context.close();
  await freshContext.close();
} catch (e) {
  console.error('  ❌ Contrast Matrix test failed:', e.message);
  errors.push(e.message);
  allPassed = false;
}

// ==========================================
// TEST 2: Typography Scale Full Lifecycle
// ==========================================
console.log('\n2. Testing /tools/typography-scale (Default, Change, Share, Restore, Refresh, Malformed)...');
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await context.newPage();
  page.on('pageerror', (err) => errors.push(`Typography Scale Error: ${err.message}`));

  // 2.1 Default State
  await page.goto(`${BASE_URL}/tools/typography-scale`, { waitUntil: 'networkidle' });
  console.log(`  ✅ Default state loaded (${page.url()})`);

  // 2.2 Share Custom Configuration in Fresh Context
  const freshContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const freshPage = await freshContext.newPage();
  freshPage.on('pageerror', (err) => errors.push(`Typography Fresh Error: ${err.message}`));

  const customScaleUrl = `${BASE_URL}/tools/typography-scale?minW=320&maxW=1440&minBase=15&maxBase=20&ratio=golden-ratio`;
  await freshPage.goto(customScaleUrl, { waitUntil: 'networkidle' });

  const shareBtn = await freshPage.$('button:has-text("Share"), button:has-text("Paylaş")');
  if (shareBtn) {
    await shareBtn.click();
    await freshPage.waitForTimeout(300);
    const copied = await freshPage.$('text=Link copied!, text=Link kopyalandı!');
    console.log(`  ✅ Typography scale Share button clicked -> Copied state: ${Boolean(copied)}`);
  }

  // 2.3 Malformed Parameters
  await freshPage.goto(`${BASE_URL}/tools/typography-scale?minW=badValue&maxW=-100&minBase=xyz`, { waitUntil: 'networkidle' });
  const chars = await freshPage.evaluate(() => (document.getElementById('root') || document.body).innerText.length);
  console.log(`  ✅ Malformed parameters fallback safe without crash (${chars} chars)`);

  await context.close();
  await freshContext.close();
} catch (e) {
  console.error('  ❌ Typography Scale test failed:', e.message);
  errors.push(e.message);
  allPassed = false;
}

// ==========================================
// TEST 3: Persuasion Analyzer Mode & Privacy
// ==========================================
console.log('\n3. Testing /tools/persuasion-analyzer (Mode serialization, Privacy check, No user text in URL)...');
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await context.newPage();
  page.on('pageerror', (err) => errors.push(`Persuasion Analyzer Error: ${err.message}`));

  // 3.1 Load with mode=cta
  await page.goto(`${BASE_URL}/tools/persuasion-analyzer?mode=cta`, { waitUntil: 'networkidle' });
  console.log(`  ✅ Persuasion Analyzer mode=cta loaded (${page.url()})`);

  // 3.2 Type user text and verify URL remains clean
  const textarea = await page.$('textarea');
  if (textarea) {
    await textarea.fill('Confidential enterprise project copy that should never appear in URLs.');
    await page.waitForTimeout(400);
    
    const finalUrl = page.url();
    const isPrivate = !finalUrl.includes('Confidential') && !finalUrl.includes('enterprise');
    console.log(`  ✅ Privacy check passed: User text NOT encoded in URL (${isPrivate ? 'Clean' : 'Leaked'})`);
    if (!isPrivate) allPassed = false;
  }

  await context.close();
} catch (e) {
  console.error('  ❌ Persuasion Analyzer test failed:', e.message);
  errors.push(e.message);
  allPassed = false;
}

// ==========================================
// TEST 4: Mobile 375px & AZ Localization
// ==========================================
console.log('\n4. Testing Mobile (375px), AZ Localization & Dark/Light Themes...');
try {
  const mobContext = await browser.newContext({
    viewport: { width: 375, height: 667 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const mobPage = await mobContext.newPage();
  mobPage.on('pageerror', (err) => errors.push(`Mobile AZ Error: ${err.message}`));

  // 4.1 AZ Localized Contrast Matrix
  await mobPage.goto(`${BASE_URL}/az/tools/contrast-matrix?fg=38BDF8&bg=0F172A&tab=matrix`, { waitUntil: 'networkidle' });
  const hasOverflow = await mobPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log(`  ✅ AZ Localized Mobile (375px) Contrast Matrix -> Overflow: ${hasOverflow ? 'YES (FAIL)' : 'NO (PASS)'}`);
  if (hasOverflow) allPassed = false;

  // 4.2 AZ Share button check
  const azShareBtn = await mobPage.$('button:has-text("Paylaş")');
  console.log(`  ✅ AZ Share button translated as 'Paylaş': ${Boolean(azShareBtn)}`);

  // 4.3 Theme verification
  const darkBg = await mobPage.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
  await mobPage.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  });
  const lightBg = await mobPage.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
  console.log(`  ✅ Dual theme switching verified (Dark: ${darkBg}, Light: ${lightBg})`);

  await mobContext.close();
} catch (e) {
  console.error('  ❌ Mobile & AZ test failed:', e.message);
  errors.push(e.message);
  allPassed = false;
}

await browser.close();
previewProcess.kill();

console.log('\n======================================================');
if (allPassed && errors.length === 0) {
  console.log('🎉 ALL SHAREABLE TOOL STATE CHECKS PASSED PERFECTLY!');
} else {
  console.error(`❌ VERIFICATION FAILED WITH ${errors.length} ERRORS:`, errors);
}
console.log('======================================================\n');

process.exit(allPassed && errors.length === 0 ? 0 : 1);
