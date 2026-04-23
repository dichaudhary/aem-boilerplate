/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-tile.
 * Base: cards. Source: https://www.nationwide.com/
 * Generated: 2026-04-18
 *
 * Cards block: 2 columns, multiple rows.
 * Row 1: Block name
 * Row N: image | heading + link
 *
 * Source DOM: section.nw-tile-block contains tile links (a.nw-tile-block__tile),
 * each with a background image and text overlay heading.
 * Used for both tile row 1 (section#p30097) and tile row 2 (section#p30087).
 */
export default function parse(element, { document }) {
  // Find all tile links within the section
  // Found in captured HTML: <a href="/personal/investing/" class="nw-tile-block__tile nw-tile-block__tile--tall">
  const tiles = element.querySelectorAll('a.nw-tile-block__tile');

  const cells = [];

  tiles.forEach((tile) => {
    // Extract tile image
    // Found in captured HTML: <div class="nw-tile-block__image"><img src="./images/..."></div>
    const image = tile.querySelector('.nw-tile-block__image img, img');

    // Extract tile heading
    // Found in captured HTML: <h2 class="nw-tile-block__content-subheader">Let us protect your financial future, too</h2>
    const heading = tile.querySelector('h2.nw-tile-block__content-subheader, h2, h3');

    // Extract the link href to create a proper linked heading
    const href = tile.getAttribute('href');

    // Build row: [image | heading with link]
    const imageCell = image ? image : '';
    const contentCell = [];

    if (heading) {
      // Create a linked heading: wrap heading text in a link
      if (href) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = heading.textContent.trim();
        const h2 = document.createElement('h2');
        h2.append(link);
        contentCell.push(h2);
      } else {
        contentCell.push(heading);
      }
    }

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tile', cells });
  element.replaceWith(block);
}
