/**
 * community — "Our Community" three-slide teaser carousel (prototype `.section--community`,
 * schema stardust/eds-schema/index.json sections[8]). Decode tier: template-slotted, one
 * authored row per slide.
 *
 * Authoring: the section head (h2 + lede) is default content before the block (styled in
 * place); one row per slide with two cells, order-agnostic:
 *   - media cell: desktop background image, then the ≤1023px rendition
 *   - copy cell: heading (h2), description paragraph, CTA `<strong><a>`
 * Rendered-only text: arrows ("Previous"/"Next", transparent) and dot labels ("1 of 3" …) are
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
const hasLink = (el) => el.matches('a[href]') || !!el.querySelector('a[href]');

function button(className, label) {
  const b = document.createElement('button');
  b.className = className;
  b.type = 'button';
  b.setAttribute('aria-label', label);
  b.textContent = label;
  return b;
}

function buildSlide(row, index, total) {
  const nodes = [...row.children].flatMap((c) => [...c.children]);
  const media = nodes.filter(isMedia);
  const heading = nodes.find((n) => n.matches('h1, h2, h3, h4, h5, h6'));
  const ctas = nodes.filter((n) => !isMedia(n) && n !== heading && hasLink(n));
  const body = nodes.filter((n) => !media.includes(n) && n !== heading && !ctas.includes(n));

  const slide = document.createElement('div');
  slide.className = 'community-slide';
  slide.setAttribute('role', 'tabpanel');
  slide.setAttribute('aria-label', `Slide ${index + 1} of ${total}`);
  const teaser = document.createElement('div');
  teaser.className = 'teaser-carousel';
  if (media.length) {
    const bg = document.createElement('div');
    bg.className = 'teaser-bg';
    bg.append(wrapNode(media[0], 'teaser-bg-desktop'));
    if (media[1]) bg.append(wrapNode(media[1], 'teaser-bg-mobile'));
    teaser.append(bg);
  }
  const content = document.createElement('div');
  content.className = 'teaser-content';
  if (heading) content.append(wrapNode(heading, 'teaser-title'));
  if (body.length) {
    const desc = document.createElement('div');
    desc.className = 'teaser-description';
    desc.append(...body);
    content.append(desc);
  }
  if (ctas.length) {
    const action = document.createElement('div');
    action.className = 'teaser-action';
    action.append(...ctas);
    content.append(action);
  }
  teaser.append(content);
  slide.append(teaser);
  return slide;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const slides = rows.map((row, i) => buildSlide(row, i, rows.length));

  const carousel = document.createElement('div');
  carousel.className = 'carousel community-carousel';
  const list = document.createElement('div');
  list.className = 'community-list';
  const track = document.createElement('div');
  track.className = 'community-track';
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
