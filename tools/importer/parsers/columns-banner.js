/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-banner variant.
 * Base: columns (variant: columns-banner)
 * Source URLs: https://www.nationwide.com/personal/investing/mutual-funds/
 *              https://www.nationwide.com/personal/investing/retirement-plans/
 *              https://www.nationwide.com/personal/insurance/auto/
 * Source selectors: .nw-2col-lockup, .rtc-component:has(img):has(ul)
 *
 * Target table structure (Columns block with 2 columns):
 *   Row 1: block name ("columns-banner") — added automatically by createBlock
 *   Row 2: 2 cells — [image] | [heading + text/list content + optional CTA]
 *
 * Source DOM pattern A (.rtc-component with image + list):
 *   div.rtc-component(.nw-bg-gray-pale-25|other bg)
 *     └── div.rtc-section
 *           └── div.expanded.rtc-container
 *                 └── div.row.nw-inner-bun--sm
 *                       ├── div.large-3.small-12.columns.rtc-paragraph (image column)
 *                       │     └── span > img
 *                       └── div.large-9.small-12.columns.rtc-paragraph (content column)
 *                             └── span > h2 + ul > li (or p, or a)
 *
 * Source DOM pattern B (.nw-2col-lockup):
 *   div.nw-2col-lockup
 *     └── div.row
 *           ├── div.columns (image column with img)
 *           └── div.columns (content column with heading + text/list + links)
 *
 * Source DOM pattern C (.nw-banner-inpage — legacy insurance pattern):
 *   div.nw-banner-inpage(.nw-banner-inpage--left|.nw-banner-inpage--right)
 *     └── div.row.small-collapse
 *           ├── div.nw-banner-inpage__media > div.nw-banner-inpage__image > img
 *           └── div.column.large-expand > div.nw-banner-inpage__content
 *                 ├── h2/h3 (heading)
 *                 ├── p (description)
 *                 └── a or p > a (CTA links)
 *
 * Handles variations:
 *   - Image in left column (most common) or right column
 *   - Content as bulleted list (ul > li) or paragraphs (p)
 *   - Optional CTA links (a[href]) in content column
 *   - Various heading levels (h2, h3, h4)
 *   - Content wrapped in span or directly in the column div
 *   - nw-banner-inpage--left / --right layout modifiers
 *
 * Generated: 2026-06-01
 * Validated: 2026-06-01 (Pattern A: mutual-funds, Pattern C: auto insurance)
 */

export default function parse(element, { document }) {
  // ---------- Detect DOM pattern ----------
  const isBannerInpage = element.classList.contains('nw-banner-inpage');

  if (isBannerInpage) {
    // --- Pattern C: .nw-banner-inpage (insurance pages) ---
    parseBannerInpage(element, document);
  } else {
    // --- Pattern A/B: .rtc-component or .nw-2col-lockup (investing pages) ---
    parseRtcColumns(element, document);
  }
}

/**
 * Pattern C: .nw-banner-inpage layout from insurance pages
 * Source DOM:
 *   div.nw-banner-inpage(.nw-banner-inpage--left|.nw-banner-inpage--right)
 *     └── div.row.small-collapse
 *           ├── div.nw-banner-inpage__media > div.nw-banner-inpage__image (background-image or <img>)
 *           └── div.column.large-expand > div.nw-banner-inpage__content
 *                 ├── h2/h3 (heading)
 *                 ├── p (description text)
 *                 └── p > a.button (CTA link)
 */
