import { chromium } from 'playwright';

const baseURL = process.env.BASE_URL || 'http://localhost:3100';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const evidence = [];

async function assert(condition, message, details = {}) {
  if (!condition) {
    throw new Error(`${message} ${JSON.stringify(details)}`);
  }
  evidence.push({ message, ...details });
}

await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 30000 });
await assert(await page.locator('.topbar-strip').count() === 1, 'Desktop topbar exists');
const topbarTextUz = await page.locator('.topbar-strip').innerText();
await assert(!topbarTextUz.includes('|'), 'Topbar has no visible pipe separators', { topbarTextUz });
await assert(topbarTextUz.includes('142-sonli davlat umumiy o‘rta ta’lim maktabi'), 'Uzbek topbar institution text is corrected', { topbarTextUz });
const durationHover = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--duration-hover').trim());
await assert(durationHover === '300ms', 'Frontend hover duration token is 300ms', { durationHover });
const btnTransitionDuration = await page.locator('.btn').first().evaluate((el) => getComputedStyle(el).transitionDuration);
await assert(btnTransitionDuration.includes('0.3s') || btnTransitionDuration.includes('300ms'), 'Button hover transitions use 0.3s timing', { btnTransitionDuration });

await page.locator('button[aria-label="Tilni tanlash (Select Language)"]').first().click();
await page.locator('button:has-text("English")').first().click();
await page.waitForTimeout(300);
const topbarTextEn = await page.locator('.topbar-strip').innerText();
await assert(topbarTextEn.includes('State School No. 142'), 'English topbar uses concise school name', { topbarTextEn });
await assert(topbarTextEn.includes('eMaktab Diary'), 'English eMaktab label is corrected', { topbarTextEn });
await assert(!topbarTextEn.includes('State General Secondary Educational Institution'), 'Old verbose English institution text removed');
await assert(!topbarTextEn.includes('|'), 'English topbar remains free of pipe separators');

const themeButton = page.locator('button[aria-label*="rejim"], button[aria-label*="mode"]').first();
await themeButton.click();
await page.waitForTimeout(300);
const darkState = await page.evaluate(() => ({
  theme: document.documentElement.getAttribute('data-theme'),
  bodyBg: getComputedStyle(document.body).backgroundColor,
  glassBg: getComputedStyle(document.querySelector('.glass-nav')).backgroundColor,
}));
await assert(darkState.theme === 'dark', 'Theme toggle switches to dark mode', darkState);
await assert(!['rgb(255, 255, 255)', 'rgba(255, 255, 255, 1)'].includes(darkState.bodyBg), 'Dark mode body background is not white', darkState);

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 30000 });
const mobileMetrics = await page.evaluate(() => ({ innerWidth, scrollWidth: document.documentElement.scrollWidth, topbarDisplay: getComputedStyle(document.querySelector('.topbar-strip')).display }));
await assert(mobileMetrics.topbarDisplay === 'none', 'Topbar hides on mobile to avoid overflow', mobileMetrics);
await assert(mobileMetrics.scrollWidth <= mobileMetrics.innerWidth + 2, 'Mobile homepage has no horizontal overflow', mobileMetrics);
await page.locator('button[aria-label="Menyuni ochish"]').click();
await assert(await page.locator('text=Kundalik / eMaktab portali').count() > 0 || await page.locator('text=Kundalik').count() > 0, 'Mobile menu opens and shows quick links');

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${baseURL}/admin/login`, { waitUntil: 'networkidle', timeout: 30000 });
const loginText = await page.locator('body').innerText();
const adminDuration = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--duration-hover').trim());
await assert(loginText.includes('Tizimga kirish') || loginText.includes('Boshqaruv'), 'Admin login renders successfully', { loginText: loginText.slice(0, 200) });
await assert(adminDuration === '300ms', 'Admin hover duration token is 300ms', { adminDuration });
await page.goto(`${baseURL}/admin/news`, { waitUntil: 'networkidle', timeout: 30000 });
const protectedText = await page.locator('body').innerText();
await assert(page.url().includes('/admin/login') || protectedText.includes('Tizimga kirish'), 'Protected admin route redirects/renders login when unauthenticated', { url: page.url() });

await browser.close();
console.log(JSON.stringify({ ok: true, evidence }, null, 2));
