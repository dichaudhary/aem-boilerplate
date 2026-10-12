// height-probe2.mjs <url> : section tops after settle (stitch-shot ordering), then again after a chunk-style scroll
import { chromium } from 'playwright';
import { newLiveContext, gotoLive } from '../diff/live-session.mjs';
const url = process.argv[2]; const W = Number(process.argv[process.argv.indexOf('--width') + 1] || 1440);
const b = await chromium.launch(); const ctx = await newLiveContext(b, { viewport: { width: W, height: 900 } });
const p = await ctx.newPage(); await gotoLive(p, url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(3000);
const tops = () => p.evaluate(() => { const root = document.querySelector('#container-c7d5ec23b7 > .aem-Grid') || document.querySelector('#container-c7d5ec23b7'); const out = [...root.children].map((c) => Math.round(c.getBoundingClientRect().top + scrollY) + ':' + Math.round(c.getBoundingClientRect().height)); const f = document.querySelector('#footer'); out.push('footer ' + Math.round(f.getBoundingClientRect().top + scrollY) + ':' + Math.round(f.getBoundingClientRect().height)); out.push('doc ' + document.documentElement.scrollHeight); return out.join(' '); });
await p.evaluate(async () => { for (let y = 0; y <= document.body.scrollHeight; y += 300) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 220)); } });
await p.waitForTimeout(3000); console.log('settled:', await tops());
const imgs = await p.evaluate(() => [...document.querySelectorAll('#footer img')].map((i) => `${i.alt}:${i.naturalWidth}x${i.naturalHeight}:${Math.round(i.getBoundingClientRect().height)}`).join(' '));
console.log('footer imgs:', imgs);
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(800);
for (let y = 0; y < 7000; y += 900) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(300); }
console.log('after chunks:', await tops());
await b.close();
