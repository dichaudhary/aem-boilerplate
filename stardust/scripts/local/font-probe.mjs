// font-probe.mjs <url> : list font responses + loaded faces under the shared live-session context
import { chromium } from 'playwright';
import { newLiveContext, gotoLive } from '../diff/live-session.mjs';
const url = process.argv[2];
const b = await chromium.launch(); const ctx = await newLiveContext(b, { viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage(); const fonts = [];
p.on('response', (r) => { if (/woff2?|ttf|fonts\.googleapis/.test(r.url())) fonts.push(`${r.status()} ${r.url().slice(0, 150)}`); });
await gotoLive(p, url, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
console.log(fonts.join('\n'));
console.log(await p.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter((f) => /Baskerville/.test(f.family)).map((f) => `${f.family} ${f.weight} ${f.style} ${f.status} ${f.unicodeRange.slice(0, 20)}`).join('\n'); }));
await b.close();
