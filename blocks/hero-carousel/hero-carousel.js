/**
 * hero-carousel — the home hero: four 1366×640 banners in a slick-style carousel
 * (prototype `.section--hero > .hero`, schema stardust/eds-schema/index.json sections[0]).
 * Decode tier: template-slotted, one authored row per slide.
 *
 * Authoring (one row per slide, up to three cells, order-agnostic):
 *   - a cell with the slide logo image (small `is/content` rendition)
 *   - a cell with the slide copy: heading (h2), sub-heading (h3), CTA `<strong><a>`
 *   - a cell with the banner background: desktop image, then the ≤600px rendition
 *   A single media cell with two images is read as the background pair.
 *
 * Rendered-only text: the arrows ("Previous"/"Next", color transparent) and the
 * dot labels ("1 of 4" …) are carousel chrome from the prototype, not authored copy.
 * No exemptions: every authored text moves (EW1); the arrows and dots are generated chrome
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const MEDIA = 'picture, img';
const isMedia = (el) => el.matches(MEDIA) || !!el.querySelector(MEDIA);
const hasLink = (el) => el.matches('a[href]') || !!el.querySelector('a[href]');

function button(className, label) {
  const b = document.createElement('button');
  b.className = className;
  b.type = 'button';
  b.setAttribute('aria-label', label);
  b.textContent = label;
  return b;
}

/** Splits one authored row into { logo, bgs[], texts[] } by cell content. */
function readSlide(row) {
  const cells = [...row.children];
  const mediaCells = cells.filter((c) => [...c.children].some(isMedia)
    && !c.querySelector('h1, h2, h3, h4, h5, h6'));
  const textCells = cells.filter((c) => !mediaCells.includes(c));
  const mediaNodes = (c) => [...c.children].filter(isMedia);
  let logo = null;
  let bgs = [];
  if (mediaCells.length >= 2) {
    [logo] = mediaNodes(mediaCells[0]);
    bgs = mediaCells.slice(1).flatMap(mediaNodes);
  } else if (mediaCells.length === 1) {
    bgs = mediaNodes(mediaCells[0]);
  }
  const texts = textCells.flatMap((c) => [...c.children]);
  return { logo, bgs, texts };
}

function buildSlide(row, index, total) {
  const { logo, bgs, texts } = readSlide(row);
  const slide = document.createElement('div');
  slide.className = 'hero-slide';
  slide.setAttribute('role', 'tabpanel');
  slide.setAttribute('aria-label', `Slide ${index + 1} of ${total}`);
  const banner = document.createElement('div');
  banner.className = 'banner';
  if (bgs.length) {
    const bg = document.createElement('div');
    bg.className = 'banner-bg';
    bg.append(wrapNode(bgs[0], 'banner-bg-desktop'));
    if (bgs[1]) bg.append(wrapNode(bgs[1], 'banner-bg-mobile'));
    banner.append(bg);
  }
  if (logo) banner.append(wrapNode(logo, 'banner-logo'));
  const heading = texts.find((t) => t.matches('h1, h2'));
  const sub = texts.find((t) => t.matches('h3, h4, h5, h6'));
  if (heading) banner.append(wrapNode(heading, 'banner-title'));
  if (sub) banner.append(wrapNode(sub, 'banner-sub-title'));
  const ctas = texts.filter((t) => t !== heading && t !== sub && hasLink(t));
  if (ctas.length) {
    const action = document.createElement('div');
    action.className = 'banner-button';
    action.append(...ctas);
    banner.append(action);
  }
  // leftovers pass: any other authored node stays visible inside the banner
  texts.filter((t) => t !== heading && t !== sub && !ctas.includes(t))
    .forEach((t) => banner.append(wrapNode(t, 'banner-extra')));
  slide.append(banner);
  return slide;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const slides = rows.map((row, i) => buildSlide(row, i, rows.length));

  const hero = document.createElement('div');
  hero.className = 'hero';
  const carousel = document.createElement('div');
  carousel.className = 'carousel';
  const list = document.createElement('div');
  list.className = 'hero-list';
  const track = document.createElement('div');
  track.className = 'hero-track';
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
  hero.append(carousel);
  block.replaceChildren(hero);

  let current = 0;
  const go = (k) => {
    current = Math.max(0, Math.min(slides.length - 1, k));
    track.style.transition = 'transform 500ms ease';
    track.style.transform = `translate3d(-${current * 100}%, 0, 0)`;
    slides.forEach((s, j) => s.classList.toggle('is-active', j === current));
    [...dots.children].forEach((d, j) => d.classList.toggle('is-active', j === current));
    prev.classList.toggle('is-disabled', current === 0);
    next.classList.toggle('is-disabled', current === slides.length - 1);
  };
  go(0);
  prev.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  [...dots.children].forEach((d, j) => d.addEventListener('click', () => go(j)));
}
