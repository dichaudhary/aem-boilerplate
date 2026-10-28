// pseudo.mjs <url> <width> <selector>... — ::before/::after of first 2 matches (content codepoints + key styles)
import { chromium } from 'playwright';
const [url, w, ...sels] = process.argv.slice(2);
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: +w, height: 900 } })).newPage();
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); await p.waitForTimeout(3500);
const res = await p.evaluate((sels) => sels.map(s => { const els = [...document.querySelectorAll(s)].slice(0, 1); return { s, n: document.querySelectorAll(s).length, v: els.map(e => ['::before', '::after', ''].map(ps => { const c = getComputedStyle(e, ps || null);
  if (ps && (c.content === 'none' || c.content === 'normal')) return null;
  const cont = [...(c.content || '')].map(ch => ch.charCodeAt(0) > 126 ? '\\' + ch.charCodeAt(0).toString(16) : ch).join('');
  const props = ['display','position','top','left','right','bottom','width','height','font-family','font-size','line-height','color','background-color','background-image','background-size','border','border-top','border-bottom','border-left','border-right','border-radius','transform','padding','margin','opacity','content'];
  return (ps || 'self') + ' content=' + cont + ' | ' + props.filter(k=>k!=='content').map(k => k + ':' + c.getPropertyValue(k)).filter(x => !/:(none|auto|normal|0px|rgba\(0, 0, 0, 0\)|static|0px none.*|)$/.test(x)).join('; ');
}).filter(Boolean)) }; }), sels);
for (const r of res) { console.log(`== ${r.s} (${r.n})`); for (const v of r.v) for (const l of v) console.log('  ' + l.slice(0, 600)); }
await b.close();
