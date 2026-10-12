// fetch-recipes.mjs : download every recipe-card rendition the live tabs load (wid=300 desktop, wid=236 mobile)
// from the page's own scene7 URLs into the harvest and record them in the manifest.
import fs from 'fs';
const LIVE = '/workspace/f4bf5395/stardust/current/assets/live';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36';
const m = JSON.parse(fs.readFileSync(`${LIVE}/manifest.json`, 'utf8'));
const tabs = JSON.parse(fs.readFileSync('/workspace/f4bf5395/stardust/.work/probe/recipes-1440.json', 'utf8'));
const urls = new Set();
for (const t of tabs) for (const c of t.cards) if (c.img) { urls.add(c.img); urls.add(c.img.replace('wid=300', 'wid=236')); }
let n = 0;
for (const u of urls) {
  if (m[u]) continue;
  const name = decodeURIComponent(u.split('/').pop().split('?')[0]).replace(/[^A-Za-z0-9_-]+/g, '_');
  const wid = (u.match(/wid=(\d+)/) || [])[1] || 'x';
  const file = `img/rc-${name}-${wid}.webp`;
  const r = await fetch(u, { headers: { 'user-agent': UA } });
  if (!r.ok) { console.log('FAIL', r.status, u); continue; }
  fs.writeFileSync(`${LIVE}/${file}`, Buffer.from(await r.arrayBuffer()));
  m[u] = { file, ct: r.headers.get('content-type'), bytes: fs.statSync(`${LIVE}/${file}`).size, source: 'replica-phase3 fetch: recipe-tab card renditions the live page lazy-loads on reveal/tab switch' };
  n += 1;
}
fs.writeFileSync(`${LIVE}/manifest.json`, JSON.stringify(m, null, 1));
console.log(`fetched ${n} of ${urls.size}`);
