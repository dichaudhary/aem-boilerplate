/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: aashirvaad cleanup
 * Removes non-authorable site chrome and UI artifacts from aashirvaad.com pages.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Slick carousel UI controls (buttons, dots) — interfere with block parsing
    // Found: .slick-prev, .slick-next, .slick-arrow, .slick-dots (lines 646, 746, 747, 887, etc.)
    WebImporter.DOMUtils.remove(element, [
      '.slick-arrow',
      '.slick-dots',
    ]);

    // Card popup three-dots icon — non-authorable UI overlay
    // Found: .cmp-card__three-dots.icon-open-card-popup (lines 896, 943, 990, etc.)
    WebImporter.DOMUtils.remove(element, [
      '.icon-open-card-popup',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Header experience fragment — non-authorable site navigation
    // Found: #header.cmp-experiencefragment--header (line 6)
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--header',
    ]);

    // Footer experience fragment — non-authorable site footer
    // Found: #footer.cmp-experiencefragment--footer (line 1854)
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--footer',
    ]);

    // Search component — non-authorable site search overlay
    // Found: .cmp-search (line 612)
    WebImporter.DOMUtils.remove(element, [
      '.cmp-search',
    ]);

    // Stray iframes (e.g. tracking pixels) and orphan source/link/noscript elements
    // Found: <iframe> (line 2004), <source> (lines 18, 660, 683, etc.), <link> throughout
    WebImporter.DOMUtils.remove(element, [
      'source',
      'link',
      'noscript',
    ]);

    // Remove empty iframe at end of page (tracking pixel, line 2004)
    // Keep content iframes like YouTube (line 837) — only remove iframes with no src
    const emptyIframes = element.querySelectorAll('iframe:not([src])');
    emptyIframes.forEach((iframe) => {
      iframe.remove();
    });
  }
}
