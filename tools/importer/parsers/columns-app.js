/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-app variant.
 * Base: columns (variant: columns-app)
 * Source URL: https://www.nationwide.com/
 * Source selector: div#p43655.rtc-component.nw-bg-rebrand-vibrant-blue (mobile
 *   app promo section on the Nationwide homepage).
 *
 * Target table structure (from columns library example):
 *   Row 1: block name ("columns-app")
 *   Row 2: 2 cells — [left text column] | [right QR image column]
 *
 * Source DOM shape (validated against
 * migration-work/block-context/columns-app/source.html):
 *   div#p43655.rtc-component.nw-bg-rebrand-vibrant-blue
 *     └── div.rtc-section
 *           └── div.expanded.rtc-container
 *                 └── div.row.nw-inner-bun--sm
 *                       ├── div.large-6.small-12.columns.rtc-paragraph   // LEFT col
 *                       │     └── span
 *                       │           ├── div.nw-text-lg    // intro text
 *                       │           ├── h3.nw-heading-tiempos-md  // headline
 *                       │           └── div (x3)          // checkmark <img> + text
 *                       └── div.large-6.small-12.columns.rtc-paragraph   // RIGHT col
 *                             └── span
 *                                   ├── div > img          // QR code image
 *                                   └── p                  // caption
 *
 * Each checkmark row in the left column is a bare <div> whose first child is a
 * small checkmark <img>. The parser strips the checkmark image and converts the
 * three divs into <li> elements inside a <ul>, producing a proper bulleted list
 * in the output.
 */

export default function parse(element, { document }) {
  // The two main columns (mobile-first responsive classes from Foundation grid).
  const columnDivs = Array.from(
    element.querySelectorAll('.large-6.small-12.columns.rtc-paragraph'),
  );
  const [leftCol, rightCol] = columnDivs;

  // ---------- Column 1: intro text + heading + bulleted list ----------
  const leftCell = [];

  if (leftCol) {
    // Scope to the inner <span> wrapper when present so we avoid any siblings
    // added around the column in variations.
    const leftScope = leftCol.querySelector(':scope > span') || leftCol;

    // Intro paragraph (e.g. "Get easy 24/7 support on our")
    const intro = leftScope.querySelector('.nw-text-lg, [class*="text-lg"]');
    if (intro) {
      const p = document.createElement('p');
      p.textContent = (intro.textContent || '').replace(/ /g, ' ').trim();
      if (p.textContent) leftCell.push(p);
    }

    // Heading (h3 preferred, with graceful fallbacks)
    const heading = leftScope.querySelector('h1, h2, h3, h4, [class*="heading"]');
    if (heading) leftCell.push(heading);

    // The three checkmark rows are bare <div>s that contain a small <img>
    // (the checkmark) followed by text. Filter out containers/decorative divs
    // and the intro `.nw-text-lg` div.
    const candidateDivs = Array.from(leftScope.querySelectorAll(':scope > div'));
    const listItems = candidateDivs.filter((d) => {
      if (d.classList.contains('nw-text-lg')) return false;
      // require visible text content (beyond whitespace / nbsp)
      const text = (d.textContent || '').replace(/ /g, ' ').trim();
      return text.length > 0;
    });

    if (listItems.length > 0) {
      const ul = document.createElement('ul');
      listItems.forEach((itemDiv) => {
        const li = document.createElement('li');
        // Text content with the leading checkmark image stripped, and NBSPs
        // normalised to regular spaces.
        const text = (itemDiv.textContent || '').replace(/ /g, ' ').trim();
        if (text) {
          li.textContent = text;
          ul.appendChild(li);
        }
      });
      if (ul.children.length > 0) leftCell.push(ul);
    }
  }

  // ---------- Column 2: QR image + caption ----------
  const rightCell = [];

  if (rightCol) {
    const rightScope = rightCol.querySelector(':scope > span') || rightCol;

    // Emit the QR code as a locally-hosted PNG (post-import asset sync)
    // so the content is self-contained. The right column's only image is
    // the QR code, and the caption is always "Scan this QR code to download the app!".
    const qrImage = document.createElement('img');
    qrImage.setAttribute('src', './images/qr-code.png');
    qrImage.setAttribute('alt', 'Scan this QR code to download the app!');
    rightCell.push(qrImage);

    // Caption paragraph below the QR image (source of truth)
    const caption = rightScope.querySelector('p');
    if (caption) rightCell.push(caption);
  }

  // Row 1 (block name) is added automatically by createBlock; we supply Row 2
  // as a single 2-cell row matching the columns library example.
  const cells = [
    [leftCell, rightCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-app',
    cells,
  });

  element.replaceWith(block);
}
