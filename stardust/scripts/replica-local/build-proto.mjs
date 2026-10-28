// build-proto.mjs — authors stardust/prototypes/index-proposed.html from the captured content
// (replica/content.json + current/data/*.json). Run from stardust/. Strings are verbatim.
import fs from 'fs';
const c = JSON.parse(fs.readFileSync('replica/content.json', 'utf8'));
const tabs = JSON.parse(fs.readFileSync('current/data/recipe-tabs.json', 'utf8'));
const cats = JSON.parse(fs.readFileSync('current/data/productcategory.json', 'utf8'));
const pop = JSON.parse(fs.readFileSync('current/data/popularproducts.json', 'utf8'));
const nav = JSON.parse(fs.readFileSync('current/data/nav.json', 'utf8'));
const M = '/current/assets/media/';
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tgt = (t) => (t === '_blank' ? ' target="_blank" rel="noopener"' : '');
const logoFile = (u) => (/Logo-2$/.test(u) ? 'logo-2.svg' : 'logo.svg');
const catFile = ['cat-atta', 'cat-organic', 'cat-salt', 'cat-vermicelli', 'cat-rava'];

const navItem = (n) => `<li class="nav__item${n.children?.length ? ' nav__item--drop' : ''}"><a href="${esc(n.href)}">${esc(n.text)}</a>${n.children?.length ? `
            <ul class="nav__sub">${n.children.map((k) => `<li><a href="${esc(k.href)}">${esc(k.text)}</a>${k.children?.length ? `<ul>${k.children.map((g) => `<li><a href="${esc(g.href)}">${esc(g.text)}</a></li>`).join('')}</ul>` : ''}</li>`).join('')}</ul>` : ''}</li>`;

const header = `<header class="header site-header">
    <div class="site-header__bar">
      <button class="site-header__burger" type="button" aria-label="Menu" aria-expanded="false"></button>
      <a class="site-header__logo" href="${esc(c.header.logoHref)}"><img src="${M}logo-header.svg" alt="${esc(c.header.logoAlt)}" width="125" height="40"></a>
      <nav class="site-header__nav" aria-label="Main">
        <ul class="nav">
          ${nav.map(navItem).join('\n          ')}
        </ul>
      </nav>
      <a class="site-header__search" href="${esc(c.header.searchHref)}"><span class="icon icon--search" aria-hidden="true"></span><div class="site-header__search-text">${esc(c.header.search)}</div></a>
    </div>
  </header>`;

const arrows = (prevDisabled, nextDisabled) => `<button class="carousel__arrow carousel__arrow--prev"${prevDisabled ? ' disabled' : ''} type="button" aria-label="Previous">Previous</button>
          <button class="carousel__arrow carousel__arrow--next"${nextDisabled ? ' disabled' : ''} type="button" aria-label="Next">Next</button>`;
const dots = (n, active) => `<ul class="carousel__dots">${Array.from({ length: n }, (_, i) => `<li><button type="button"${i === active ? ' aria-current="true"' : ''} aria-label="${i + 1} of ${n}"></button></li>`).join('')}</ul>`;

const hero = `<section class="hero carousel" data-carousel>
      <div class="carousel__viewport">
        <div class="carousel__track">
          ${c.hero.map((s, i) => `<div class="hero__slide carousel__slide${i === 0 ? ' is-active' : ''}">
            <picture class="hero__bg"><source media="(max-width: 1023px)" srcset="${M}hero-${i + 1}-m.webp"><img src="${M}hero-${i + 1}-d.webp" alt="${esc(s.alt)}"${i ? ' loading="lazy"' : ''}></picture>
            <div class="hero__content">
              <div class="hero__logo"><img src="${M}${logoFile(s.logo)}" alt="${esc(s.logoAlt)}"></div>
              <h2 class="hero__title">${esc(s.title)}</h2>
              <h3 class="hero__sub">${esc(s.sub)}</h3>
              <div class="hero__action"><a class="btn" href="${esc(s.href)}"${tgt(s.target)}>${esc(s.cta)}</a></div>
            </div>
          </div>`).join('\n          ')}
        </div>
      </div>
      ${arrows(true, false)}
      ${dots(c.hero.length, 0)}
    </section>`;

