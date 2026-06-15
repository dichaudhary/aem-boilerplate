/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-coverage variant.
 * Base: columns (variant: columns-coverage)
 * Source URL: https://www.nationwide.com/business/insurance/business-owners-policy-bop/
 * Source selector: #main-content > div.rtc-component.nw-outer-bottom--lg:nth-of-type(8)
 *   (section rc12 — "Additional coverage options to consider")
 *
 * Target table structure (columns base block — single content row, one cell per column):
 *   Row 1: block name ("columns-coverage")
 *   Row 2: N cells (one per source column). Each cell stacks multiple
 *          H3 (often linked) + paragraph pairs describing a coverage option.
 *
 * Source DOM shape (validated against
 *   migration-work/block-context/columns-coverage/source.html):
 *   div.rtc-component
 *     └── div.rtc-section
 *           ├── div.row.columns.text-center > h2.nw-heading-md   // section heading (kept as default content, not in block)
 *           └── div.expanded.rtc-container
 *                 └── div.row.nw-inner-bun--sm
 *                       └── div.large-4.small-12.columns.rtc-paragraph   // one per column (3 here)
 *                             └── span
 *                                   ├── h3[.nw-heading] (text or wrapping <a href>)
 *                                   ├── p (description)        // last item is sometimes a <div>
 *                                   └── ... (repeated heading + paragraph pairs)
 *
 * Notes on source variations handled:
 *   - Headings may be plain text (<h3>Accounts receivable</h3>) or contain an
 *     anchor (<h3><a href="...">Business auto</a></h3>); the anchor's class/title
 *     placement also varies (on <h3> vs on <a>). We preserve the heading node as-is.
 *   - The trailing description is usually a <p> but can be a <div>
 *     (e.g. Workers' compensation); we normalise any non-heading block to a <p>.
 */
export default function parse(element, { document }) {
  // Each visual column is a `.columns.rtc-paragraph` div whose inner content
  // lives inside a single <span>. Fall back to the column div itself if no span.
  const columnEls = Array.from(
    element.querySelectorAll('div.columns.rtc-paragraph, div[class*="columns"].rtc-paragraph'),
  );

  const columnCells = columnEls.map((colEl) => {
    const root = colEl.querySelector(':scope > span') || colEl;
    const cellContent = [];

    Array.from(root.children).forEach((child) => {
      const tag = child.tagName ? child.tagName.toLowerCase() : '';
      const text = (child.textContent || '').replace(/ /g, ' ').trim();
      if (!text) return;

      if (/^h[1-6]$/.test(tag)) {
        // Preserve heading (and any nested link) exactly as authored.
        cellContent.push(child);
      } else {
        // Description: normalise <p>/<div> (or anything else) to a <p>.
        if (tag === 'p') {
          cellContent.push(child);
        } else {
          const p = document.createElement('p');
          p.textContent = text;
          cellContent.push(p);
        }
      }
    });

    return cellContent;
  }).filter((cell) => cell.length > 0);

  // Empty-block guard: if no column content was found, unwrap rather than
  // emit an empty block.
  if (columnCells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single content row with one cell per column.
  const cells = [columnCells];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-coverage',
    cells,
  });

  element.replaceWith(block);
}
