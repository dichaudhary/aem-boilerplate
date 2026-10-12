/**
 * community — "Our Community" teaser carousel (3 photographic slides with copy + CTA).
 * Schema: stardust/eds-schema/index.json → sections[8] (repeat DIV.carousel__slide × 3).
 * Decode tier: reconstructive (authors add / remove slides).
 *
 * Authoring rows (classified by content):
 *   head: <h2> title + intro paragraph (leading rows without a picture)
 *   one row per slide: desktop <picture>, mobile <picture> | <h2> title, text <p>, CTA <p>
 * CTAs open in a new tab as on the source.
 */
// carousel behaviour (scripts/carousel.js) loads on demand — no module-scope import
async function initCarousel(root, options) {
  try {
    const { default: createCarousel } = await import('../../scripts/carousel.js');
    createCarousel(root, options);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('carousel unavailable', e);
  }
}

// the section is display:none while its blocks decorate — measure only once laid out
function whenLaidOut(node, fn) {
  if (node.offsetWidth) {
    fn();
    return;
  }
  const ro = new ResizeObserver(() => {
    if (!node.offsetWidth) return;
    ro.disconnect();
    fn();
  });
  ro.observe(node);
}

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  if (node) w.append(node);
  return w;
}

function el(tag, className, attrs = {}) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  return e;
}

function buildSlide(row, i, total) {
  const pics = [...row.querySelectorAll('picture, img')]
    .filter((p) => p.tagName === 'PICTURE' || !p.closest('picture'));
  const nodes = [...row.querySelectorAll(':scope > div > *')]
    .filter((n) => n.textContent.trim() && !n.querySelector('picture, img'));
  const teaser = el('div', 'community-teaser');
  const bg = el('div', `community-media${pics[1] ? '' : ' community-media-single'}`);
  if (pics[0]) bg.append(wrapNode(pics[0], 'community-media-desktop'));
  if (pics[1]) bg.append(wrapNode(pics[1], 'community-media-mobile'));
  const content = el('div', 'community-content');
  const desc = el('div', 'community-desc');
  const action = el('div', 'community-action');
  nodes.forEach((n) => {
    if (/^H[1-6]$/.test(n.tagName)) content.append(wrapNode(n, 'community-title'));
    else if (n.querySelector('a')) action.append(n);
    else desc.append(n);
  });
  if (desc.children.length) content.append(desc);
  if (action.children.length) content.append(action);
  action.querySelectorAll('a[href]').forEach((a) => {
    a.target = '_blank';
  });
  teaser.append(bg, content);
  const slide = wrapNode(teaser, 'carousel-slide community-slide');
  slide.setAttribute('aria-label', `Slide ${i + 1} of ${total}`);
  return slide;
}

export default function decorate(block) {
  const rows = [...block.children];
  const first = rows.findIndex((r) => r.querySelector('picture, img'));
  const headRows = first === -1 ? rows : rows.slice(0, first);
  const slideRows = first === -1 ? [] : rows.slice(first);

  const inner = el('div', 'community-inner');
  const intro = el('div', 'community-intro');
  headRows.forEach((r) => r.querySelectorAll(':scope > div > *').forEach((n) => {
    if (n.textContent.trim()) intro.append(n);
  }));
  if (intro.children.length) inner.append(intro);

  const slides = slideRows.map((r, i) => buildSlide(r, i, slideRows.length));
  const root = el('div', 'carousel community-carousel', { 'data-start': '0' });
  const prev = el('button', 'carousel-arrow carousel-arrow-prev', { type: 'button', 'aria-label': 'Previous' });
  prev.textContent = 'Previous';
  const next = el('button', 'carousel-arrow carousel-arrow-next', { type: 'button', 'aria-label': 'Next' });
  next.textContent = 'Next';
  const viewport = el('div', 'carousel-viewport');
  const track = el('div', 'carousel-track');
  track.append(...slides);
  viewport.append(track);
  root.append(prev, viewport, next);
  const dots = el('ul', 'carousel-dots');
  slides.forEach((s, i) => {
    const li = el('li', i === 0 ? 'is-active' : '');
    const b = el('button', '', { type: 'button', 'aria-label': `${i + 1} of ${slides.length}` });
    b.textContent = String(i + 1);
    li.append(b);
    dots.append(li);
  });
  root.append(dots);
  inner.append(root);
  block.replaceChildren(inner);
  whenLaidOut(root, () => initCarousel(root));
}
