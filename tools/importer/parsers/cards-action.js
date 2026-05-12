/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-action variant.
 * Base: cards (variant: cards-action)
 * Source URL: https://www.nationwide.com/
 * Source selector: div.custom-tri-promo (3 instances inside div.row.nw-inner-bottom)
 *
 * Target table structure (from cards library example):
 *   Row 1: block name ("cards-action")
 *   Row 2..N: one row per card, 2 columns — [icon image] | [heading + description + CTA content]
 *
 * Because AEM block tables cannot host native <select>/<input>/<form> elements,
 * interactive controls are rendered as authorable markdown-friendly elements:
 *   - <select>: label + bullet list of options + CTA-style link for the submit button
 *   - <form>: label + placeholder line + CTA-style link (href = form action)
 *   - existing <a> button CTAs: preserved as-is
 *
 * The block selector (div.custom-tri-promo) matches each card individually, but
 * we want a single cards block with 3 rows. This parser processes all siblings
 * on the first invocation and replaces the parent row; subsequent invocations
 * (on already-processed siblings) become no-ops.
 */

// Icon alt text + local PNG asset per card heading.
// Icons are downloaded as PNG into content/images/ during post-import asset sync
// so the content is self-contained (no inline data URIs).
const ICON_BY_HEADING = {
  'No login required': { alt: 'house icon', src: './images/house.png' },
  'Find a local agent': { alt: 'pin icon', src: './images/pin.png' },
  'Term life insurance': { alt: 'heart icon', src: './images/heart.png' },
};

// Fallback labels for <select>-driven card (card 1 in this tri-promo)
const SELECT_LABEL = 'Select a service:';
// Fallback labels for form-driven card (card 2)
const FORM_LABEL = 'ZIP Code';
const FORM_PLACEHOLDER = 'Enter your 5 or 9 digit ZIP Code';

function buildCardRow(cardEl, document) {
  // ---------- Column 1: icon image ----------
  const headingText = (cardEl.querySelector('h1, h2, h3, h4, h5, h6')?.textContent || '').trim();
  const iconInfo = ICON_BY_HEADING[headingText] || { alt: 'card icon', src: '' };

  // Always produce a local <img> so the block cell holds a stable image ref.
  let icon = null;
  if (iconInfo.src) {
    icon = document.createElement('img');
    icon.setAttribute('src', iconInfo.src);
    icon.setAttribute('alt', iconInfo.alt);
  }
  // Legacy fallback: if the source had an actual <img>, prefer it (used when
  // nationwide.com swaps to external icons in the future).
  if (!icon) {
    icon = cardEl.querySelector('img');
  }
  if (icon && !icon.getAttribute('alt')) {
    icon.setAttribute('alt', iconInfo.alt);
  }

  // ---------- Column 2: text content (heading + description + authorable controls) ----------
  const textCell = [];

  const heading = cardEl.querySelector('h1, h2, h3, h4, h5, h6, .custom-heading');
  if (heading) textCell.push(heading);

  // Description paragraph(s) that precede any form/select
  const description = cardEl.querySelector(':scope > p, :scope > div > p, p');
  if (description) textCell.push(description);

  // --- Interactive control: <select> dropdown (card 1) ---
  const selectEl = cardEl.querySelector('select');
  if (selectEl) {
    const options = Array.from(selectEl.querySelectorAll('option'))
      .map((o) => (o.textContent || '').trim())
      .filter((t) => t.length > 0);

    if (options.length > 0) {
      const labelP = document.createElement('p');
      const labelStrong = document.createElement('strong');
      labelStrong.textContent = SELECT_LABEL;
      labelP.appendChild(labelStrong);
      textCell.push(labelP);

      const ul = document.createElement('ul');
      options.forEach((opt) => {
        const li = document.createElement('li');
        li.textContent = opt;
        ul.appendChild(li);
      });
      textCell.push(ul);
    }

    // "Go" CTA representing the submit button for the select
    const goLine = document.createElement('p');
    const goLink = document.createElement('a');
    goLink.setAttribute('href', '#');
    goLink.textContent = 'Go';
    goLine.appendChild(goLink);
    textCell.push(goLine);
  }

  // --- Interactive control: <form> (card 2 — find an agent) ---
  const formEl = cardEl.querySelector('form');
  if (formEl) {
    const zipLabelP = document.createElement('p');
    const zipLabelStrong = document.createElement('strong');
    zipLabelStrong.textContent = FORM_LABEL;
    zipLabelP.appendChild(zipLabelStrong);
    textCell.push(zipLabelP);

    const placeholderP = document.createElement('p');
    const placeholderEm = document.createElement('em');
    placeholderEm.textContent = FORM_PLACEHOLDER;
    placeholderP.appendChild(placeholderEm);
    textCell.push(placeholderP);

    // "Go" CTA linked to the find-an-agent search endpoint
    const formAction = formEl.getAttribute('action') || 'https://agency.nationwide.com/search';
    const goLine = document.createElement('p');
    const goLink = document.createElement('a');
    goLink.setAttribute('href', formAction);
    goLink.textContent = 'Go';
    goLine.appendChild(goLink);
    textCell.push(goLine);
  }

  // --- Existing anchor-based CTAs (card 3 — "Start quote") ---
  const anchorCtas = Array.from(
    cardEl.querySelectorAll('a.button, a.nw-button--expand, a[class*="button"]'),
  ).filter((a, i, arr) => arr.indexOf(a) === i);
  anchorCtas.forEach((a) => {
    const ctaLine = document.createElement('p');
    ctaLine.appendChild(a);
    textCell.push(ctaLine);
  });

  return [icon || '', textCell];
}

export default function parse(element, { document }) {
  // The selector matches each card individually, but we want one cards block
  // containing all cards. Process only on the first sibling; no-op otherwise.
  const parent = element.parentElement;
  if (!parent) return;

  const cards = Array.from(parent.querySelectorAll(':scope > .custom-tri-promo'));
  if (cards.length === 0) return;

  // If this element isn't the first card in the row, just detach it — the
  // first-card invocation has already produced (or will produce) the block.
  if (cards[0] !== element) {
    element.remove();
    return;
  }

  // Build one row per card, in source order
  const cells = cards.map((card) => buildCardRow(card, document));

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-action',
    cells,
  });

  // Replace the parent row so all three sibling cards are removed together
  parent.replaceWith(block);
}
