// Inspection harvester (not a gate instrument): dump a box tree + outerHTML of chosen containers
// at one width, through the diff skill's live-session hardening. Output JSON is read by json-query.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const args = process.argv.slice(2);
const url = args[0];
const opt = (k, d) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : d; };
const width = Number(opt('--width', '360'));
const selectors = opt('--selectors', '#footer').split(',');
const out = opt('--out', `stardust/replica/lift/boxes-${width}.json`);
const depth = Number(opt('--depth', '7'));
const session = await import(pathToFileURL(path.resolve('stardust/scripts/diff/live-session.mjs')).href);
const { chromium } = await import('playwright');
const live = session.isLiveHttpUrl(url);
const browser = await chromium.launch({ headless: true });
const common = { reducedMotion: 'reduce', colorScheme: 'light', ignoreHTTPSErrors: true, viewport: { width, height: 900 } };
const context = live ? await session.newLiveContext(browser, common) : await browser.newContext({ locale: 'en-US', ...common });
const page = await context.newPage();
if (live) {
  await session.gotoLive(page, url, { waitUntil: session.defaultWaitUntil(url), timeoutMs: 60000, settleMs: 3000 });
  await session.dismissOverlays(page, { lateWindowMs: 6000 });
} else { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); }
await page.evaluate(async () => {
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); }
  window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600));
});
const data = await page.evaluate(({ selectors, depth }) => {
  const PROPS = ['display','position','backgroundImage','backgroundSize','backgroundPosition','backgroundRepeat','fontSize','lineHeight','fontFamily','fontWeight','letterSpacing','textAlign','paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginBottom','marginLeft','marginRight','gap','rowGap','columnGap','backgroundColor','color','borderRadius','width','height','maxWidth','flexDirection','justifyContent','alignItems','gridTemplateColumns','objectFit','overflow','opacity','visibility'];
  const sy = window.scrollY;
  const walk = (el, d) => {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    const node = { tag: el.tagName.toLowerCase(), id: el.id || undefined, cls: (el.className && typeof el.className === 'string') ? el.className.trim().slice(0, 120) : undefined,
      x: Math.round(r.x), y: Math.round(r.y + sy), w: Math.round(r.width), h: Math.round(r.height) };
    for (const p of PROPS) node[p] = cs[p];
    const txt = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).filter(Boolean).join(' ');
    if (txt) node.text = txt.slice(0, 80);
    if (el.tagName === 'IMG') { node.src = (el.currentSrc || el.src || '').slice(-80); node.nat = `${el.naturalWidth}x${el.naturalHeight}`; node.alt = el.alt; }
    if (el.getAttribute('aria-label')) node.aria = el.getAttribute('aria-label');
    if (d < depth && el.children.length && cs.display !== 'none') node.kids = [...el.children].filter(c => !['SCRIPT','STYLE','NOSCRIPT'].includes(c.tagName)).map(c => walk(c, d + 1));
    return node;
  };
  const res = {};
  for (const s of selectors) { const el = document.querySelector(s); if (!el) { res[s] = null; continue; }
    res[s] = { tree: walk(el, 0), html: el.outerHTML.replace(/<script[\s\S]*?<\/script>/g, '').replace(/\s+/g, ' ').slice(0, 60000) }; }
  res._root = { scrollHeight: document.documentElement.scrollHeight, scrollWidth: document.documentElement.scrollWidth };
  return res;
}, { selectors, depth });
await browser.close();
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ url, width, at: new Date().toISOString(), ...data }, null, 1));
console.log(`harvest-boxes: ${url} @${width} → ${out}; root ${JSON.stringify(data._root)}; ` + selectors.map(s => `${s}: ${data[s] ? data[s].tree.h + 'px' : 'MISSING'}`).join(', '));
