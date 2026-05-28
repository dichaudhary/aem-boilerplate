/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-tile variant.
 * Handles two source patterns:
 *   1. Homepage: section.nw-tile-block with a.nw-tile-block__tile items (background-image tiles)
 *   2. Insurance landing: .nw-content-promo with ul > li > a items (image + heading tiles)
 *      Also: section.nw-bg-gray-pale-25 with linked article cards
 *
 * Target table structure:
 *   Row 1: block name ("cards-tile")
 *   Row 2..N: one row per tile, 2 columns — [image] | [linked heading]
 */

function extractBackgroundImageUrl(el) {
  if (!el) return null;
  const style = el.getAttribute('style') || '';
  const match = style.match(/background-image\s*:\s*url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
  return match ? match[1] : null;
}

const TILE_IMAGE_BY_HEADING = {
  'Let us protect your financial future, too': './images/tile-financial-future.jpg',
  'The importance of long-term care': './images/tile-long-term-care.jpg',
  'Protect your small business': './images/tile-small-business.jpg',
  'Save an average of $1,032 when you bundle home and car insurance*': './images/tile-bundle.jpg',
  'Easy access to manage your insurance online': './images/tile-manage-online.png',
};

function buildHomepageTileRow(tileAnchor, document) {
  const href = tileAnchor.getAttribute('href') || '#';
  const headingEl = tileAnchor.querySelector('h2, h3, [class*="subheader"]');
  const headingText = (headingEl?.textContent || '').trim();

  const imageWrapper = tileAnchor.querySelector('.nw-tile-block__image');
  let imageCell = '';

  const localSrc = TILE_IMAGE_BY_HEADING[headingText];
  if (localSrc) {
    const img = document.createElement('img');
    img.setAttribute('src', localSrc);
    img.setAttribute('alt', headingText);
    imageCell = img;
  } else {
    const existingImg = imageWrapper?.querySelector('img') || tileAnchor.querySelector('img');
    if (existingImg) {
      if (!existingImg.getAttribute('alt') && headingText) existingImg.setAttribute('alt', headingText);
      imageCell = existingImg;
    } else {
      const bgUrl = extractBackgroundImageUrl(imageWrapper);
      if (bgUrl) {
        const img = document.createElement('img');
        img.setAttribute('src', bgUrl);
        img.setAttribute('alt', headingText || '');
        imageCell = img;
      }
    }
  }

  const textCell = [];
  if (headingEl) {
    const heading = document.createElement('h2');
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.textContent = headingText;
    heading.appendChild(link);
    textCell.push(heading);
  }

  return [imageCell, textCell];
}

function buildInsuranceTileRow(tileEl, document) {
  const anchor = tileEl.tagName === 'A' ? tileEl : tileEl.querySelector('a');
  const href = anchor ? anchor.getAttribute('href') || '#' : '#';

  const img = tileEl.querySelector('img');
  const heading = tileEl.querySelector('h2, h3, h4, h5, h6');
  const headingText = (heading?.textContent || '').trim();

  let imageCell = '';
  if (img) {
    if (!img.getAttribute('alt') && headingText) img.setAttribute('alt', headingText);
    imageCell = img;
  }

  const textCell = [];
  if (headingText) {
    const h = document.createElement('h2');
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.textContent = headingText;
    h.appendChild(link);
    textCell.push(h);
  } else if (anchor) {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.textContent = anchor.textContent.trim() || href;
    p.appendChild(link);
    textCell.push(p);
  }

  return [imageCell, textCell];
}

export default function parse(element, { document }) {
  // Pattern 1: Homepage — section.nw-tile-block with anchor tiles
  const tileAnchors = Array.from(element.querySelectorAll('a.nw-tile-block__tile'));
  if (tileAnchors.length > 0) {
    const cells = tileAnchors.map((tile) => buildHomepageTileRow(tile, document));
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tile', cells });
    element.replaceWith(block);
    return;
  }

  // Pattern 2: Insurance — .nw-content-promo with ul > li > a items
  const contentPromo = element.querySelector('.nw-content-promo');
  if (contentPromo) {
    const items = Array.from(contentPromo.querySelectorAll('ul > li'));
    if (items.length > 0) {
      const cells = items.map((li) => buildInsuranceTileRow(li, document));
      const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tile', cells });
      element.replaceWith(block);
      return;
    }
  }

  // Pattern 3: Insurance — section.nw-bg-gray-pale-25 related resources grid
  const resourceLinks = Array.from(element.querySelectorAll('.nw-content-promo a, .nw-tile-block__tile'));
  if (resourceLinks.length === 0) {
    // Try to find linked cards in grey background sections (related topics)
    const linkedCards = Array.from(element.querySelectorAll('a[href]'))
      .filter((a) => a.querySelector('img') || a.querySelector('h2, h3, h4, h5'));
    if (linkedCards.length > 0) {
      const cells = linkedCards.map((a) => buildInsuranceTileRow(a, document));
      const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tile', cells });
      element.replaceWith(block);
      return;
    }
  }

  if (resourceLinks.length > 0) {
    const cells = resourceLinks.map((a) => buildInsuranceTileRow(a, document));
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tile', cells });
    element.replaceWith(block);
  }
}
