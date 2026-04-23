/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-promo.
 * Base: hero. Source: https://www.nationwide.com/
 * Generated: 2026-04-18
 *
 * Hero block: 1 column, 3 rows.
 * Row 1: Block name
 * Row 2: Background image (optional)
 * Row 3: Heading + subheading + CTAs
 *
 * Source DOM: .nw-home-quote-banner contains h1, h2, CTA links, and promo image.
 * Form elements (select, zip input) are simplified to CTA links only.
 */
export default function parse(element, { document }) {
  // Extract background/promo image
  // Found in captured HTML: <img src="./images/08ae2f830e0196d62d25ac672678804c.png"> inside .bg-image-container
  const bgImage = element.querySelector('.bg-image-container img, .large-shrink-custom img');

  // Extract heading
  // Found in captured HTML: <h1 class="nw-heading-tiempos-md nw-banner-media__title banner-title">
  const heading = element.querySelector('h1, h2.nw-heading-tiempos-md');

  // Extract subheading
  // Found in captured HTML: <h2>For your insurance and financial needs...</h2>
  const subheading = element.querySelector('.nw-banner-inpage__content h2, .banner-content-custom h2');

  // Extract CTA links (skip form elements, only get real links)
  // Found in captured HTML: <a class="nw-text-sm find-an-agent-link" href="...">Find an agent</a>
  // and <a class="nw-text-sm find-an-agent-link at-element-click-tracking" href="...">Explore financial products</a>
  const ctaLinks = element.querySelectorAll('a.find-an-agent-link, .nw-banner-inpage__content a[href]');

  const cells = [];

  // Row 1 (image): Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2 (content): Heading + subheading + CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  ctaLinks.forEach((link) => contentCell.push(link));
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-promo', cells });
  element.replaceWith(block);
}
