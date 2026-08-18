import { chromium } from 'playwright';
import { spawn } from 'child_process';

const previewProcess = spawn('npx', ['vite', 'preview', '--port', '4174', '--strictPort'], {
  shell: true,
  stdio: 'pipe',
});

let serverReady = false;
previewProcess.stdout.on('data', (data) => {
  if (data.toString().includes('4174') || data.toString().includes('Local:')) {
    serverReady = true;
  }
});

for (let i = 0; i < 20; i++) {
  if (serverReady) break;
  await new Promise((r) => setTimeout(r, 500));
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto('http://localhost:4174/', { waitUntil: 'networkidle' });
const h1Text = await page.$eval('h1', el => el.innerText);
const eyebrowText = await page.$eval('section div span, section div div', el => el.innerText).catch(() => '');
const ctas = await page.$$eval('section a', els => els.map(e => ({ text: e.innerText, href: e.getAttribute('href') })));

console.log('=== DIRECT HERO TEST RESULTS ===');
console.log('H1 Text:', h1Text);
console.log('Eyebrow Text:', eyebrowText);
console.log('CTAs:', ctas);

await browser.close();
previewProcess.kill();
