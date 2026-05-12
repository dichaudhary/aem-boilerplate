/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-tile variant.
 * Base: cards (variant: cards-tile)
 * Source URL: https://www.nationwide.com/
 * Source selectors: section.nw-tile-block (section#p30097 with 2 tiles,
 *                   section#p30087 with 3 tiles).
 *
 * Each tile is an <a class="nw-tile-block__tile"> containing:
 *   - a .nw-tile-block__image div (image provided either as a nested <img>
 *     in the cleaned/local HTML OR as a CSS `background-image:url(...)` on
 *     the live page)
 *   - a .nw-tile-block__content-subheader <h2> as the tile heading
 *
 * Target table structure (from cards library example):
 *   Row 1: block name ("cards-tile")
 *   Row 2..N: one row per tile, 2 columns — [image] | [linked heading]
 *
 * The parser produces the same table regardless of how many tiles the
 * section contains (2, 3, or more) and regardless of whether the image is
 * expressed as <img> or as a background-image style.
 */

function extractBackgroundImageUrl(el) {
  if (!el) return null;
  const style = el.getAttribute('style') || '';
  const match = style.match(/background-image\s*:\s*url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
  return match ? match[1] : null;
}

// Map each tile heading to a locally-downloaded asset (post-import asset sync).
// Downloaded URLs:
//   vcp-lg-hp-financial-future-newsib-2_tcm108-19797.jpg → tile-financial-future.jpg
//   vcp-med-hp-longtermcare-chess_tcm108-20410.jpg       → tile-long-term-care.jpg
//   vcp-lg-hp-smallbiz-landscaping_tcm108-19096.jpg      → tile-small-business.jpg
//   vcp-sm-hp-bundle-driving_tcm108-18981.jpg            → tile-bundle.jpg
//   HP-VCP-312x185-10418_7997-Easy%20access ... .png     → tile-manage-online.png
const TILE_IMAGE_BY_HEADING = {
  'Let us protect your financial future, too': './images/tile-financial-future.jpg',
  'The importance of long-term care': './images/tile-long-term-care.jpg',
  'Protect your small business': './images/tile-small-business.jpg',
  'Save an average of $1,032 when you bundle home and car insurance*': './images/tile-bundle.jpg',
  'Easy access to manage your insurance online': './images/tile-manage-online.png',
};

function buildTileRow(tileAnchor, document) {
  const href = tileAnchor.getAttribute('href') || '#';

  // ---------- Heading ----------
  const headingEl = tileAnchor.querySelector(
    'h2.nw-tile-block__content-subheader, h2, h3, [class*="subheader"]',
  );
  const headingText = (headingEl?.textContent || '').trim();

  // ---------- Image cell ----------
  // Prefer the locally-downloaded asset keyed by heading. Fall back to an existing
  // <img> or to the CSS background-image URL (for forward compatibility).
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
      if (!existingImg.getAttribute('alt') && headingText) {
        existingImg.setAttribute('alt', headingText);
      }
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

  // ---------- Text cell: linked heading ----------
  // Preserve heading semantics AND the tile link by wrapping an <a> around
  // the heading text inside an <h2>.
  const textCell = [];
  if (headingEl) {
    const heading = document.createElement('h2');
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.textContent = headingText;
    heading.appendChild(link);
    textCell.push(heading);
  } else if (href && href !== '#') {
    // Heading missing but link exists — still emit a linked text cell.
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.textContent = href;
    p.appendChild(link);
    textCell.push(p);
  }

  return [imageCell, textCell];
}

export default function parse(element, { document }) {
  // Collect every tile anchor within this section, in source order.
  const tileAnchors = Array.from(
    element.querySelectorAll('a.nw-tile-block__tile'),
  );

  if (tileAnchors.length === 0) {
    // Nothing to transform — leave the element alone.
    return;
  }

  const cells = tileAnchors.map((tile) => buildTileRow(tile, document));

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-tile',
    cells,
  });

  element.replaceWith(block);
}
