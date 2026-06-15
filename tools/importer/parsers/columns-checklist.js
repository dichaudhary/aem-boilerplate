/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-checklist variant.
 * Base: columns (variant: columns-checklist)
 * Source URL: https://www.nationwide.com/business/insurance/business-owners-policy-bop/
 * Source selector: #main-content > div.rtc-component.nw-outer-bottom--lg.nw-bg-rebrand-vibrant-blue
 *   ("Why choose a BOP" section — vibrant-blue brand background, two columns of
 *   checkmark-prefixed benefit statements).
 *
 * Target table structure (columns block; library example unavailable — endpoint
 * unreachable, so structure derived from blocks/columns/columns.js + sibling
 * columns-app parser convention + block metadata):
 *   Row 1: block name ("columns-checklist")  — added by createBlock
 *   Row 2: 1 cell  — section heading (full width)
 *   Row 3: 2 cells — [left checklist column] | [right checklist column]
 *
 * Source DOM shape (validated against
 * migration-work/block-context/columns-checklist/source.html):
 *   div.rtc-component.nw-outer-bottom--lg.nw-bg-rebrand-vibrant-blue
 *     └── div.rtc-section
 *           ├── div.row.columns.text-center
 *           │     └── h2.nw-heading-tiempos-md           // section heading
 *           └── div.expanded.rtc-container
 *                 └── div.row.nw-inner-bun--sm
 *                       ├── div.large-6.small-12.columns.rtc-paragraph  // LEFT col
 *                       │     └── span
 *                       │           └── p (xN)  // checkmark <img> + statement text
 *                       └── div.large-6.small-12.columns.rtc-paragraph  // RIGHT col
 *                             └── span
 *                                   └── p (xN)  // checkmark <img> + statement text
 *
 * Each statement <p> begins with a small decorative checkmark <img> followed by
 * &nbsp; padding and the statement text. The parser strips the decorative
 * checkmark image and the NBSP padding, converting each <p> into an <li> within
 * a <ul> so the output is a clean bulleted checklist per column. <sup> and other
 * inline markup inside the statement is preserved.
 */

export default function parse(element, { document }) {
  // ---------- Section heading ----------
  // Scoped to the centered heading row; falls back to any brand heading class.
  const heading = element.querySelector(
    'h1, h2, h3, .nw-heading-tiempos-md, [class*="heading"]',
  );

  // ---------- The two checklist columns ----------
  const columnDivs = Array.from(
    element.querySelectorAll('.large-6.small-12.columns.rtc-paragraph'),
  );
  const [leftCol, rightCol] = columnDivs;

  // Build a <ul> of statements for a given column. Each statement is a <p>
  // whose leading child is the decorative checkmark <img>; that image is
  // removed and NBSP padding normalised so only the statement remains.
  function buildList(col) {
    if (!col) return null;
    const scope = col.querySelector(':scope > span') || col;
    const statements = Array.from(scope.querySelectorAll('p'));
    if (statements.length === 0) return null;

    const ul = document.createElement('ul');
    statements.forEach((p) => {
      // Clone so we can mutate without disturbing the source element, then
      // drop the leading decorative checkmark image(s).
      const clone = p.cloneNode(true);
      clone.querySelectorAll('img').forEach((img) => img.remove());

      const li = document.createElement('li');
      // Move the remaining (non-image) inline nodes into the <li>, preserving
      // markup such as <sup>. Normalise NBSP padding to a single space.
      Array.from(clone.childNodes).forEach((node) => {
        if (node.nodeType === 3 /* text */) {
          const text = (node.textContent || '').replace(/ /g, ' ');
          if (text.trim()) {
            li.appendChild(document.createTextNode(text.replace(/\s+/g, ' ')));
          }
        } else {
          li.appendChild(node);
        }
      });

      // Trim leading whitespace text node if present.
      if (li.firstChild && li.firstChild.nodeType === 3) {
        li.firstChild.textContent = li.firstChild.textContent.replace(/^\s+/, '');
      }

      if ((li.textContent || '').trim()) ul.appendChild(li);
    });

    return ul.children.length > 0 ? ul : null;
  }

  const leftList = buildList(leftCol);
  const rightList = buildList(rightCol);

  // Empty-block guard: if there is no heading and no checklist content, unwrap.
  if (!heading && !leftList && !rightList) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: full-width heading (only when present).
  if (heading) {
    cells.push([heading]);
  }

  // Row 3: two columns of checklist statements.
  cells.push([leftList || '', rightList || '']);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-checklist',
    cells,
  });

  element.replaceWith(block);
}
