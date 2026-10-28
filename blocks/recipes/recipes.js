/**
 * recipes — tabbed recipe carousels (prototype section.recipes, stardust/eds-schema/index.json).
 * Decode tier: reconstructive (repeat groups: tabs → panels → recipe cards).
 *
 * Section head: the default content before the block (h2 + lede) is reabsorbed (EW8).
 * Authoring (single column, classified by content, never by row index):
 *   - a row holding only a short paragraph       → a tab label; the cards after it form its panel
 *   - a row holding an image + a heading          → a recipe card: image, tag paragraph (before
 *     the heading), title heading linking to the recipe (the whole card becomes the link,
 *     EW6), then the cooking-time and level paragraphs
 *   - a row holding only a CTA (<strong><a>)      → the "View All" action under the panels
 *     (rendered as the source's navigating button)
 * Only the cards in view load their image (prototype .lazy-img); the panel viewport takes the
 * height of the cards in view (adaptive track).
 */

const DESKTOP = window.matchMedia('(width >= 1024px)');

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function wrapNodes(className, nodes) {
  const w = el('div', className);
  w.append(...nodes);
  return w;
}

function icon(name) {
  return el('span', `icon icon-${name}`, { 'aria-hidden': 'true' });
}

/** the section head authored as default content right before the block (EW8) */
function takeSectionHead(block) {
  const prev = block.parentElement?.previousElementSibling;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return [];
  const nodes = [...prev.children];
  prev.remove();
  return nodes;
}

// ── carousel (the prototype's index.js initCarousel; copied per block — no shared module) ──
function buildCarousel(slides, { arrows = true, dots = false } = {}) {
  const root = el('div', 'carousel');
  const viewport = el('div', 'carousel-viewport');
  const track = el('div', 'carousel-track');
  slides.forEach((s) => s.classList.add('carousel-slide'));
  track.append(...slides);
  viewport.append(track);
  root.append(viewport);
  if (arrows) {
    root.append(
      el('button', 'carousel-arrow carousel-arrow-prev', { type: 'button', 'aria-label': 'Previous' }),
      el('button', 'carousel-arrow carousel-arrow-next', { type: 'button', 'aria-label': 'Next' }),
    );
  }
  if (dots) {
    const list = el('ul', 'carousel-dots');
    slides.forEach((s, i) => {
      const li = el('li');
      li.append(el('button', '', { type: 'button', 'aria-label': `${i + 1} of ${slides.length}` }));
      list.append(li);
    });
    root.append(list);
  }
  return root;
}