function parseBannerInpage(element, document) {
  // Image column — may be an <img> tag or a CSS background-image on .nw-banner-inpage__image
  const mediaContainer = element.querySelector('.nw-banner-inpage__media');
  let img = null;

  if (mediaContainer) {
    // First try to find an actual <img> element
    img = mediaContainer.querySelector('img');

    // Fallback: extract background-image URL from .nw-banner-inpage__image div
    if (!img) {
      const bgDiv = mediaContainer.querySelector('.nw-banner-inpage__image');
      if (bgDiv) {
        const style = bgDiv.getAttribute('style') || '';
        const bgMatch = style.match(/background-image\s*:\s*url\(([^)]+)\)/i);
        if (bgMatch) {
          const bgUrl = bgMatch[1].replace(/['"]/g, '');
          img = document.createElement('img');
          img.setAttribute('src', bgUrl);
          img.setAttribute('alt', '');
        }
      }
    }
  }

  // Further fallback: any img in the element
  if (!img) {
    img = element.querySelector('img');
  }

  const imageCell = [];
  if (img) {
    imageCell.push(img);
  }

  // Content column
  const contentContainer = element.querySelector('.nw-banner-inpage__content');
  const contentCell = [];

  if (contentContainer) {
    // Heading
    const heading = contentContainer.querySelector('h2, h3, h1, h4');
    if (heading) {
      contentCell.push(heading);
    }

    // Description paragraphs — include text paragraphs, skip CTA-only paragraphs
    const paragraphs = Array.from(contentContainer.querySelectorAll(':scope > p'));
    paragraphs.forEach((p) => {
      const links = p.querySelectorAll('a[href]');
      // A paragraph is CTA-only if it has a single link that is the only content
      const isCTAOnly = links.length === 1
        && (links[0].classList.contains('button') || links[0].className.includes('nw-button'))
        && p.textContent.trim() === links[0].textContent.trim();
      if (isCTAOnly) {
        // Add as a standalone CTA link
        contentCell.push(p);
      } else if (p.textContent.trim()) {
        contentCell.push(p);
      }
    });
  }

  // Column order based on layout modifier
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

/**
 * Pattern A/B: .rtc-component or .nw-2col-lockup layout from investing pages
 * Two-column row with image on one side and heading + list/text on the other.
 */
function parseRtcColumns(element, document) {
  // Find the column containers inside a .row
  let columnDivs = Array.from(
    element.querySelectorAll('.row > .rtc-paragraph')
  );

  // Fallback: .row > div.columns
  if (columnDivs.length < 2) {
    columnDivs = Array.from(
      element.querySelectorAll('.row > div[class*="columns"]')
    );
  }

  // Further fallback: direct children of a .row
  if (columnDivs.length < 2) {
    const row = element.querySelector('.row');
    if (row) {
      columnDivs = Array.from(row.querySelectorAll(':scope > div'));
    }
  }

  // Determine which column has the image and which has content
  let imageCol = null;
  let contentCol = null;

  for (const col of columnDivs) {
    const hasImg = col.querySelector('img');
    const hasTextContent = col.querySelector('h1, h2, h3, h4, ul, ol');
    if (hasImg && !hasTextContent) {
      imageCol = col;
    } else if (hasTextContent) {
      contentCol = col;
    }
  }

  // Fallback assignment if heuristic didn't work
  if (!imageCol && !contentCol && columnDivs.length >= 2) {
    if (columnDivs[0].querySelector('img')) {
      imageCol = columnDivs[0];
      contentCol = columnDivs[1];
    } else {
      contentCol = columnDivs[0];
      imageCol = columnDivs[1];
    }
  } else if (!imageCol && contentCol && columnDivs.length >= 2) {
    for (const col of columnDivs) {
      if (col !== contentCol && col.querySelector('img')) {
        imageCol = col;
        break;
      }
    }
  }

  // ---------- Extract image cell ----------
  const imageCell = [];
  if (imageCol) {
    const img = imageCol.querySelector('img');
    if (img) {
      imageCell.push(img);
    }
  }

  // ---------- Extract content cell ----------
  const contentCell = [];
  if (contentCol) {
    // Content may be inside a <span> wrapper (rtc-component pattern)
    const contentRoot = contentCol.querySelector(':scope > span') || contentCol;

    // Heading (h2 is most common in this pattern)
    const heading = contentRoot.querySelector('h2, h3, h4, h1');
    if (heading) {
      contentCell.push(heading);
    }

    // Paragraphs — include text paragraphs (not link-only)
    const paragraphs = Array.from(contentRoot.querySelectorAll(':scope > p'));
    paragraphs.forEach((p) => {
      const textContent = (p.textContent || '').trim();
      if (textContent) {
        contentCell.push(p);
      }
    });

    // Lists (ul, ol) — important for this variant
    const lists = Array.from(contentRoot.querySelectorAll(':scope > ul, :scope > ol'));
    lists.forEach((list) => {
      contentCell.push(list);
    });

    // CTA links — standalone anchors or links in a button container
    const ctaContainer = contentRoot.querySelector('.button-body, .nw-button-container');
    if (ctaContainer) {
      const ctaLinks = Array.from(ctaContainer.querySelectorAll('a[href]'));
      ctaLinks.forEach((link) => {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.setAttribute('href', link.getAttribute('href') || '#');
        a.textContent = (link.textContent || '').trim();
        p.appendChild(a);
        contentCell.push(p);
      });
    } else {
      // Check for standalone CTA links not already in paragraphs or lists
      const standaloneLinks = Array.from(
        contentRoot.querySelectorAll(':scope > a[href], :scope > div:not(.row) > a[href]')
      );
      standaloneLinks.forEach((link) => {
        const linkText = (link.textContent || '').trim();
        if (!linkText) return;
        // Skip image-only links
        if (link.querySelector('img') && !linkText.replace(/\s/g, '')) return;
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.setAttribute('href', link.getAttribute('href') || '#');
        a.textContent = linkText;
        p.appendChild(a);
        contentCell.push(p);
      });
    }
  }

  // Guard: if neither column has meaningful content, skip block creation
  if (imageCell.length === 0 && contentCell.length === 0) {
    return;
  }

  // ---------- Determine column order (preserve source order) ----------
  let cells;
  if (imageCol && contentCol) {
    const imageIndex = columnDivs.indexOf(imageCol);
    const contentIndex = columnDivs.indexOf(contentCol);
    if (imageIndex < contentIndex) {
      cells = [[imageCell, contentCell]];
    } else {
      cells = [[contentCell, imageCell]];
    }
  } else {
    // Default: image left, content right
    cells = [[imageCell, contentCell]];
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-banner',
    cells,
  });

  element.replaceWith(block);
}