const offerings = `<section class="offerings">
      <div class="offerings__inner">
        <h1 class="offerings__title">${esc(cats.categoryTitle)}</h1>
        <p class="offerings__sub">${esc(cats.categorySubTitle)}</p>
        <ul class="offerings__list">
          ${cats.categoryProdItems.map((p, i) => `<li><a class="offerings__item" href="${esc(p.redirectionLink)}"><span class="offerings__img"><img class="fade" src="${M}${catFile[i]}.webp" alt="${esc(p.altText)}" loading="lazy"></span><span class="offerings__name">${esc(p.productName.trim())}</span></a></li>`).join('\n          ')}
        </ul>
      </div>
    </section>`;

const video = `<section class="video-teaser">
      <div class="video-teaser__frame"><iframe src="${esc(c.video.src)}" title="YouTube video player" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
    </section>`;

const card = (r, t, i) => `<div class="carousel__slide recipe-slide"><a class="recipe-card" href="${esc(r.href)}">`
  + `<span class="recipe-card__media"><span class="lazy-img" data-src="${M}recipe-t${t}-${i + 1}.webp" data-alt="${esc(r.alt)}"></span><span class="icon icon--dots" aria-hidden="true"></span></span>`
  + `<span class="recipe-card__info"><span class="recipe-card__tag"><span>${esc(r.tag)}</span><span class="recipe-card__fav"><span class="icon icon--heart" aria-hidden="true"></span></span></span>`
  + `<span class="recipe-card__title"><h4>${esc(r.title)}</h4></span>`
  + `<span class="recipe-card__footer"><span class="recipe-card__time"><span class="icon icon--clock" aria-hidden="true"></span><span>${esc(r.time)}</span></span><span class="recipe-card__level"><span class="icon icon--chef" aria-hidden="true"></span><span>${esc(r.level)}</span></span></span>`
  + `</span></a></div>`;
const recipes = `<section class="recipes">
      <div class="recipes__inner">
        <h2 class="section-title">Cook delicious recipes with us</h2>
        <p class="section-sub">Explore your favourite recipe curated by experts using Aashirvaad products.</p>
        <div class="recipes__tabs" role="tablist">
          ${tabs.map((t, i) => `<button class="recipes__tab" role="tab" type="button" aria-selected="${i === 0}" data-tab="${i}">${esc(t.tab)}</button>`).join('\n          ')}
        </div>
        ${tabs.map((t, ti) => `<div class="recipes__panel carousel" data-carousel data-adaptive role="tabpanel"${ti ? ' hidden' : ''}>
          <div class="carousel__viewport">
            <div class="carousel__track">
            ${t.cards.map((r, i) => card(r, ti + 1, i)).join('\n            ')}
            </div>
          </div>
          ${arrows(true, false)}
        </div>`).join('\n        ')}
        <div class="recipes__action"><button class="btn" type="button" data-href="/recipe-listing.html">View All</button></div>
      </div>
    </section>`;

const no1 = `<section class="split split--no1">
      <div class="split__inner">
        <div class="no1">
          <picture class="no1__bg"><source media="(max-width: 1023px)" srcset="${M}nudge-m.webp"><img src="${M}nudge-d.webp" alt="" loading="lazy"></picture>
          <div class="no1__content">
            <h2 class="no1__title">${esc(c.no1.title)}</h2>
            <p class="no1__desc">${esc(c.no1.desc)}</p>
            <div class="no1__action"><a class="btn" href="${esc(c.no1.href)}">${esc(c.no1.cta)}</a></div>
          </div>
        </div>
      </div>
    </section>`;

