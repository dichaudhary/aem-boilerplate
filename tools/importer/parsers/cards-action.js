/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-action (base: cards).
 * Source: https://www.nationwide.com/personal/investing/retirement-plans/
 * Selector: .nw-card-set .nw-card--action, .nw-multi-option-promo .column.large-4
 *
 * Handles two source patterns:
 *   1. Insurance/investing pages: .nw-multi-option-promo (section with column cards:
 *      SVG icon or img + h3 + p + button link)
 *   2. Homepage: div.custom-tri-promo (3 individual card divs with forms/selects/CTAs)
 *
 * Target table structure (2 columns per card row):
 *   Row 1..N: [icon image] | [heading + description + CTA]
 *
 * Generated: 2026-06-01
 */

function buildInsuranceCard(cardEl, document) {
  // Icon: may be SVG (inline) or img element
  const svg = cardEl.querySelector('svg');
  const img = cardEl.querySelector('img');
  let iconCell = '';

  if (svg) {
    // Convert inline SVG to data URI image for the block table
    const desc = svg.querySelector('desc');
    const altText = desc ? desc.textContent.trim() : 'icon';
    const svgClone = svg.cloneNode(true);
    const serialized = new XMLSerializer().serializeToString(svgClone);
    const dataUri = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(serialized)));
    const iconImg = document.createElement('img');
    iconImg.src = dataUri;
    iconImg.alt = altText;
    iconCell = iconImg;
  } else if (img) {
    if (!img.getAttribute('alt')) {
      const heading = cardEl.querySelector('h3, h4');
      img.setAttribute('alt', heading ? heading.textContent.trim() + ' icon' : 'icon');
    }
    iconCell = img;
  }

  // Body: heading + description + CTA
  const heading = cardEl.querySelector('h3.mopHeading, h3.nw-heading-sm, h3, h4');
  const desc = cardEl.querySelector('p.mopDesc, p');
  const cta = cardEl.querySelector('a.button, a[class*="nw-button"], a[href]');

  const textCell = [];
  if (heading) textCell.push(heading);
  if (desc) textCell.push(desc);
  if (cta) textCell.push(cta);

  return [iconCell, textCell];
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

function buildContentPromoCard(li, document) {
  // Pattern: li > a wrapping (img + h5 + p) or (img + h5) + sibling a with description
  const link = li.querySelector('a');
  if (!link) return null;

  const img = li.querySelector('img');
  const heading = li.querySelector('h5, h4, h3');
  const desc = li.querySelector('p') || li.querySelector('a + a');

  const iconCell = img || '';
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (desc) contentCell.push(desc);
  // If heading is inside an anchor, keep the CTA
  if (heading && heading.closest('a')) {
    const ctaP = document.createElement('p');
    const ctaA = document.createElement('a');
    ctaA.setAttribute('href', heading.closest('a').getAttribute('href') || '#');
    ctaA.textContent = heading.textContent.trim();
    ctaP.appendChild(ctaA);
    contentCell.push(ctaP);
  }

  return [iconCell, contentCell];
}

function buildResourcePromoCard(col, document) {
  // Pattern: div.column > a > (h3 + div.nw-resource-promo__content)
  const link = col.querySelector('a[href]');
  if (!link) return null;

  const heading = col.querySelector('h3, h4');
  const descEl = col.querySelector('.nw-resource-promo__content, p, div:not(:has(h3)):not(:has(h4))');

  const contentCell = [];
  if (heading) {
    const h = document.createElement('h3');
    const a = document.createElement('a');
    a.setAttribute('href', link.getAttribute('href') || '#');
    a.textContent = heading.textContent.trim();
    h.appendChild(a);
    contentCell.push(h);
  }
  if (descEl) {
    const p = document.createElement('p');
    const descLink = document.createElement('a');
    descLink.setAttribute('href', link.getAttribute('href') || '#');
    descLink.textContent = (descEl.textContent || '').trim();
    p.appendChild(descLink);
    contentCell.push(p);
  }

  return ['', contentCell];
}

export default function parse(element, { document }) {
  // Pattern 1: Insurance/investing pages (.nw-multi-option-promo, .nw-card-set)
  // Cards are in .column.large-4 or .nw-card--action children
  const columns = element.querySelectorAll(
    '.nw-card--action, .column.small-12.large-4, .column.large-4, .column.small-12.large-3'
  );
  if (columns.length > 0) {
    // Deduplicate in case selectors overlap
    const uniqueCards = [...new Set(Array.from(columns))];
    const cells = uniqueCards
      .filter((col) => col.querySelector('h3, h4, svg, img'))
      .map((col) => buildInsuranceCard(col, document));
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'cards-action',
      cells,
    });
    element.replaceWith(block);
    return;
  }

  // Pattern 3: section.nw-container > .nw-content-promo > ul > li (annuities/mutual-funds type lists)
  const contentPromoList = element.querySelector('.nw-content-promo ul, ul:has(> li > a > h5), ul:has(> li > a > h4)');
  if (contentPromoList) {
    const listItems = Array.from(contentPromoList.querySelectorAll(':scope > li'));
    const cells = listItems
      .map((li) => buildContentPromoCard(li, document))
      .filter(Boolean);
    if (cells.length > 0) {
      // Include section heading if present
      const sectionHeading = element.querySelector('h2');
      const allCells = [];
      if (sectionHeading) allCells.push([sectionHeading]);
      allCells.push(...cells);
      const block = WebImporter.Blocks.createBlock(document, {
        name: 'cards-action',
        cells: allCells,
      });
      element.replaceWith(block);
      return;
    }
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
