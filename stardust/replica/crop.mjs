// crop.mjs <in.png> <out.png> --y <y> --h <h> [--scale 0.5]
import fs from 'node:fs'; import { createRequire } from 'node:module';
const { PNG } = createRequire(process.cwd() + '/')('pngjs');
const a = process.argv.slice(2); const opt = (k, d) => { const i = a.indexOf(k); return i > -1 ? Number(a[i+1]) : d; };
const src = PNG.sync.read(fs.readFileSync(a[0])); const y0 = opt('--y', 0), h = Math.min(opt('--h', 500), src.height - y0), s = opt('--scale', 0.5);
const ow = Math.round(src.width * s), oh = Math.round(h * s); const out = new PNG({ width: ow, height: oh });
for (let oy = 0; oy < oh; oy++) for (let ox = 0; ox < ow; ox++) { const sx = Math.min(src.width-1, Math.round(ox / s)), sy = Math.min(src.height-1, y0 + Math.round(oy / s)); const si = (sy * src.width + sx) * 4, oi = (oy * ow + ox) * 4; out.data.set(src.data.subarray(si, si+4), oi); }
fs.writeFileSync(a[1], PNG.sync.write(out)); console.log(`${a[1]} ${ow}x${oh} from y=${y0} h=${h}`);
