/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-cta variant.
 * Base: columns (variant: columns-cta)
 * Source URL: https://www.nationwide.com/personal/investing/
 * Source selectors: #main-content > div.nw-bg-blue-darkest.nw-small-cta,
 *                   #main-content > div.nw-bg-blue-sea-dark.nw-small-cta
 * Generated: 2026-06-01
 *
 * Target table structure (columns block):
 *   Row 1: block name ("columns-cta") — added automatically by createBlock
 *   Row 2: 2 cells — [icon image] | [headline + description with links + CTA button]
 *
 * Source DOM shape (validated against migration-work/block-context/columns-cta/source.html):
 *   div.nw-small-cta
 *     └── div.nw-container
 *           └── section.nw-cta-small
 *                 ├── div.media-object-section.nw-cta-small__icon   // <img> (SVG icon)
 *                 ├── div.media-object-section.nw-cta-small__text   // text content
 *                 │     └── div.cta-text
 *                 │           ├── div > <strong>headline</strong>
 *                 │           └── div (description with <a> phone links)
 *                 └── div.media-object-section                      // CTA button <a>
 *
 * Variations handled:
 *   - Icon as inline base64 SVG or external image src
 *   - Description with embedded links (phone numbers) or plain text
 *   - CTA link in trailing .media-object-section sibling OR inline in text container
 *   - Different background color classes (nw-bg-blue-darkest, nw-bg-blue-sea-dark)
 *   - Different headline text across pages
 */

export default function parse(element, { document }) {
  // Scope to the inner CTA section when present; otherwise use the element itself.
  const scope = element.querySelector('section.nw-cta-small, .nw-cta-small') || element;

  // ---------- Column 1: icon image ----------
  const iconContainer = scope.querySelector('.nw-cta-small__icon');
  const icon = iconContainer ? iconContainer.querySelector('img') : null;

  // ---------- Column 2: headline + description + CTA link ----------
  const textContainer = scope.querySelector('.nw-cta-small__text');
  const textCell = [];

  if (textContainer) {
    // Headline: <strong> element, promoted to <h3> for semantic heading
    const headlineStrong = textContainer.querySelector('strong');
    if (headlineStrong) {
      const h = document.createElement('h3');
      h.textContent = (headlineStrong.textContent || '').replace(/\s+/g, ' ').trim();
      textCell.push(h);
    }

    // Description: sibling <div> elements in .cta-text that are NOT the headline div.
    // Preserve links (e.g. phone numbers) as semantic HTML rather than flattening.
    const textRoot = textContainer.querySelector('.cta-text') || textContainer;
    const descriptionDivs = Array.from(textRoot.querySelectorAll(':scope > div'))
      .filter((d) => !d.querySelector('strong'))
      .filter((d) => (d.textContent || '').trim().length > 0);

    descriptionDivs.forEach((d) => {
      const p = document.createElement('p');
      // Clone child nodes to preserve links and inline formatting
      Array.from(d.childNodes).forEach((node) => {
        p.appendChild(node.cloneNode(true));
      });
      textCell.push(p);
    });
  }

  // CTA link — lives in a trailing sibling .media-object-section (not the icon or text
  // section). Avoid picking up inline phone number links as the CTA.
  let ctaLink = null;

  // 1) Trailing .media-object-section sibling (NOT the icon or text section)
  const trailingSections = Array.from(
    scope.querySelectorAll(':scope > .media-object-section'),
  ).filter((s) => !s.classList.contains('nw-cta-small__icon')
    && !s.classList.contains('nw-cta-small__text'));
  for (const s of trailingSections) {
    const a = s.querySelector('a[href]');
    if (a) { ctaLink = a; break; }
  }

  // 2) Fallback: bolt-button web component (may wrap an <a> or be an <a> itself)
  if (!ctaLink) {
    const bolt = scope.querySelector('bolt-button');
    if (bolt) {
      ctaLink = bolt.querySelector('a[href]') || (bolt.tagName === 'A' ? bolt : null);
    }
  }

  // 3) Fallback: button-style anchor anywhere in the scope (excludes tel: links)
  if (!ctaLink) {
    ctaLink = scope.querySelector(
      'a.bolt-button, a.button, a[class*="nw-button"], a[class*="button"]',
    );
  }

  // 4) Last resort: any non-tel <a href> inside the scope that isn't inside .cta-text
  if (!ctaLink) {
    const allLinks = Array.from(scope.querySelectorAll('a[href]'));
    ctaLink = allLinks.find((a) => {
      const href = a.getAttribute('href') || '';
      return !href.startsWith('tel:') && !a.closest('.cta-text');
    }) || null;
  }

  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', ctaLink.getAttribute('href') || '#');
    a.textContent = (ctaLink.textContent || '').trim();
    p.appendChild(a);
    textCell.push(p);
  }

  // Guard: if no meaningful content was found, skip block creation
  if (!icon && textCell.length === 0) {
    return;
  }

  // Build the cells matching the columns library example:
  // Row 1 (block name) is added automatically by createBlock; we supply Row 2.
  const cells = [
    [icon || '', textCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-cta',
    cells,
  });

  element.replaceWith(block);
}
