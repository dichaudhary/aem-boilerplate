/**
 * recipes — "Cook delicious recipes with us": category tabs + recipe-card carousel.
 * Schema: stardust/eds-schema/index.json → sections[3] (tabs × 3, card carousel).
 * Decode tier: reconstructive (cards are authored rows — document-first snapshot of the
 * source's per-tab cardsinfo data, dynamic-features #5; tab switching is client-only).
 *
 * Authoring rows (classified by content, never by index):
 *   head: <h2> title + intro paragraph (the leading row with a heading and no picture)
 *   tab label: a text-only row (no picture, no heading) BEFORE cards — opens a tab
 *   card: <picture> | tag <p>, <h4><a href>title</a></h4>, time <p>, level <p>
 *   action: a text-only row AFTER the last card ("View All", no link on the source)
 * Card-as-link (EW6): the card is one <a>; the authored title link is unwrapped.
 * Card images load when their slide is revealed (source lazy-load), then fade in.
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

// source lazy-load: the authored <picture> is held off the DOM until its slide is revealed
const pending = new WeakMap();

function reveal(slide) {
  const box = slide.querySelector('.recipe-card-image');
  const pic = box ? pending.get(box) : null;
  if (!pic) return;
  pending.delete(box);
  const img = pic.matches('img') ? pic : pic.querySelector('img');
  if (img) {
    img.loading = 'eager';
    img.addEventListener('load', () => box.classList.add('loaded'), { once: true });
  }
  box.append(pic);
  if (img && img.complete && img.naturalWidth) box.classList.add('loaded');
}

function buildCard(row) {
  const nodes = items(row);
  const pic = nodes.map(media).find(Boolean);
  const title = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const link = row.querySelector('a[href]');
  const texts = nodes.filter((n) => n !== title && !(pic && n.contains(pic))
    && n.textContent.trim());
  const [tag, time, level, ...extra] = texts;

  const card = el('a', 'recipe-card');
  if (link) card.href = link.getAttribute('href');
  const mediaBox = el('div', 'recipe-card-media');
  const options = el('div', 'recipe-card-options');
  options.append(el('div', 'recipe-card-dots icon-open-card-popup'));
  const imageBox = el('div', 'recipe-card-image');
  if (pic) {
    pic.remove();
    pending.set(imageBox, pic);
  }
  mediaBox.append(options, imageBox);

  const info = el('div', 'recipe-card-info');
  const tagRow = el('div', 'recipe-card-tag');
  const hearts = el('div', 'recipe-card-hearts');
  hearts.append(el('div', 'recipe-card-heart icon-favorite'), el('p'));
  tagRow.append(wrapNode(tag, 'recipe-card-tag-wrap'), hearts);
  const titleBox = wrapNode(title, 'recipe-card-title');
  extra.forEach((n) => titleBox.append(n));
  const footer = el('div', 'recipe-card-footer');
  const timeBox = el('div', 'recipe-card-time');
  timeBox.append(el('div', 'recipe-card-icon icon-clock'));
  if (time) timeBox.append(time);
  const levelBox = el('div', 'recipe-card-level');
  levelBox.append(el('div', 'recipe-card-icon icon-chef'));
  if (level) levelBox.append(level);
  footer.append(timeBox, levelBox);
  info.append(tagRow, titleBox, footer);
  card.append(mediaBox, info);
  if (link) link.replaceWith(...link.childNodes);
  return wrapNode(card, 'carousel-slide recipes-slide');
}

function buildCarousel(slides) {
  const root = el('div', 'carousel recipes-carousel');
  root.dataset.start = '0';
  root.dataset.scroll = '3';
  root.setAttribute('data-arrows-desktop', '');
  const prev = el('button', 'carousel-arrow carousel-arrow-prev', { type: 'button', 'aria-label': 'Previous' });
  prev.textContent = 'Previous';
  const next = el('button', 'carousel-arrow carousel-arrow-next', { type: 'button', 'aria-label': 'Next' });
  next.textContent = 'Next';
  const viewport = el('div', 'carousel-viewport');
  const track = el('div', 'carousel-track');
  track.append(...slides);
  viewport.append(track);
  root.append(prev, viewport, next);
  return root;
}

export default function decorate(block) {
  const rows = [...block.children];
  const isCard = (r) => !!r.querySelector('picture, img');
  const lastCard = rows.map(isCard).lastIndexOf(true);

  const head = el('div', 'recipes-header');
  const tabs = [];
  let current = null;
  const actions = [];
  rows.forEach((row, i) => {
    if (isCard(row)) {
      if (!current) {
        current = { label: null, slides: [] };
        tabs.push(current);
      }
      current.slides.push(buildCard(row));
      return;
    }
    const nodes = items(row).filter((n) => n.textContent.trim());
    if (nodes.some((n) => /^H[1-6]$/.test(n.tagName))) {
      nodes.forEach((n) => head.append(wrapNode(n, /^H[1-6]$/.test(n.tagName)
        ? 'recipes-title' : 'recipes-sub')));
    } else if (i > lastCard && lastCard !== -1) {
      actions.push(...nodes);
    } else if (nodes.length) {
      current = { label: nodes, slides: [] };
      tabs.push(current);
    }
  });

  const inner = el('div', 'recipes-inner');
  if (head.children.length) inner.append(head);

  const tablist = el('div', 'recipes-tabs tabs', { role: 'tablist' });
  const content = el('div', 'recipes-content');
  const panels = tabs.map((tab, i) => {
    const panel = el('div', 'recipes-panel', { role: 'tabpanel' });
    if (i > 0) panel.hidden = true;
    const carousel = buildCarousel(tab.slides);
    panel.append(carousel);
    content.append(panel);
    return { panel, carousel };
  });
  const select = (i) => {
    tablist.querySelectorAll('.tabs-tab').forEach((t, j) => {
      t.classList.toggle('is-selected', i === j);
      t.setAttribute('aria-selected', String(i === j));
    });
    panels.forEach((p, j) => {
      p.panel.hidden = i !== j;
    });
    panels[i]?.carousel.carousel?.refresh();
  };
  tabs.forEach((tab, i) => {
    if (!tab.label) return;
    const t = el('div', `tabs-tab${i === 0 ? ' is-selected' : ''}`, {
      role: 'tab', tabindex: '0', 'aria-selected': String(i === 0),
    });
    t.append(wrapNode(null, 'tabs-text'));
    t.firstChild.append(...tab.label);
    t.addEventListener('click', () => {
      if (!t.classList.contains('is-selected')) select(i);
    });
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!t.classList.contains('is-selected')) select(i);
      }
    });
    tablist.append(wrapNode(t, 'tabs-item'));
  });
  if (tablist.children.length) inner.append(tablist);
  if (actions.length) {
    const action = el('div', 'recipes-action');
    const btn = el('div', 'btn');
    btn.append(...actions);
    action.append(btn);
    content.append(action);
  }
  inner.append(content);
  block.replaceChildren(inner);
  panels.forEach(({ carousel }) => {
    whenLaidOut(carousel, () => initCarousel(carousel, { onVisible: reveal }));
  });
}
