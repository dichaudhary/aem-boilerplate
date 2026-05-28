/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-info variant.
 * Base: columns (variant: columns-info)
 * Source URL: https://www.nationwide.com/personal/insurance/auto/
 * Source selectors: #p43606.rtc-component, #p42591.rtc-component
 *
 * Target table structure (Columns block with 2 columns):
 *   Row 1: block name ("columns-info") — added automatically by createBlock
 *   Row 2: 2 cells — [left column definitions] | [right column definitions]
 *
 * Heading + intro paragraph are output BEFORE the block as default content.
 * Optional trailing glossary link is output AFTER the block as default content.
 *
 * Source DOM shape (validated against migration-work/block-context/columns-info/source.html):
 *   div.rtc-component
 *     ├── div.rtc-section (header section)
 *     │     └── div.row.columns.text-center
 *     │           ├── h2.nw-heading-tiempos-md | h2.nw-heading-md  (heading)
 *     │           └── .nw-container-article > p | div.nw-heading-sm (intro text)
 *     ├── div.rtc-section (definitions section)
 *     │     └── div.expanded.rtc-container
 *     │           └── div.row.nw-inner-bun--sm
 *     │                 ├── div.large-6.rtc-paragraph (left column)
 *     │                 │     └── span > (h3.nw-heading > a + p) * N  [instance 1]
 *     │                 │     └── span > (div.nw-heading + p/div) * N  [instance 2]
 *     │                 └── div.large-6.rtc-paragraph (right column)
 *     │                       └── (same pattern as left)
 *     └── div.rtc-section (optional trailing section — glossary link)
 *           └── div.large-12.rtc-paragraph > span > p > a
 *
 * Instance 1 (#p43606): "Common auto coverages" — h3>a headings with <p> descriptions
 * Instance 2 (#p42591): "Auto insurance terminology" — div.nw-heading headings with <p>/<div> descriptions
 *
 * Generated: 2026-05-27T00:00:00Z
 */

export default function parse(element, { document }) {
  // ---------- Header: heading + intro paragraph ----------
  // The heading (h2) is always present; intro text may be in .nw-container-article,
  // .nw-heading-sm, or a <p> near the heading. These are output BEFORE the block.
  const elementsBeforeBlock = [];

  const heading = element.querySelector('h2');
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = (heading.textContent || '').trim();
    elementsBeforeBlock.push(h2);
  }

  // Intro paragraph — look for .nw-container-article (instance 2) or .nw-heading-sm (instance 1)
  // that is NOT the heading itself
  const introContainer = element.querySelector('.nw-container-article p, div.nw-heading-sm.nw-container-article');
  let introText = null;
  if (introContainer) {
    // .nw-container-article p (instance 2) or div.nw-heading-sm (instance 1)
    introText = introContainer;
  } else {
    // Fallback: look for .nw-heading-sm div that contains intro text
    const headingSm = element.querySelector('div.nw-heading-sm');
    if (headingSm) introText = headingSm;
  }

  if (introText && (introText.textContent || '').trim()) {
    const p = document.createElement('p');
    p.textContent = (introText.textContent || '').trim();
    elementsBeforeBlock.push(p);
  }

  // ---------- Definitions section: two columns ----------
  // Find the two large-6 column containers anywhere in the element.
  // Both instances have .large-6.rtc-paragraph divs holding the definitions.
  const columnDivs = Array.from(
    element.querySelectorAll('.large-6.rtc-paragraph, div[class*="large-6"][class*="rtc-paragraph"]')
  );

  // Fallback: if large-6 didn't match, try any pair of rtc-paragraph siblings in a row
  const colContainers = columnDivs.length >= 2
    ? [columnDivs[0], columnDivs[1]]
    : Array.from(element.querySelectorAll('.row > div.rtc-paragraph')).slice(0, 2);

  const leftContainer = colContainers[0];
  const rightContainer = colContainers[1];

  const leftCell = [];
  const rightCell = [];

  // Extract definition items from a column container
  // Handles both patterns:
  //   - h3.nw-heading > a + p (instance 1: linked headings)
  //   - div.nw-heading + p/div (instance 2: plain text headings)
  function extractDefinitions(container, targetCell) {
    if (!container) return;

    // Get the span wrapper if present (content lives inside span in source)
    const contentRoot = container.querySelector('span') || container;

    // Gather all direct children that are headings or descriptions
    const children = Array.from(contentRoot.children);

    children.forEach((child) => {
      if (child.tagName === 'H3' || (child.tagName === 'DIV' && child.classList.contains('nw-heading'))) {
        // This is a definition heading
        const h3 = document.createElement('h3');
        const link = child.querySelector('a[href]');
        if (link) {
          // Linked heading (instance 1 pattern)
          const a = document.createElement('a');
          a.setAttribute('href', link.getAttribute('href') || '#');
          a.textContent = (link.textContent || '').trim();
          h3.appendChild(a);
        } else {
          // Plain text heading (instance 2 pattern)
          h3.textContent = (child.textContent || '').trim();
        }
        targetCell.push(h3);
      } else if (child.tagName === 'P' || (child.tagName === 'DIV' && !child.classList.contains('nw-heading'))) {
        // This is a definition description
        const text = (child.textContent || '').trim();
        if (text) {
          const p = document.createElement('p');
          p.textContent = text;
          targetCell.push(p);
        }
      }
    });
  }

  extractDefinitions(leftContainer, leftCell);
  extractDefinitions(rightContainer, rightCell);

  // ---------- Optional trailing section (glossary link) ----------
  // Instance 2 has a trailing rtc-section with a full-width paragraph containing a glossary link.
  // Detect it by looking for a large-12 rtc-paragraph that does NOT contain large-6 columns.
  const elementsAfterBlock = [];
  const trailingFullWidthSections = Array.from(
    element.querySelectorAll('.large-12.rtc-paragraph, div[class*="large-12"][class*="rtc-paragraph"]')
  );
  // Filter out any that are in the header section (they hold the intro text)
  trailingFullWidthSections.forEach((section) => {
    // Skip if this section contains the heading or intro (it's in the header area)
    if (section.querySelector('h2') || section.querySelector('.nw-heading-sm')) return;
    // Skip if this is a parent of the column definitions
    if (section.querySelector('.large-6')) return;

    const trailingParagraph = section.querySelector('p') || section.querySelector('span > p');
    if (trailingParagraph && (trailingParagraph.textContent || '').trim()) {
      const p = document.createElement('p');
      const link = trailingParagraph.querySelector('a[href]');
      if (link) {
        const a = document.createElement('a');
        a.setAttribute('href', link.getAttribute('href') || '#');
        a.textContent = (link.textContent || '').trim();
        // Preserve surrounding text
        const fullText = (trailingParagraph.textContent || '').trim();
        const linkText = (link.textContent || '').trim();
        const parts = fullText.split(linkText);
        const beforeLink = parts[0] || '';
        const afterLink = parts[1] || '';
        if (beforeLink) p.appendChild(document.createTextNode(beforeLink));
        p.appendChild(a);
        if (afterLink) p.appendChild(document.createTextNode(afterLink));
      } else {
        p.textContent = (trailingParagraph.textContent || '').trim();
      }
      if ((p.textContent || '').trim()) {
        elementsAfterBlock.push(p);
      }
    }
  });

  // ---------- Build block table ----------
  const cells = [
    [leftCell, rightCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-info',
    cells,
  });

  // Replace the element with: heading, intro, block, and optional trailing content
  element.replaceWith(...elementsBeforeBlock, block, ...elementsAfterBlock);
}
