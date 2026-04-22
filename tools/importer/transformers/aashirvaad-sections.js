/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: aashirvaad sections
 * Inserts section breaks (<hr>) and Section Metadata blocks based on template sections.
 * Runs only in afterTransform. Processes sections in reverse order to preserve DOM positions.
 * All section selectors verified against migration-work/cleaned.html.
 *
 * Section selectors from cleaned.html:
 *   1. .color-background-default (line 641)
 *   2. .color-background-default + .color-background-background-2 (line 764)
 *      Fallback: .color-background-background-2:has(.productcategory) — adjacent sibling
 *      selector fails on live DOM because .main-banner sits between the two containers
 *   3. .color-background-gradient-3:has(.aashirvaad-video-teaser) (line 830)
 *   4. .color-background-background-3:has(.dynamicCardsVertwo) (line 846)
 *   5. .color-background-gradient-2 (line 1513)
 *   6. .color-background-background-2:has(.popularproducts) (line 1538)
 *   7. .color-background-gradient-3:has(.cmp-teaser--cta) (line 1628)
 *   8. .color-background-background-2:has(.footprint) (line 1649)
 *   9. .cmp-ourcommunity-teasercarousel-container (line 1726)
 *  10. .color-background-background-2:has(#container-bf16ed3982) (line 1831)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

// Fallback selectors for cases where the template selector does not match the live DOM.
// Section 2: adjacent sibling selector fails on live DOM because .main-banner (not
// .color-background-default) is the direct previous sibling of the product categories container.
// Verified on live page: .color-background-background-2:has(.productcategory) matches (line 764).
const SELECTOR_FALLBACKS = {
  '.color-background-default + .color-background-background-2': '.color-background-background-2:has(.productcategory)',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const document = element.ownerDocument;
    const sections = template.sections;

    // Process in reverse order to avoid shifting DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      let sectionEl = element.querySelector(section.selector);
      // Try fallback selector if primary does not match
      if (!sectionEl && SELECTOR_FALLBACKS[section.selector]) {
        sectionEl = element.querySelector(SELECTOR_FALLBACKS[section.selector]);
      }
      if (!sectionEl) continue;

      // Add Section Metadata block when section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(sectionMetadata);
      }

      // Insert <hr> before each section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
