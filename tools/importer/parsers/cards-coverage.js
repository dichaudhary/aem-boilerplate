/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-coverage.
 * Base block: cards
 * Source URL: https://www.nationwide.com/business/insurance/business-owners-policy-bop/
 * Generated: 2026-06-15
 *
 * Source structure (validated against source.html):
 *   div.nw-multi-option-promo
 *     > div.text-center... > h2            (section heading - default content, not part of block)
 *     > section.nw-container.nw-multi-option-promo
 *         > div.row.text-center.align-center
 *             > div.column.small-12.large-3   (one per card)
 *                 svg[name]                    (inline icon)
 *                 h3.mopHeading                (card heading)
 *                 p.mopDesc                    (card description)
 *                 a.button.hollow              (learn-more link)
 *
 * The cards block renders one row per card; each card cell holds
 * icon + heading + description + link. Icons are inline <svg>, not
 * <picture>, so they live in the body cell with the rest of the content.
 */
export default function parse(element, { document }) {
  // Each card is a column inside the row. Fallbacks cover layout variation.
  let cardEls = Array.from(element.querySelectorAll(
    ':scope div.row > div[class*="column"], :scope div.row > div[class*="large-"]',
  ));

  // Fallback: any column-like child that contains a heading.
  if (cardEls.length === 0) {
    cardEls = Array.from(element.querySelectorAll('div[class*="column"]'))
      .filter((col) => col.querySelector('h3, h2, [class*="Heading"]'));
  }

  const cells = [];

  cardEls.forEach((card) => {
    const icon = card.querySelector('svg, picture, img');
    const heading = card.querySelector('h3.mopHeading, h3, h4, [class*="Heading"]');
    const description = card.querySelector('p.mopDesc, p');
    const link = card.querySelector('a.button, a.hollow, a[href]');

    const body = [];
    if (icon) body.push(icon);
    if (heading) body.push(heading);
    if (description) body.push(description);
    if (link) body.push(link);

    // Skip empty/invalid cards.
    if (body.length === 0) return;

    cells.push([body]);
  });

  // Empty-block guard: bail gracefully if no cards were found.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-coverage', cells });
  element.replaceWith(block);
}
