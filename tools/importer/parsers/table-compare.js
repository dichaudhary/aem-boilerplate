/* eslint-disable */
/* global WebImporter */
/**
 * Parser for table-compare variant.
 * Source: https://www.nationwide.com/personal/investing/annuities/
 * Selector: #main-content > div.rtc-component:has(table)
 *
 * Source DOM pattern:
 *   div.rtc-component.nw-bg-gray-pale-25
 *     └── div.rtc-section
 *           └── div.expanded.rtc-container
 *                 └── div.row
 *                       └── div.rtc-paragraph
 *                             └── span > h2 + table
 *                                   ├── thead > tr > th (Benefit, Variable, Registered index-linked, Fixed indexed, Fixed, Immediate)
 *                                   └── tbody > tr > td (text + ✔ checkmarks)
 *
 * Target table structure:
 *   Header row: "table-compare"
 *   Row 1: column headers from thead
 *   Row 2..N: data rows from tbody (preserving ✔ marks)
 */

export default function parse(element, { document }) {
  const table = element.querySelector('table');
  if (!table) return;

  // Extract heading above the table
  const sectionHeading = element.querySelector('h2');

  // Extract thead
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  if (!thead || !tbody) return;

  const headerCells = Array.from(thead.querySelectorAll('th, td')).map(
    (cell) => cell.textContent.trim()
  );

  // Extract tbody rows
  const bodyRows = Array.from(tbody.querySelectorAll('tr')).map((row) =>
    Array.from(row.querySelectorAll('td, th')).map((cell) => cell.textContent.trim())
  );

  if (headerCells.length === 0 || bodyRows.length === 0) return;

  const cells = [];

  // Add section heading as content above if present
  if (sectionHeading) {
    cells.push([sectionHeading]);
  }

  // Header row
  cells.push(headerCells);

  // Data rows
  bodyRows.forEach((row) => {
    cells.push(row);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'table-compare',
    cells,
  });

  element.replaceWith(block);
}
