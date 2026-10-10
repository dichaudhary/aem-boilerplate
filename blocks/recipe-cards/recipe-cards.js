/**
 * recipe-cards — "Cook delicious recipes with us": tab chips + a 14-card recipe rail
 * (prototype `.section--recipes`, schema stardust/eds-schema/index.json sections[3]).
 * Decode tier: reconstructive.
 *
 * Authoring: the section head (h2 + lede) is default content before the block (styled in
 * place). Block rows, classified by content:
 *   - a row holding a `<ul>` = the tab chips (the `<strong>` item is the selected chip)
 *   - a row with a heading whose link is the recipe page = one recipe card; fields in order:
 *     optional image, tag paragraph, heading (card-as-link, EW6), time paragraph,
 *     difficulty paragraph
 *   - a trailing text-only row = the rail action ("View All", a button with no target on live)
 *   - leading text-only rows = in-table head (decode fallback)
 * Capture-state promise: every card keeps its reserved image box at ≤1023 too (the live page
 * lazy-loads off-screen cards; the prototype hid their media to match that capture).
 * Rendered-only text: the arrows ("Previous"/"Next", transparent) are carousel chrome.
 * No exemptions: every authored text moves (EW1); the arrows are generated chrome
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const MEDIA = 'picture, img';
const HEADING = 'h1, h2, h3, h4, h5, h6';
const isMedia = (el) => el.matches(MEDIA) || !!el.querySelector(MEDIA);
const isHeading = (el) => el.matches(HEADING);

function button(className, label) {
  const b = document.createElement('button');
  b.className = className;
  b.type = 'button';
  b.setAttribute('aria-label', label);
  b.textContent = label;
  return b;
}

function glyph(className) {
  const d = document.createElement('div');
  d.className = className;
  return d;
}

function buildCard(nodes) {
  const media = nodes.find(isMedia);
  const heading = nodes.find(isHeading);
  const link = heading ? heading.querySelector('a[href]') : null;
  const texts = nodes.filter((n) => n !== media && n !== heading);
  const hi = heading ? nodes.indexOf(heading) : -1;
  const before = texts.filter((t) => nodes.indexOf(t) < hi);
  const after = texts.filter((t) => nodes.indexOf(t) > hi);

  const slide = document.createElement('div');
  slide.className = 'recipes-slide';
  const card = document.createElement(link ? 'a' : 'div');
  card.className = 'card card-recipe';
  if (link) card.href = link.href;
  const content = document.createElement('div');
  content.className = 'card-content';

  const mediaBox = document.createElement('div');
  mediaBox.className = 'card-media';
  const options = document.createElement('div');
  options.className = 'card-options';
  options.append(glyph('card-three-dots icon-open-card-popup'));
  const image = document.createElement('div');
  image.className = 'card-image';
  const lazy = document.createElement('div');
  lazy.className = 'lazy-image-container';
  if (media) lazy.append(media);
  image.append(lazy);
  mediaBox.append(options, image);

  const info = document.createElement('div');
  info.className = 'card-info';
  const tagRow = document.createElement('div');
  tagRow.className = 'card-tag';
  const tagWrap = document.createElement('div');
  tagWrap.className = 'card-tag-wrapper';
  if (before[0]) tagWrap.append(before[0]);
  const hearts = document.createElement('div');
  hearts.className = 'card-hearts hidden';
  hearts.append(glyph('card-icon icon-favorite_FILL1_wght400_GRAD0_opsz20'));
  tagRow.append(tagWrap, hearts);
  info.append(tagRow);
  if (heading) info.append(wrapNode(heading, 'card-title'));
  const footer = document.createElement('div');
  footer.className = 'card-recipe-footer';
  const time = document.createElement('div');
  time.className = 'card-time';
  time.append(glyph('card-icon icon-Group-21690'));
  if (after[0]) time.append(after[0]);
  const difficulty = document.createElement('div');
  difficulty.className = 'card-difficulty icon-chef-cap';
  difficulty.append(glyph('card-icon path1'));
  if (after[1]) difficulty.append(after[1]);
  footer.append(time, difficulty);
  info.append(footer);
  // leftovers pass: anything else authored in the card stays visible
  [...before.slice(1), ...after.slice(2)].forEach((t) => info.append(wrapNode(t, 'card-extra')));

  content.append(mediaBox, info);
  card.append(content);
  // card-as-link: the authored anchor is unwrapped inside the card link (EW6)
  if (link) link.replaceWith(...link.childNodes);
  slide.append(card);
  return slide;
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children].flatMap((c) => [...c.children]));
  if (!rows.length) return;
  const isTabs = (nodes) => nodes.some((n) => n.matches('ul, ol'));
  const isCard = (nodes) => nodes.some((n) => isHeading(n) && n.querySelector('a[href]'))
    || (nodes.some(isMedia) && nodes.some(isHeading));
  const firstCard = rows.findIndex(isCard);
  const lastCard = rows.length - 1 - [...rows].reverse().findIndex(isCard);

  const head = document.createElement('div');
  head.className = 'recipes-header';
  const tabs = document.createElement('div');
  tabs.className = 'recipes-tabs';
  const action = document.createElement('div');
  action.className = 'recipes-action';
  const slides = [];
  rows.forEach((nodes, i) => {
    if (isTabs(nodes)) {
      const group = document.createElement('div');
      group.className = 'tab-group';
      group.append(...nodes);
      tabs.append(group);
    } else if (isCard(nodes)) {
      slides.push(buildCard(nodes));
    } else if (firstCard >= 0 && i > lastCard) {
      const btn = document.createElement('div');
      btn.className = 'button button--primary';
      const inner = document.createElement('div');
      inner.className = 'cmp-button';
      inner.append(...nodes);
      btn.append(inner);
      action.append(btn);
    } else {
      head.append(...nodes);
    }
  });

  const content = document.createElement('div');
  content.className = 'recipes-content';
  const carousel = document.createElement('div');
  carousel.className = 'carousel recipes-carousel';
  const list = document.createElement('div');
  list.className = 'recipes-list';
  const track = document.createElement('div');
  track.className = 'recipes-track';
  track.append(...slides);
  list.append(track);
  const prev = button('arrow arrow--prev is-disabled', 'Previous');
  const next = button('arrow arrow--next', 'Next');
  carousel.append(prev, list, next);
  content.append(carousel);

  const out = [];
  if (head.childElementCount) out.push(head);
  if (tabs.childElementCount) out.push(tabs);
  out.push(content);
  if (action.childElementCount) out.push(action);
  block.replaceChildren(...out);

  let offset = 0;
  const go = (dir) => {
    const step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : 0;
    const max = Math.max(0, track.scrollWidth - list.clientWidth);
    offset = Math.max(0, Math.min(max, offset + dir * step));
    track.style.transition = 'transform 500ms ease';
    track.style.transform = `translate3d(-${offset}px, 0, 0)`;
    prev.classList.toggle('is-disabled', offset === 0);
    next.classList.toggle('is-disabled', offset >= max);
  };
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
}
