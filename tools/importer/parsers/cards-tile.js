/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-tile variant.
 * Base block: cards
 * Source: https://www.nationwide.com/personal/investing/annuities/
 * Generated: 2026-06-01
 *
 * Handles three source patterns:
 *   1. Investing pages: .nw-articles with .nw-articles__tile-container > a.nw-articles__tile
 *      Each anchor wraps: div > img (thumbnail) + span.nw-articles__tile-title
 *      Includes "see all" tile with class nw-articles__tile--seeall (no image)
 *   2. Homepage: section.nw-tile-block with a.nw-tile-block__tile items (background-image tiles)
 *   3. Insurance landing: .nw-content-promo with ul > li > a items (image + heading tiles)
 *
 * Target table structure:
 *   Row 1: block name ("cards-tile")
 *   Row 2..N: one row per tile, 2 columns — [image] | [linked heading]
 *
 * Selectors validated against:
 *   - migration-work/block-context/cards-tile/source.html (.nw-articles pattern)
 *   - page-templates.json instances:
 *       "#main-content > div.nw-container"
 *       "#main-content > section.nw-bg-white.nw-inner-bun--lg"
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

  // Include description paragraph if present
  const desc = tileEl.querySelector('p');
  if (desc) {
    const descText = desc.textContent.trim();
    if (descText && descText !== headingText) {
      const para = document.createElement('p');
      para.textContent = descText;
      textCell.push(para);
    }
  }

  return [imageCell, textCell];
}

function buildArticleTileRow(container, document) {
  const anchor = container.tagName === 'A' ? container : container.querySelector('a.nw-articles__tile, a');
  if (!anchor) return null;

  const href = anchor.getAttribute('href') || '#';

  // Extract the tile image (validated: div > img inside the anchor)
  const img = anchor.querySelector('img');

  // Extract the tile title from span.nw-articles__tile-title or fallback to any span
  const titleSpan = anchor.querySelector('span.nw-articles__tile-title, span');
  const titleText = titleSpan ? titleSpan.textContent.trim() : anchor.textContent.trim();

  if (!titleText) return null;

  // Build image cell (empty string if no image, e.g. "see all" tiles)
  let imageCell = '';
  if (img) {
    if (!img.getAttribute('alt')) {
      img.setAttribute('alt', titleText);
    }
    imageCell = img;
  }

  // Build content cell with linked heading
  const textCell = [];
  const p = document.createElement('p');
  const link = document.createElement('a');
  link.setAttribute('href', href);
  link.textContent = titleText;
  p.appendChild(link);
  textCell.push(p);

  return [imageCell, textCell];
}

export default function parse(element, { document }) {
  // Pattern 1: Investing pages — .nw-articles with .nw-articles__tile-container tiles
  // Validated selectors: .nw-articles__tile-container, a.nw-articles__tile, span.nw-articles__tile-title
  const articleTileContainers = Array.from(element.querySelectorAll('.nw-articles__tile-container'));
  if (articleTileContainers.length > 0) {
    const cells = articleTileContainers
      .map((container) => buildArticleTileRow(container, document))
      .filter(Boolean);
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tile', cells });
      element.replaceWith(block);
      return;
    }
  }

  // Pattern 1b: If element contains a.nw-articles__tile directly (fallback)
  const articleTiles = Array.from(element.querySelectorAll('a.nw-articles__tile'));
  if (articleTiles.length > 0) {
    const cells = articleTiles
      .map((anchor) => buildArticleTileRow(anchor, document))
      .filter(Boolean);
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tile', cells });
      element.replaceWith(block);
      return;
    }
  }

  // Pattern 2: Homepage — section.nw-tile-block with anchor tiles
  const tileAnchors = Array.from(element.querySelectorAll('a.nw-tile-block__tile'));
  if (tileAnchors.length > 0) {
    const cells = tileAnchors.map((tile) => buildHomepageTileRow(tile, document));
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tile', cells });
    element.replaceWith(block);
    return;
  }

  // Pattern 3: Insurance — .nw-content-promo with ul > li > a items
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

  // Pattern 4: Generic fallback — linked cards with image or heading
  const linkedCards = Array.from(element.querySelectorAll('a[href]'))
    .filter((a) => a.querySelector('img') || a.querySelector('h2, h3, h4, h5'));
  if (linkedCards.length > 0) {
    const cells = linkedCards.map((a) => buildInsuranceTileRow(a, document));
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tile', cells });
    element.replaceWith(block);
  }
}
