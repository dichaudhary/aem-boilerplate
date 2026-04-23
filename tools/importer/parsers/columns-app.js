/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-app.
 * Base: columns. Source: https://www.nationwide.com/
 * Generated: 2026-04-18
 *
 * Columns block: multiple columns, multiple rows.
 * Row 1: Block name
 * Row 2: col1 (heading + bullet list) | col2 (QR image + caption)
 *
 * Source DOM: #p43655 .rtc-component contains two .rtc-paragraph columns.
 * Left column: intro text + h3 heading + checkmark bullet items.
 * Right column: QR code image + caption paragraph.
 */
export default function parse(element, { document }) {
  // Find the two column divs
  // Found in captured HTML: <div class="large-6 small-12 columns rtc-paragraph">
  const columns = element.querySelectorAll('.rtc-paragraph, .columns.large-6');

  const leftCol = columns[0];
  const rightCol = columns[1];

  // Build left column content: heading + bullet list
  const leftContent = [];

  if (leftCol) {
    // Extract intro text
    // Found in captured HTML: <div class="nw-text-lg">Get easy 24/7 support on our</div>
    const introText = leftCol.querySelector('.nw-text-lg, div.nw-text-lg');
    if (introText) {
      const p = document.createElement('p');
      p.textContent = introText.textContent.trim();
      leftContent.push(p);
    }

    // Extract heading
    // Found in captured HTML: <h3 class="nw-heading-tiempos-md">mobile app</h3>
    const heading = leftCol.querySelector('h3, h3.nw-heading-tiempos-md');
    if (heading) leftContent.push(heading);

    // Extract bullet points (checkmark items) and convert to a list
    // Found in captured HTML: <div><img alt="checkmark">&nbsp;Easy way to pay bills</div>
    const bulletDivs = leftCol.querySelectorAll('span > div:not(.nw-text-lg)');
    if (bulletDivs.length > 0) {
      const ul = document.createElement('ul');
      bulletDivs.forEach((div) => {
        // Extract text only (skip checkmark images)
        const text = div.textContent.trim().replace(/^\s*/, '');
        if (text) {
          const li = document.createElement('li');
          li.textContent = text;
          ul.append(li);
        }
      });
      if (ul.children.length > 0) leftContent.push(ul);
    }
  }

  // Build right column content: QR image + caption
  const rightContent = [];

  if (rightCol) {
    // Extract QR code image
    // Found in captured HTML: <img src="./images/2b71fe336a97b6492133be6a1a6d09c1.png" alt="Scan this QR code...">
    const qrImage = rightCol.querySelector('img');
    if (qrImage) rightContent.push(qrImage);

    // Extract caption
    // Found in captured HTML: <p>Scan this QR code to download the app!</p>
    const caption = rightCol.querySelector('p');
    if (caption) rightContent.push(caption);
  }

  const cells = [
    [leftContent, rightContent],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-app', cells });
  element.replaceWith(block);
}
