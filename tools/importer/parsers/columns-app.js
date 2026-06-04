/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-app variant.
 * Base: columns (variant: columns-app)
 *
 * Handles two source patterns:
 *   Pattern A (Homepage): Two .large-6 columns — left text + bulleted list, right QR image
 *   Pattern B (Retirement plans): Centered h3 heading + .large-3 icon + .large-9 description/list
 *     + two .large-6 QR code columns below
 *
 * Target table structure:
 *   Row 1: [left column: heading + description + list] | [right column: QR/app images]
 */

function parseRetirementApp(element, document) {
  // Pattern B: heading above + icon/description row + QR row
  const heading = element.querySelector('.row.columns.text-center h3, h3[class*="heading-tiempos"]');
  const iconCol = element.querySelector('.large-3.columns.rtc-paragraph');
  const descCol = element.querySelector('.large-9.columns.rtc-paragraph');
  const qrCols = element.querySelectorAll('.large-6.small-12.columns.rtc-paragraph');

  const leftCell = [];
  const rightCell = [];

  // Heading
  if (heading) {
    const h3 = document.createElement('h3');
    h3.textContent = heading.textContent.trim();
    leftCell.push(h3);
  }

  // Description and list from the large-9 column
  if (descCol) {
    const scope = descCol.querySelector(':scope > span') || descCol;
    const p = scope.querySelector('p');
    if (p) leftCell.push(p);
    const ul = scope.querySelector('ul');
    if (ul) leftCell.push(ul);
  }

  // App icon from large-3 column
  if (iconCol) {
    const img = iconCol.querySelector('img');
    if (img) rightCell.push(img);
  }

  // QR codes from the two large-6 columns
  qrCols.forEach((col) => {
    const scope = col.querySelector(':scope > span') || col;
    const imgs = scope.querySelectorAll('img');
    const texts = [];
    // Get text nodes (e.g. "Get the iPhone app")
    const textDiv = scope.querySelector('.nw-text-lg, div');
    if (textDiv) {
      const walker = document.createTreeWalker(textDiv, 4);
      while (walker.nextNode()) {
        const t = walker.currentNode.textContent.trim();
        if (t && !t.startsWith('http')) texts.push(t);
      }
    }
    imgs.forEach((img) => rightCell.push(img));
    texts.forEach((t) => {
      const p = document.createElement('p');
      p.textContent = t;
      rightCell.push(p);
    });
  });

  const cells = [[leftCell, rightCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-app', cells });
  element.replaceWith(block);
}

function parseHomepageApp(element, document) {
  // Pattern A: Two .large-6 columns (left text, right QR)
  const columnDivs = Array.from(
    element.querySelectorAll('.large-6.small-12.columns.rtc-paragraph'),
  );
  const [leftCol, rightCol] = columnDivs;

  const leftCell = [];
  if (leftCol) {
    const leftScope = leftCol.querySelector(':scope > span') || leftCol;
    const intro = leftScope.querySelector('.nw-text-lg, [class*="text-lg"]');
    if (intro) {
      const p = document.createElement('p');
      p.textContent = (intro.textContent || '').replace(/ /g, ' ').trim();
      if (p.textContent) leftCell.push(p);
    }
    const heading = leftScope.querySelector('h1, h2, h3, h4, [class*="heading"]');
    if (heading) leftCell.push(heading);
    const candidateDivs = Array.from(leftScope.querySelectorAll(':scope > div'));
    const listItems = candidateDivs.filter((d) => {
      if (d.classList.contains('nw-text-lg')) return false;
      const text = (d.textContent || '').replace(/ /g, ' ').trim();
      return text.length > 0;
    });
    if (listItems.length > 0) {
      const ul = document.createElement('ul');
      listItems.forEach((itemDiv) => {
        const li = document.createElement('li');
        const text = (itemDiv.textContent || '').replace(/ /g, ' ').trim();
        if (text) { li.textContent = text; ul.appendChild(li); }
      });
      if (ul.children.length > 0) leftCell.push(ul);
    }
  }

  const rightCell = [];
  if (rightCol) {
    const rightScope = rightCol.querySelector(':scope > span') || rightCol;
    const imgs = rightScope.querySelectorAll('img');
    imgs.forEach((img) => rightCell.push(img));
    const caption = rightScope.querySelector('p');
    if (caption) rightCell.push(caption);
  }

  const cells = [[leftCell, rightCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-app', cells });
  element.replaceWith(block);
}

export default function parse(element, { document }) {
  // Detect Pattern B: has a large-3 + large-9 column layout (retirement app promo)
  const hasIconDescLayout = element.querySelector('.large-3.columns.rtc-paragraph') &&
    element.querySelector('.large-9.columns.rtc-paragraph');

  if (hasIconDescLayout) {
    parseRetirementApp(element, document);
    return;
  }

  // Pattern A: Homepage-style two equal columns
  const large6Cols = element.querySelectorAll('.large-6.small-12.columns.rtc-paragraph');
  if (large6Cols.length >= 2) {
    parseHomepageApp(element, document);
    return;
  }
}
