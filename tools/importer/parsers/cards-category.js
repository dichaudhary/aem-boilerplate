/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-category.
 * Base: cards. Source: https://www.nationwide.com/
 * Generated: 2026-04-18
 *
 * Cards block: 2 columns, multiple rows.
 * Row 1: Block name
 * Row N: image/icon | heading + description + CTA
 *
 * Source DOM: #p43486 .nw-multi-option-promo section contains three .column.large-4 divs,
 * each with icon (SVG img), h3 heading, p description, and CTA link button.
 */
export default function parse(element, { document }) {
  // Find all product category columns
  // Found in captured HTML: <div class="column small-12 large-4"> inside
  // <section class="nw-container nw-inner-bottom--lg nw-multi-option-promo">
  const section = element.querySelector('section.nw-multi-option-promo, section.nw-container');
  const columns = section
    ? section.querySelectorAll(':scope .row > .column.large-4, :scope .row > div.column')
    : element.querySelectorAll('.row .column.large-4');

  const cells = [];

  columns.forEach((col) => {
    // Extract icon image
    // Found in captured HTML: <img src="data:image/svg+xml;base64,..."> (SVG icons)
    const icon = col.querySelector('img');

    // Extract heading
    // Found in captured HTML: <h3 class="mopHeading nw-heading-sm nw-links-rebrand-vibrant-blue">
    const heading = col.querySelector('h3, h3.mopHeading');

    // Extract description paragraph
    // Found in captured HTML: <p class="mopDesc">We protect vehicles...</p>
    const description = col.querySelector('p, p.mopDesc');

    // Extract CTA link
    // Found in captured HTML: <a href="/personal/insurance/" class="row button hollow ...">Personal insurance</a>
    const ctaLink = col.querySelector('a.button, a[href]');

    // Build row: [icon | heading + description + CTA]
    const imageCell = icon ? icon : '';
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLink) contentCell.push(ctaLink);

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
  element.replaceWith(block);
}
