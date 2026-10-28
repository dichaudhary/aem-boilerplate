// computed.mjs <url> <out.tsv> <width> — per visible element: path, doc rect, key computed styles (TSV, one line each)
import { chromium } from 'playwright'; import fs from 'fs';
const [url, out, w] = process.argv.slice(2); const width = +w;
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width, height: 900 } })).newPage();
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); await p.waitForTimeout(3000);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 400) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(150); }
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(1500);
const rows = await p.evaluate(() => {
  const props = ['display','position','font-family','font-size','font-weight','line-height','letter-spacing','text-transform','text-align','color','background-color','background-image','background-size','background-position','padding','margin','border','border-radius','box-shadow','max-width','gap','grid-template-columns','flex-direction','justify-content','align-items','opacity','object-fit','z-index','top','overflow','text-decoration-line','white-space'];
  const dflt = {}; const out = [];
  const name = (e) => e.tagName.toLowerCase() + (e.id && !/^(container|button|teaser|text|slick|logo|navigation)-/.test(e.id) ? '#' + e.id : '') + [...e.classList].filter(c => !/^(aem-|responsivegrid$|slick-(slide|current|active|cloned)$)/.test(c)).slice(0, 3).map(c => '.' + c).join('');
  let i = 0;
  for (const e of document.body.querySelectorAll('*')) {
    if (/^(SCRIPT|STYLE|NOSCRIPT|PATH|LINK|META|BR|SOURCE)$/.test(e.tagName)) continue;
    const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    if (e.closest('svg') && e.tagName !== 'svg') continue;
    let chain = []; let n = e; for (let k = 0; k < 3 && n && n !== document.body; k++, n = n.parentElement) chain.unshift(name(n));
    const own = [...e.childNodes].filter(t => t.nodeType === 3).map(t => t.textContent.trim()).join(' ').replace(/\s+/g, ' ').slice(0, 40);
    const s = props.map(k => { const v = cs.getPropertyValue(k); return v && !['none','normal','auto','0px','static','visible','rgba(0, 0, 0, 0)','start','stretch','row','1'].includes(v) && !(k==='border' && /^0px/.test(v)) && !(k==='padding'&&v==='0px') && !(k==='margin'&&v==='0px') ? `${k}:${v}` : '' }).filter(Boolean).join('; ');
    const src = e.currentSrc || e.src || ''; 
    out.push([i++, chain.join(' > '), `${Math.round(r.x)},${Math.round(r.y + scrollY)},${Math.round(r.width)}x${Math.round(r.height)}`, own ? JSON.stringify(own) : '', src ? 'src=' + src.slice(0, 140) : '', s].join('\t'));
  }
  return out;
});
fs.writeFileSync(out, rows.join('\n') + '\n'); console.log(out, rows.length, 'rows; docH', H); await b.close();
