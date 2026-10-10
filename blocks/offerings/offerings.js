/**
 * offerings — "Aashirvaad offerings" category tiles (prototype `.section--offerings`,
 * schema stardust/eds-schema/index.json sections[1]). Decode tier: reconstructive.
 *
 * Authoring: the section head (h1 + lede) is default content before the block (styled in
 * place by this block's CSS); the block holds ONE ROW PER CATEGORY — the category image and
 * a paragraph whose link carries the category name and target (card-as-link, EW6).
 * Leading rows without image/link are read as an in-table head (decode fallback).
 * No exemptions: every authored text moves (EW1); the category anchor is unwrapped into
 *   the generated tile link after its href is read (EW6)
 */

const MEDIA = 'picture, img';
const isMedia = (el) => el.matches(MEDIA) || !!el.querySelector(MEDIA);

function buildTile(nodes) {
  const media = nodes.find(isMedia);
  const link = nodes.map((n) => (n.matches('a[href]') ? n : n.querySelector('a[href]')))
    .find(Boolean);
  const tile = document.createElement('div');
  tile.className = 'categorylist';
  const item = document.createElement(link ? 'a' : 'div');
  item.className = 'categorylist-item';
  if (link) {
    item.href = link.href;
    // the live tile link carries the category name as its title
    item.title = link.getAttribute('title') || link.textContent.trim();
  }
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'categorylist-imagewrapper';
  if (media) imageWrapper.append(media);
  item.append(imageWrapper);
  const texts = nodes.filter((n) => n !== media);
  if (texts.length) {
    const name = document.createElement('div');
    name.className = 'categorylist-name';
    name.append(...texts);
    item.append(name);
  }
  // card-as-link: the authored anchor lives on inside the tile link (EW6)
  if (link && link.closest('.categorylist-item') === item) {
    link.replaceWith(...link.childNodes);
  }
  tile.append(item);
  return tile;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const rowNodes = rows.map((row) => [...row.children].flatMap((cell) => [...cell.children]));
  const isUnit = (nodes) => nodes.some(isMedia) || nodes.some((n) => n.querySelector('a[href]'));
  const firstUnit = rowNodes.findIndex(isUnit);
  const headRows = firstUnit < 0 ? rowNodes : rowNodes.slice(0, firstUnit);
  const unitRows = firstUnit < 0 ? [] : rowNodes.slice(firstUnit);

  const frag = document.createDocumentFragment();
  if (headRows.length) {
    const head = document.createElement('div');
    head.className = 'offerings-header';
    headRows.forEach((nodes) => head.append(...nodes));
    frag.append(head);
  }
  const content = document.createElement('div');
  content.className = 'offerings-content';
  unitRows.forEach((nodes) => content.append(buildTile(nodes)));
  frag.append(content);
  block.replaceChildren(frag);
}
