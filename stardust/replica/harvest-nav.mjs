// Harvest the live header nav tree (labels + hrefs + level classes) from the captured DOM
// into a clean <ul>/<li>/<a> fragment. Text/href verbatim; wrapper divs and <span><meta> noise dropped.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/');
const cheerio = require('cheerio');
const html = fs.readFileSync('stardust/current/pages/index.html', 'utf8');
const $ = cheerio.load(html);
function ul($ul, depth) {
  const cls = ($ul.attr('class') || '').trim();
  let out = `${'  '.repeat(depth)}<ul class="${cls}">\n`;
  $ul.children().each((_, c) => {
    const $c = $(c);
    if (c.tagName === 'div') { // .cmp-header__category-menu wrapper: keep as div (it carries layout)
      out += `${'  '.repeat(depth+1)}<div class="${($c.attr('class')||'').trim()}">\n`;
      $c.children('li').each((_, li) => { out += liOut($(li), depth+2); });
      out += `${'  '.repeat(depth+1)}</div>\n`;
    } else if (c.tagName === 'li') out += liOut($c, depth+1);
  });
  return out + `${'  '.repeat(depth)}</ul>\n`;
}
function liOut($li, depth) {
  const cls = ($li.attr('class') || '').trim().replace(/\s+/g, ' ');
  const $a = $li.children('a').first();
  let s = `${'  '.repeat(depth)}<li class="${cls}">`;
  if ($a.length) s += `<a class="cmp-navigation__item-link" href="${$a.attr('href')}">${$a.text().replace(/\s+/g,' ')}</a>`;
  $li.children('ul').each((_, u) => { s += '\n' + ul($(u), depth+1) + '  '.repeat(depth); });
  return s + `</li>\n`;
}
const $nav = $('#navigation-3f62f7748f > ul').first();
const frag = ul($nav, 0);
fs.writeFileSync('stardust/replica/nav-fragment.html', frag);
const counts = { li: (frag.match(/<li /g)||[]).length, a: (frag.match(/<a /g)||[]).length, level0: (frag.match(/level-0/g)||[]).length, mobileOnly: (frag.match(/mobile/g)||[]).length };
console.log('nav fragment', frag.length, 'chars', counts);
// header icons / other bits
console.log('nav-icons:', $('.cmp-header__nav-icons').html().replace(/\s+/g,' ').slice(0, 600));
console.log('search section text:', $('#search-48d9bd3936').text().replace(/\s+/g,' ').slice(0, 200));
console.log('header classes level0:', $('#navigation-3f62f7748f > ul > li').map((_, li) => $(li).attr('class').trim()).get());
console.log('level0 texts:', $('#navigation-3f62f7748f > ul > li > a').map((_, a) => $(a).text().trim()).get());
