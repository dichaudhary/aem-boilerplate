/**
 * hero — main banner carousel (source: cmp-banner slick carousel, 4 slides).
 * Schema: stardust/eds-schema/index.json → sections[0] (hero). Decode tier: template-slotted
 * per slide (fixed composition: logo, title, sub, CTA over a full-bleed background).
 *
 * Authoring rows (one row per slide):
 *   cell 1: desktop background <picture>, then the mobile background <picture> (art-directed)
 *   cell 2: logo <picture>, <h2> title, <h3> sub, CTA paragraph (<strong><a>)
 * Rows are classified by content (heading → copy cell; pictures without heading → media).
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

const media = (el) => (el.matches('picture, img') ? el : el.querySelector('picture, img'));

function buildSlide(row, i, total) {
  const cells = [...row.children];
  const copyCell = cells.find((c) => c.querySelector('h1, h2, h3, h4, h5, h6')) || cells[cells.length - 1];
  const bgPics = [];
  cells.filter((c) => c !== copyCell).forEach((c) => {
    c.querySelectorAll('picture, img').forEach((p) => {
      if (!p.closest('picture') || p.tagName === 'PICTURE') bgPics.push(p);
    });
  });
  const headings = [...copyCell.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  const title = headings[0];
  const sub = headings[1];
  const logoEl = [...copyCell.children].map(media).find(Boolean);
  const ctas = [...copyCell.querySelectorAll('a')].map((a) => a.closest('p') || a);
  const rest = [...copyCell.children].filter((el) => !headings.includes(el)
    && !ctas.includes(el) && !(logoEl && el.contains(logoEl)) && el.textContent.trim());

  const slide = document.createElement('div');
  slide.className = 'carousel-slide hero-slide';
  slide.setAttribute('aria-label', `Slide ${i + 1} of ${total}`);
  const banner = document.createElement('div');
  banner.className = 'hero-banner';
  const bg = document.createElement('div');
  bg.className = 'hero-media';
  if (bgPics[0]) bg.append(wrapNode(bgPics[0], 'hero-media-desktop'));
  if (bgPics[1]) bg.append(wrapNode(bgPics[1], 'hero-media-mobile'));
  else bg.classList.add('hero-media-single');
  if (i === 0) {
    bg.querySelectorAll('img').forEach((img) => {
      img.loading = 'eager';
      img.fetchPriority = 'high';
    });
  }
  banner.append(bg, wrapNode(logoEl, 'hero-logo'));
  if (title) banner.append(wrapNode(title, 'hero-title'));
  if (sub) banner.append(wrapNode(sub, 'hero-sub'));
  rest.forEach((el) => banner.append(wrapNode(el, 'hero-sub')));
  if (ctas.length) {
    const cta = wrapNode(null, 'hero-cta');
    cta.append(...ctas);
    banner.append(cta);
  }
  slide.append(banner);
  return slide;
}

export default function decorate(block) {
  const rows = [...block.children].filter((r) => r.querySelector('picture, img, h1, h2, h3, a'));
  if (!rows.length) return;
  const slides = rows.map((r, i) => buildSlide(r, i, rows.length));

  const carousel = document.createElement('div');
  carousel.className = 'carousel hero-carousel';
  carousel.dataset.start = '0';
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-arrow carousel-arrow-prev';
  prev.setAttribute('aria-label', 'Previous');
  prev.textContent = 'Previous';
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-arrow carousel-arrow-next';
  next.setAttribute('aria-label', 'Next');
  next.textContent = 'Next';
  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';
  const track = document.createElement('div');
  track.className = 'carousel-track';
  track.append(...slides);
  viewport.append(track);
  carousel.append(prev, viewport, next);
  if (slides.length > 1) {
    const dots = document.createElement('ul');
    dots.className = 'carousel-dots';
    slides.forEach((s, i) => {
      const li = document.createElement('li');
      if (i === 0) li.className = 'is-active';
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
      b.textContent = String(i + 1);
      li.append(b);
      dots.append(li);
    });
    carousel.append(dots);
  }
  block.replaceChildren(carousel);
  whenLaidOut(carousel, () => initCarousel(carousel));
}
