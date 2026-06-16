/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-promo variant.
 * Base: columns (variant: columns-promo)
 * Source URL: https://www.nationwide.com/personal/investing/
 * Source selector: #main-content > div.rtc-component.nw-outer-bottom--lg.nw-bg-rebrand-vibrant-blue
 * Generated: 2026-06-02 (validated locally via JSDOM)
 *
 * Target table structure (from columns library pattern):
 *   Row 1: block name ("columns-promo") — added automatically by createBlock
 *   Row 2: 2 cells — [left text column] | [right image/QR column]
 *
 * Source DOM shape (validated against cached source HTML — same
 * .nw-bg-rebrand-vibrant-blue two-column promotional layout):
 *   div.rtc-component.nw-bg-rebrand-vibrant-blue
 *     ├── div.rtc-section
 *     │     └── div.row.columns.text-center           // optional centered heading
 *     │           └── h3.nw-heading-tiempos-md
 *     ├── div.rtc-section (or same)
 *     │     └── div.expanded.rtc-container
 *     │           └── div.row.nw-inner-bun--sm        // Row 1: icon + description
 *     │                 ├── div.large-3 (or 6)        // small image column
 *     │                 └── div.large-9 (or 6)        // text/list column
 *     └── div.rtc-section (optional)
 *           └── div.expanded.rtc-container
 *                 └── div.row.nw-inner-bun--sm        // Row 2: QR codes / badges
 *                       ├── div.large-6               // iPhone QR + badge
 *                       └── div.large-6               // Android QR + badge
 *
 * Variations handled:
 * - Single-row: 6/6 split (text left, image right) like homepage app promo
 * - Multi-row: centered heading + 3/9 split (icon + text) + 6/6 QR row
 * - Text content: intro div, heading, paragraphs, bullet list, CTA links
 * - Image content: QR codes, app badges, promo images with captions
 */

