/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-inpage.
 * Base block: hero
 * Source URL: https://www.nationwide.com/business/insurance/business-owners-policy-bop/
 * Generated: 2026-06-15.
 *
 * Target structure (hero base block):
 *   Row 1 (optional): image cell (picture/img background) — omitted here because the
 *     source uses a CSS background-image, so the hero renders image-less (no-image).
 *   Row 2: content cell — heading + supporting copy + CTA/links.
 *
 * Notes on the source DOM (validated against source.html):
 *   - Content lives in .nw-banner-inpage__content
 *   - A breadcrumb <nav> precedes the heading — that is navigation chrome, not hero
 *     content, so it is intentionally excluded.
 *   - Heading is <h1 class="nw-heading-tiempos-mdlg">
 *   - Supporting copy + CTAs live inside .rtc-component (paragraphs, links, .nw-text-sm).
 */
export default function parse(element, { document }) {
  // Scope to the inner content container; fall back to the element itself.
  const content = element.querySelector('.nw-banner-inpage__content') || element;

  // Heading (h1 in source; allow other levels for cross-page variation).
  const heading = content.querySelector('h1, h2, h3, [class*="heading"]');

  // Supporting copy + CTAs typically wrapped in .rtc-component.
  const body = content.querySelector('.rtc-component') || content;

  // Optional foreground image (only present if the source ever uses a real <picture>/<img>).
  const image = element.querySelector(
    '.nw-banner-inpage__media picture, .nw-banner-inpage__media img'
  );

  // Collect supporting blocks: paragraphs and supplementary link wrappers.
  // Exclude the breadcrumb nav and the heading itself.
  const contentNodes = [];
  if (heading) contentNodes.push(heading);

  if (body && body !== content) {
    // body is the .rtc-component wrapper — pull its meaningful children directly so
    // breadcrumb/nav siblings are never captured.
    const supporting = Array.from(
      body.querySelectorAll(':scope > span > *, :scope > p, :scope > div')
    );
    supporting.forEach((node) => {
      if (node.closest('nav')) return; // skip any navigation chrome
      contentNodes.push(node);
    });
  } else {
    // Fallback: gather paragraphs and supplementary link containers from content,
    // skipping the breadcrumb nav.
    Array.from(content.querySelectorAll('p, .nw-text-sm')).forEach((node) => {
      if (node.closest('nav')) return;
      if (heading && heading.contains(node)) return;
      contentNodes.push(node);
    });
  }

  // Empty-block guard.
  if (!heading && contentNodes.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Optional image row (single cell) — only when a real image element exists.
  if (image) cells.push([[image]]);
  // Content row (single cell holding heading + supporting copy + CTAs/links).
  cells.push([contentNodes]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-inpage', cells });
  element.replaceWith(block);
}
