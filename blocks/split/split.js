/**
 * split — full-width image teaser band (prototype section.split, stardust/eds-schema/index.json).
 * Decode tier: template-slotted (fixed composition), one block with two variants:
 *   split (no1)    — background art + heading, description and CTA over it
 *   split (chakki) — background art; the whole band links to the CTA target, the CTA label
 *                    sits on the art as a button (inner anchor unwrapped after reading href, EW6)
 *
 * Authoring: one row — cell 1: background image(s), first desktop, second (optional) mobile;
 * cell 2: heading, description, CTA (<strong><a>) — or only the CTA for the chakki variant.
 */

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

/** background art: first image desktop, second mobile (one image serves both) */
function buildBg(pictures, className) {
  const bg = el('div', className);
  if (pictures[0]) {
    bg.append(wrapNodes(pictures[1] ? 'bg-desktop' : 'bg-all', [pictures[0]]));
  }
  if (pictures[1]) bg.append(wrapNodes('bg-mobile', [pictures[1]]));
  return bg;
}

export default function decorate(block) {
  if (block.querySelector('.split-inner')) return; // EW9: re-entrant
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const contentCell = cells.find((c) => c.querySelector('h1, h2, h3, h4, h5, h6, a')) || null;
  const pictures = cells
    .filter((c) => c !== contentCell)
    .flatMap((c) => [...c.querySelectorAll('picture')]);
  const heading = contentCell?.querySelector('h1, h2, h3, h4, h5, h6');
  const ctas = contentCell
    ? [...contentCell.querySelectorAll('p')].filter((p) => p.querySelector('a[href]'))
    : [];
  const texts = contentCell
    ? [...contentCell.querySelectorAll('p')].filter((p) => !ctas.includes(p) && p.textContent.trim())
    : [];

  const inner = el('div', 'split-inner');
  const card = el('div', 'split-card');
  card.append(buildBg(pictures, 'split-bg'));

  if (!heading && !texts.length && ctas.length) {
    // chakki shape: the band is the link; the CTA label rides on it as a button
    const link = ctas[0].querySelector('a[href]');
    const overlay = el('a', 'split-link', { href: link.href });
    overlay.append(wrapNodes('split-btn', [ctas[0]]));
    link.replaceWith(...link.childNodes);
    card.append(overlay);
  } else {
    const content = el('div', 'split-content');
    if (heading) content.append(wrapNodes('split-title', [heading]));
    if (texts.length) content.append(wrapNodes('split-desc', texts));
    if (ctas.length) content.append(wrapNodes('split-action', ctas));
    card.append(content);
  }

  inner.append(card);
  block.replaceChildren(inner);
}