const popular = `<section class="popular">
      <div class="popular__inner">
        <h2 class="section-title">${esc(pop.title.trim())}</h2>
        <p class="section-sub">${esc(pop.subTitle.trim())}</p>
        <div class="carousel" data-carousel data-start="1" data-autoplay-at-delivery="3000">
          <div class="carousel__viewport">
            <div class="carousel__track">
              ${pop.productItemsList.map((p, i) => `<div class="carousel__slide${i === 1 ? ' is-active' : ''}"><div class="popular__item">
                <div class="popular__image"><a href="${esc(p.productLink)}"><img class="fade" src="${M}popular-${i + 1}.webp" alt="${esc(p.productImageAlt)}" width="496" height="${i ? 635 : 496}"></a></div>
                <div class="popular__desc">
                  <p class="popular__name">${esc(p.productName)}</p>
                  <p class="popular__details">${esc(p.productDescription.trim())}</p>
                </div>
              </div></div>`).join('\n              ')}
            </div>
          </div>
          ${arrows(false, true)}
          ${dots(pop.productItemsList.length, 1)}
        </div>
      </div>
    </section>`;

const chakki = `<section class="split split--chakki">
      <div class="split__inner">
        <div class="chakki">
          <picture class="chakki__bg"><source media="(max-width: 1023px)" srcset="${M}chakki-m.webp"><img src="${M}chakki-d.webp" alt="" loading="lazy"></picture>
          <a class="chakki__link" href="${esc(c.chakki.href)}"><span class="btn chakki__btn">${esc(c.chakki.cta)}</span></a>
        </div>
      </div>
    </section>`;

const fpVideos = [c.footprint.cards[0].video, 'https://www.youtube.com/embed/LrHM0ri-NwQ?rel=0', 'https://www.youtube.com/embed/sz9Zkq2aQWk?rel=0'];
const vision = `<section class="vision">
      <div class="vision__inner">
        <h2 class="section-title vision__title">${esc(c.footprint.title)}</h2>
        <div class="vision__grid carousel" data-carousel data-mobile-only data-adaptive>
          <div class="carousel__viewport">
            <div class="carousel__track">
              ${c.footprint.cards.map((k, i) => `<div class="carousel__slide vision__slide"><div class="vision-card vision-card--${i ? 'default' : 'highlighted'} vision-card--${i}">
                <div class="vision-card__media"><iframe src="${esc(fpVideos[i])}" title="${esc(k.vtitle || 'YouTube video player')}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
                <div class="vision-card__info"><p class="vision-card__title">${esc(k.title)}</p><p class="vision-card__desc">${esc(k.desc)}</p></div>
              </div></div>`).join('\n              ')}
            </div>
          </div>
          ${dots(3, 0)}
        </div>
      </div>
    </section>`;

const mFile = ['community-1', 'community-2', 'community-3'];
const community = `<section class="community">
      <div class="community__inner">
        <h2 class="section-title">${esc(c.community.title)}</h2>
        <p class="community__sub">${esc(c.community.sub)}</p>
        <div class="community__carousel carousel" data-carousel>
          <div class="carousel__viewport">
            <div class="carousel__track">
              ${c.community.slides.map((s, i) => `<div class="carousel__slide${i === 0 ? ' is-active' : ''}"><div class="community-card">
                <picture class="community-card__bg"><source media="(max-width: 1023px)" srcset="${M}${mFile[i]}-m.webp"><img src="${M}${mFile[i]}-d.webp" alt="" loading="lazy"></picture>
                <div class="community-card__content">
                  <h3 class="community-card__title">${esc(s.title)}</h3>
                  <p class="community-card__desc">${esc(s.desc)}</p>
                  <div class="community-card__action"><a class="btn" href="${esc(s.href)}"${tgt(s.target)}>${esc(s.cta)}</a></div>
                </div>
              </div></div>`).join('\n              ')}
            </div>
          </div>
          ${arrows(true, false)}
          ${dots(3, 0)}
        </div>
      </div>
    </section>`;

