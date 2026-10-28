import fs from 'fs';
const [inp, vw] = process.argv.slice(2);
for (const l of fs.readFileSync(inp, 'utf8').trim().split('\n')) {
  const [i, chain, rect, text, src, s] = l.split('\t');
  const [x] = rect.split(',').map(Number); if (x >= +vw || x < -50) continue;
  const parts = chain.split(' > '); const el = parts.slice(-2).join(' > ');
  const st = (s || '').split('; ').filter(p => !/^(font-family:Poppins, sans-serif|font-size:16px|font-weight:400|color:rgb\(0, 0, 0\)|background-position:0% 0%|object-fit:fill|display:block)$/.test(p)).join('; ');
  if (!text && !src && !st) continue;
  console.log([i, el.replace(/\.cmp-navigation__item--level-0|\.cmp-header__nav-products/g, ''), rect, text, src, st].filter(Boolean).join(' | '));
}
