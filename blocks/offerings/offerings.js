/**
 * offerings — "Aashirvaad offerings" category listing (5 circular product tiles).
 * Schema: stardust/eds-schema/index.json → sections[1] (repeat DIV.offerings__cat × 5).
 * Decode tier: reconstructive (authors add / remove categories).
 *
 * Authoring rows:
 *   head row(s): <h1>/<h2> title + intro paragraph (every leading row without a picture)
 *   one row per category: <picture> | <p><a href="…">Name</a></p>
 * Card-as-link (EW6): the tile is one <a>; the authored inner anchor is unwrapped after its
 * href is read, the authored <p> stays the editable label.
 */

function wrapNode(node, className, tag = 'div') {
  const w = document.createElement(tag);
  w.className = className;
  if (node) w.append(node);
  return w;
}

const media = (el) => (el.matches('picture, img') ? el : el.querySelector('picture, img'));

export default function decorate(block) {
  const rows = [...block.children];
  const firstCard = rows.findIndex((r) => r.querySelector('picture, img'));
  const headRows = firstCard === -1 ? rows : rows.slice(0, firstCard);
  const cardRows = firstCard === -1 ? [] : rows.slice(firstCard);

  const inner = wrapNode(null, 'offerings-inner');
  const header = wrapNode(null, 'offerings-header');
  headRows.forEach((r) => r.querySelectorAll(':scope > div > *').forEach((el) => {
    if (/^H[1-6]$/.test(el.tagName)) header.append(wrapNode(el, 'offerings-title'));
    else if (el.textContent.trim()) header.append(wrapNode(el, 'offerings-sub'));
  }));
  if (header.children.length) inner.append(header);

  const grid = wrapNode(null, 'offerings-grid');
  cardRows.forEach((row) => {
    const pic = [...row.querySelectorAll(':scope > div > *')].map(media).find(Boolean);
    const link = row.querySelector('a[href]');
    const label = link ? (link.closest('p, h2, h3, h4, h5, h6') || link) : null;
    const others = [...row.querySelectorAll(':scope > div > *')]
      .filter((el) => el.textContent.trim() && !el.contains(link) && !(pic && el.contains(pic)));
    const a = document.createElement('a');
    a.className = 'offerings-link';
    if (link) {
      a.href = link.getAttribute('href');
      a.title = link.textContent;
    }
    a.append(wrapNode(pic, 'offerings-circle', 'span'));
    const name = wrapNode(label, 'offerings-name');
    others.forEach((el) => name.append(el));
    a.append(name);
    if (link && label !== link) link.replaceWith(...link.childNodes);
    grid.append(wrapNode(a, 'offerings-cat'));
  });
  inner.append(grid);
  block.replaceChildren(inner);
}
