/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-benefit variant.
 * Source: https://www.nationwide.com/personal/investing/annuities/
 * Selector: #main-content > div.rtc-component:has(.rtc-paragraph img[style*="60px"])
 *
 * Source DOM pattern:
 *   div.rtc-component.nw-outer-bottom--sm.nw-bg-rebrand-vibrant-blue
 *     └── div.rtc-section
 *           └── div.expanded.rtc-container
 *                 └── div.row.nw-inner-bun--sm
 *                       ├── div.large-4.small-12.columns.rtc-paragraph
 *                       │     └── span > img(60x60) + h3 + p
 *                       ├── div.large-4.small-12.columns.rtc-paragraph
 *                       │     └── span > img(60x60) + h3 + p
 *                       └── div.large-4.small-12.columns.rtc-paragraph
 *                             └── span > img(60x60) + h3 + p
 *
 * Also handles heading above the cards (h2 "Benefits of an annuity").
 *
 * Target table structure:
 *   Header row: "cards-benefit"
 *   Row per card: [icon image] | [h3 title + description paragraph]
 */

export default function parse(element, { document }) {
  const items = element.querySelectorAll('.rtc-paragraph');
  if (items.length === 0) return;

  // Check this is the benefit pattern (small icon images, not large photos)
  const hasSmallIcons = Array.from(items).some((item) => {
    const img = item.querySelector('img');
    if (!img) return false;
    const style = img.getAttribute('style') || '';
    return style.includes('60px') || style.includes('48px') || style.includes('64px');
  });
  if (!hasSmallIcons) return;

  // Extract section heading if present (above the cards row)
  const sectionHeading = element.querySelector('h2');

  const cells = [];

  // Add heading as first row if present
  if (sectionHeading) {
    cells.push([sectionHeading]);
  }

  Array.from(items).forEach((item) => {
    const span = item.querySelector('span') || item;
    const img = span.querySelector('img');
    const heading = span.querySelector('h3, h4');
    const desc = span.querySelector('p');

    if (!img && !heading) return;

    const iconCell = img ? img : '';
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (desc) contentCell.push(desc);

    cells.push([iconCell, contentCell]);
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-benefit',
    cells,
  });

  element.replaceWith(block);
}
