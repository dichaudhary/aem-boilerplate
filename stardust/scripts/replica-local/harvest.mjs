// Harvest the live page's own responses (stylesheets, fonts, images) at the given widths.
// Usage: node harvest.mjs <url> <outdir> [widths=1440,360]
import { chromium } from 'playwright';
import fs from 'fs'; import path from 'path'; import crypto from 'crypto';
const [url, out, w='1440,360'] = process.argv.slice(2);
const dirs = { stylesheet: 'css', font: 'fonts', image: 'img', script: 'js' };
for (const d of Object.values(dirs)) fs.mkdirSync(path.join(out, d), { recursive: true });
const manPath = path.join(out, 'manifest.json');
const manifest = fs.existsSync(manPath) ? JSON.parse(fs.readFileSync(manPath)) : {};
const browser = await chromium.launch();
for (const width of w.split(',').map(Number)) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const pending = [];
  page.on('response', (res) => {
    const type = res.request().resourceType(); const d = dirs[type];
    if (!d || res.status() >= 300) return;
    const u = res.url(); if (u.startsWith('data:')) return;
    pending.push((async () => {
      try {
        const buf = await res.body(); const ct = res.headers()['content-type'] || '';
        let base = decodeURIComponent(new URL(u).pathname.split('/').pop() || 'index').replace(/[^\w.-]+/g, '_').slice(0, 60);
        const h = crypto.createHash('sha1').update(u).digest('hex').slice(0, 8);
        let ext = path.extname(base);
        if (!ext) ext = ct.includes('webp') ? '.webp' : ct.includes('png') ? '.png' : ct.includes('jpeg') ? '.jpg' : ct.includes('svg') ? '.svg' : ct.includes('css') ? '.css' : ct.includes('woff2') ? '.woff2' : ct.includes('javascript') ? '.js' : '.bin';
        else base = base.slice(0, -ext.length);
        const file = path.join(d, `${base}-${h}${ext}`);
        fs.writeFileSync(path.join(out, file), buf);
        manifest[u] = { file, type, ct, bytes: buf.length, width };
      } catch {}
    })());
  });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 500) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(250); }
  await page.waitForTimeout(3000);
  await Promise.all(pending);
  await ctx.close();
}
await browser.close();
fs.writeFileSync(manPath, JSON.stringify(manifest, null, 1));
const c = {}; for (const v of Object.values(manifest)) c[v.type] = (c[v.type] || 0) + 1;
console.log('harvested', JSON.stringify(c));
