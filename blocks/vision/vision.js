/**
 * vision — "Our vision" footprint: a 3-card grid at desktop, a carousel (dots) below 1024px.
 * Schema: stardust/eds-schema/index.json → sections[7] (repeat DIV.carousel__slide × 3).
 * Decode tier: reconstructive (authors add / remove cards).
 *
 * Authoring rows (classified by content):
 *   head: <h2> title (leading text rows before the first card)
 *   one row per card: the YouTube embed link paragraph, title <p>, description <p> (one cell;
 *     same-src iframe, the link title becomes the iframe title) — or, for a card without a
 *     video, two cells: placeholder text (the source's "Video will load soon...") | title,
 *     description.
 * Card grounds follow the source rhythm by position: cream highlight, yellow, sand. Only the
 * first card shows its media at desktop (the source's other videos are mobile-only).
 * @ew-exempt <p> embed source link — video/embed source URL (text-as-metadata)
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

const GROUNDS = ['cream', 'yellow', 'sand'];
const isEmbed = (a) => /youtube\.com\/embed|youtu\.be|player\.vimeo/.test(a.getAttribute('href') || '');

function buildIframe(a, i) {
  const iframe = el('iframe', 'vision-iframe');
  iframe.src = a.getAttribute('href');
  const t = a.getAttribute('title');
  iframe.title = t && t !== a.textContent ? t : 'YouTube video';
  iframe.width = '640';
  iframe.height = '360';
  iframe.allowFullscreen = true;
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; '
    + 'gyroscope; picture-in-picture; web-share');
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  if (i > 0) iframe.loading = 'lazy';
  return iframe;
}

function buildSlide(row, i) {
  const cells = [...row.children];
  const embed = [...row.querySelectorAll('a[href]')].find(isEmbed);
  const embedPara = embed ? (embed.closest('p') || embed) : null;
  // no embed: a two-cell row carries the placeholder text in its first (media) cell
  const mediaCell = !embed && cells.length > 1 ? cells[0] : null;
  const infoNodes = cells.filter((c) => c !== mediaCell)
    .flatMap((c) => [...c.children])
    .filter((n) => n !== embedPara && n.textContent.trim());

  const ground = GROUNDS[i % GROUNDS.length];
  const card = el('div', `vision-card vision-card-${ground} vision-card-${i === 0 ? 'highlight' : 'default'}`);
  const mediaBox = el('div', `vision-media${i > 0 ? ' vision-media-mobile' : ''}`);
  const video = el('div', 'vision-video');
  if (embed) {
    video.append(buildIframe(embed, i));
  } else {
    video.classList.add('vision-video-pending');
    const holder = el('div');
    if (mediaCell) holder.append(...[...mediaCell.children].filter((n) => n.textContent.trim()));
    video.append(holder);
  }
  mediaBox.append(video);
  const info = el('div', 'vision-info');
  const [title, ...desc] = infoNodes;
  info.append(wrapNode(title, 'vision-title'));
  const d = el('div', 'vision-desc');
  d.append(...desc);
  info.append(d);
  card.append(mediaBox, info);
  return wrapNode(card, `carousel-slide vision-slide vision-slide-${i}`);
}

export default function decorate(block) {
  const rows = [...block.children];
  const isCard = (r) => r.children.length > 1 || !!r.querySelector('a[href]');
  const first = rows.findIndex(isCard);
  const headRows = first === -1 ? rows : rows.slice(0, first);
  const cardRows = first === -1 ? [] : rows.slice(first);

  const inner = el('div', 'vision-inner');
  const header = el('div', 'vision-header');
  headRows.forEach((r) => r.querySelectorAll(':scope > div > *').forEach((n) => {
    if (n.textContent.trim()) header.append(wrapNode(n, 'vision-heading'));
  }));
  if (header.children.length) inner.append(header);

  const slides = cardRows.map(buildSlide);
  const root = el('div', 'carousel vision-carousel', { 'data-start': '0', 'data-mobile-only': '' });
  const viewport = el('div', 'carousel-viewport');
  const track = el('div', 'carousel-track');
  track.append(...slides);
  viewport.append(track);
  root.append(viewport);
  const dots = el('ul', 'carousel-dots');
  slides.forEach((s, i) => {
    const li = el('li', i === 0 ? 'is-active' : '');
    const b = el('button', '', { type: 'button', 'aria-label': `${i + 1} of ${slides.length}` });
    b.textContent = String(i + 1);
    li.append(b);
    dots.append(li);
  });
  root.append(dots);
  inner.append(wrapNode(root, 'vision-content'));
  block.replaceChildren(inner);
  whenLaidOut(root, () => initCarousel(root));
}
