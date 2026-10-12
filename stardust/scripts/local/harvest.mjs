// Harvest the live page's own responses (css, fonts, images, svg) at given widths.
// Usage: node harvest.mjs <url> <outDir> [--widths 1440,360]
import { chromium } from 'playwright';
import fs from 'fs'; import path from 'path'; import crypto from 'crypto';
const [url, out] = process.argv.slice(2);
const wi = process.argv.indexOf('--widths');
const widths = (wi > 0 ? process.argv[wi + 1] : '1440,360').split(',').map(Number);
const manifest = {}; const mfile = path.join(out, 'manifest.json');
if (fs.existsSync(mfile)) Object.assign(manifest, JSON.parse(fs.readFileSync(mfile)));
const browser = await chromium.launch();
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
  const page = await ctx.newPage();
  page.on('response', async (r) => {
    try {
      const u = r.url(); if (manifest[u] || r.status() >= 300) return;
      const ct = (r.headers()['content-type'] || '').split(';')[0];
      let kind = null;
      if (/css/.test(ct) || /\.css(\?|$)/.test(u)) kind = 'css';
      else if (/font|woff|ttf|otf/.test(ct) || /\.(woff2?|ttf|otf)(\?|$)/.test(u)) kind = 'fonts';
      else if (/^image\//.test(ct)) kind = 'img';
      if (!kind) return;
      const body = await r.body();
      const base = decodeURIComponent(new URL(u).pathname.split('/').pop() || 'x').replace(/[^\w.-]+/g, '_').slice(-60);
      const h = crypto.createHash('sha1').update(u).digest('hex').slice(0, 6);
      let ext = path.extname(base); if (!ext) ext = { 'image/svg+xml': '.svg', 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'text/css': '.css' }[ct] || '';
      const name = `${h}-${path.basename(base, path.extname(base))}${ext}`;
      fs.mkdirSync(path.join(out, kind), { recursive: true });
      fs.writeFileSync(path.join(out, kind, name), body);
      manifest[u] = { file: `${kind}/${name}`, ct, bytes: body.length, width: w };
    } catch {}
  });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H + 900; y += 400) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(250); }
  await page.waitForTimeout(3000);
  await ctx.close();
}
await browser.close();
fs.writeFileSync(mfile, JSON.stringify(manifest, null, 1));
const c = {}; for (const v of Object.values(manifest)) c[v.file.split('/')[0]] = (c[v.file.split('/')[0]] || 0) + 1;
console.log('harvest:', JSON.stringify(c));
