// font-probe2 <url>: which 'Libre Baskerville' faces a page has loaded + canvas widths at 400/700 + nav link width
import path from 'node:path'; import { pathToFileURL } from 'node:url';
const session = await import(pathToFileURL(path.resolve('stardust/scripts/diff/live-session.mjs')).href);
const { chromium } = await import('playwright');
const url = process.argv[2]; const live = session.isLiveHttpUrl(url);
const browser = await chromium.launch({ headless: true });
const ctx = live ? await session.newLiveContext(browser, { viewport: { width: 1440, height: 900 } }) : await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
if (live) await session.gotoLive(page, url, { waitUntil: 'domcontentloaded', timeoutMs: 60000, settleMs: 4000 }); else await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const r = await page.evaluate(async () => {
  await document.fonts.ready;
  const faces = []; document.fonts.forEach(f => { if (/Baskerville|Poppins/i.test(f.family)) faces.push(`${f.family} ${f.weight} ${f.style} ${f.status}`); });
  const c = document.createElement('canvas').getContext('2d'); const m = {};
  for (const w of [400, 700]) { c.font = `${w} 16px "Libre Baskerville"`; m['LB' + w] = Math.round(c.measureText('Our Products').width * 10) / 10; }
  for (const w of [400, 500, 600]) { c.font = `${w} 16px Poppins`; m['P' + w] = Math.round(c.measureText('Our Products').width * 10) / 10; }
  const a = [...document.querySelectorAll('a')].find(x => x.textContent.trim() === 'Our Products');
  const cs = a ? getComputedStyle(a) : null;
  return { faces, m, nav: a ? { w: Math.round(a.getBoundingClientRect().width), ff: cs.fontFamily, fw: cs.fontWeight, fs: cs.fontSize, fss: cs.fontSynthesis, ls: cs.letterSpacing, tt: cs.textTransform } : null };
});
console.log(JSON.stringify(r, null, 1)); await browser.close();
