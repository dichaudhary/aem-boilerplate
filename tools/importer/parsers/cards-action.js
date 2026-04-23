/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-action.
 * Base: cards. Source: https://www.nationwide.com/
 * Generated: 2026-04-18
 *
 * Cards block: 2 columns, multiple rows.
 * Row 1: Block name
 * Row N: image/icon | heading + description + CTA
 *
 * Source DOM: Three .custom-tri-promo divs, each with icon (SVG img), h3 heading,
 * p description, and action element (select+button or link).
 * Form elements simplified to descriptive text + CTA links.
 */
export default function parse(element, { document }) {
  // Find all tri-promo card items
  // Found in captured HTML: <div class="custom-tri-promo column small-12 large-4 nw-inner-bun--sm">
  const cards = element.querySelectorAll('.custom-tri-promo');

  const cells = [];

  cards.forEach((card) => {
    // Extract icon image
    // Found in captured HTML: <img src="data:image/svg+xml;base64,..."> inside .nw-fg-rebrand-vibrant-blue
    const icon = card.querySelector('.nw-fg-rebrand-vibrant-blue img, img[src^="data:image/svg"]');

    // Extract heading
    // Found in captured HTML: <h3 class="nw-heading-sm custom-heading">No login required</h3>
    const heading = card.querySelector('h3, h3.custom-heading, h3.nw-heading-sm');

    // Extract description paragraph
    // Found in captured HTML: <p>What would you like to do?</p>
    const description = card.querySelector('p');

    // Extract CTA link (prefer actual anchor links, fall back to button text)
    // Found in captured HTML: <a href="..." class="button ...">Start quote</a>
    const ctaLink = card.querySelector('a.button, a[href]');

    // Build row: [icon | heading + description + CTA]
    const imageCell = icon ? icon : '';
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLink) contentCell.push(ctaLink);

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-action', cells });
  element.replaceWith(block);
}
