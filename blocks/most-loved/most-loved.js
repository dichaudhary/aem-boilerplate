/**
 * most-loved — "Most loved" two-product carousel (prototype `.section--popular`, schema
 * stardust/eds-schema/index.json sections[5]). Decode tier: reconstructive, one row per
 * product.
 *
 * Authoring: the section head (h2 + lede) is default content before the block (styled in
 * place); one row per product, two cells, order-agnostic:
 *   - media cell: the product image, linked to the product page
 *   - copy cell: product name (`<p><strong>`), description paragraph, optional "Buy Now"
 *     label (the live site hides it — rendered display: none, kept for parity)
 * Capture-state promise (stardust/replica/progress.json): start on slide 1, auto-advance
 * every 3000 ms until the last slide, then stop (no wrap); transform 500 ms ease; the list
 * height follows the active slide.
 * Rendered-only text: arrows ("Previous"/"Next", transparent) and dot labels ("1 of 2") are
 * the prototype's carousel chrome.
 * No exemptions: every authored text moves (EW1); arrows and dots are generated chrome
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const MEDIA = 'picture, img';
const isMedia = (el) => el.matches(MEDIA) || !!el.querySelector(MEDIA);
const leadsWithStrong = (el) => el.firstElementChild?.tagName === 'STRONG';

function button(className, label) {
  const b = document.createElement('button');
  b.className = className;
  b.type = 'button';
  b.setAttribute('aria-label', label);
  b.textContent = label;
  return b;
}

function buildSlide(row) {
  const nodes = [...row.children].flatMap((c) => [...c.children]);
  const media = nodes.filter(isMedia);
  const texts = nodes.filter((n) => !media.includes(n));
  const name = texts.find(leadsWithStrong) || texts[0];
  const rest = texts.filter((t) => t !== name);
  const details = rest.filter((t) => !t.querySelector('a[href]')).slice(0, 1);
  const extras = rest.filter((t) => !details.includes(t));

  const slide = document.createElement('div');
  slide.className = 'popular-slide';
  slide.setAttribute('role', 'tabpanel');
  const wrapper = document.createElement('div');
  wrapper.className = 'popular-wrapper';
  const image = document.createElement('div');
  image.className = 'popular-image';
  image.append(...media);
  const description = document.createElement('div');
  description.className = 'popular-description';
  if (name) description.append(wrapNode(name, 'popular-name'));
  if (details.length) description.append(wrapNode(details[0], 'popular-details'));
  if (extras.length) {
    const action = document.createElement('div');
    action.className = 'popular-action';
    action.append(...extras);
    description.append(action);
  }
  wrapper.append(image, description);
  slide.append(wrapper);
  return slide;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const slides = rows.map(buildSlide);

  const carousel = document.createElement('div');
  carousel.className = 'carousel popular-carousel';
  const list = document.createElement('div');
  list.className = 'popular-list';
  const track = document.createElement('div');
  track.className = 'popular-track';
  track.append(...slides);
  list.append(track);
  const prev = button('arrow arrow--prev', 'Previous');
  const next = button('arrow arrow--next', 'Next');
  const dots = document.createElement('ul');
  dots.className = 'dots';
  dots.setAttribute('role', 'tablist');
  slides.forEach((s, i) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'presentation');
    const b = button('', `${i + 1} of ${slides.length}`);
    b.setAttribute('role', 'tab');
    b.textContent = String(i + 1);
    li.append(b);
    dots.append(li);
  });
  carousel.append(prev, list, next, dots);
  block.replaceChildren(carousel);

  let current = 0;
  let timer = null;
  const stop = () => { if (timer) clearInterval(timer); timer = null; };
  const fit = () => {
    const h = slides[current].offsetHeight;
    if (h) list.style.height = `${h}px`;
  };
  const go = (k) => {
    current = Math.max(0, Math.min(slides.length - 1, k));
    if (current === slides.length - 1) stop();
    track.style.transition = 'transform 500ms ease';
    track.style.transform = `translate3d(-${current * 100}%, 0, 0)`;
    slides.forEach((s, j) => s.classList.toggle('is-active', j === current));
    [...dots.children].forEach((d, j) => d.classList.toggle('is-active', j === current));
    prev.classList.toggle('is-disabled', current === 0);
    next.classList.toggle('is-disabled', current === slides.length - 1);
    fit();
  };
  go(0);
  if (slides.length > 1) timer = setInterval(() => go(current + 1), 3000);
  window.addEventListener('resize', fit);
  window.addEventListener('load', fit);
  block.querySelectorAll('img').forEach((im) => im.addEventListener('load', fit));
  prev.addEventListener('click', () => { stop(); go(current - 1); });
  next.addEventListener('click', () => { stop(); go(current + 1); });
  [...dots.children].forEach((d, j) => d.addEventListener('click', () => { stop(); go(j); }));
}
