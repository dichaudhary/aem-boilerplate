// lq.mjs <lift.json> [--y0 N --y1 N] [--min-h N] [--maxd N] [--grep re] [--styles] [--keys a,b]
import fs from 'fs';
const a = process.argv.slice(2); const f = a[0]; const g = (k, d) => { const i = a.indexOf(k); return i > 0 ? a[i + 1] : d; };
const D = JSON.parse(fs.readFileSync(f)); const y0 = +g('--y0', -1e9), y1 = +g('--y1', 1e9), minh = +g('--min-h', 0), maxd = +g('--maxd', 99), re = g('--grep') ? new RegExp(g('--grep')) : null;
const showSt = a.includes('--styles'); const keys = g('--keys') ? g('--keys').split(',') : null;
const abbrev = { fontFamily: 'ff', fontSize: 'fs', fontWeight: 'fw', lineHeight: 'lh', letterSpacing: 'ls', color: 'c', backgroundColor: 'bg', backgroundImage: 'bgi', paddingTop: 'pt', paddingRight: 'pr', paddingBottom: 'pb', paddingLeft: 'pl', marginTop: 'mt', marginRight: 'mr', marginBottom: 'mb', marginLeft: 'ml', borderRadius: 'br', textAlign: 'ta', display: 'dis', position: 'pos', maxWidth: 'maxw', justifyContent: 'jc', alignItems: 'ai', flexDirection: 'fd', gridTemplateColumns: 'gtc', textTransform: 'tt', boxShadow: 'shadow', backgroundSize: 'bgs', backgroundPosition: 'bgp', borderBottom: 'bb', borderTop: 'bt', borderLeft: 'bl', borderRight: 'brt', boxSizing: 'bs' };
const byI = new Map(D.els.map(e => [e.i, e]));
const INH = ['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','textAlign','textTransform','whiteSpace'];
const JUNK = (k, v) => /^0px none/.test(v) || (k==='backgroundPosition' && v==='0% 0%') || (k==='objectFit' && v==='fill') || (k==='flexDirection' && v==='row') || (k==='boxSizing' && v==='border-box') || (k==='display' && /^(block|inline|list-item)$/.test(v)) || (k==='overflow' && v==='clip');
for (const e of D.els) {
  if (!e.vis || e.y + e.h < y0 || e.y > y1 || e.h < minh || e.d > maxd) continue;
  const line = `${'.'.repeat(Math.min(e.d, 30))}${e.s} [${e.x},${e.y} ${e.w}x${e.h}]` + (e.t ? ` «${e.t}»` : '') + (e.src ? ` img=${e.src} ${e.nat}` : '') + (e.href ? ` →${e.href}` : '');
  if (re && !re.test(line)) continue;
  let st = '';
  if (showSt || keys) { st = Object.entries(e.st).filter(([k, v]) => (!keys || keys.includes(k)) && !JUNK(k, v) && !(INH.includes(k) && byI.get(e.path) && byI.get(e.path).st[k] === v)).map(([k, v]) => `${abbrev[k] || k}:${String(v).replace(/"/g, '').replace(/rgb\((\d+), (\d+), (\d+)\)/g, (m, r, gg, b) => '#' + [r, gg, b].map(x => (+x).toString(16).padStart(2, '0')).join('')).slice(0, 90)}`).join(' ');
    if (e.before) st += ` ::before{${JSON.stringify(e.before).slice(0, 160)}}`; if (e.after) st += ` ::after{${JSON.stringify(e.after).slice(0, 160)}}`; }
  console.log(line + (st ? '  | ' + st : ''));
}
