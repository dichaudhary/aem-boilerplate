/**
 * offerings — product-category tiles (prototype section.offerings, stardust/eds-schema/index.json).
 * Decode tier: reconstructive (repeat group: one row per category).
 *
 * Section head: the default content before the block (h1 + lede) is reabsorbed (EW8).
 * Authoring: one row per category — cell 1: image; cell 2: the category name as a link
 * (the whole tile becomes the link; the inner anchor is unwrapped after reading href, EW6).
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

/** the section head authored as default content right before the block (EW8) */
function takeSectionHead(block) {
  const prev = block.parentElement?.previousElementSibling;
  if (!prev || !prev.classList.contains('default-content-wrapper')) return [];
  const nodes = [...prev.children];
  prev.remove();
  return nodes;
}

function buildItem(row) {
  const link = row.querySelector('a[href]');
  const picture = row.querySelector('picture');
  const li = el('li');
  const item = el(link ? 'a' : 'div', 'offerings-item', link ? { href: link.href } : {});
  if (link?.title) item.title = link.title; // the source's tiles carry title="<category>"
  if (picture) item.append(wrapNodes('offerings-img', [picture]));
  const label = link ? link.closest('p') : [...row.querySelectorAll('p')].find((p) => p.textContent.trim());
  if (label) {
    item.append(wrapNodes('offerings-name', [label]));
    if (link) link.replaceWith(...link.childNodes);
  }
  li.append(item);
  return li;
}

export default function decorate(block) {
  if (block.querySelector('.offerings-inner')) return; // EW9: re-entrant
  const head = takeSectionHead(block);
  const rows = [...block.children];
  const inner = el('div', 'offerings-inner');

  const heading = head.find((n) => /^H[1-6]$/.test(n.tagName));
  if (heading) inner.append(wrapNodes('offerings-title', [heading]));
  const lede = head.filter((n) => n !== heading);
  if (lede.length) inner.append(wrapNodes('offerings-sub', lede));

  const list = el('ul', 'offerings-list');
  rows.filter((row) => row.querySelector('picture, a')).forEach((row) => list.append(buildItem(row)));
  inner.append(list);

  // fade lazy images in once loaded (prototype: img.fade)
  list.querySelectorAll('img').forEach((img) => {
    img.classList.add('fade');
    if (img.complete && img.naturalWidth) img.classList.add('loaded');
    else img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
  });

  block.replaceChildren(inner);
}
