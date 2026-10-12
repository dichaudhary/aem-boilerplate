// recipe-probe.mjs <url> <out.json> --width W : per recipe tab, the card list (+ image src after paging through)
import { chromium } from 'playwright'; import fs from 'fs';
import { newLiveContext, gotoLive } from '../diff/live-session.mjs';
const [url, out] = process.argv.slice(2); const W = Number(process.argv[process.argv.indexOf('--width') + 1] || 1440);
const b = await chromium.launch(); const ctx = await newLiveContext(b, { viewport: { width: W, height: 900 } });
const p = await ctx.newPage(); await gotoLive(p, url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3000);
await p.evaluate(() => document.querySelector('.cmp-recipe-group').scrollIntoView()); await p.waitForTimeout(1500);
const tabs = await p.$$('.cmp-recipe-group__tabs .cmp-tab');
const res = [];
for (let t = 0; t < tabs.length; t += 1) {
  if (t > 0) { await tabs[t].click(); await p.waitForTimeout(3500); }
  for (let k = 0; k < 6; k += 1) { const n = await p.$('.cmp-recipe-group .slick-next:not(.slick-disabled)'); if (!n) break; await n.click(); await p.waitForTimeout(900); }
  const cards = await p.evaluate(() => [...document.querySelectorAll('.cmp-recipe-group__carousel-item:not(.slick-cloned)')].map((c) => {
    const img = c.querySelector('img'); const ps = c.querySelectorAll('.cmp-card__recipe_footer p');
    return { href: c.querySelector('a')?.getAttribute('href'), img: img ? (img.currentSrc || img.src) : null, alt: img ? img.alt : null, tag: c.querySelector('.cmp-card__tag-wrapper p')?.textContent.trim(), title: c.querySelector('h4')?.textContent.trim(), time: ps[0]?.textContent.trim(), level: ps[1]?.textContent.trim() };
  }));
  res.push({ tab: (await tabs[t].textContent()).trim(), cards });
}
fs.writeFileSync(out, JSON.stringify(res, null, 1)); console.log(res.map((r) => `${r.tab}: ${r.cards.length} cards, ${r.cards.filter((c) => c.img).length} imgs`).join('\n'));
await b.close();
