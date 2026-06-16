/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-service variant.
 * Base block: cards
 * Source: https://www.nationwide.com/personal/investing/find-financial-professional/
 * Generated: 2026-06-02
 *
 * Handles icon + text benefit/service items:
 *   div.rtc-component.nw-bg-gray-pale-25 containing:
 *     - Large column with h2 heading + multiple icon+text blocks (inline styled divs)
 *     - Optional side image column
 *
 * Pattern: img (SVG icon, ~59px) floated left + div with span.nw-heading + description text
 *
 * Target table structure:
 *   Row 1: section heading
 *   Row 2..N: one row per service item, 2 columns — [icon image] | [title + description]
 *   Last row (optional): large feature image
 */

function parseResourcePromo(element, document) {
  const heading = element.querySelector('h2');
  const links = Array.from(element.querySelectorAll('.nw-resource-promo a[href], .nw-resource-promo .column a[href]'));

  if (links.length === 0) return;

  const cells = [];
  if (heading) {
    cells.push([[heading]]);
  }

  links.forEach((link) => {
    const h3 = link.querySelector('h3, h4');
    const descEl = link.querySelector('.nw-resource-promo__content, div:not(:has(h3)):not(:has(h4))');
    const href = link.getAttribute('href') || '#';

    const contentCell = [];
    if (h3) {
      const newH3 = document.createElement('h3');
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = h3.textContent.trim();
      newH3.appendChild(a);
      contentCell.push(newH3);
    }
    if (descEl && descEl.textContent.trim()) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = descEl.textContent.trim();
      p.appendChild(a);
      contentCell.push(p);
    }

    if (contentCell.length > 0) {
      cells.push(['', contentCell]);
    }
  });

  if (cells.length < 2) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-service', cells });
  element.replaceWith(block);
}

export default function parse(element, { document }) {
  // Pattern B: .nw-resource-promo (linked cards with h3 + description)
  const resourcePromo = element.querySelector('.nw-resource-promo');
  if (resourcePromo) {
    parseResourcePromo(element, document);
    return;
  }

  // Pattern A: Find the content column (has the h2 + icon items)
  const contentCol = element.querySelector('.rtc-paragraph span');
  if (!contentCol) return;

  // Must have heading + icons
  const heading = contentCol.querySelector('h2');
  const icons = Array.from(contentCol.querySelectorAll('img[src*=".svg"], img[alt]')).filter(
    (img) => {
      const src = img.getAttribute('src') || '';
      const style = img.getAttribute('style') || '';
      return src.includes('.svg') || style.includes('59px') || style.includes('float');
    },
  );

  if (!heading || icons.length < 2) {
    return;
  }

  const cells = [];

  // Extract heading
  const h2 = document.createElement('h2');
  h2.textContent = heading.textContent.trim();
  cells.push([[h2]]);

  // Extract icon + text items
  // Pattern: img followed by a sibling div with margin-left containing span.nw-heading + text
  icons.forEach((icon) => {
    const iconSrc = icon.getAttribute('src') || '';
    const iconAlt = icon.getAttribute('alt') || '';

    // Find the associated text div (sibling or next element with margin-left)
    let textDiv = icon.nextElementSibling;
    // If icon is inside a clear:both div, look at its parent's next sibling
    if (!textDiv || !textDiv.querySelector) {
      const parent = icon.parentElement;
      if (parent) textDiv = parent.nextElementSibling;
    }
    // Sometimes the structure is: img > (same parent) > div[style*=margin-left]
    if (!textDiv || !textDiv.textContent.trim()) {
      const parent = icon.closest('div[style*="clear"]') || icon.parentElement;
      if (parent) {
        textDiv = parent.querySelector('div[style*="margin-left"]');
      }
    }

    const titleEl = textDiv ? textDiv.querySelector('span.nw-heading, strong') : null;
    const titleText = titleEl ? titleEl.textContent.trim() : '';
    const fullText = textDiv ? textDiv.textContent.trim() : '';
    const descText = titleText ? fullText.replace(titleText, '').trim() : fullText;

    let imageCell = '';
    if (iconSrc) {
      const img = document.createElement('img');
      img.setAttribute('src', iconSrc.startsWith('/') ? `https://www.nationwide.com${iconSrc}` : iconSrc);
      img.setAttribute('alt', iconAlt);
      imageCell = img;
    }

    const textCell = [];
    if (titleText) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = titleText;
      p.appendChild(strong);
      textCell.push(p);
    }
    if (descText) {
      const p = document.createElement('p');
      p.textContent = descText;
      textCell.push(p);
    }

    if (imageCell || textCell.length > 0) {
      cells.push([imageCell, textCell]);
    }
  });

  // Check for side image (second rtc-paragraph column with large image)
  const sideImg = element.querySelector('.rtc-paragraph img.rtc-column-image');
  if (sideImg) {
    const src = sideImg.getAttribute('src') || '';
    const img = document.createElement('img');
    img.setAttribute('src', src.startsWith('/') ? `https://www.nationwide.com${src}` : src);
    img.setAttribute('alt', sideImg.getAttribute('alt') || '');
    cells.push([img]);
  }

  if (cells.length < 3) {
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-service', cells });
  element.replaceWith(block);
}
