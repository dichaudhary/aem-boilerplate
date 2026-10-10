// tree.mjs <boxes.json> <selector> [--depth 4] [--grep re] — indented box tree from harvest-boxes output
import fs from 'node:fs';
const a = process.argv.slice(2); const opt = (k, d) => { const i = a.indexOf(k); return i > -1 ? a[i+1] : d; };
const j = JSON.parse(fs.readFileSync(a[0], 'utf8')); const sel = a[1]; const maxD = Number(opt('--depth', 4)); const re = opt('--grep') ? new RegExp(opt('--grep')) : null;
const t = j[sel]?.tree; if (!t) { console.log('MISSING', sel); process.exit(1); }
const pr = (n, d) => { const line = `${'  '.repeat(d)}${n.tag}${n.id ? '#' + n.id : ''}${n.cls ? '.' + n.cls.split(' ').slice(0,3).join('.') : ''}  y${n.y} h${n.h} w${n.w} x${n.x}  ${n.display}${n.position !== 'static' ? ' ' + n.position : ''} fs${parseFloat(n.fontSize)}/${n.lineHeight} p${n.paddingTop}/${n.paddingBottom} m${n.marginTop}/${n.marginBottom}${n.gap !== 'normal' ? ' gap' + n.gap : ''}${n.text ? '  "' + n.text.slice(0,40) + '"' : ''}${n.nat ? ' img' + n.nat : ''}${n.aria ? ' aria:' + n.aria : ''}`;
  if (!re || re.test(line)) console.log(line); if (d < maxD && n.kids) n.kids.forEach(k => pr(k, d+1)); };
pr(t, 0);
