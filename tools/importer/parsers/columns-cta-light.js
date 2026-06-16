/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-cta-light variant.
 * Base: columns (variant: columns-cta-light)
 * Source URL: https://www.nationwide.com/personal/investing/mutual-funds/
 * Source selector: .nw-small-cta:not(:has(bolt-button)):not(:has(a.bolt-button))
 * Generated: 2026-06-01T17:07Z
 *
 * Target table structure (columns block):
 *   Row 1: block name ("columns-cta-light") — added automatically by createBlock
 *   Row 2: 2 cells — [icon image/SVG] | [headline + description with inline links]
 *
 * Source DOM shape (validated against source.html from mutual-funds page):
 *   div.nw-small-cta (light background — no nw-bg-blue-darkest class)
 *     └── div.nw-container
 *           └── section.nw-cta-small
 *                 ├── div.media-object-section.nw-cta-small__icon   // SVG icon or <img>
 *                 ├── div.media-object-section.nw-cta-small__text   // text content
 *                 │     └── div.cta-text
 *                 │           ├── div > <strong>headline</strong>
 *                 │           └── div (description with inline <a> links)
 *                 └── div.media-object-section                      // trailing section (may be empty or have a plain link)
 *
 * Difference from columns-cta:
 *   - Light/white background (no dark styling)
 *   - No bolt-button element
 *   - CTA link may be absent; if present, it's a plain <a> (not bolt-button)
 *   - Primarily informational with inline links in description text
 *
 * Variations handled:
 *   - Icon as inline SVG or external <img> src
 *   - Description with embedded links (phone numbers, external URLs) or plain text
 *   - Trailing .media-object-section may have a plain link or be empty
 *   - Different headline text across pages
 */

export default function parse(element, { document }) {
  // Scope to the inner CTA section when present; otherwise use the element itself.
  const scope = element.querySelector('section.nw-cta-small, .nw-cta-small') || element;

  // ---------- Column 1: icon (SVG or img) ----------
  const iconContainer = scope.querySelector('.nw-cta-small__icon');
  let icon = null;
  if (iconContainer) {
    // Prefer <img> if available; otherwise convert inline SVG to a placeholder image
    const img = iconContainer.querySelector('img');
    if (img) {
      icon = img;
    } else {
      const svg = iconContainer.querySelector('svg');
      if (svg) {
        // Create an img element referencing the SVG data URI for block table compatibility
        const svgData = new XMLSerializer().serializeToString(svg);
        const dataUri = 'data:image/svg+xml;base64,' + btoa(svgData);
        const imgEl = document.createElement('img');
        imgEl.setAttribute('src', dataUri);
        imgEl.setAttribute('alt', svg.getAttribute('name') || 'icon');
        icon = imgEl;
      }
    }
  }

  // ---------- Column 2: headline + description with inline links ----------
  const textContainer = scope.querySelector('.nw-cta-small__text');
  const textCell = [];

  if (textContainer) {
    // Headline: <strong> element, promoted to <h3> for semantic heading
    const headlineStrong = textContainer.querySelector('strong');
    if (headlineStrong) {
      const h = document.createElement('h3');
      h.textContent = (headlineStrong.textContent || '').replace(/ /g, ' ').trim();
      textCell.push(h);
    }

    // Description: sibling <div> elements in .cta-text that are NOT the headline div.
    // Preserve links (e.g. phone numbers, external URLs) as semantic HTML.
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

  // Optional trailing CTA link — may live in a trailing .media-object-section
  // that is NOT the icon or text section. Only include if present (light variant may omit it).
  const trailingSections = Array.from(
    scope.querySelectorAll(':scope > .media-object-section'),
  ).filter((s) => !s.classList.contains('nw-cta-small__icon')
    && !s.classList.contains('nw-cta-small__text'));

  for (const s of trailingSections) {
    const a = s.querySelector('a[href]');
    if (a) {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.setAttribute('href', a.getAttribute('href') || '#');
      link.textContent = (a.textContent || '').trim();
      p.appendChild(link);
      textCell.push(p);
      break;
    }
  }

  // Build the cells matching the columns library example:
  // Row 1 (block name) is added automatically by createBlock; we supply Row 2.
  const cells = [
    [icon || '', textCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-cta-light',
    cells,
  });

  element.replaceWith(block);
}
