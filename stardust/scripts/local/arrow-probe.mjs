// arrow-probe.mjs <url> --width W : which slick carousels render prev/next/dots at this width
import { chromium } from 'playwright';
import { newLiveContext, gotoLive } from '../diff/live-session.mjs';
const url = process.argv[2]; const W = Number(process.argv[process.argv.indexOf('--width') + 1] || 360);
const b = await chromium.launch(); const ctx = await newLiveContext(b, { viewport: { width: W, height: 900 } });
const p = await ctx.newPage(); await gotoLive(p, url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
console.log(await p.evaluate(() => [...document.querySelectorAll('.slick-slider')].map((s) => {
  const host = s.closest('.main-banner, .cmp-recipe-group, .cmp-popular-products, .cmp-our-foot-print, .cmp-ourcommunity-teasercarousel-container, .cmp-tab-group');
  return `${host ? host.className.split(' ').slice(0, 2).join('.') : s.className} prev=${!!s.querySelector(':scope > .slick-prev')} next=${!!s.querySelector(':scope > .slick-next')} dots=${s.querySelectorAll(':scope > .slick-dots li').length} slides=${s.querySelectorAll('.slick-slide:not(.slick-cloned)').length} cls=${s.parentElement.parentElement.className.slice(0, 80)}`;
}).join('\n')));
await b.close();
