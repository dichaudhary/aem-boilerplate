// Captures each recipe tab's cards (settled DOM after clicking the tab) → stardust/current/data/recipe-tabs.json
import { chromium } from 'playwright'; import fs from 'fs';
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto('https://aashirvaad.com/', { waitUntil: 'domcontentloaded', timeout: 60000 }); await p.waitForTimeout(3000);
await p.evaluate(() => document.querySelector('.cmp-recipe-group').scrollIntoView()); await p.waitForTimeout(1000);
const tabs = await p.$$eval('.cmp-recipe-group .cmp-tab', (t) => t.map((x) => x.textContent.trim()));
const out = [];
for (let i = 0; i < tabs.length; i++) {
  await p.locator('.cmp-recipe-group .cmp-tab').nth(i).click(); await p.waitForTimeout(2500);
  for (let k = 0; k < 16; k++) { await p.click('.cmp-recipe-group .slick-next', { timeout: 1500 }).catch(() => {}); await p.waitForTimeout(350); }
  const cards = await p.evaluate(() => [...document.querySelectorAll('.cmp-recipe-group .slick-slide:not(.slick-cloned) a.card')].map((a) => ({ href: a.getAttribute('href'), title: a.querySelector('h4')?.textContent.trim(), tag: a.querySelector('.cmp-card__tag-wrapper p')?.textContent.trim(), time: a.querySelector('.cmp-card__time-in-minutes p')?.textContent.trim(), level: a.querySelector('.cmp-card__difficulty-level p')?.textContent.trim(), img: a.querySelector('img')?.getAttribute('src'), alt: a.querySelector('img')?.getAttribute('alt') })));
  out.push({ tab: tabs[i], cards });
}
fs.writeFileSync('stardust/current/data/recipe-tabs.json', JSON.stringify(out, null, 1));
console.log(out.map((t) => `${t.tab}: ${t.cards.length} cards, ${t.cards.filter((c) => c.img).length} imgs`).join('\n')); await b.close();
