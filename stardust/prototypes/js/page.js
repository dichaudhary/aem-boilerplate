/* page.js — page behaviours: recipe tabs (selected state), mobile nav accordion. */
(() => {
  // recipe tabs: the source re-fetches the tab's cards (cardsinfo endpoint) and re-initialises the
  // carousel at slide 1; here the per-tab card data ships as JSON (outside <main>) and the same
  // card markup is rendered into the track, then the carousel is refreshed.
  const data = JSON.parse(document.getElementById('recipe-tab-data')?.textContent || '[]');
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const card = (c) => `<div class="carousel__slide recipes__slide"><a class="recipe-card" href="${esc(c.href)}"><div class="recipe-card__media"><div class="recipe-card__options"><div class="recipe-card__dots icon-open-card-popup"></div></div><div class="recipe-card__image"${c.d ? ` data-lazy-src="${c.d}" data-lazy-src-m="${c.m}" data-lazy-alt="${esc(c.alt)}"` : ''}></div></div><div class="recipe-card__info"><div class="recipe-card__tag"><div class="recipe-card__tag-wrap"><p>${esc(c.tag)}</p></div><div class="recipe-card__hearts"><div class="recipe-card__heart icon-favorite"></div><p></p></div></div><div class="recipe-card__title"><h4>${esc(c.title)}</h4></div><div class="recipe-card__footer"><div class="recipe-card__time"><div class="recipe-card__icon icon-clock"></div><p>${esc(c.time)}</p></div><div class="recipe-card__level"><div class="recipe-card__icon icon-chef"></div><p>${esc(c.level)}</p></div></div></div></a></div>`;
  document.querySelectorAll('.recipes').forEach((section) => {
    const tabs = [...section.querySelectorAll('.tabs__tab')];
    const carousel = section.querySelector('.recipes__carousel');
    tabs.forEach((t, i) => t.addEventListener('click', () => {
      if (t.classList.contains('is-selected')) return;
      tabs.forEach((x) => { x.classList.toggle('is-selected', x === t); x.setAttribute('aria-selected', String(x === t)); });
      if (!data[i] || !carousel?.carousel) return;
      carousel.querySelector('.carousel__track').innerHTML = data[i].map(card).join('');
      carousel.carousel.refresh();
    }));
  });

  // mobile nav: product categories open as an accordion (desktop opens on hover via CSS)
  const mobile = window.matchMedia('(max-width: 1023px)');
  document.querySelectorAll('.nav__item--has-menu > .nav__link, .nav__item--l1 > .nav__link').forEach((a) => {
    const li = a.parentElement;
    if (!li.querySelector(':scope > ul')) return;
    a.addEventListener('click', (e) => {
      if (!mobile.matches) return;
      e.preventDefault();
      li.classList.toggle('is-open');
    });
  });
})();
