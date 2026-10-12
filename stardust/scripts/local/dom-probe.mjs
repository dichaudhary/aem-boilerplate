// dom-probe.mjs <url> <out.json> --width W : dump selected live DOM fragments (after scroll settle)
import { chromium } from 'playwright'; import fs from 'fs';
const [url, out] = process.argv.slice(2); const W = Number(process.argv[process.argv.indexOf('--width') + 1] || 1440);
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: W, height: 900 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
const p = await ctx.newPage(); await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); await p.waitForTimeout(3000);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 500) { await p.evaluate((yy) => scrollTo(0, yy), y); await p.waitForTimeout(150); }
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(1500);
const data = await p.evaluate(() => {
  const strip = (el) => { if (!el) return null; const c = el.cloneNode(true); c.querySelectorAll('script,style').forEach((s) => s.remove()); return c.outerHTML.replace(/\s+/g, ' '); };
  return {
    iframes: [...document.querySelectorAll('iframe')].map((f) => ({ id: f.id, cls: f.className, src: f.src, title: f.title, w: f.getBoundingClientRect().width, h: f.getBoundingClientRect().height })),
    footprint: strip(document.querySelector('.cmp-our-foot-print')),
    popular: strip(document.querySelector('.cmp-popular-products')),
    catImgs: [...document.querySelectorAll('.cmp-categorylist__image')].map((i) => ({ alt: i.alt, src: i.currentSrc })),
    imgs: [...document.querySelectorAll('img')].map((i) => ({ alt: i.alt, src: i.currentSrc, w: i.naturalWidth, h: i.naturalHeight })).filter((x) => /scene7|aashirvaad/.test(x.src)),
  };
});
fs.writeFileSync(out, JSON.stringify(data, null, 1)); await b.close();
