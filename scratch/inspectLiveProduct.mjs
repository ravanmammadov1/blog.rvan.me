import { chromium } from 'playwright';

const BASE_URL = 'https://www.rvan.me';

async function inspectProduction() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to live homepage...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });

  const heroHeadline = await page.$eval('h1', el => el.innerText).catch(() => '');
  const heroSub = await page.$eval('p', el => el.innerText).catch(() => '');
  const navLinks = await page.$$eval('nav a', els => els.map(e => e.innerText)).catch(() => []);

  console.log('Hero Title:', heroHeadline);
  console.log('Hero Subtitle:', heroSub);
  console.log('Nav Links:', navLinks);

  // Check blog page
  await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle' });
  const blogTitle = await page.$eval('h1', el => el.innerText).catch(() => '');
  const articlesCount = await page.$$eval('h3', els => els.length).catch(() => 0);
  console.log(`Blog Title: ${blogTitle}, Articles Count: ${articlesCount}`);

  // Check tool page
  await page.goto(`${BASE_URL}/tools/contrast-matrix`, { waitUntil: 'networkidle' });
  const toolTitle = await page.$eval('h1', el => el.innerText).catch(() => '');
  console.log(`Tool Title: ${toolTitle}`);

  await browser.close();
}

inspectProduction();