export default function parse(element, { document }) {
  // Check for a centered heading above the columns
  const centeredHeadingRow = element.querySelector('.row.columns.text-center, .row.text-center');
  const topHeading = centeredHeadingRow
    ? centeredHeadingRow.querySelector('h1, h2, h3, h4, [class*="heading"]')
    : null;

  // Find ALL content rows (may be 1 or 2 rows in multi-section layouts)
  const contentRows = Array.from(
    element.querySelectorAll('.row.nw-inner-bun--sm, .row.nw-inner-bun'),
  );

  if (contentRows.length === 0) {
    // Fallback: preserve raw content if structure is unexpected
    element.replaceWith(...element.childNodes);
    return;
  }

  // ---------- Build left cell (text/description content) ----------
  const leftCell = [];

  // Add centered heading if present
  if (topHeading) {
    leftCell.push(topHeading);
  }

  // Process first row — find the text-heavy column (larger or right column)
  const firstRow = contentRows[0];
  const firstRowCols = Array.from(
    firstRow.querySelectorAll(':scope > [class*="columns"][class*="rtc-paragraph"]'),
  );

  if (firstRowCols.length >= 2) {
    // Determine which column has text vs image
    // In 3/9 split: small column has icon, large has text
    // In 6/6 split: left has text, right has image
    let textCol = null;
    let imageCol = null;

    const firstColIsSmall = firstRowCols[0].className.includes('large-3')
      || firstRowCols[0].className.includes('large-4');

    if (firstColIsSmall) {
      // 3/9 or 4/8 layout: first col is icon, second is text
      imageCol = firstRowCols[0];
      textCol = firstRowCols[1];
    } else {
      // 6/6 layout: first col is text, second is image
      textCol = firstRowCols[0];
      imageCol = firstRowCols[1];
    }

    // Extract text content from the text column
    if (textCol) {
      const textScope = textCol.querySelector(':scope > span') || textCol;

      // Intro paragraph (e.g. "Get easy 24/7 support on our")
      const intro = textScope.querySelector('.nw-text-lg, [class*="text-lg"]');
      if (intro) {
        const p = document.createElement('p');
        p.textContent = (intro.textContent || '').replace(/ /g, ' ').trim();
        if (p.textContent) leftCell.push(p);
      }

      // Heading within the text column
      const heading = textScope.querySelector('h1, h2, h3, h4, [class*="heading"]');
      if (heading && heading !== topHeading) leftCell.push(heading);

      // Description paragraphs
      const paragraphs = Array.from(textScope.querySelectorAll(':scope > p'));
      paragraphs.forEach((p) => {
        if (p.textContent.trim()) leftCell.push(p);
      });

      // Bullet/feature items: bare <div>s containing checkmark img + text
      const candidateDivs = Array.from(textScope.querySelectorAll(':scope > div'));
      const listItems = candidateDivs.filter((d) => {
        if (d.classList.contains('nw-text-lg')) return false;
        if (d.querySelector('h1, h2, h3, h4')) return false;
        const text = (d.textContent || '').replace(/ /g, ' ').trim();
        return text.length > 0;
      });

      if (listItems.length > 0) {
        const ul = document.createElement('ul');
        listItems.forEach((itemDiv) => {
          const li = document.createElement('li');
          const text = (itemDiv.textContent || '').replace(/ /g, ' ').trim();
          if (text) {
            li.textContent = text;
            ul.appendChild(li);
          }
        });
        if (ul.children.length > 0) leftCell.push(ul);
      }

      // Existing <ul> in source (e.g. retirement plans variant)
      const existingUl = textScope.querySelector('ul');
      if (existingUl && listItems.length === 0) {
        leftCell.push(existingUl);
      }

      // CTA links (not inside text-lg divs, not wrapping images)
      const ctaLinks = Array.from(textScope.querySelectorAll('a'))
        .filter((a) => !a.closest('.nw-text-lg') && !a.querySelector('img'));
      ctaLinks.forEach((link) => leftCell.push(link));
    }

    // If there's an icon/image in the smaller column, add it to the left cell
    if (imageCol && firstColIsSmall) {
      const icon = imageCol.querySelector('img');
      if (icon) {
        // Insert icon before the heading for visual hierarchy
        leftCell.splice(topHeading ? 1 : 0, 0, icon);
      }
    }
  } else if (firstRowCols.length === 1) {
    // Single column fallback
    const scope = firstRowCols[0].querySelector(':scope > span') || firstRowCols[0];
    const heading = scope.querySelector('h1, h2, h3, h4');
    if (heading) leftCell.push(heading);
    const paras = Array.from(scope.querySelectorAll('p'));
    paras.forEach((p) => { if (p.textContent.trim()) leftCell.push(p); });
  }

  // ---------- Build right cell (image/QR content) ----------
  const rightCell = [];

  // From first row — the image column in 6/6 layouts
  if (firstRowCols.length >= 2) {
    const firstColIsSmall = firstRowCols[0].className.includes('large-3')
      || firstRowCols[0].className.includes('large-4');

    if (!firstColIsSmall) {
      // 6/6 layout: right column has images/QR
      const rightScope = firstRowCols[1].querySelector(':scope > span') || firstRowCols[1];
      const imageLinks = Array.from(rightScope.querySelectorAll('a:has(img)'));
      const standaloneImages = Array.from(rightScope.querySelectorAll('img'))
        .filter((img) => !img.closest('a'));

      if (imageLinks.length > 0) {
        imageLinks.forEach((link) => rightCell.push(link));
      }
      if (standaloneImages.length > 0) {
        standaloneImages.forEach((img) => rightCell.push(img));
      }

      const captions = Array.from(rightScope.querySelectorAll('p'));
      captions.forEach((cap) => {
        if (cap.textContent.trim()) rightCell.push(cap);
      });
    }
  }

  // From second row (if present) — QR codes / app store badges
  if (contentRows.length > 1) {
    const secondRow = contentRows[1];
    const secondRowCols = Array.from(
      secondRow.querySelectorAll(':scope > [class*="columns"][class*="rtc-paragraph"]'),
    );

    secondRowCols.forEach((col) => {
      const scope = col.querySelector(':scope > span') || col;
      const nwTextDiv = scope.querySelector('.nw-text-lg, [class*="text-lg"]');
      const contentScope = nwTextDiv || scope;

      // App store links with QR images
      const appLinks = Array.from(contentScope.querySelectorAll('a:has(img)'));
      if (appLinks.length > 0) {
        appLinks.forEach((link) => rightCell.push(link));
      } else {
        // Standalone images
        const imgs = Array.from(contentScope.querySelectorAll('img'));
        imgs.forEach((img) => rightCell.push(img));
      }

      // Label text (e.g. "Get the iPhone app")
      const textContent = (contentScope.textContent || '')
        .replace(/ /g, ' ').trim()
        .replace(/\s+/g, ' ');
      // Extract plain text (not from image alts)
      const imgTexts = Array.from(contentScope.querySelectorAll('img'))
        .map((img) => img.alt).join('');
      const pureText = textContent.replace(imgTexts, '').trim();
      if (pureText) {
        const label = document.createElement('p');
        label.textContent = pureText;
        rightCell.push(label);
      }
    });
  }

  // Guard: if both cells are empty, bail out
  if (leftCell.length === 0 && rightCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Build cells: single row with two columns matching the columns library pattern
  const cells = [
    [leftCell, rightCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-promo',
    cells,
  });

  element.replaceWith(block);
}
