/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-quote variant.
 * Base block: hero (variant)
 * Variant: hero-quote
 * Source URL: https://www.nationwide.com/
 * Source selector: div.nw-home-quote-banner
 *
 * Target table structure (from hero library example):
 *   Row 1: block name ("hero-quote")
 *   Row 2: Background/hero image (optional) — preserved with caption
 *   Row 3: Title (H1) + Subheading (H2) + authorable form content + CTAs
 *
 * Form controls are rendered as authorable markdown-friendly elements
 * (labels + bullet list of select options + text lines + CTA-style links)
 * because AEM block tables cannot host native <select>/<input> elements.
 */
export default function parse(element, { document }) {
  // ---------- Content extraction (validated against source.html) ----------
  const contentContainer = element.querySelector(
    '.nw-banner-inpage__content, .banner-content-custom',
  ) || element;

  const title = contentContainer.querySelector(
    'h1.banner-title, h1.nw-banner-media__title, h1',
  );
  const subheading = contentContainer.querySelector('h2');

  // Hero image lives in the right-hand flex item
  const imageContainer = element.querySelector('.bg-image-container');
  let heroImage = imageContainer ? imageContainer.querySelector('img') : null;
  const imageCaptionEl = imageContainer
    ? imageContainer.querySelector('.custom-img-text, [class*="img-text"]')
    : null;

  // The live page renders the hero image via CSS background-image on .bg-image-container.
  // Extract that URL and synthesize an <img> so the content table has a real image.
  if (!heroImage && imageContainer) {
    // Check inline style first
    const styleAttr = imageContainer.getAttribute('style') || '';
    let bgMatch = styleAttr.match(/background-image\s*:\s*url\(["']?([^"')]+)["']?\)/i);
    // Also scan ancestor <style> blocks that scope to .custom-target-banner .bg-image-container
    if (!bgMatch) {
      const doc = imageContainer.ownerDocument;
      const styleTags = doc ? doc.querySelectorAll('style') : [];
      for (const tag of styleTags) {
        const text = tag.textContent || '';
        const m = text.match(/\.bg-image-container\s*\{[^}]*background-image\s*:\s*url\(["']?([^"')]+)["']?\)/i);
        if (m) {
          bgMatch = m;
          break;
        }
      }
    }
    if (bgMatch) {
      heroImage = document.createElement('img');
      // Use a local asset path (post-processed to PNG) instead of the
      // original nationwide.com URL so the content is self-contained.
      heroImage.setAttribute('src', './images/hero-peyton.png');
    }
  }

  // Native <select> — converted to an authorable label + bullet list
  const selectEl = contentContainer.querySelector('select#customSelectQuote, select');
  const selectOptions = selectEl
    ? Array.from(selectEl.querySelectorAll('option'))
      .map((o) => (o.textContent || '').trim())
      .filter((t) => t.length > 0)
    : [];

  // Supporting links (Find an agent / Explore financial products)
  const supportingLinks = Array.from(
    contentContainer.querySelectorAll('a.find-an-agent-link, a[href*="agency.nationwide.com"], a[href*="/personal/investing"]'),
  ).filter((a, i, arr) => arr.indexOf(a) === i); // dedupe in case selectors overlap

  // ---------- Build Row 2: background/hero image (optional) ----------
  const cells = [];

  if (heroImage) {
    const imageCell = [];
    // Ensure alt text is preserved — source <img> has no alt, apply the caption text
    if (!heroImage.getAttribute('alt')) {
      const altText = imageCaptionEl
        ? (imageCaptionEl.textContent || '').trim()
        : "He's so much more than Peyton Manning.";
      heroImage.setAttribute('alt', altText);
    }
    imageCell.push(heroImage);
    if (imageCaptionEl) {
      const caption = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = (imageCaptionEl.textContent || '').trim();
      caption.appendChild(em);
      imageCell.push(caption);
    }
    cells.push([imageCell]);
  }

  // ---------- Build Row 3: title + subheading + form content + CTAs ----------
  const contentCell = [];
  if (title) contentCell.push(title);
  if (subheading) contentCell.push(subheading);

  // Authorable representation of the <select> — label + bullet list
  if (selectOptions.length > 0) {
    const selectLabel = document.createElement('p');
    const strongLabel = document.createElement('strong');
    strongLabel.textContent = 'Insurance type';
    selectLabel.appendChild(strongLabel);
    contentCell.push(selectLabel);

    const optionList = document.createElement('ul');
    selectOptions.forEach((opt) => {
      const li = document.createElement('li');
      li.textContent = opt;
      optionList.appendChild(li);
    });
    contentCell.push(optionList);
  }

  // Authorable representation of the ZIP input — labeled placeholder line
  const zipInput = contentContainer.querySelector('input#detail-banner__zip-input, input.zip-field');
  if (zipInput) {
    const zipLine = document.createElement('p');
    const zipLabel = document.createElement('strong');
    zipLabel.textContent = 'ZIP Code: ';
    zipLine.appendChild(zipLabel);
    zipLine.appendChild(document.createTextNode('ZIP Code'));
    contentCell.push(zipLine);
  }

  // Primary CTA — the submit button rendered as a link-styled CTA
  const submitBtn = contentContainer.querySelector(
    'input#detail-banner__quote-btn, input.custom-quote-submit',
  );
  if (submitBtn) {
    const ctaLine = document.createElement('p');
    const ctaLink = document.createElement('a');
    ctaLink.setAttribute('href', '#');
    ctaLink.textContent = 'Start your quote';
    ctaLine.appendChild(ctaLink);
    contentCell.push(ctaLine);
  }

  // Supporting links
  supportingLinks.forEach((link) => {
    const linkLine = document.createElement('p');
    linkLine.appendChild(link);
    contentCell.push(linkLine);
  });

  cells.push([contentCell]);

  // ---------- Assemble block ----------
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-quote',
    cells,
  });
  element.replaceWith(block);
}
