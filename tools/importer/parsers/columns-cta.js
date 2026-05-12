/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-cta variant.
 * Base: columns (variant: columns-cta)
 * Source URL: https://www.nationwide.com/
 * Source selector: div.nw-small-cta (two instances on the homepage — section 4
 *   "Are you a Nationwide member?" with handshake icon, and section 8 "Have a
 *   business to protect?" with storefront icon)
 *
 * Target table structure (from columns library example):
 *   Row 1: block name ("columns-cta")
 *   Row 2: 2 cells — [icon image] | [headline + optional description + CTA link]
 *
 * Source DOM shape (validated against migration-work/block-context/columns-cta/source.html):
 *   div.nw-small-cta
 *     └── div.nw-container
 *           └── section.nw-cta-small
 *                 ├── div.nw-cta-small__icon                  // media-object-section with <img>
 *                 ├── div.nw-cta-small__text                  // <strong> headline + optional description <div>
 *                 │     └── div.cta-text (sometimes holds the <a>)
 *                 └── div.media-object-section (optional)     // holds the button <a>
 *
 * The CTA link may live either in a trailing `.media-object-section` sibling
 * (section 4) or inline within `.nw-cta-small__text` / `.cta-text` (section 8).
 * The parser handles both placements so a single parser works for both instances.
 */

// Map each CTA headline text to a locally-downloaded PNG icon
// (post-import asset sync — icons stored under content/images/).
const CTA_ICON_BY_HEADLINE = {
  'Are you a Nationwide member?': { src: './images/handshake.png', alt: 'handshake icon' },
  'Have a business to protect?': { src: './images/storefront.png', alt: 'storefront icon' },
};

export default function parse(element, { document }) {
  // Scope to the inner CTA section when present; otherwise use the element itself.
  const scope = element.querySelector('section.nw-cta-small, .nw-cta-small') || element;

  // ---------- Column 1: icon image ----------
  // Key by headline text so both known CTAs (member / business) use the
  // correct locally-hosted icon. Fall back to an existing <img> if the
  // heading doesn't match the map (forward-compatibility).
  const headlineStrongEl = scope.querySelector('.nw-cta-small__text strong');
  const headlineText = (headlineStrongEl?.textContent || '').replace(/ /g, ' ').trim();
  const iconInfo = CTA_ICON_BY_HEADLINE[headlineText];
  let icon = null;
  if (iconInfo) {
    icon = document.createElement('img');
    icon.setAttribute('src', iconInfo.src);
    icon.setAttribute('alt', iconInfo.alt);
  }
  if (!icon) {
    const iconContainer = scope.querySelector('.nw-cta-small__icon');
    icon = iconContainer ? iconContainer.querySelector('img') : null;
  }

  // ---------- Column 2: headline + optional description + CTA link ----------
  const textContainer = scope.querySelector('.nw-cta-small__text');
  const textCell = [];

  if (textContainer) {
    // Headline is a <strong> (optionally wrapped in a <div>)
    const headlineStrong = textContainer.querySelector('strong');
    if (headlineStrong) {
      // Promote <strong> to an <h3> so it renders as a heading in the block
      const h = document.createElement('h3');
      h.textContent = (headlineStrong.textContent || '').replace(/ /g, ' ').trim();
      textCell.push(h);
    }

    // Description: any <div> inside .cta-text (or .nw-cta-small__text) that does
    // NOT contain the <strong> headline and has visible text content.
    const textRoot = textContainer.querySelector('.cta-text') || textContainer;
    const descriptionDivs = Array.from(textRoot.querySelectorAll(':scope > div'))
      .filter((d) => !d.querySelector('strong'))
      .filter((d) => (d.textContent || '').trim().length > 0);
    descriptionDivs.forEach((d) => {
      const p = document.createElement('p');
      p.textContent = (d.textContent || '').replace(/ /g, ' ').trim();
      textCell.push(p);
    });
  }

  // CTA link — may live in a trailing sibling .media-object-section, or inline
  // inside .nw-cta-small__text / .cta-text. Prefer the button-style anchor.
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

  // 2) Fallback: button-style anchor anywhere in the scope
  if (!ctaLink) {
    ctaLink = scope.querySelector(
      'a.button, a[class*="nw-button"], a[class*="button"]',
    );
  }

  // 3) Last resort: any <a href> inside the text container
  if (!ctaLink && textContainer) {
    ctaLink = textContainer.querySelector('a[href]');
  }

  if (ctaLink) {
    // Wrap in a paragraph for consistent rendering in the column cell
    const p = document.createElement('p');
    // Clone the anchor to avoid moving it out from under other potential
    // references; keep href and visible text.
    const a = document.createElement('a');
    a.setAttribute('href', ctaLink.getAttribute('href') || '#');
    a.textContent = (ctaLink.textContent || '').trim();
    p.appendChild(a);
    textCell.push(p);
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
