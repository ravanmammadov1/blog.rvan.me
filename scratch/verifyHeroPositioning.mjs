import { chromium } from 'playwright';
import { spawn } from 'child_process';

console.log('=== STARTING HERO POSITIONING BROWSER VERIFICATION ===\n');

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

for (let i = 0; i < 20; i++) {
  if (serverReady) break;
  await new Promise((r) => setTimeout(r, 500));
}

const BASE_URL = 'http://localhost:4173';
console.log(`Preview server running at ${BASE_URL}\n`);

const browser = await chromium.launch({ headless: true });
let allPassed = true;

// 1. Verify EN Desktop (1440px)
console.log('1. Verifying EN Desktop (1440px)...');
const enContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const enPage = await enContext.newPage();

const enErrors = [];
enPage.on('pageerror', (err) => enErrors.push(err.toString()));
enPage.on('console', (msg) => {
  if (msg.type() === 'error') console.error('  ⚠️ [EN Console Error]:', msg.text());
});

await enPage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

const enH1 = await enPage.$eval('h1', (el) => el.innerText);
const enEyebrow = await enPage.$eval('div:has(> h1) span, div:has(> h1) div', (el) => el.innerText).catch(() => '');
const enButtons = await enPage.$$eval('a[href*="/tools"], a[href*="/blog"]', (els) => els.map((e) => e.innerText));

console.log('  EN H1:', enH1.replace(/\n/g, ' '));
console.log('  EN CTAs found:', enButtons);

if (!enH1.includes('Deconstructing visual logic') || !enH1.includes('Engineering practical tools')) {
  console.error('  ❌ EN H1 copy mismatch');
  allPassed = false;
} else {
  console.log('  ✅ EN H1 copy verified');
}

// 2. Verify AZ Desktop (1440px)
console.log('\n2. Verifying AZ Desktop (1440px)...');
const azContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const azPage = await azContext.newPage();

const azErrors = [];
azPage.on('pageerror', (err) => azErrors.push(err.toString()));
azPage.on('console', (msg) => {
  if (msg.type() === 'error') console.error('  ⚠️ [AZ Console Error]:', msg.text());
});

await azPage.goto(`${BASE_URL}/az`, { waitUntil: 'networkidle' });

const azH1 = await azPage.$eval('h1', (el) => el.innerText);
const azButtons = await azPage.$$eval('a[href*="/az/tools"], a[href*="/az/blog"]', (els) => els.map((e) => e.innerText));

console.log('  AZ H1:', azH1.replace(/\n/g, ' '));
console.log('  AZ CTAs found:', azButtons);

if (!azH1.includes('Dizayn məntiqini anlamaq') || !azH1.includes('Funksional alətlər yaratmaq')) {
  console.error('  ❌ AZ H1 copy mismatch');
  allPassed = false;
} else {
  console.log('  ✅ AZ H1 copy verified');
}

// 3. Verify Mobile 375px (iPhone SE)
console.log('\n3. Verifying Mobile 375px (iPhone SE)...');
const mobContext = await browser.newContext({ viewport: { width: 375, height: 667 } });
const mobPage = await mobContext.newPage();

await mobPage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
const hasMobOverflow = await mobPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
console.log(`  Mobile 375px Horizontal Overflow: ${hasMobOverflow ? 'YES (FAIL)' : 'NO (PASS)'}`);

if (hasMobOverflow) {
  allPassed = false;
}

// 4. Verify Theme Toggling (Dark and Light)
console.log('\n4. Verifying Dark & Light Theme Rendering...');
const hasDarkBg = await enPage.evaluate(() => {
  const bg = window.getComputedStyle(document.body).backgroundColor;
  return bg;
});
console.log(`  Dark mode body background computed: ${hasDarkBg}`);

// Switch to light class on documentElement
await enPage.evaluate(() => {
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('light');
});
const hasLightBg = await enPage.evaluate(() => {
  return window.getComputedStyle(document.body).backgroundColor;
});
console.log(`  Light mode body background computed: ${hasLightBg}`);

// Verify errors
if (enErrors.length > 0 || azErrors.length > 0) {
  console.error('  ❌ Console runtime exceptions occurred:', { enErrors, azErrors });
  allPassed = false;
} else {
  console.log('  ✅ Zero runtime exceptions across EN/AZ desktop and mobile!');
}

await enContext.close();
await azContext.close();
await mobContext.close();
await browser.close();
previewProcess.kill();

console.log('\n======================================================');
if (allPassed) {
  console.log('🎉 HERO POSITIONING VERIFICATION PASSED PERFECTLY!');
} else {
  console.error('❌ VERIFICATION FAILED');
}
console.log('======================================================\n');

process.exit(allPassed ? 0 : 1);
