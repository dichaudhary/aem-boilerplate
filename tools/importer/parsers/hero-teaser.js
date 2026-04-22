/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-teaser
 * Base block: hero
 * Source: https://aashirvaad.com/
 * Selectors: .cmp-teaser--first-half-center-aligned, .cmp-teaser--cta
 * Generated: 2026-04-22
 *
 * Target table structure (from block library):
 *   Row 1: block name (hero-teaser)
 *   Row 2: background image
 *   Row 3: heading + subheading text + CTA link(s) — all in one cell
 *
 * Live DOM structure (validated via Playwright):
 *   div.teaser (root, matched by selector)
 *     div.cmp-teaser[data-background-image-desktop="..."][style="background-image: url(...)"]
 *       div.cmp-teaser__content
 *         h2.cmp-teaser__title (heading — may be absent in CTA-only variant)
 *         div.cmp-teaser__description > p (subheading — may be absent)
 *         div.cmp-teaser__action-container > div.button > a.cmp-button (CTA link)
 *       NOTE: No <img> element — background image is CSS via data-background-image-desktop
 *
 *   Instance 2 (.cmp-teaser--cta): CTA-only variant
 *     Entire teaser wrapped in a.cmp-teaser__link[href]
 *     Only has action-container with a <button>, no heading/description
 *
 * Handles variations:
 *   - Background image from data-attribute (no <img> tag in live DOM)
 *   - Heading may be h1, h2, or h3 — or absent entirely
 *   - Description may be absent (CTA-only teaser)
 *   - CTA may be <a> or <button> inside an <a.cmp-teaser__link> wrapper
 *   - Multiple CTA links possible
 */
export default function parse(element, { document }) {
  // Extract background image from data attribute or inline style
  // Validated: live DOM uses data-background-image-desktop on .cmp-teaser, no <img> tag
  const teaserEl = element.querySelector('.cmp-teaser') || element;
  const bgImageUrl = teaserEl.getAttribute('data-background-image-desktop')
    || teaserEl.getAttribute('data-background-image-mobile');

  let bgImage = element.querySelector('img');
  if (!bgImage && bgImageUrl) {
    bgImage = document.createElement('img');
    bgImage.src = bgImageUrl;
    bgImage.alt = '';
  }

  // Extract heading
  // Validated: <h2 class="cmp-teaser__title"> in instance 1; absent in instance 2
  const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3');

  // Extract description paragraph
  // Validated: <div class="cmp-teaser__description"><p>...</p></div> in instance 1
  const description = element.querySelector('.cmp-teaser__description p');

  // Extract CTA links
  // Validated: instance 1 has <a class="cmp-button"> inside .cmp-teaser__action-container
  // Instance 2 has <a class="cmp-teaser__link"> wrapping the whole teaser with a <button> inside
  const ctaAnchors = Array.from(
    element.querySelectorAll('.cmp-teaser__action-container a')
  );

  // Fallback: if no <a> in action-container, check for wrapping <a.cmp-teaser__link>
  // Instance 2 uses this pattern with a <button> child — extract the link + button text
  if (ctaAnchors.length === 0) {
    const wrapperLink = element.querySelector('a.cmp-teaser__link');
    if (wrapperLink) {
      const buttonText = element.querySelector('.cmp-button__text');
      const ctaLink = document.createElement('a');
      ctaLink.href = wrapperLink.href;
      ctaLink.textContent = buttonText ? buttonText.textContent.trim() : wrapperLink.textContent.trim();
      ctaAnchors.push(ctaLink);
    }
  }

  const cells = [];

  // Row 1: background image (add if available)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: content cell — heading + subheading + CTA link(s) all in one cell
  // Wrap all content elements in a single container div so they form one cell
  const contentContainer = document.createElement('div');
  let hasContent = false;

  if (heading) {
    contentContainer.appendChild(heading);
    hasContent = true;
  }
  if (description) {
    contentContainer.appendChild(description);
    hasContent = true;
  }
  for (const cta of ctaAnchors) {
    contentContainer.appendChild(cta);
    hasContent = true;
  }

  if (hasContent) {
    cells.push([contentContainer]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-teaser', cells });
  element.replaceWith(block);
}
