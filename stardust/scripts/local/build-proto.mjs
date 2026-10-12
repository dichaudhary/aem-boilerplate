// build-proto.mjs — emits stardust/prototypes/index-proposed.html from the captured page
// (stardust/current/pages/index.html is read as DATA only: strings, hrefs, alts, asset URLs).
// Markup is authored here (clean BEM-ish), never copied. Assets are rehosted under
// stardust/prototypes/assets/ via stardust/current/assets/live/manifest.json.
import * as cheerio from '/app/node_modules/cheerio/dist/esm/index.js';
import fs from 'fs';
import path from 'path';

const ROOT = '/workspace/f4bf5395';
const LIVE = `${ROOT}/stardust/current/assets/live`;
const OUT = `${ROOT}/stardust/prototypes`;
const $ = cheerio.load(fs.readFileSync(`${ROOT}/stardust/current/pages/index.html`, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(`${LIVE}/manifest.json`, 'utf8'));
const missing = [];

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const txt = (el) => $(el).text().replace(/\s+/g, ' ').trim();
const norm = (u) => u.replace(/&amp;/g, '&').replace(/ /g, '%20');

function asset(url) {
  if (!url) return '';
  const u = norm(url.startsWith('//') ? `https:${url}` : url);
  const hit = manifest[u] || manifest[decodeURI(u)] || Object.entries(manifest).find(([k]) => norm(k) === u)?.[1];
  if (!hit) { missing.push(u); return `MISSING:${u}`; }
  const file = path.basename(hit.file);
  const dir = hit.file.startsWith('fonts/') ? 'fonts' : 'img';
  fs.mkdirSync(`${OUT}/assets/${dir}`, { recursive: true });
  fs.copyFileSync(`${LIVE}/${hit.file}`, `${OUT}/assets/${dir}/${file}`);
  return `assets/${dir}/${file}`;
}
const S7 = 'https://s7ap1.scene7.com/is/image/itcportalprod/';
const S7C = 'https://s7ap1.scene7.com/is/content/itcportalprod/';

// ---------- header ----------
function navItem(li, level) {
  const $li = $(li);
  const a = $li.children('a').first();
  const sub = $li.children('ul').first();
  const kids = sub.length ? sub.find(`> div.cmp-header__category-menu > li, > li`).toArray() : [];
  const hasKids = kids.length > 0;
  const cls = [`nav__item`, `nav__item--l${level}`];
  if (level === 0) cls.push(hasKids ? 'nav__item--has-menu' : 'nav__item--plain');
  let h = `<li class="${cls.join(' ')}"><a class="nav__link" href="${esc(a.attr('href'))}">${esc(txt(a))}</a>`;
  if (hasKids) {
    const menuCls = level === 0 ? 'nav__menu' : 'nav__submenu';
    h += `<ul class="${menuCls}">${kids.map((k) => navItem(k, level + 1)).join('')}</ul>`;
  }
  return `${h}</li>`;
}
const navTop = $('.cmp-header__nav-group').first().children('li').toArray().map((li) => navItem(li, 0)).join('\n          ');
const policy = $('.cmp-header__mobile-list .cmp-header__policy a').toArray()
  .map((a) => `<li><a href="${esc($(a).attr('href'))}" target="_blank">${esc(txt(a))}</a></li>`).join('');
const SOCIAL = [['icon-instagram', 'https://www.instagram.com/aashirvaad/'], ['icon-facebok', 'https://www.facebook.com/Aashirvaad/'], ['icon-twitter', 'https://twitter.com/AashirvaadAtta'], ['icon-youtube', 'https://www.youtube.com/user/AashirvaadAtta']];
const social = (cls) => SOCIAL.map(([i, h]) => `<a class="${cls} ${i}" href="${h}" target="_blank"></a>`).join('');
const headerLogo = $('.cmp-header__logo img').first();

const header = `
  <header class="site-header">
    <input class="site-header__toggle" type="checkbox" id="nav-toggle">
    <a class="site-header__logo" href="/"><img src="${asset(headerLogo.attr('src'))}" alt="${esc(headerLogo.attr('alt'))}" width="240" height="78"></a>
    <div class="site-header__nav">
      <nav class="nav">
        <ul class="nav__list">
          ${navTop}
        </ul>
        <div class="nav__mobile-list">
          <ul class="nav__policy">${policy}</ul>
          <div class="nav__social">${social('nav__social-link')}</div>
        </div>
      </nav>
    </div>
    <div class="site-header__icons">
      <a class="site-header__icon" href="#"><div class="icon icon-search"></div><div class="site-header__icon-text">Search</div></a>
    </div>
  </header>`;

// ---------- hero ----------
const MOBILE_HERO = ['Trust', 'nutritions', 'quality', 'monile%20pink%20salt'];
const heroSlides = $('.main-banner .cmp-carousel__item').toArray().map((s, i) => {
  const $s = $(s);
  const logo = $s.find('.cmp-banner__item-logo img');
  const img = $s.find('img.cmp-banner__image');
  const desk = asset(img.attr('data-desktop-src') || img.attr('src'));
  const mob = asset(img.attr('data-mobile-src') || `${S7}${MOBILE_HERO[i]}?fmt=webp-alpha`);
  const a = $s.find('a.cmp-button');
  return `
        <div class="carousel__slide hero__slide" aria-label="Slide ${i + 1} of 4" style="--hero-d:url(../${desk});--hero-m:url(../${mob})">
          <div class="hero__banner">
            <div class="hero__logo"><img src="${asset(logo.attr('src'))}" alt="${esc(logo.attr('alt'))}" width="320" height="103"></div>
            <h2 class="hero__title">${esc(txt($s.find('.cmp-banner__title')))}</h2>
            <h3 class="hero__sub">${esc(txt($s.find('.cmp-banner__sub-title')))}</h3>
            <picture class="hero__picture"><source srcset="${mob}" media="(max-width: 600px)"><img src="${desk}" alt="${esc(img.attr('alt'))}"></picture>
            <div class="hero__cta"><a class="btn" href="${esc(a.attr('href'))}"><span class="btn__text">${esc(txt(a))}</span></a></div>
          </div>
        </div>`;
}).join('');
const dots = (n, active) => `<ul class="carousel__dots">${Array.from({ length: n }, (_, i) => `<li${i === active ? ' class="is-active"' : ''}><button type="button" aria-label="${i + 1} of ${n}">${i + 1}</button></li>`).join('')}</ul>`;
const arrow = (dir) => `<button class="carousel__arrow carousel__arrow--${dir}" type="button" aria-label="${dir === 'prev' ? 'Previous' : 'Next'}">${dir === 'prev' ? 'Previous' : 'Next'}</button>`;

const hero = `
    <section class="hero">
      <div class="carousel hero__carousel" data-carousel data-start="0">
        ${arrow('prev')}
        <div class="carousel__viewport"><div class="carousel__track">${heroSlides}
        </div></div>
        ${arrow('next')}
        ${dots(4, 0)}
      </div>
    </section>`;

// ---------- offerings ----------
const CAT_IMG = [['aataxmultigrain', 'Image1'], ['ORGANIC', 'Image4'], ['saltXIdoised', 'Image2'], ['our_categories_5', 'image6'], ['our_categories_6', 'Image5']];
const cats = $('.cmp-product-category-listing__content .cmp-categorylist__item').toArray().map((a, i) => `
          <div class="offerings__cat"><a class="offerings__link" href="${esc($(a).attr('href'))}" title="${esc($(a).attr('title'))}"><span class="offerings__circle"><img class="offerings__img" src="${asset(`${S7}${CAT_IMG[i][0]}?fmt=webp-alpha`)}" alt="${CAT_IMG[i][1]}"></span><span class="offerings__name">${esc(txt($(a).find('.cmp-categorylist__name')))}</span></a></div>`).join('');
const offerings = `
    <section class="band band--cream offerings">
      <div class="offerings__inner">
        <div class="offerings__header">
          <h1 class="offerings__title">${esc(txt('.cmp-product-category-listing__title'))}</h1>
          <div class="offerings__sub">${esc(txt('.cmp-product-category-listing__subTitle'))}</div>
        </div>
        <div class="offerings__grid">${cats}
        </div>
      </div>
    </section>`;

// ---------- video band ----------
const v1 = $('#player1');
const videoBand = `
    <section class="band band--split-down video-band">
      <div class="video-band__frame"><iframe id="player1" src="${esc(v1.attr('src'))}" width="100%" height="100%" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
    </section>`;

// ---------- recipes ----------
// the live card anchors carry no whitespace between their block children (their textContent is
// "Breakfast and SavouryShakarpara | …"), so the card markup is emitted tight
const tight = (strs, ...vals) => strs.reduce((a, str, i) => a + str + (i < vals.length ? vals[i] : ''), '').replace(/>\s+</g, '><').trim();
const tabs = $('.cmp-recipe-group__tabs .cmp-tab').toArray().map((b, i) => `<div class="tabs__item"><button class="tabs__tab${i === 0 ? ' is-selected' : ''}" type="button" role="tab" aria-selected="${i === 0}"><span class="tabs__text">${esc(txt(b))}</span></button></div>`).join('');
// recipe cards: tab 1 strings from the captured DOM; image renditions + tabs 2/3 from the live tab
// probe (stardust/.work/probe/recipes-1440.json — the live page's own endpoint data, as rendered)
const RPROBE = JSON.parse(fs.readFileSync(`${ROOT}/stardust/.work/probe/recipes-1440.json`, 'utf8'));
const imgByHref = new Map(RPROBE.flatMap((t) => t.cards.map((c) => [c.href, c])));
const cardData = (c) => {
  const d = c.img ? asset(c.img) : null;
  const m = c.img ? asset(c.img.replace('wid=300', 'wid=236')) : null;
  return { href: c.href, d, m, alt: c.alt, tag: c.tag, title: c.title, time: c.time, level: c.level };
};
const card = (c) => tight`
            <div class="carousel__slide recipes__slide">
              <a class="recipe-card" href="${esc(c.href)}">
                <div class="recipe-card__media"><div class="recipe-card__options"><div class="recipe-card__dots icon-open-card-popup"></div></div><div class="recipe-card__image"${c.d ? ` data-lazy-src="${c.d}" data-lazy-src-m="${c.m}" data-lazy-alt="${esc(c.alt)}"` : ''}></div></div>
                <div class="recipe-card__info">
                  <div class="recipe-card__tag"><div class="recipe-card__tag-wrap"><p>${esc(c.tag)}</p></div><div class="recipe-card__hearts"><div class="recipe-card__heart icon-favorite"></div><p></p></div></div>
                  <div class="recipe-card__title"><h4>${esc(c.title)}</h4></div>
                  <div class="recipe-card__footer"><div class="recipe-card__time"><div class="recipe-card__icon icon-clock"></div><p>${esc(c.time)}</p></div><div class="recipe-card__level"><div class="recipe-card__icon icon-chef"></div><p>${esc(c.level)}</p></div></div>
                </div>
              </a>
            </div>`;
const tab1 = $('.cmp-recipe-group__carousel-item').toArray().map((c) => {
  const $c = $(c); const href = $c.find('a.card').attr('href'); const ps = $c.find('.cmp-card__recipe_footer p');
  const pr = imgByHref.get(href) || {};
  return cardData({ href, img: pr.img, alt: $c.find('img').attr('alt') || pr.alt, tag: txt($c.find('.cmp-card__tag-wrapper p')), title: txt($c.find('h4')), time: txt(ps[0]), level: txt(ps[1]) });
});
const cards = tab1.map(card).join('');
const tabData = RPROBE.map((t, i) => (i === 0 ? tab1 : t.cards.map(cardData)));
const tabJson = `<script type="application/json" id="recipe-tab-data">${JSON.stringify(tabData).replace(/</g, '\\u003c')}</script>`;
const recipes = `
    <section class="band band--sand recipes">
      <div class="recipes__inner">
        <div class="recipes__header">
          <h2 class="recipes__title">${esc(txt('.cmp-recipe-group__title'))}</h2>
          <div class="recipes__sub">${esc(txt('.cmp-recipe-group__subtitle'))}</div>
        </div>
        <div class="recipes__tabs tabs" role="tablist">${tabs}</div>
        <div class="recipes__content">
          <div class="carousel recipes__carousel" data-carousel data-start="0" data-arrows-desktop data-scroll="3">
            ${arrow('prev')}
            <div class="carousel__viewport"><div class="carousel__track">${cards}
            </div></div>
            ${arrow('next')}
          </div>
          <div class="recipes__action"><button class="btn" type="button"><span class="btn__text">${esc(txt('.cmp-recipe-group__action .cmp-button__text'))}</span></button></div>
        </div>
      </div>
    </section>`;

// ---------- nudge teaser ----------
const t1 = $('#teaser-f9d12a04df');
const nudge = `
    <section class="band band--split-up nudge">
      <div class="nudge__inner">
        <div class="nudge__card">
          <div class="nudge__content">
            <h2 class="nudge__title">${esc(txt(t1.find('.cmp-teaser__title')))}</h2>
            <div class="nudge__desc"><p>${esc(txt(t1.find('.cmp-teaser__description p')))}</p></div>
            <div class="nudge__action"><a class="btn" href="${esc(t1.find('a.cmp-button').attr('href'))}"><span class="btn__text">${esc(txt(t1.find('a.cmp-button')))}</span></a></div>
          </div>
        </div>
      </div>
    </section>`;

// ---------- most loved ----------
const POP = [{ d: `${S7}dq?fmt=webp-alpha&wid=496&fit=fit,1`, m: `${S7}dq?fmt=webp-alpha&wid=328&fit=fit,1`, w: 496, h: 496 },
  { d: `${S7}sugar-release-control-atta?fmt=webp-alpha&wid=308&fit=fit,1`, m: null, w: 308, h: 394 }];
const popSlides = $('.cmp-popular-products__carousel-item').toArray().map((s, i) => {
  const $s = $(s); const a = $s.find('.cmp-popular-products__image a');
  const p = POP[i];
  const img = `<img class="loved__img" src="${asset(p.d)}" alt="popular-products-${i + 1}" width="${p.w}" height="${p.h}">`;
  const pic = p.m ? `<picture><source srcset="${asset(p.m)}" media="(max-width: 1023px)">${img}</picture>` : img;
  const name = $s.find('.cmp-popular-products__product-name').clone().children().remove().end();
  return `
            <div class="carousel__slide loved__slide">
              <div class="loved__wrap">
                <div class="loved__image" style="background-image:url(../${asset('https://aashirvaad.com/etc.clientlibs/itc-foods-brands/clientlibs/clientlib-aashirvaad/resources/images/product-background.svg')})"><a class="loved__link" href="${esc(a.attr('href'))}">${pic}</a></div>
                <div class="loved__desc">
                  <div class="loved__name">${esc(txt(name))}<span class="loved__weight"></span></div>
                  <div class="loved__qty"></div>
                  <div class="loved__details">${esc(txt($s.find('.cmp-popular-products__product-details')))}</div>
                  <div class="loved__action"><button class="btn btn--secondary" type="button"><span class="btn__text">${esc(txt($s.find('.cmp-button__text')))}</span></button></div>
                </div>
              </div>
            </div>`;
}).join('');
const loved = `
    <section class="band band--cream loved">
      <div class="loved__inner">
        <div class="loved__header">
          <h2 class="loved__title">${esc(txt('.cmp-popular-products__title'))}</h2>
          <div class="loved__sub">${esc(txt('.cmp-popular-products__subtitle'))}</div>
        </div>
        <div class="carousel loved__carousel" data-carousel data-start="1" data-adaptive data-autoplay="3000" data-arrows-desktop>
          ${arrow('prev')}
          <div class="carousel__viewport"><div class="carousel__track">${popSlides}
          </div></div>
          ${arrow('next')}
          ${dots(2, 1)}
        </div>
      </div>
    </section>`;

// ---------- meri chakki ----------
const t2 = $('#teaser-da4b81de79');
const chakki = `
    <section class="band band--split-down chakki">
      <div class="chakki__inner">
        <div class="chakki__card">
          <a class="chakki__link" href="${esc(t2.find('a.cmp-teaser__link').attr('href'))}" target="_blank"><div class="chakki__content"><button class="btn chakki__btn" type="button"><span class="btn__text">${esc(txt(t2.find('.cmp-button__text')))}</span></button></div></a>
        </div>
      </div>
    </section>`;

// ---------- our vision ----------
const w2 = $('iframe.cmp-video__iframe').first();
const VIS_VIDEO = [
  { src: w2.attr('src'), title: w2.attr('title') },
  { src: 'https://www.youtube.com/embed/LrHM0ri-NwQ?autoplay=0&controls=1&showinfo=0&modestbranding=1&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0&rel=0&enablejsapi=1&origin=https%3A%2F%2Faashirvaad.com&widgetid=3&forigin=https%3A%2F%2Faashirvaad.com%2F&aoriginsup=1&vf=1', title: "Come to Aashirvaad Organic's factory to know more about sustainable & #SachMuchOrganic lifestyle!" },
  null];
const VIS_BG = ['vision__card--cream', 'vision__card--yellow', 'vision__card--sand'];
const visCards = $('.cmp-card--foot-print').toArray().map((c, i) => {
  const $c = $(c); const v = VIS_VIDEO[i];
  const frame = v ? `<div class="vision__video"><iframe class="vision__iframe" title="${esc(v.title)}" src="${esc(v.src)}" width="640" height="360" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin"${i ? ' loading="lazy"' : ''}></iframe></div>` : '<div class="vision__video vision__video--pending"><div>Video will load soon...</div></div>';
  return `
            <div class="carousel__slide vision__slide vision__slide--${i}">
              <div class="vision__card ${VIS_BG[i]}${i === 0 ? ' vision__card--highlight' : ' vision__card--default'}">
                <div class="vision__media${i === 0 ? '' : ' vision__media--mobile'}">${frame}</div>
                <div class="vision__info"><div class="vision__title">${esc(txt($c.find('.cmp-card__title')))}</div><div class="vision__desc">${esc(txt($c.find('.cmp-card__desc')))}</div></div>
              </div>
            </div>`;
}).join('');
const vision = `
    <section class="band band--cream vision">
      <div class="vision__inner">
        <div class="vision__header"><h2 class="vision__heading">${esc(txt('.cmp-our-foot-print__title'))}</h2></div>
        <div class="vision__content">
          <div class="carousel vision__carousel" data-carousel data-start="0" data-mobile-only>
            <div class="carousel__viewport"><div class="carousel__track">${visCards}
            </div></div>
            ${dots(3, 0)}
          </div>
        </div>
      </div>
    </section>`;

// ---------- community ----------
const COMM = [['Slider-1-Desktop', 'HappyTummyJourney'], ['Community-Slider2-Desktop', 'Community-Slider-2-Mobile1'], ['Slider3-Desktop-modified', 'Happy_Tommy_Mobile-1']];
const commSlides = $('.cmp-ourcommunity-teasercarousel-container .cmp-carousel__item').toArray().map((s, i) => {
  const $s = $(s); const a = $s.find('a.cmp-button');
  return `
            <div class="carousel__slide community__slide" aria-label="Slide ${i + 1} of 3">
              <div class="community__teaser" style="--comm-d:url(../${asset(`${S7}${COMM[i][0]}?fmt=webp-alpha`)});--comm-m:url(../${asset(`${S7}${COMM[i][1]}?fmt=webp-alpha`)})">
                <div class="community__content">
                  <h2 class="community__title">${esc(txt($s.find('.cmp-teaser__title')))}</h2>
                  <div class="community__desc"><p>${esc(txt($s.find('.cmp-teaser__description p')))}</p></div>
                  <div class="community__action"><a class="btn" href="${esc(a.attr('href'))}" target="_blank"><span class="btn__text">${esc(txt(a))}</span></a></div>
                </div>
              </div>
            </div>`;
}).join('');
const comm = $('#text-9cab625654');
const community = `
    <section class="band band--sand community">
      <div class="community__inner">
        <div class="community__intro"><h2>${esc(txt(comm.find('h2')))}</h2><p>${esc(txt(comm.find('p')))}</p></div>
        <div class="carousel community__carousel" data-carousel data-start="0">
          ${arrow('prev')}
          <div class="carousel__viewport"><div class="carousel__track">${commSlides}
          </div></div>
          ${arrow('next')}
          ${dots(3, 0)}
        </div>
      </div>
    </section>`;

// ---------- follow ----------
const fol = $('#text-ccbfbcdd3d');
const folA = $('#button-16b51796b6');
const follow = `
    <section class="band band--cream follow">
      <div class="follow__inner">
        <div class="follow__text"><h2>${esc(txt(fol.find('h2')))}</h2><p>${esc(txt(fol.find('p').first()))}</p><p>&nbsp;</p></div>
        <div class="follow__action"><a class="btn" href="${esc(folA.attr('href'))}"><span class="btn__text">${esc(txt(folA))}</span></a></div>
      </div>
    </section>`;

// ---------- footer ----------
const fnav = (sel) => $(sel).find('a.cmp-navigation__item-link').toArray().map((a) => `<li><a class="site-footer__nav-link" href="${esc($(a).attr('href'))}">${esc(txt(a))}</a></li>`).join('');
const consentP = $('.cmp-footer__consent--link p');
const consentHtml = consentP.html().replace(/\s+/g, ' ').trim().replace(/<a [^>]*>/, '<a href="/conditions-policy/privacy-policy.html" target="_self" rel="noopener noreferrer">');
const footer = `
  <footer class="site-footer"><div class="site-footer__body">
    <div class="site-footer__main">
      <div class="site-footer__top">
        <div class="site-footer__logos">
          <div class="site-footer__logo"><a href="/"><img src="${asset(`${S7C}Logo_2?wid=271&fit=fit%2C1`)}" alt="footerlogo" width="240" height="78"></a></div>
          <div class="site-footer__badges">
            <div class="site-footer__itc"><picture><source srcset="${asset(`${S7}itc-logo-white?fmt=webp-alpha`)}" media="(max-width: 1023px)"><img src="${asset(`${S7}itc-logo-white?fmt=webp-alpha&wid=79&fit=fit%2C1`)}" alt="itc-logo"></picture></div>
            <div class="site-footer__fssai"><img src="${asset(`${S7}aashirvaad-fssai-logo?fmt=webp-alpha&wid=192&fit=fit%2C1`)}" alt="fssai logo" width="192" height="77"></div>
          </div>
        </div>
        <div class="site-footer__subscribe">
          <div class="site-footer__inbox"><img src="${asset(`${S7C}Logo_2`)}" alt="aashirvaad-logo" width="240" height="78"><h3>${esc(txt('.cmp-footer__nav-text h3'))}</h3></div>
          <div class="site-footer__field"><label for="footer-email"></label><input class="site-footer__input" id="footer-email" type="email" placeholder="Enter your Email ID" name="email"></div>
          <div class="site-footer__error"></div>
          <div class="site-footer__consent"><input class="site-footer__check" type="checkbox" id="i_agree" name="i_agree" value="i_agree"><div class="site-footer__consent-text"><p>${consentHtml}</p></div></div>
          <div class="site-footer__register"><button class="btn btn--dark" type="button" disabled><span class="btn__text">Register Now</span></button></div>
        </div>
        <div class="site-footer__nav">
          <div class="site-footer__nav-col site-footer__nav-col--left"><nav><ul>${fnav('#navigation-506467e377')}</ul></nav></div>
          <div class="site-footer__nav-col site-footer__nav-col--right"><nav><ul>${fnav('#navigation-b90fc6744f')}</ul></nav></div>
        </div>
      </div>
    </div>
    <div class="site-footer__bottom">
      <div class="site-footer__bar">
        <div class="site-footer__titles"><a class="site-footer__titles-link" href="https://www.itcportal.com/">ITC Portal</a><p>${esc(txt('.cmp-footer__ITC-Titles p'))}</p></div>
        <div class="site-footer__social">${social('site-footer__social-link')}</div>
      </div>
    </div>
  </div></footer>`;

// CSS-only assets (referenced from css/index.css) — rehost them too
for (const u of [`${S7}nudge-1?fmt=webp-alpha`, `${S7}Roti-for-mobile?fmt=webp-alpha`, `${S7}Meri_chikki_bg_desktop?fmt=webp-alpha`, `${S7}Aashirvaad_mari_chikki_mobile?fmt=webp-alpha`]) asset(u);

// font files (self-hosted Google Fonts + rehosted icomoon)
for (const f of fs.readdirSync(`${LIVE}/fonts`)) {
  if (!/^m-|icomoon/.test(f)) continue; // only the Chrome-current Google builds (m-*) + icomoon
  fs.mkdirSync(`${OUT}/assets/fonts`, { recursive: true });
  fs.copyFileSync(`${LIVE}/fonts/${f}`, `${OUT}/assets/fonts/${f}`);
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc($('title').text().trim())}</title>
  <meta name="description" content="${esc($('meta[name="description"]').attr('content'))}">
  <link rel="preload" href="assets/fonts/m-pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="assets/fonts/m-kmKnZrc3Hgbbcjq75U4uslyuy4kn0qNZaxMaC82U.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="css/canon.css">
  <link rel="stylesheet" href="css/index.css">
  <script src="js/carousel.js" defer></script>
  <script src="js/page.js" defer></script>
</head>
<body>${header}
  <main class="color-background-default">${hero}${offerings}${videoBand}${recipes}${nudge}${loved}${chakki}${vision}${community}${follow}
  </main>${footer}
  ${tabJson}
</body>
</html>
`;
fs.writeFileSync(`${OUT}/index-proposed.html`, html);
console.log(`wrote ${OUT}/index-proposed.html (${html.length} bytes)`);
if (missing.length) { console.log('MISSING assets:'); for (const m of missing) console.log('  ', m); process.exitCode = 2; }
