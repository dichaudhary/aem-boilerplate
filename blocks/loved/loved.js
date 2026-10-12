/**
 * loved — "Most loved" popular-products carousel.
 * Schema: stardust/eds-schema/index.json → sections[5] (repeat DIV.carousel__slide × 2).
 * Decode tier: reconstructive (authors add / remove products).
 *
 * Authoring rows (classified by content):
 *   head: <h2> title + intro paragraph (leading rows without a picture)
 *   one row per product: <picture> + product link paragraph | name <p>, details <p>
 * Behaviour (source parity, replica restoreAtDelivery): starts on slide 1, auto-advances every
 * 3000 ms ping-ponging between the ends (1→2→1…), the viewport height adapts to the current
 * slide; an arrow / dot / swipe stops it; arrows at desktop only.
 * @ew-exempt <p> product link URL — the image's link target (text-as-metadata)
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

function wrapNode(node, className, tag = 'div') {
  const w = document.createElement(tag);
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

const media = (n) => (n.matches('picture, img') ? n : n.querySelector('picture, img'));
const items = (row) => [...row.querySelectorAll(':scope > div > *')];
const isUrlText = (a) => /^(https?:)?\/\//.test(a.textContent.trim()) || a.textContent.trim() === '';

function buildSlide(row) {
  const nodes = items(row);
  const pic = nodes.map(media).find(Boolean);
  const urlLink = [...row.querySelectorAll('a[href]')].find(isUrlText);
  const texts = nodes.filter((n) => n.textContent.trim() && !(urlLink && n.contains(urlLink))
    && !(pic && n.contains(pic)));
  const [name, ...details] = texts;

  const image = el('div', 'loved-image');
  const link = el('a', 'loved-link');
  if (urlLink) link.href = urlLink.getAttribute('href');
  if (pic) link.append(pic);
  image.append(link);
  const desc = el('div', 'loved-desc');
  desc.append(wrapNode(name, 'loved-name'));
  const det = el('div', 'loved-details');
  det.append(...details);
  desc.append(det);
  const wrap = el('div', 'loved-wrap');
  wrap.append(image, desc);
  return wrapNode(wrap, 'carousel-slide loved-slide');
}

export default function decorate(block) {
  const rows = [...block.children];
  const firstSlide = rows.findIndex((r) => r.querySelector('picture, img'));
  const headRows = firstSlide === -1 ? rows : rows.slice(0, firstSlide);
  const slideRows = firstSlide === -1 ? [] : rows.slice(firstSlide);

  const inner = el('div', 'loved-inner');
  const header = el('div', 'loved-header');
  headRows.forEach((r) => items(r).forEach((n) => {
    if (/^H[1-6]$/.test(n.tagName)) header.append(wrapNode(n, 'loved-title'));
    else if (n.textContent.trim()) header.append(wrapNode(n, 'loved-sub'));
  }));
  if (header.children.length) inner.append(header);

  const slides = slideRows.map(buildSlide);
  const root = el('div', 'carousel loved-carousel', {
    'data-start': '0',
    'data-adaptive': '',
    'data-autoplay': '3000',
    'data-arrows-desktop': '',
  });
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
