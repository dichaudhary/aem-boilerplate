// lift.mjs <url> <out.json> --width W : visible element dump (rect + key computed styles, non-default only)
import { chromium } from 'playwright'; import fs from 'fs';
const [url, out] = process.argv.slice(2); const W = Number(process.argv[process.argv.indexOf('--width') + 1] || 1440);
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: W, height: 900 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
const p = await ctx.newPage(); await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); await p.waitForTimeout(3000);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 500) { await p.evaluate((yy) => scrollTo(0, yy), y); await p.waitForTimeout(150); }
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(1500);
const data = await p.evaluate(() => {
  const props = ['display','position','boxSizing','width','height','marginTop','marginRight','marginBottom','marginLeft','paddingTop','paddingRight','paddingBottom','paddingLeft','fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','backgroundColor','backgroundImage','backgroundSize','backgroundPosition','borderTop','borderRight','borderBottom','borderLeft','borderRadius','boxShadow','textAlign','textTransform','maxWidth','minHeight','flexDirection','justifyContent','alignItems','gap','gridTemplateColumns','objectFit','opacity','zIndex','top','left','overflow','transform','textDecorationLine','whiteSpace'];
  const res = []; let i = 0;
  const sel = (el) => { const c = [...el.classList].filter(x => !/^aem-Grid|^aem-GridColumn|^slick-(slide|cloned|current|active)$/.test(x)).slice(0, 4).join('.'); return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (c ? '.' + c : ''); };
  function walk(el, depth, path) {
    for (const c of el.children) {
      if (['SCRIPT','STYLE','NOSCRIPT','LINK','META','path','g','defs','IFRAME'].includes(c.tagName) && c.tagName !== 'IFRAME') continue;
      const cs = getComputedStyle(c); const r = c.getBoundingClientRect();
      const vis = cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
      if (cs.display === 'none') continue;
      const rec = { i: i++, d: depth, s: sel(c), x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width*10)/10, h: Math.round(r.height*10)/10, vis };
      const own = [...c.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(' ').replace(/\s+/g, ' ').trim();
      if (own) rec.t = own.slice(0, 80);
      if (c.tagName === 'IMG') { rec.src = (c.currentSrc || c.src).slice(-90); rec.nat = c.naturalWidth + 'x' + c.naturalHeight; }
      if (c.tagName === 'A') rec.href = c.getAttribute('href');
      const st = {}; for (const k of props) { const v = cs[k]; if (v && !['none','normal','auto','0px','static','visible','rgba(0, 0, 0, 0)','0px none rgb(0, 0, 0)','start','stretch','content-box','1'].includes(v)) st[k] = v; }
      delete st.width; delete st.height; rec.st = st;
      const bf = getComputedStyle(c, '::before'), af = getComputedStyle(c, '::after');
      if (bf.content && bf.content !== 'none' && bf.content !== 'normal') rec.before = { content: bf.content.slice(0, 30), bg: bf.backgroundImage.slice(0, 80), bgc: bf.backgroundColor, w: bf.width, h: bf.height, pos: bf.position, ff: bf.fontFamily };
      if (af.content && af.content !== 'none' && af.content !== 'normal') rec.after = { content: af.content.slice(0, 30), bg: af.backgroundImage.slice(0, 80), bgc: af.backgroundColor, w: af.width, h: af.height, pos: af.position, ff: af.fontFamily };
      rec.path = path;
      res.push(rec);
      if (c.tagName !== 'svg') walk(c, depth + 1, rec.i);
    }
  }
  walk(document.body, 0, -1); return { scrollHeight: document.documentElement.scrollHeight, body: getComputedStyle(document.body).backgroundColor, bodyFont: getComputedStyle(document.body).fontFamily, smoothing: getComputedStyle(document.body).webkitFontSmoothing, textRendering: getComputedStyle(document.body).textRendering, els: res };
});
fs.writeFileSync(out, JSON.stringify(data)); console.log(`lift ${W}: ${data.els.length} els, scrollHeight ${data.scrollHeight}`); await b.close();
