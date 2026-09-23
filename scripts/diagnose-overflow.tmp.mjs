import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
const result = await page.evaluate(() => ({ innerWidth: window.innerWidth, scrollWidth: document.documentElement.scrollWidth, offenders: Array.from(document.querySelectorAll('body *')).map((el) => {
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return { tag: el.tagName, cls: String(el.className), text: (el.textContent || '').trim().slice(0, 80), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), display: cs.display, position: cs.position, overflowX: cs.overflowX };
}).filter(x => x.right > window.innerWidth + 2 || x.left < -2).sort((a,b)=>b.right-a.right).slice(0, 20) }));
console.log(JSON.stringify(result, null, 2));
await browser.close();
