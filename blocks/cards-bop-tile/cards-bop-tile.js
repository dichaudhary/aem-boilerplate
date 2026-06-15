/**
 * Converts literal `:icon-name:` tokens (left as plain text by the import
 * pipeline) into inline SVG icons. The SVG is fetched and inlined (rather than
 * referenced via <img>) so that `fill: currentcolor` adapts the icon to the
 * surrounding text color (white on the dark tile, brand-blue on light cards).
 * @param {Element} scope element to search within
 */
async function convertIconTokens(scope) {
  const placeholders = [];
  scope.querySelectorAll('p').forEach((p) => {
    const match = p.textContent.trim().match(/^:([a-z0-9-]+):$/i);
    if (!match) return;
    const span = document.createElement('span');
    span.className = `icon icon-${match[1]}`;
    p.replaceWith(span);
    placeholders.push({ span, name: match[1] });
  });

  await Promise.all(placeholders.map(async ({ span, name }) => {
    try {
      const resp = await fetch(`${window.hlx?.codeBasePath || ''}/icons/${name}.svg`);
      if (resp.ok) {
        span.innerHTML = await resp.text();
      }
    } catch (e) {
      // leave the empty span if the icon asset is missing
    }
  }));
}

/**
 * loads and decorates the cards-bop-tile block.
 * Each row becomes a navigation tile: an icon centered above a linked heading,
 * with the whole tile acting as a single clickable link.
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    li.querySelectorAll(':scope > div').forEach((div) => {
      div.className = 'cards-bop-tile-card-body';
    });
    ul.append(li);
  });

  // Turn `:name:` text into inline icon SVGs
  await convertIconTokens(ul);

  // Make the entire tile a single link (mirrors the source markup where the
  // anchor wraps the icon and heading). Use the heading's link as the target.
  ul.querySelectorAll('li').forEach((li) => {
    const body = li.querySelector('.cards-bop-tile-card-body') || li;
    const headingLink = body.querySelector('h5 a, a');
    if (!headingLink) return;
    const tileLink = document.createElement('a');
    tileLink.href = headingLink.getAttribute('href');
    if (headingLink.title) tileLink.title = headingLink.title;
    // unwrap the heading's inner link, keeping the heading text
    const heading = headingLink.closest('h5') || headingLink;
    if (heading.tagName === 'H5') {
      headingLink.replaceWith(...headingLink.childNodes);
    }
    // move all body children into the tile link
    while (body.firstChild) tileLink.append(body.firstChild);
    body.append(tileLink);
  });

  block.textContent = '';
  block.append(ul);
}
