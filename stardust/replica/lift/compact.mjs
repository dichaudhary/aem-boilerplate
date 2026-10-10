// compact view of a measure.mjs log: width | selector | rect | chosen props
import fs from 'node:fs';
const [file, propsArg] = process.argv.slice(2);
const props = (propsArg || 'fontFamily,fontSize,fontWeight,lineHeight,color,backgroundColor,padding').split(',');
const lines = fs.readFileSync(file, 'utf8').split('\n');
let width = '', sel = '';
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const w = l.match(/^@ (\d+)px/); if (w) { width = w[1]; console.log(`\n@${width}`); continue; }
  if (/^  root /.test(l)) { console.log(l.trim()); continue; }
  if (/^  \S/.test(l)) { sel = l.trim(); continue; }
  const r = l.match(/^\s+x\s+(-?\d+)\s+y\s+(-?\d+)\s+w\s+(\d+)\s+h\s+(\d+)\s+(\w+)/);
  if (r) { const st = lines[i + 1] || ''; const vals = props.map(p => { const m = st.match(new RegExp(p + ': ([^;]+);')); return m ? m[1].replace(/Poppins, sans-serif/, 'Pop').replace(/"Libre Baskerville", sans-serif/, 'LB') : '?'; });
    console.log(`${sel} | ${r[1]},${r[2]} ${r[3]}x${r[4]} ${r[5]} | ${vals.join(' | ')}`); }
}
