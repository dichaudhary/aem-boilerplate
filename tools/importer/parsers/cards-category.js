/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-category (base: cards).
 * Source: https://www.nationwide.com/ (3-column category section `div#p43486.nw-multi-option-promo`).
 * The parser targets the wrapper element which contains both a section heading
 * and the inner `<section class="nw-container nw-multi-option-promo">` with 3 cards.
 * The section heading is emitted as default content by the section transformer, so
 * this parser only emits the cards table for the 3 cards.
 * Table follows the Cards block library structure: 2 columns per card.
 *   - Cell 1: icon / image
 *   - Cell 2: heading, description, CTA link
 */
// Map section 3 card headings to the local PNG asset (post-import download).
const CATEGORY_ICON_BY_HEADING = {
  'For you and your family': { src: './images/person-shield.png', alt: 'person shield icon' },
  'For your business': { src: './images/open-sign.png', alt: 'open sign icon' },
  'For your future': { src: './images/shield.png', alt: 'shield icon' },
};

export default function parse(element, { document }) {
  // Prefer the inner section that holds the cards; fall back to the wrapper itself.
  const cardsSection = element.querySelector('section.nw-multi-option-promo, section.nw-container') || element;

  // Each card is a foundation-grid column inside a `.row`.
  const cardEls = Array.from(cardsSection.querySelectorAll('.row > .column'));

  const cells = [];

  cardEls.forEach((card) => {
    // Cell 2: heading + description + CTA link (needed for alt text fallback).
    const heading = card.querySelector('h3.mopHeading, h2, h3, h4, [class*="Heading"]');
    const description = card.querySelector('p.mopDesc, p');
    const cta = card.querySelector('a.button, a.hollow, a[class*="button"], a');

    // Cell 1: local PNG icon (heading-keyed). Fall back to a source <img> if the
    // mapping doesn't match (defensive against future heading changes).
    const headingText = (heading?.textContent || '').trim();
    const iconInfo = CATEGORY_ICON_BY_HEADING[headingText];
    let icon = null;
    if (iconInfo) {
      icon = document.createElement('img');
      icon.setAttribute('src', iconInfo.src);
      icon.setAttribute('alt', iconInfo.alt);
    }
    if (!icon) {
      icon = card.querySelector('img');
    }
    if (icon && !icon.getAttribute('alt')) {
      const altText = headingText ? `${headingText} icon` : 'category icon';
      icon.setAttribute('alt', altText);
    }

    const textCell = [];
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);
    if (cta) textCell.push(cta);

    // Only push a row if we have at least heading or description (mandatory text).
    if (textCell.length > 0) {
      cells.push([icon || '', textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
  element.replaceWith(block);
}
