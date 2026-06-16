/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-lifecycle variant.
 * Base block: cards
 * Source: https://www.nationwide.com/personal/investing/retirement-plans/
 * Validated: manually against source.html (live validation blocked by networkidle timeout)
 * Generated: 2026-06-02
 *
 * Handles two source patterns:
 *   1. Retirement/product pages: div.rtc-component.nw-bg-gray-pale-25 with
 *      div.rtc-paragraph items containing circular images + linked labels
 *   2. Investing landing: div.nw-bg-gray-pale-25 > section.circle-slider with
 *      div.owl-carousel containing div.owl-item > a (circular image + p label)
 *
 * Target table structure:
 *   Row 1: block name ("cards-lifecycle")
 *   Row 2..N: one row per card, 2 columns — [image] | [linked heading/label]
 *
 * Selectors validated against:
 *   - migration-work/block-context/cards-lifecycle/source.html (rtc-component pattern)
 *   - Live DOM at /personal/investing/ (owl-carousel pattern)
 *   - page-templates.json instances:
 *       "#main-content > div.nw-bg-gray-pale-25:not(.rtc-component):not(.nw-multi-option-promo)"
 *       "#main-content > div.rtc-component.nw-bg-gray-pale-25"
 */

export default function parse(element, { document }) {
  // Content validation: lifecycle cards are circular-image + short-label combos.
  // Bail out if the element contains long-form content (paragraphs > 80 chars),
  // comparison tables, or deeply nested structures that aren't card-like.
  const owlItems = Array.from(element.querySelectorAll('.owl-item > a[href]'));
  const rtcItems = Array.from(element.querySelectorAll('.rtc-paragraph'));

  // Check rtc-paragraph items are actually lifecycle cards (img + short link)
  const validRtcItems = rtcItems.filter((item) => {
    const hasImg = !!item.querySelector('img');
    // Find a link with actual text (skip image-wrapper links which have empty text)
    const links = Array.from(item.querySelectorAll('a[href]'));
    const textLink = links.find((a) => a.textContent.trim().length > 0);
    const linkText = textLink ? textLink.textContent.trim() : '';
    return hasImg && linkText && linkText.length < 80;
  });

  // Must have at least 2 valid card items from either pattern
  if (owlItems.length < 2 && validRtcItems.length < 2) {
    // Not lifecycle content — preserve as default content
    return;
  }

  const cells = [];

  // Extract section heading and subtitle
  const sectionHeading = element.querySelector('h2');
  const sectionSubtitle = element.querySelector('div.nw-heading, div.nw-heading-sm, .nw-heading');

  if (sectionHeading || sectionSubtitle) {
    const headerCell = [];
    if (sectionHeading) {
      const h2 = document.createElement('h2');
      h2.textContent = sectionHeading.textContent.trim();
      headerCell.push(h2);
    }
    if (sectionSubtitle) {
      const p = document.createElement('p');
      p.textContent = sectionSubtitle.textContent.trim();
      headerCell.push(p);
    }
    cells.push([headerCell]);
  }

  if (owlItems.length >= 2) {
    // Pattern 1: owl-carousel items (investing landing page)
    owlItems.forEach((anchor) => {
      const img = anchor.querySelector('img');
      const label = anchor.querySelector('p');
      const href = anchor.getAttribute('href') || '#';
      const labelText = label ? label.textContent.trim() : '';

      let imageCell = '';
      if (img) {
        if (!img.getAttribute('alt') && labelText) {
          img.setAttribute('alt', labelText);
        }
        imageCell = img;
      }

      const textCell = [];
      if (labelText) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = labelText;
        p.appendChild(a);
        textCell.push(p);
      }

      if (imageCell || textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
  } else {
    // Pattern 2: rtc-paragraph items (retirement-plans product pages)
    validRtcItems.forEach((item) => {
      const img = item.querySelector('img');
      // Find link with actual text (skip image-wrapper links)
      const links = Array.from(item.querySelectorAll('a[href]'));
      const link = links.find((a) => a.textContent.trim().length > 0) || links[0];
      const href = link ? link.getAttribute('href') || '#' : '#';
      const linkText = link ? link.textContent.trim() : '';

      let imageCell = '';
      if (img) {
        if (!img.getAttribute('alt') && linkText) {
          img.setAttribute('alt', linkText);
        }
        imageCell = img;
      }

      const textCell = [];
      if (linkText) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = linkText;
        p.appendChild(a);
        textCell.push(p);
      }

      if (imageCell || textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
  }

  // Final guard: need at least header + 2 cards or just 2+ cards
  if (cells.length < 2) {
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-lifecycle', cells });
  element.replaceWith(block);
}
