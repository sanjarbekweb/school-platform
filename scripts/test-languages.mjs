import { chromium } from 'playwright';
import path from 'path';

const outDir = 'C:/Users/Mr David/.gemini/antigravity/brain/953f8007-4fa5-423e-b6e9-bc21e98766f3';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. Click Language Switcher button in desktop header
  const switcherBtn = page.locator('button[aria-label="Tilni tanlash (Select Language)"]').first();
  await switcherBtn.click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, 'language_dropdown_open.png'), clip: { x: 1000, y: 30, width: 350, height: 320 } });
  console.log('Saved language_dropdown_open.png');

  // 2. Select Russian
  const ruBtn = page.locator('button:has-text("Русский")').first();
  await ruBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, 'frontend_home_ru.png'), clip: { x: 0, y: 0, width: 1440, height: 750 } });
  console.log('Saved frontend_home_ru.png');

  // 3. Select English
  await switcherBtn.click();
  await page.waitForTimeout(300);
  const enBtn = page.locator('button:has-text("English")').first();
  await enBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, 'frontend_home_en.png'), clip: { x: 0, y: 0, width: 1440, height: 750 } });
  console.log('Saved frontend_home_en.png');

  await browser.close();
  console.log('Language switcher screenshots complete!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
