import { chromium } from 'playwright'; import fs from 'fs';
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto('https://aashirvaad.com/', { waitUntil: 'domcontentloaded', timeout: 60000 }); await p.waitForTimeout(3000);
await p.evaluate(() => document.querySelector('.cmp-recipe-group').scrollIntoView()); await p.waitForTimeout(1500);
const nxt = '.cmp-recipe-group .slick-next';
for (let i = 0; i < 14; i++) { await p.click(nxt, { timeout: 3000 }).catch(() => {}); await p.waitForTimeout(500); }
const out = {};
out.cards = await p.evaluate(() => [...document.querySelectorAll('.cmp-recipe-group .slick-slide:not(.slick-cloned) a.card')].map(a => ({ href: a.getAttribute('href'), target: a.getAttribute('target'), title: a.querySelector('h4')?.textContent.trim(), tag: a.querySelector('.cmp-card__tag-wrapper p')?.textContent.trim(), time: a.querySelector('.cmp-card__time-in-minutes p')?.textContent.trim(), level: a.querySelector('.cmp-card__difficulty-level p')?.textContent.trim(), img: a.querySelector('img')?.getAttribute('src'), alt: a.querySelector('img')?.getAttribute('alt') })));
out.tabs = await p.evaluate(() => [...document.querySelectorAll('.cmp-recipe-group .cmp-tab')].map(t => t.textContent.trim()));
out.viewAll = await p.evaluate(() => { const b = document.querySelector('.cmp-recipe-group__action button, .cmp-recipe-group__action a'); return b && b.outerHTML.slice(0, 400); });
out.links = await p.evaluate(() => [...document.querySelectorAll('.cmp-banner a.cmp-button, .cmp-teaser a, .cmp-teaser button, .cmp-categorylist a, .cmp-popular-products a, .cmp-popular-products button, .cmp-our-foot-print a, .cmp-container--center-align a, .cmp-footer a, .cmp-header__logo a, .cmp-header__nav-group > li > a, .cmp-header__search a, .cmp-banner__item-logo img, .cmp-header__logo img, .cmp-footer img, .cmp-banner img')].map(a => [a.tagName, a.className.slice(0,40), (a.textContent||'').trim().slice(0, 40), a.getAttribute('href') || a.getAttribute('data-href') || a.getAttribute('onclick') || '', a.getAttribute('target') || '', a.getAttribute('alt') || a.getAttribute('aria-label') || ''].join(' | ')));
fs.writeFileSync('stardust/current/data/live-content.json', JSON.stringify(out, null, 1)); console.log(out.cards.length, 'cards'); await b.close();
