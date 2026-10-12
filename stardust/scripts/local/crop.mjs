// crop.mjs <in.png> <out.png> <y> <h> [scale=0.5] [x=0] [w=full]
import fs from 'fs'; import { PNG } from 'pngjs';
const [inp, out, y0, h0, sc = '0.5', x0 = '0', w0] = process.argv.slice(2);
const src = PNG.sync.read(fs.readFileSync(inp));
const s = Number(sc), X = Number(x0), Y = Number(y0);
const W = Number(w0 || src.width - X), H = Math.min(Number(h0), src.height - Y);
const ow = Math.round(W * s), oh = Math.round(H * s);
const dst = new PNG({ width: ow, height: oh });
for (let j = 0; j < oh; j++) for (let i = 0; i < ow; i++) {
  let r = 0, g = 0, b = 0, n = 0;
  const sx0 = X + Math.floor(i / s), sy0 = Y + Math.floor(j / s), k = Math.max(1, Math.round(1 / s));
  for (let dy = 0; dy < k; dy++) for (let dx = 0; dx < k; dx++) {
    const sx = sx0 + dx, sy = sy0 + dy; if (sx >= src.width || sy >= src.height) continue;
    const o = (sy * src.width + sx) * 4; r += src.data[o]; g += src.data[o + 1]; b += src.data[o + 2]; n++;
  }
  const d = (j * ow + i) * 4; dst.data[d] = r / n; dst.data[d + 1] = g / n; dst.data[d + 2] = b / n; dst.data[d + 3] = 255;
}
fs.writeFileSync(out, PNG.sync.write(dst)); console.log(`${out} ${ow}x${oh} from y=${Y} h=${H}`);
