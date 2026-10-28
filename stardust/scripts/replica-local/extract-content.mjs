// extract-content.mjs — verbatim content of the captured home page → stardust/replica/content.json
import fs from 'fs'; import * as cheerio from 'cheerio';
const $ = cheerio.load(fs.readFileSync('current/pages/index.html', 'utf8'));
const t = (el) => $(el).text().replace(/\s+/g, ' ').trim();
const bgUrl = (el) => (($(el).attr('style') || '').match(/url\(["']?([^"')]+)/) || [])[1] || null;
const out = {};
out.hero = $('#slickcarousel-45c1cf16aa .slick-slide:not(.slick-cloned) .cmp-banner').map((i, b) => ({
  logo: $(b).find('.cmp-banner__item-logo img').attr('src'), logoAlt: $(b).find('.cmp-banner__item-logo img').attr('alt'),
  title: t($(b).find('.cmp-banner__title')), sub: t($(b).find('.cmp-banner__sub-title')),
  mobile: $(b).find('picture source').attr('srcset'), desktop: $(b).find('picture img').attr('src') || bgUrl(b), alt: $(b).find('picture img').attr('alt'),
  bg: bgUrl(b), cta: t($(b).find('a.cmp-button')), href: $(b).find('a.cmp-button').attr('href'), target: $(b).find('a.cmp-button').attr('target') || null })).get();
out.video = { src: $('#player1').attr('src'), title: $('#player1').attr('title') || null };
const ft = $('.cmp-teaser--first-half-center-aligned');
out.no1 = { title: t(ft.find('.cmp-teaser__title')), desc: t(ft.find('.cmp-teaser__description')), cta: t(ft.find('.cmp-button')), href: ft.find('a.cmp-button').attr('href') || ft.find('a').attr('href'), bg: bgUrl(ft.find('.cmp-teaser')), mbg: ft.find('.cmp-teaser').attr('data-mobile-image') || null, attrs: Object.keys(ft.find('.cmp-teaser').attr() || {}) };
const ct = $('.cmp-teaser--cta');
out.chakki = { href: ct.find('a').attr('href'), cta: t(ct.find('.cmp-button')), bg: bgUrl(ct.find('.cmp-teaser')), attrs: ct.find('.cmp-teaser').attr() };
out.footprint = { title: t($('.cmp-our-foot-print__title')), cards: $('.cmp-our-foot-print .slick-slide:not(.slick-cloned) .card, .cmp-our-foot-print .cmp-our-foot-print__carousel-item .card').map((i, c) => ({ cls: $(c).attr('class'), title: t($(c).find('.cmp-card__title')), desc: t($(c).find('.cmp-card__desc')), video: $(c).find('iframe').attr('src') || null, vtitle: $(c).find('iframe').attr('title') || null })).get() };
out.community = { title: t($('.cta-text h2')), sub: t($('.cta-text p')), slides: $('#slickcarousel-0f817c55a9 .slick-slide:not(.slick-cloned) .cmp-teaser').map((i, c) => ({ title: t($(c).find('.cmp-teaser__title')), desc: t($(c).find('.cmp-teaser__description')), cta: t($(c).find('.cmp-button')), href: $(c).find('a.cmp-button').attr('href') || $(c).find('a').attr('href'), target: $(c).find('a.cmp-button').attr('target') || null, bg: bgUrl(c), attrs: Object.keys($(c).attr() || {}) })).get() };
const fo = $('.top-lg-margin.bottom-lg-margin');
out.follow = { h: t(fo.find('h2')), p: fo.find('.cmp-text p').map((i, p) => t(p)).get(), cta: t(fo.find('.cmp-button')), href: fo.find('a.cmp-button').attr('href'), target: fo.find('a.cmp-button').attr('target') || null };
const f = $('.cmp-footer');
out.footer = { logos: f.find('img').map((i, im) => ({ src: $(im).attr('src') || $(im).attr('data-src'), alt: $(im).attr('alt') })).get(), logoHref: f.find('.cmp-footer__logo a').attr('href'),
  inbox: t(f.find('.cmp-footer__nav-text h3')), placeholder: f.find('input[type=text],input[type=email]').attr('placeholder'), consent: f.find('.cmp-footer__consent--link p').html()?.trim(), register: t(f.find('.cmp-button')),
  nav: f.find('.cmp-footer__nav a').map((i, a) => ({ text: t(a), href: $(a).attr('href') })).get(),
  bottom: f.find('.cmp-footer__ITC-Titles').children().map((i, a) => ({ tag: a.tagName, text: t(a), href: $(a).attr('href') || null, target: $(a).attr('target') || null })).get(),
  social: f.find('.cmp-footer__social-media a').map((i, a) => ({ cls: $(a).attr('class'), href: $(a).attr('href'), label: $(a).attr('aria-label') || null })).get() };
const h = $('.cmp-header');
out.header = { logoHref: h.find('.cmp-header__logo a').attr('href'), logo: h.find('.cmp-header__logo img').attr('src'), logoAlt: h.find('.cmp-header__logo img').attr('alt'),
  top: h.find('.cmp-header__nav-group > li').map((i, li) => ({ text: t($(li).children('a')), href: $(li).children('a').attr('href') })).get(), search: t(h.find('.cmp-header__icon-text')), searchHref: h.find('.cmp-header__search a').attr('href') };
out.meta = { title: $('title').text(), description: $('meta[name=description]').attr('content'), lang: $('html').attr('lang') };
fs.writeFileSync('replica/content.json', JSON.stringify(out, null, 1)); console.log(Object.keys(out).join(','));
