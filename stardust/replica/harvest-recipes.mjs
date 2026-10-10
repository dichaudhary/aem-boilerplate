import fs from 'node:fs';
import { createRequire } from 'node:module';
const cheerio = createRequire(process.cwd() + '/')('cheerio');
const $ = cheerio.load(fs.readFileSync('stardust/current/pages/index.html', 'utf8'));
const rows = [];
$('.cmp-recipe-group__carousel-item').each((i, el) => {
  const $el = $(el);
  rows.push({
    cls: ($el.attr('class')||'').replace(/\s+/g,' ').trim(),
    href: $el.find('a.card').attr('href'),
    img: $el.find('img').attr('src') || $el.find('img').attr('data-src') || '',
    alt: $el.find('img').attr('alt') || '',
    tag: $el.find('.cmp-card__tag-wrapper p').text().trim(),
    title: $el.find('.cmp-card__title h4').text(),
    time: $el.find('.cmp-card__time-in-minutes p').text().trim(),
    level: $el.find('.cmp-card__difficulty-level p').text().trim(),
    hasImg: $el.find('img').length,
  });
});
fs.writeFileSync('stardust/replica/recipes.json', JSON.stringify(rows, null, 1));
for (const r of rows) console.log(r.cls.replace('cmp-recipe-group__carousel-item cmp-carousel__item slick-slide','').trim() || '-', '|', r.title, '|', r.time, '|', r.level, '|', r.hasImg ? r.img.slice(45, 110) : 'NOIMG');
console.log('popular imgs:', $('#popidd img').map((_, i) => $(i).attr('src')).get());
console.log('recipe action:', $('.cmp-recipe-group__action').parent().html()?.replace(/\s+/g,' ').slice(0,500));
console.log('slick-track style hero:', $('#slickcarousel-45c1cf16aa .slick-track').attr('style'));
console.log('slick-track style recipes:', $('.cmp-recipe-group .slick-track').attr('style'));
console.log('slick-track style popular:', $('#popidd .slick-track').attr('style'));
console.log('slick-track style community:', $('#slickcarousel-0f817c55a9 .slick-track').attr('style'));
console.log('slide widths:', $('#slickcarousel-45c1cf16aa .slick-slide').first().attr('style'), $('.cmp-recipe-group .slick-slide').first().attr('style'), $('#popidd .slick-slide').first().attr('style'));
console.log('teaser styles:', $('#teaser-f9d12a04df').attr('style'), '|', $('#teaser-da4b81de79').attr('style'), '|', $('#teaser-1e869c0ca5').attr('style'));
console.log('popular image style:', $('.cmp-popular-products__image').first().attr('style'));
console.log('categorylist inner:', $('.cmp-categorylist__imagewrapper').first().html().replace(/\s+/g,' ').slice(0,300));
console.log('banner picture source:', $('.cmp-banner picture source').first().toString().slice(0,300));
console.log('header picture source:', $('#header picture source').first().toString().slice(0,300));
console.log('footer sources:', $('#footer picture source').map((_, s) => $(s).attr('srcset') || $(s).attr('data-srcset')).get());
console.log('footer imgs:', $('#footer img').map((_, s) => ($(s).attr('src')||'') + ' / ' + ($(s).attr('data-src')||'')).get());
