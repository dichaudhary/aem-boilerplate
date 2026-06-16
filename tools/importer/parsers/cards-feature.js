/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature variant.
 * Base block: cards
 * Source: https://www.nationwide.com/personal/investing/
 * Generated: 2026-06-02
 *
 * Handles bolt-tile web components:
 *   div.nw-container > bolt-tile-group > bolt-tile[href][img][label] > p
 *
 * Target table structure:
 *   Row 1..N: one row per card, 2 columns — [image] | [linked heading + description]
 */

export default function parse(element, { document }) {
  const boltTiles = Array.from(element.querySelectorAll('bolt-tile[href]'));
  if (boltTiles.length === 0) {
    return;
  }

  const cells = boltTiles.map((tile) => {
    const href = tile.getAttribute('href') || '#';
    const label = tile.getAttribute('label') || '';
    const imgSrc = tile.getAttribute('img') || '';
    const desc = tile.querySelector('p');
    const descText = desc ? desc.textContent.trim() : '';

    let imageCell = '';
    if (imgSrc) {
      const img = document.createElement('img');
      img.setAttribute('src', imgSrc.startsWith('/') ? `https://www.nationwide.com${imgSrc}` : imgSrc);
      img.setAttribute('alt', label);
      imageCell = img;
    }

    const textCell = [];
    if (label) {
      const h = document.createElement('h2');
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = label;
      h.appendChild(link);
      textCell.push(h);
    }
    if (descText) {
      const p = document.createElement('p');
      p.textContent = descText;
      textCell.push(p);
    }

    return [imageCell, textCell];
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
    element.replaceWith(block);
  }
}
