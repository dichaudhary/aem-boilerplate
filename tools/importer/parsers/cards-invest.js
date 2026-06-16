/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-invest
 * Base block: cards
 * Source: https://www.nationwide.com/personal/investing/
 * Generated: 2026-06-02
 *
 * Handles two source structures:
 * 1. Owl carousel (investing landing): div.owl-item > a with img + p
 * 2. List grid (product pages): ul.row > li.column > a with svg/img + h5 + p
 * 3. Direct anchor cards: a:has(h5), a:has(h4), a:has(h3)
 *
 * Target: 2-column cards table (image | linked heading + description)
 */
export default function parse(element, { document }) {
  // Strategy 1: owl-carousel items (JS-rendered investing landing page)
  let items = Array.from(element.querySelectorAll('.owl-item > a, .owl-item a[href]'));

  // Strategy 2: circle-slider anchors (server-side rendering without owl-carousel JS)
  // When fetched without JS, owl classes are absent — anchors are direct children
  // of the carousel wrapper or its stage container.
  if (items.length === 0) {
    const slider = element.querySelector('.circle-slider, .owl-carousel, [class*="carousel"]');
    if (slider) {
      items = Array.from(slider.querySelectorAll('a[href]')).filter(
        (a) => a.querySelector('img') || a.querySelector('p'),
      );
    }
  }

  // Strategy 3: list-based grid (product pages like annuities)
  if (items.length === 0) {
    items = Array.from(element.querySelectorAll('ul.row > li.column'));
  }

  // Strategy 4: direct list items with column class
  if (items.length === 0) {
    items = Array.from(element.querySelectorAll('li.column'));
  }

  // Strategy 5: direct anchor cards with headings
  if (items.length === 0) {
    items = Array.from(element.querySelectorAll('a:has(h5), a:has(h4), a:has(h3)'));
  }

  // Strategy 6: any anchors containing both img and text (generic media-object)
  if (items.length === 0) {
    items = Array.from(element.querySelectorAll('a[href]')).filter(
      (a) => a.querySelector('img') && a.textContent.trim().length > 0,
    );
  }

  // Empty-block guard: bail out without replacing if no items found
  if (items.length === 0) {
    return;
  }

  const cells = items.map((item) => {
    // Determine the anchor element (item itself if it's an <a>, or child <a>)
    const anchor = item.tagName === 'A' ? item : item.querySelector('a');
    const href = anchor ? anchor.getAttribute('href') || '' : '';

    // Extract icon/image (img or svg)
    const icon = item.querySelector('img, svg');

    // Extract heading (h5, h4, h3, h6, h2)
    const heading = item.querySelector('h5, h4, h3, h6, h2');

    // Extract description paragraph
    // For owl-carousel items, the <p> is the label (no separate heading)
    // For list items, the <p> is the description below the heading
    const desc = item.querySelector('p');

    // Build the content cell (column 2: linked heading + description)
    const contentCell = [];

    if (heading) {
      // Product pages: has explicit heading + description
      const h = document.createElement('h3');
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = heading.textContent.trim();
      h.appendChild(link);
      contentCell.push(h);

      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        contentCell.push(p);
      }
    } else if (desc && href) {
      // Carousel items: <p> is the label, no separate heading
      const h = document.createElement('h3');
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = desc.textContent.trim();
      h.appendChild(link);
      contentCell.push(h);
    } else if (href) {
      // Fallback: use anchor text as linked content
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = (anchor ? anchor.textContent.trim() : '') || href;
      p.appendChild(link);
      contentCell.push(p);
    }

    // Set alt text on icon if missing
    if (icon && icon.tagName === 'IMG' && !icon.getAttribute('alt') && (heading || desc)) {
      const altText = heading ? heading.textContent.trim() : desc.textContent.trim();
      icon.setAttribute('alt', altText + ' icon');
    }

    // For SVGs, create an img placeholder with the title as alt
    let imageCell = icon || '';
    if (icon && icon.tagName === 'svg') {
      const titleEl = icon.querySelector('title');
      if (titleEl) {
        const img = document.createElement('img');
        img.setAttribute('alt', titleEl.textContent.trim());
        img.setAttribute('src', '');
        imageCell = img;
      }
    }

    return [imageCell, contentCell];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-invest', cells });
  element.replaceWith(block);
}
