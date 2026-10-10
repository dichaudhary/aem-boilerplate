/**
 * footprint — "Our vision": three fixed tiles — a highlighted video card and two text cards
 * (prototype `.section--footprint`, schema stardust/eds-schema/index.json sections[7]).
 * Decode tier: template-slotted, 3 fixed tiles (one authored row each, positional variants:
 * tile 1 highlighted/cream, tile 2 butter, tile 3 sand).
 *
 * Authoring per row (one cell, in order): optional media — a YouTube link (becomes the
 * card's iframe) or a plain text placeholder (the live card 3 shows "Video will load
 * soon..."); the title as `<p><strong>`; the description paragraph(s).
 * Capture-state promise: ≥1024 a 3-card grid; ≤1023 a one-card carousel with dots
 * ("1 of 3" … "3 of 3", translate3d 500 ms); tiles 2–3 show their media only ≤1023.
 * Rendered-only text: the dot labels are the prototype's carousel chrome.
 * @ew-exempt <p> video/embed source links (tiles 1–2) — metadata (EW5 a): the URL is never
 *   displayed, the paragraph is removed once the card iframe is built; dots are generated chrome
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const VIDEO = /youtube\.com|youtu\.be/i;
const TILE_CLASSES = [
  'card card-footprint card-footprint-highlighted bg-background-2',
  'card card-footprint bg-primary-6',
  'card card-footprint bg-background-3',
];
const leadsWithStrong = (el) => el.firstElementChild?.tagName === 'STRONG';

function embedUrl(href) {
  try {
    const u = new URL(href);
    if (u.pathname.startsWith('/embed/')) return href;
    const id = u.hostname.includes('youtu.be') ? u.pathname.slice(1) : u.searchParams.get('v');
    return id ? `https://www.youtube.com/embed/${id}` : href;
  } catch {
    return href;
  }
}

function buildMedia(nodes, index) {
  const mediaBox = document.createElement('div');
  mediaBox.className = index === 0 ? 'card-media' : 'card-media card-media-mobile';
  const image = document.createElement('div');
  image.className = 'card-image';
  const videoCard = document.createElement('div');
  videoCard.className = 'video-card';
  const link = nodes.map((n) => (n.matches('a[href]') ? n : n.querySelector('a[href]')))
    .find((a) => a && VIDEO.test(a.href));
  if (link) {
    const iframe = document.createElement('iframe');
    iframe.className = 'video-card-iframe';
    iframe.src = embedUrl(link.href);
    iframe.title = 'YouTube video';
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; '
      + 'gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.loading = 'lazy';
    videoCard.append(iframe);
    (link.closest('p') || link).remove();
  } else {
    videoCard.classList.add('video-card--pending');
    const pending = document.createElement('div');
    pending.className = 'video-card-pending';
    pending.append(...nodes);
    videoCard.append(pending);
  }
  image.append(videoCard);
  mediaBox.append(image);
  return mediaBox;
}

function buildTile(row, index) {
  const nodes = [...row.children].flatMap((c) => [...c.children]);
  const title = nodes.find(leadsWithStrong) || nodes.find((n) => n.matches('h1, h2, h3, h4'));
  const ti = title ? nodes.indexOf(title) : nodes.length;
  const mediaNodes = nodes.slice(0, ti);
  const descNodes = nodes.slice(ti + 1);

  const item = document.createElement('div');
  item.className = 'footprint-item';
  const card = document.createElement('div');
  card.className = TILE_CLASSES[index] || TILE_CLASSES[TILE_CLASSES.length - 1];
  const content = document.createElement('div');
  content.className = 'card-content';
  if (mediaNodes.length) content.append(buildMedia(mediaNodes, index));
  const info = document.createElement('div');
  info.className = 'card-info';
  if (title) info.append(wrapNode(title, 'card-title'));
  if (descNodes.length) {
    const desc = document.createElement('div');
    desc.className = 'card-desc';
    desc.append(...descNodes);
    info.append(desc);
  }
  content.append(info);
  card.append(content);
  item.append(card);
  return item;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const items = rows.map(buildTile);

  const content = document.createElement('div');
  content.className = 'footprint-content';
  const carousel = document.createElement('div');
  carousel.className = 'carousel footprint-carousel';
  const list = document.createElement('div');
  list.className = 'footprint-list';
  const grid = document.createElement('div');
  grid.className = 'footprint-grid footprint-track';
  grid.append(...items);
  list.append(grid);
  const dots = document.createElement('ul');
  dots.className = 'dots footprint-dots';
  dots.setAttribute('role', 'tablist');
  items.forEach((it, i) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'presentation');
    if (i === 0) li.classList.add('is-active');
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `${i + 1} of ${items.length}`);
    b.textContent = String(i + 1);
    li.append(b);
    dots.append(li);
  });
  carousel.append(list, dots);
  content.append(carousel);
  block.replaceChildren(content);

  const mobile = window.matchMedia('(max-width: 1023px)');
  const go = (j) => {
    grid.style.transform = mobile.matches ? `translate3d(-${j * 100}%, 0, 0)` : '';
    [...dots.children].forEach((d, k) => d.classList.toggle('is-active', k === j));
  };
  [...dots.children].forEach((d, j) => d.addEventListener('click', () => go(j)));
  mobile.addEventListener('change', () => go(0));
}
