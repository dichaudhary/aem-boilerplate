// px.mjs <png> x,y [x,y…] — sample pixel colours
import fs from 'node:fs'; import { createRequire } from 'node:module';
const { PNG } = createRequire(process.cwd() + '/')('pngjs');
const p = PNG.sync.read(fs.readFileSync(process.argv[2]));
for (const pt of process.argv.slice(3)) { const [x, y] = pt.split(',').map(Number); const i = (y * p.width + x) * 4; console.log(`${pt}: rgb(${p.data[i]},${p.data[i+1]},${p.data[i+2]})`); }
