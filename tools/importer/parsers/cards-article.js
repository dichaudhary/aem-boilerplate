/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article.
 * Base block: cards.
 * Source: https://www.nationwide.com/lc/resources/cyber-resource-center/
 * Generated: 2026-06-15
 *
 * Target structure (standard cards block): one row per card, each row has two cells:
 *   - image cell: a single element wrapping the (linked) thumbnail image
 *   - body cell: linked heading (h3) + description paragraph
 *
 * Source structure: the block element is a `div.rtc-section`. The section heading
 * (e.g. "Featured") is section default content above the grid and is NOT part of the
 * block. Each card lives in a `div.columns.rtc-paragraph` cell, each containing a span
 * with: a div wrapping a linked img, a linked h3, and a description p.
 */
export default function parse(element, { document }) {
  // Each card is a column cell. Validate against source: div.large-4.small-12.columns.rtc-paragraph
  let cardCells = Array.from(element.querySelectorAll(':scope div.columns.rtc-paragraph'));
  // Fallback: any rtc-paragraph column or generic column cell if class variations occur
  if (!cardCells.length) {
    cardCells = Array.from(element.querySelectorAll(':scope div.rtc-paragraph, :scope div.columns'));
  }

  const cells = [];

  cardCells.forEach((card) => {
    // The card content is wrapped in a span; fall back to the card itself.
    const wrapper = card.querySelector(':scope > span') || card;

    // Image: the thumbnail (optionally linked). Reference the linked anchor if present
    // so the image-cell's only child remains a single element (link wrapping img),
    // which the cards decorator treats as the image cell.
    const img = wrapper.querySelector('img');
    let imageEl = null;
    if (img) {
      const imgLink = img.closest('a');
      imageEl = imgLink || img;
    }

    // Heading: linked h3 (preserve the anchor and heading semantics).
    const heading = wrapper.querySelector('h3, h2, h4, [class*="heading"]');

    // Description: the paragraph after the heading.
    const description = wrapper.querySelector(':scope > p, p');

    // Skip cards with no meaningful content.
    if (!imageEl && !heading && !description) return;

    const imageCell = imageEl ? [imageEl] : [];

    const bodyCell = [];
    if (heading) bodyCell.push(heading);
    if (description) bodyCell.push(description);

    cells.push([imageCell, bodyCell]);
  });

  // Empty-block guard: if no cards were extracted, unwrap the element.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
