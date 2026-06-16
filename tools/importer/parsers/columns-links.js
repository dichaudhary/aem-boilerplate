/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-links variant.
 * Base: columns (variant: columns-links)
 * Source URL: https://www.nationwide.com/personal/investing/
 * Source selectors: #main-content > div.rtc-component.nw-outer-bottom--xl:nth-of-type(10),
 *                   div.solutions.circle-slider parent containers
 * Generated: 2026-06-02
 *
 * Target table structure (Columns block):
 *   Row 1: block name ("columns-links") — added automatically by createBlock
 *   Row 2+: one row per link — [circular image] | [link text as anchor]
 *
 * Heading (e.g. "Financial options") is output BEFORE the block as default content.
 *
 * Source DOM shape (validated against live page):
 *   div (parent container, may have rtc-component class or be plain div)
 *     └── section.solutions.circle-slider.nw-container
 *           ├── h2 (section heading, e.g. "Financial options")
 *           ├── div.owl-carousel (carousel wrapper)
 *           │     └── div.owl-stage-outer > div.owl-stage
 *           │           └── div.owl-item * N
 *           │                 └── a[href]
 *           │                       ├── div.circle-slider__circle > img
 *           │                       └── p (link label)
 *           └── (optional: owl-nav, owl-dots navigation controls)
 *
 * Variations handled:
 *   - Container may or may not have rtc-component class
 *   - Heading may be h2 or h3
 *   - Links may be inside owl-carousel or directly under section
 *   - Variable number of links (3-8 typically)
 *   - Links may open in same or new window (target attribute)
 */

export default function parse(element, { document }) {
  // ---------- Heading: output as default content before block ----------
  const elementsBeforeBlock = [];

  const heading = element.querySelector('h2, h3');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = (heading.textContent || '').trim();
    elementsBeforeBlock.push(h2);
  }

  // ---------- Extract link items from carousel or direct links ----------
  // Primary: owl-carousel items (live page uses owl-carousel widget)
  let linkItems = Array.from(
    element.querySelectorAll('.owl-item a[href], .owl-stage a[href]')
  );

  // Fallback: if no owl-carousel, look for direct links in the section
  if (linkItems.length === 0) {
    linkItems = Array.from(
      element.querySelectorAll('section a[href], .circle-slider a[href]')
    );
  }

  // Final fallback: any anchor with an image sibling/child inside the element
  if (linkItems.length === 0) {
    linkItems = Array.from(element.querySelectorAll('a[href]')).filter(
      (a) => a.querySelector('img') || a.querySelector('picture')
    );
  }

  // Deduplicate links by href (owl-carousel can clone items)
  const seenHrefs = new Set();
  const uniqueLinks = [];
  linkItems.forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href && !seenHrefs.has(href)) {
      seenHrefs.add(href);
      uniqueLinks.push(a);
    }
  });

  // Guard: if no links found, preserve raw content
  if (uniqueLinks.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // ---------- Build cells: one row per link [image | link] ----------
  const cells = uniqueLinks.map((linkEl) => {
    // Image: look for img inside circle-slider__circle or directly in the link
    const img = linkEl.querySelector('.circle-slider__circle img, img');

    // Link text: from <p> child or textContent of the anchor
    const labelP = linkEl.querySelector('p');
    const linkText = labelP
      ? (labelP.textContent || '').trim()
      : (linkEl.textContent || '').trim();

    // Build image cell
    const imgCell = [];
    if (img) {
      const newImg = document.createElement('img');
      newImg.setAttribute('src', img.getAttribute('src') || '');
      if (img.getAttribute('alt')) {
        newImg.setAttribute('alt', img.getAttribute('alt'));
      }
      imgCell.push(newImg);
    }

    // Build link cell
    const linkCell = [];
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', linkEl.getAttribute('href') || '#');
    a.textContent = linkText;
    p.appendChild(a);
    linkCell.push(p);

    return [imgCell.length > 0 ? imgCell : '', linkCell];
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-links',
    cells,
  });

  element.replaceWith(...elementsBeforeBlock, block);
}