const follow = `<section class="follow">
      <h2 class="follow__title">${esc(c.follow.h)}</h2>
      <p class="follow__text">${esc(c.follow.p[0])}</p>
      <p class="follow__text">&nbsp;</p>
      <div class="follow__action"><a class="btn" href="${esc(c.follow.href)}"${tgt(c.follow.target)}>${esc(c.follow.cta)}</a></div>
    </section>`;

const f = c.footer;
const socialIcon = { 'icon-instagram': 'instagram', 'icon-facebok': 'facebook', 'icon-twitter': 'twitter', 'icon-youtube': 'youtube' };
const social = [['instagram', 'https://www.instagram.com/aashirvaad/', 'Instagram'], ['facebook', 'https://www.facebook.com/Aashirvaad/', 'Facebook'], ['twitter', 'https://twitter.com/AashirvaadAtta', 'Twitter'], ['youtube', 'https://www.youtube.com/user/AashirvaadAtta', 'YouTube']];
const footer = `<footer class="footer site-footer">
    <div class="site-footer__main">
      <div class="site-footer__logos">
        <a class="site-footer__logo" href="${esc(f.logoHref)}"><img src="${M}logo-header.svg" alt="footerlogo" width="240" height="78" loading="lazy"></a>
        <div class="site-footer__marks"><img class="site-footer__itc" src="${M}itc-logo-white.webp" alt="itc-logo" loading="lazy"><span class="site-footer__fssai"><img src="${M}fssai-logo.webp" alt="fssai logo" loading="lazy"></span></div>
      </div>
      <form class="site-footer__subscribe" action="#" onsubmit="return false">
        <div class="site-footer__inbox"><img src="${M}logo-header.svg" alt="aashirvaad-logo" loading="lazy"><h3>${esc(f.inbox)}</h3></div>
        <input class="site-footer__email" type="email" name="email" placeholder="${esc(f.placeholder)}" aria-label="${esc(f.placeholder)}">
        <div class="site-footer__consent"><input type="checkbox" id="i_agree" aria-label="I agree"><p>${f.consent}</p></div>
        <button class="btn btn--pink" type="submit"><span>${esc(f.register)}</span></button>
      </form>
      <nav class="site-footer__nav" aria-label="Footer">
        <ul>${f.nav.slice(0, 3).map((a) => `<li><a href="${esc(a.href)}">${esc(a.text)}</a></li>`).join('')}</ul>
        <ul>${f.nav.slice(3).map((a) => `<li><a href="${esc(a.href)}">${esc(a.text)}</a></li>`).join('')}</ul>
      </nav>
    </div>
    <div class="site-footer__bottom">
      <div class="site-footer__bottom-inner">
        <div class="site-footer__titles"><a href="https://www.itcportal.com/" target="_blank" rel="noopener">ITC Portal</a><p>© 2026 Aashirvaad. All Rights Reserved.</p></div>
        <div class="site-footer__social">${social.map(([k, h, l]) => `<a class="icon icon--${k}" href="${h}" target="_blank" rel="noopener" aria-label="${l}"></a>`).join('')}</div>
      </div>
    </div>
  </footer>`;

const html = `<!DOCTYPE html>
<html lang="${esc(c.meta.lang)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(c.meta.title)}</title>
  <meta name="description" content="${esc(c.meta.description)}">
  <link rel="stylesheet" href="index.css">
  <script src="index.js" defer></script>
</head>
<body>
  ${header}
  <main class="color-background-default">
    ${hero}
    ${offerings}
    ${video}
    ${recipes}
    ${no1}
    ${popular}
    ${chakki}
    ${vision}
    ${community}
    ${follow}
  </main>
  ${footer}
</body>
</html>
`;
fs.writeFileSync('prototypes/index-proposed.html', html);
console.log('prototypes/index-proposed.html', html.length, 'bytes');
