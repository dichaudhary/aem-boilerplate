// height-probe.mjs <url> --width W : replicate stitch-shot's settle+freeze, print height metrics at each step
import { chromium } from 'playwright';
const url = process.argv[2]; const W = Number(process.argv[process.argv.indexOf('--width') + 1] || 1440);
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: W, height: 900 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
const p = await ctx.newPage(); await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
const m = (tag) => p.evaluate((t) => { const f = document.querySelector('.cmp-footer, footer'); const r = f && f.getBoundingClientRect(); return `${t}: docEl ${document.documentElement.scrollHeight} body ${document.body.scrollHeight} bodyH ${document.body.getBoundingClientRect().height} footerBottom ${r ? Math.round(r.bottom + scrollY) : '-'} htmlCS ${getComputedStyle(document.documentElement).height}/${getComputedStyle(document.documentElement).overflowY} bodyCS ${getComputedStyle(document.body).height}/${getComputedStyle(document.body).overflowY}`; }, tag);
await p.waitForTimeout(3000); console.log(await m('loaded'));
await p.evaluate(async () => { for (let y = 0; y <= document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 220)); } });
await p.waitForTimeout(3000); console.log(await m('settled'));
await p.addStyleTag({ content: '*,*::before,*::after{animation-play-state:paused!important;transition:none!important}' });
console.log(await m('frozen'));
await p.evaluate(() => { let id = window.setTimeout(() => {}, 0); while (id-- > 0) { clearTimeout(id); clearInterval(id); } const d = document.querySelector('.slick-dots li:first-child button'); if (d) d.click(); });
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(800); console.log(await m('top'));
const tall = await p.evaluate(() => [...document.body.querySelectorAll('*')].map((e) => { const r = e.getBoundingClientRect(); return [r.bottom + scrollY, e.tagName + '.' + e.className.toString().slice(0, 60)]; }).sort((a, c) => c[0] - a[0]).slice(0, 6));
console.log(JSON.stringify(tall));
await b.close();
