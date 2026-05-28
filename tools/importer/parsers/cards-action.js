/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-action variant.
 * Handles two source patterns:
 *   1. Homepage: div.custom-tri-promo (3 individual card divs with forms/selects)
 *   2. Insurance landing: .nw-multi-option-promo (section with column cards: icon + h3 + p + button)
 *
 * Target table structure:
 *   Row 1: block name ("cards-action")
 *   Row 2..N: one row per card, 2 columns — [icon image] | [heading + description + CTA]
 */

function buildInsuranceCard(cardEl, document) {
  const icon = cardEl.querySelector('img');
  const heading = cardEl.querySelector('h3, h2, h4');
  const desc = cardEl.querySelector('p.mopDesc, p');
  const cta = cardEl.querySelector('a.button, a[class*="button"], a');

  const textCell = [];
  if (heading) {
    const h = document.createElement('h3');
    h.textContent = heading.textContent.trim();
    textCell.push(h);
  }
  if (desc) {
    const p = document.createElement('p');
    p.textContent = desc.textContent.trim();
    textCell.push(p);
  }
  if (cta) {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.setAttribute('href', cta.getAttribute('href') || '#');
    link.textContent = cta.textContent.trim();
    p.appendChild(link);
    textCell.push(p);
  }

  return [icon || '', textCell];
}

function buildHomepageCard(cardEl, document) {
  const headingText = (cardEl.querySelector('h1, h2, h3, h4, h5, h6')?.textContent || '').trim();
  const ICON_BY_HEADING = {
    'No login required': { alt: 'house icon', src: './images/house.svg' },
    'Find a local agent': { alt: 'pin icon', src: './images/pin.svg' },
    'Term life insurance': { alt: 'heart icon', src: './images/heart.svg' },
  };
  const iconInfo = ICON_BY_HEADING[headingText] || { alt: 'card icon', src: '' };

  let icon = null;
  if (iconInfo.src) {
    icon = document.createElement('img');
    icon.setAttribute('src', iconInfo.src);
    icon.setAttribute('alt', iconInfo.alt);
  }
  if (!icon) icon = cardEl.querySelector('img');

  const textCell = [];
  const heading = cardEl.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) textCell.push(heading);

  const description = cardEl.querySelector('p');
  if (description) textCell.push(description);

  const selectEl = cardEl.querySelector('select');
  if (selectEl) {
    const options = Array.from(selectEl.querySelectorAll('option'))
      .map((o) => o.textContent.trim())
      .filter((t) => t.length > 0);
    if (options.length > 0) {
      const labelP = document.createElement('p');
      const labelStrong = document.createElement('strong');
      labelStrong.textContent = 'Select a service:';
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
    const goLine = document.createElement('p');
    const goLink = document.createElement('a');
    goLink.setAttribute('href', '#');
    goLink.textContent = 'Go';
    goLine.appendChild(goLink);
    textCell.push(goLine);
  }

  const formEl = cardEl.querySelector('form');
  if (formEl) {
    const zipLabelP = document.createElement('p');
    const zipLabelStrong = document.createElement('strong');
    zipLabelStrong.textContent = 'ZIP Code';
    zipLabelP.appendChild(zipLabelStrong);
    textCell.push(zipLabelP);
    const placeholderP = document.createElement('p');
    const placeholderEm = document.createElement('em');
    placeholderEm.textContent = 'Enter your 5 or 9 digit ZIP Code';
    placeholderP.appendChild(placeholderEm);
    textCell.push(placeholderP);
    const goLine = document.createElement('p');
    const goLink = document.createElement('a');
    goLink.setAttribute('href', formEl.getAttribute('action') || 'https://agency.nationwide.com/search');
    goLink.textContent = 'Go';
    goLine.appendChild(goLink);
    textCell.push(goLine);
  }

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
  // Pattern 1: Insurance landing pages (.nw-multi-option-promo)
  const columns = element.querySelectorAll('.column.small-12.large-4, .column.large-4');
  if (columns.length > 0) {
    const cells = Array.from(columns).map((col) => buildInsuranceCard(col, document));
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'cards-action',
      cells,
    });
    element.replaceWith(block);
    return;
  }

  // Pattern 2: Homepage (div.custom-tri-promo siblings)
  const parent = element.parentElement;
  if (!parent) return;

  const cards = Array.from(parent.querySelectorAll(':scope > .custom-tri-promo'));
  if (cards.length === 0) return;

  if (cards[0] !== element) {
    element.remove();
    return;
  }

  const cells = cards.map((card) => buildHomepageCard(card, document));
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-action',
    cells,
  });
  parent.replaceWith(block);
}
