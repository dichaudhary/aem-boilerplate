/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-bop-tile variant.
 * Base: cards (variant: cards-bop-tile)
 * Source URL: https://www.nationwide.com/business/insurance/business-owners-policy-bop/
 *             (also reused on /lc/resources/cyber-resource-center/ and
 *              /lc/resources/personal-finance/)
 * Generated: 2026-06-15
 *
 * Source selectors (from page-templates.json instances[]):
 *   #main-content > section.nw-container.text-center:nth-of-type(1)
 *   #main-content > section.nw-container.text-center.nw-outer-bottom--xl
 *   #main-content > section.nw-container.text-center.nw-outer-bottom--lg
 *
 * Source structure (validated against cached source.html):
 *   <section class="nw-container text-center">
 *     <div class="nw-content-promo ...">
 *       <ul class="row ...">
 *         <li class="column"><a href="...">
 *           <svg name="truck-outline" aria-labelledby="...">
 *             <desc>truck</desc>
 *           </svg>
 *           <h5>Auto BOP</h5>
 *           <p></p>            <!-- empty, sometimes absent -->
 *         </a></li>
 *         ... (2-up or 3-up rows of tiles)
 *       </ul>
 *     </div>
 *   </section>
 *
 * Each tile is a whole-tile link (<a>) containing an inline SVG icon, a linked
 * H5 heading and (usually) an empty trailing <p>. There is NO body/description
 * copy and no separate CTA — the entire tile navigates via the <a> href.
 *
 * Target table structure (cards base block):
 *   Row 1: block name ("cards-bop-tile")
 *   Row 2..N: one row per tile.
 *     The cards-bop-tile decorator treats a cell whose single child is a
 *     <picture> as the image cell, and everything else as the card body. The
 *     icon here is an inline SVG (Nationwide icon), not a picture, so it is
 *     emitted as an EDS icon token (":name:") inside the single body cell,
 *     directly above the linked heading. This keeps the icon's identity and the
 *     navigation link without depending on any downloaded image asset.
 *
 * The parser produces the same table regardless of how many tiles a section
 * contains (2-up or 3-up) and tolerates a missing/empty trailing <p>.
 */

function iconTokenFromSvg(svg) {
  if (!svg) return null;
  // Prefer the icon identity from the SVG `name` attribute, fall back to the
  // accessible <desc>/<title> text. Normalise to a slug suitable for an EDS
  // icon token (e.g. "open sign" -> "open-sign").
  let raw = svg.getAttribute('name')
    || (svg.querySelector('desc')?.textContent || '')
    || (svg.querySelector('title')?.textContent || '');
  raw = raw.trim().toLowerCase();
  if (!raw) return null;
  const slug = raw.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug ? `:${slug}:` : null;
}

function buildTileRow(tile, document) {
  // The tile is usually an <li> wrapping a single whole-tile <a>. When the
  // fallback selector already gives us the <a>, use the tile itself.
  const linkEl = tile.matches?.('a[href]') ? tile : tile.querySelector('a[href]');
  const href = (linkEl?.getAttribute('href')) || '';

  // ---------- Heading ----------
  const headingEl = tile.querySelector('h5, h2, h3, h4, h6, [class*="heading"]');
  const headingText = (headingEl?.textContent || '').trim();

  // ---------- Icon (inline SVG -> EDS icon token) ----------
  const svg = tile.querySelector('svg');
  const iconToken = iconTokenFromSvg(svg);

  // ---------- Single body cell: icon token + linked heading ----------
  const bodyCell = [];

  if (iconToken) {
    const iconP = document.createElement('p');
    iconP.textContent = iconToken;
    bodyCell.push(iconP);
  }

  if (headingText) {
    // Preserve heading semantics AND the whole-tile link by wrapping an <a>
    // around the heading text. Use H5 to match the source heading level.
    const heading = document.createElement(headingEl?.tagName?.toLowerCase() || 'h5');
    if (href) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = headingText;
      heading.appendChild(link);
    } else {
      heading.textContent = headingText;
    }
    bodyCell.push(heading);
  } else if (href) {
    // Heading missing but the tile still links — emit a linked paragraph.
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.textContent = href;
    p.appendChild(link);
    bodyCell.push(p);
  }

  return [bodyCell];
}

export default function parse(element, { document }) {
  // Collect every tile in source order. Tiles are <li> entries; some reused
  // instances may wrap content directly without an <li>, so fall back to the
  // tile anchors when no list items are found.
  let tiles = Array.from(element.querySelectorAll('ul > li'));
  if (tiles.length === 0) {
    tiles = Array.from(element.querySelectorAll('a[href]'));
  }

  // Build a row per tile, skipping any that yield no content.
  const cells = tiles
    .map((tile) => buildTileRow(tile, document))
    .filter((row) => Array.isArray(row[0]) && row[0].length > 0);

  if (cells.length === 0) {
    // Nothing meaningful to transform — leave the original content in place.
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-bop-tile',
    cells,
  });

  element.replaceWith(block);
}
