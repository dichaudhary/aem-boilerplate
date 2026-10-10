// font-probe: measure "Our Products" width for a font URL at weights 400/700 (is the file variable? does 700 render bold?)
import { chromium } from 'playwright';
const urls = process.argv.slice(2);
const browser = await chromium.launch({ headless: true }); const page = await browser.newPage();
await page.goto('http://localhost:8791/index-proposed.html', { waitUntil: 'domcontentloaded' });
for (const u of urls) {
  const r = await page.evaluate(async (u) => {
    const fam = 'Probe' + Math.random().toString(36).slice(2, 7);
    const f = new FontFace(fam, `url(${u})`, { weight: '100 900' }); await f.load(); document.fonts.add(f);
    const c = document.createElement('canvas').getContext('2d'); const out = {};
    for (const w of [400, 700]) { c.font = `${w} 16px "${fam}"`; out[w] = Math.round(c.measureText('Our Products').width * 10) / 10; }
    c.font = `700 16px "Libre Baskerville"`; out.pageFont700 = Math.round(c.measureText('Our Products').width * 10) / 10;
    c.font = `400 16px "Libre Baskerville"`; out.pageFont400 = Math.round(c.measureText('Our Products').width * 10) / 10;
    return out;
  }, u);
  console.log(u.slice(-60), JSON.stringify(r));
}
await browser.close();
