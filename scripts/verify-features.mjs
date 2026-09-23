import { chromium } from 'playwright';
import path from 'path';

const outDir = 'C:/Users/Mr David/.gemini/antigravity/brain/953f8007-4fa5-423e-b6e9-bc21e98766f3';

async function run() {
  const browser = await chromium.launch();

  // 1. Admin Login & Dashboard
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Type credentials and login
    await page.fill('input[type="email"]', 'admin@maktab142.uz');
    await page.fill('input[type="password"]', 'MaktabAdmin2026!');
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL('**/admin', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1200);

    await page.screenshot({ path: path.join(outDir, 'admin_dashboard_authenticated.png') });
    console.log('Saved admin_dashboard_authenticated.png');
    await page.close();
  }

  // 2. Frontend Language Switcher test
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Click the main desktop language dropdown
    const langTrigger = page.locator('header .lang-switcher-dropdown').first();
    if (await langTrigger.isVisible()) {
      await langTrigger.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(outDir, 'language_dropdown_open.png'), clip: { x: 900, y: 50, width: 450, height: 250 } });

      // Click Russian
      const ruOption = page.locator('button:has-text("Русский")').first();
      if (await ruOption.isVisible()) {
        await ruOption.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(outDir, 'frontend_home_ru.png'), clip: { x: 0, y: 0, width: 1440, height: 750 } });
        console.log('Saved frontend_home_ru.png');
      }

      // Reopen and switch to English
      const langTrigger2 = page.locator('header .lang-switcher-dropdown').first();
      await langTrigger2.click();
      await page.waitForTimeout(300);
      const enOption = page.locator('button:has-text("English")').first();
      if (await enOption.isVisible()) {
        await enOption.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(outDir, 'frontend_home_en.png'), clip: { x: 0, y: 0, width: 1440, height: 750 } });
        console.log('Saved frontend_home_en.png');
      }
    }
    await page.close();
  }

  await browser.close();
  console.log('All verification captures completed!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