function initCarousel(root, opts = {}) {
  const track = root.querySelector('.carousel-track');
  const viewport = root.querySelector('.carousel-viewport');
  const prev = root.querySelector('.carousel-arrow-prev');
  const next = root.querySelector('.carousel-arrow-next');
  const dots = [...root.querySelectorAll('.carousel-dots button')];
  const slides = [...track.children];
  let index = opts.start || 0;

  const slideWidth = () => slides[0]?.getBoundingClientRect().width || 0;
  const perView = () => Math.max(1, Math.round(viewport.clientWidth / (slideWidth() || 1)));
  const lastIndex = () => Math.max(0, slides.length - (dots.length ? 1 : perView()));

  function render() {
    if (opts.mobileOnly && DESKTOP.matches) {
      track.style.transform = '';
      viewport.style.height = '';
      return;
    }
    const w = slideWidth();
    track.style.transform = `translateX(${-index * w}px)`;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    if (prev) prev.disabled = index <= 0;
    if (next) next.disabled = index >= lastIndex();
    const count = Math.max(1, Math.ceil(viewport.clientWidth / (w || 1) - 0.01));
    const visible = slides.slice(index, index + count);
    if (opts.onVisible) opts.onVisible(visible);
    if (opts.adaptive) {
      viewport.style.height = `${Math.max(...visible.map((s) => s.offsetHeight))}px`;
    }
    dots.forEach((d, i) => {
      if (i === index) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
  }

  const go = (i) => {
    index = Math.min(Math.max(i, 0), lastIndex());
    render();
  };

  prev?.addEventListener('click', () => go(index - 1));
  next?.addEventListener('click', () => go(index + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  window.addEventListener('resize', render);
  if (opts.adaptive) new ResizeObserver(() => render()).observe(track);
  root.carouselReset = () => go(0);
  if (opts.autoplay) {
    // the source rotates once on a timer and stops at the last slide (non-looping)
    const timer = setInterval(() => {
      if (index >= lastIndex()) clearInterval(timer);
      else go(index + 1);
    }, opts.autoplay);
    [prev, next, ...dots].forEach((c) => c?.addEventListener('click', () => clearInterval(timer)));
  }
  track.style.transition = 'none';
  render();
  requestAnimationFrame(() => {
    track.style.transition = '';
  });
}

// ── lazy images: only the cards in view hold (and load) their image; the others keep an
// empty placeholder like the source's lazy slider (prototype .lazy-img). The authored
// <picture> is parked on the placeholder and MOVED back when its card comes into view.
const parked = new WeakMap();

function deferImage(picture) {
  picture.querySelectorAll('source[srcset]').forEach((s) => {
    s.dataset.srcset = s.getAttribute('srcset');
    s.removeAttribute('srcset');
  });
  const img = picture.querySelector('img');
  if (img && img.getAttribute('src')) {
    img.dataset.src = img.getAttribute('src');
    img.removeAttribute('src');
    img.classList.add('fade');
  }
  const placeholder = el('span', 'lazy-img');
  parked.set(placeholder, picture);
  return placeholder;
}

function loadImages(slides) {
  slides.forEach((slide) => {
    slide.querySelectorAll('.lazy-img').forEach((placeholder) => {
      const picture = parked.get(placeholder);
      if (!picture) return;
      placeholder.replaceWith(picture);
      picture.querySelectorAll('source[data-srcset]').forEach((s) => {
        s.setAttribute('srcset', s.dataset.srcset);
        delete s.dataset.srcset;
      });
      picture.querySelectorAll('img[data-src]').forEach((img) => {
        img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
        img.setAttribute('src', img.dataset.src);
        delete img.dataset.src;
      });
    });
  });
}

function buildCard(row) {
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const picture = row.querySelector('picture');
  const link = heading?.querySelector('a[href]') || row.querySelector('a[href]');
  const paras = [...row.querySelectorAll('p')].filter((p) => !p.querySelector('picture') && p.textContent.trim());
  // tag = the paragraph(s) before the heading; time/level = the ones after it
  const order = [...row.querySelectorAll('p, h1, h2, h3, h4, h5, h6')];
  const before = paras.filter((p) => heading && order.indexOf(p) < order.indexOf(heading));
  const after = paras.filter((p) => !before.includes(p));
  const time = after.find((p) => /\bmins?\b/i.test(p.textContent)) || after[0];
  const level = after.find((p) => p !== time);
  const leftovers = after.filter((p) => p !== time && p !== level);

  const slide = el('div', 'recipe-slide');
  const card = el(link ? 'a' : 'div', 'recipe-card', link ? { href: link.href } : {});
  const media = el('div', 'recipe-card-media');
  if (picture) {
    picture.remove();
    media.append(deferImage(picture));
  }
  media.append(icon('dots'));
  card.append(media);

  const info = el('div', 'recipe-card-info');
  const tag = wrapNodes('recipe-card-tag', [wrapNodes('recipe-card-tag-text', before)]);
  const fav = el('span', 'recipe-card-fav');
  fav.append(icon('heart'));
  tag.append(fav);
  info.append(tag);
  if (heading) {
    info.append(wrapNodes('recipe-card-title', [heading]));
    if (link && heading.contains(link)) link.replaceWith(...link.childNodes);
  }
  const footer = el('div', 'recipe-card-footer');
  const timeBox = el('div', 'recipe-card-time');
  timeBox.append(icon('clock'));
  if (time) timeBox.append(wrapNodes('recipe-card-value', [time]));
  const levelBox = el('div', 'recipe-card-level');
  levelBox.append(icon('chef'));
  if (level) levelBox.append(wrapNodes('recipe-card-value', [level]));
  footer.append(timeBox, levelBox);
  info.append(footer);
  if (leftovers.length) info.append(...leftovers);
  card.append(info);
  slide.append(card);
  return slide;
}

/**
 * "View All": the source renders a navigating <button>, not a link — the authored CTA's href
 * is read, its anchor unwrapped (EW6) and the paragraph sits in a link-role button box.
 */
function buildAction(p) {
  const link = p.querySelector('a[href]');
  if (!link) return p;
  const { href } = link;
  const box = el('div', 'recipes-action-btn', { role: 'link', tabindex: '0' });
  box.append(p);
  link.replaceWith(...link.childNodes);
  const go = () => {
    window.location.href = href;
  };
  box.addEventListener('click', go);
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') go();
  });
  return box;
}

function selectTab(tabs, panels, i) {
  tabs.forEach((t, j) => t.setAttribute('aria-selected', String(i === j)));
  panels.forEach((p, j) => {
    p.hidden = i !== j;
  });
  panels[i]?.carouselReset?.();
}

export default function decorate(block) {
  if (block.querySelector('.recipes-inner')) return; // EW9: re-entrant
  const head = takeSectionHead(block);
  const inner = el('div', 'recipes-inner');
  const heading = head.find((n) => /^H[1-6]$/.test(n.tagName));
  if (heading) inner.append(wrapNodes('section-title', [heading]));
  const lede = head.filter((n) => n !== heading);
  if (lede.length) inner.append(wrapNodes('section-sub', lede));

  // classify rows into tab labels, card groups and actions
  const groups = [];
  const actions = [];
  [...block.children].forEach((row) => {
    if (row.querySelector('picture') || row.querySelector('h1, h2, h3, h4, h5, h6')) {
      if (!groups.length) groups.push({ label: null, cards: [] });
      groups[groups.length - 1].cards.push(row);
    } else if (row.querySelector('a[href]')) {
      actions.push(...[...row.querySelectorAll('a[href]')].map((a) => a.closest('p') || a));
    } else {
      const label = [...row.querySelectorAll('p')].find((p) => p.textContent.trim());
      if (label) groups.push({ label, cards: [] });
    }
  });

  const tabs = [];
  const tabList = el('div', 'recipes-tabs', { role: 'tablist' });
  groups.forEach((g, i) => {
    const tab = el('div', 'recipes-tab', { role: 'tab', tabindex: '0', 'aria-selected': String(i === 0) });
    if (g.label) tab.append(g.label);
    tabs.push(tab);
    tabList.append(tab);
  });
  if (groups.some((g) => g.label)) inner.append(tabList);

  const panels = groups.map((g, i) => {
    const carousel = buildCarousel(g.cards.map(buildCard), { arrows: true, dots: false });
    carousel.classList.add('recipes-panel');
    carousel.setAttribute('role', 'tabpanel');
    carousel.hidden = i !== 0;
    inner.append(carousel);
    return carousel;
  });

  if (actions.length) inner.append(wrapNodes('recipes-action', actions.map(buildAction)));
  block.replaceChildren(inner);

  panels.forEach((p) => initCarousel(p, { adaptive: true, onVisible: loadImages }));
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tabs, panels, i));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectTab(tabs, panels, i);
      }
    });
  });
}
