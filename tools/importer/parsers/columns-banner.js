/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-banner variant.
 * Base: columns (variant: columns-banner)
 * Source URL: https://www.nationwide.com/personal/insurance/auto/
 * Source selectors: #p37116.nw-banner-inpage, #p37254.nw-banner-inpage
 *
 * Target table structure (Columns block with 2 columns):
 *   Row 1: block name ("columns-banner")
 *   Row 2: 2 cells — [image] | [heading + description + CTA links]
 *
 * The visual column order follows the source layout modifier:
 *   - nw-banner-inpage--left  → image first (left), content second (right)
 *   - nw-banner-inpage--right → content first (left), image second (right)
 *
 * Source DOM shape (validated against migration-work/block-context/columns-banner/source.html):
 *   div.nw-banner-inpage(.nw-banner-inpage--left|.nw-banner-inpage--right)
 *     └── div.row.small-collapse
 *           ├── div.nw-banner-inpage__media
 *           │     └── div.nw-banner-inpage__image
 *           │           └── <img>
 *           └── div.column.large-expand
 *                 └── div.nw-banner-inpage__content
 *                       ├── <h2> (heading)
 *                       ├── <p>  (description)
 *                       └── <a> or <p><a> (one or more CTA links)
 *
 * Instance 1 (#p37116): Image left, single button-style CTA
 * Instance 2 (#p37254): Image right, multiple plain links
 *
 * Generated: 2026-05-27
 */

export default function parse(element, { document }) {
  // ---------- Image column ----------
  const mediaContainer = element.querySelector('.nw-banner-inpage__image, .nw-banner-inpage__media img');
  const img = mediaContainer
    ? (mediaContainer.tagName === 'IMG' ? mediaContainer : mediaContainer.querySelector('img'))
    : element.querySelector('img');

  const imageCell = [];
  if (img) {
    imageCell.push(img);
  }

  // ---------- Content column ----------
  const contentContainer = element.querySelector('.nw-banner-inpage__content');
  const contentCell = [];

  if (contentContainer) {
    // Heading (h2, h3, or any heading)
    const heading = contentContainer.querySelector('h2, h3, h1, h4');
    if (heading) {
      contentCell.push(heading);
    }

    // Description paragraph(s) — paragraphs that do NOT contain a link as sole child
    const paragraphs = Array.from(contentContainer.querySelectorAll(':scope > p'));
    paragraphs.forEach((p) => {
      const links = p.querySelectorAll('a[href]');
      const hasOnlyLink = links.length > 0 && p.textContent.trim() === links[0].textContent.trim();
      if (!hasOnlyLink) {
        contentCell.push(p);
      }
    });

    // CTA links — collect all anchor elements (may be wrapped in <p> or standalone)
    const allLinks = Array.from(contentContainer.querySelectorAll('a[href]'));
    allLinks.forEach((link) => {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href') || '#');
      a.textContent = (link.textContent || '').trim();
      // Preserve button styling hint if present
      if (link.classList.contains('button') || link.className.includes('nw-button')) {
        a.setAttribute('class', 'button');
      }
      p.appendChild(a);
      contentCell.push(p);
    });
  }

  // ---------- Determine column order based on layout modifier ----------
  // nw-banner-inpage--right means the image is on the right side visually
  const isImageRight = element.classList.contains('nw-banner-inpage--right');

  const cells = isImageRight
    ? [[contentCell, imageCell]]
    : [[imageCell, contentCell]];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-banner',
    cells,
  });

  element.replaceWith(block);
}
