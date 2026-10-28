// crop.mjs <in.png> <out.png> <y> <h> [x=0] [w=all] [scale=1]  — box-filter downscale
import fs from 'fs'; import { PNG } from 'pngjs';
const [inp, out, y0, h0, x0 = 0, w0 = 0, sc = 1] = process.argv.slice(2);
const src = PNG.sync.read(fs.readFileSync(inp));
const x = +x0, y = +y0, w = +w0 || src.width - x, h = Math.min(+h0, src.height - y), s = +sc;
const W = Math.floor(w / s), H = Math.floor(h / s); const dst = new PNG({ width: W, height: H });
for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const acc = [0, 0, 0, 0]; let n = 0;
  for (let b = 0; b < s; b++) for (let a = 0; a < s; a++) { const k = ((y + j * s + b) * src.width + (x + i * s + a)) * 4; for (let c = 0; c < 4; c++) acc[c] += src.data[k + c]; n++; }
  const o = (j * W + i) * 4; for (let c = 0; c < 4; c++) dst.data[o + c] = Math.round(acc[c] / n); }
fs.writeFileSync(out, PNG.sync.write(dst)); console.log(out, W + 'x' + H);
