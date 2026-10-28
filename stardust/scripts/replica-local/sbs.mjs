// sbs.mjs <a.png> <b.png> <y> <h> <out.png> [yb=y] [scale=1] — side-by-side crop of two captures (box-filter downscale)
import fs from 'fs'; import { PNG } from 'pngjs';
const [a, b, y0, h0, out, yb0, sc = 1] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b)); const s = +sc;
const ya = +y0, yb = yb0 === undefined || yb0 === '' ? ya : +yb0, h = +h0;
const wA = Math.floor(A.width / s), wB = Math.floor(B.width / s), H = Math.floor(h / s), W = wA + wB + 6;
const o = new PNG({ width: W, height: H }); o.data.fill(255);
const put = (S, y, xo, w) => { for (let j = 0; j < H; j++) for (let i = 0; i < w; i++) { const acc = [0, 0, 0, 0]; let n = 0;
  for (let q = 0; q < s; q++) for (let p = 0; p < s; p++) { const yy = y + j * s + q; if (yy >= S.height) continue; const k = (yy * S.width + i * s + p) * 4; for (let c = 0; c < 4; c++) acc[c] += S.data[k + c]; n++; }
  if (!n) continue; const d = (j * W + xo + i) * 4; for (let c = 0; c < 4; c++) o.data[d + c] = Math.round(acc[c] / n); } };
put(A, ya, 0, wA); put(B, yb, wA + 6, wB); fs.writeFileSync(out, PNG.sync.write(o)); console.log(out, W + 'x' + H);
