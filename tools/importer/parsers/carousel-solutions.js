/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-solutions.
 * Base block: carousel
 * Source: https://www.nationwide.com/business/insurance/business-owners-policy-bop/
 * Generated: 2026-06-15
 *
 * Each slide row: [image, caption-link]. Section heading/subhead are
 * default content (handled by the transformer), not part of this block.
 *
 * Source structure: section.solutions.circle-slider contains an H2 + subhead
 * (section default content, handled by the transformer) followed by a
 * div.owl-carousel of anchor slides. Each slide is an <a> wrapping
 * div.circle-slider__circle > img and a caption <p>.
 *
 * Target structure (carousel block): one row per slide with two columns —
 * column 1 = slide image, column 2 = caption content (link wrapping the text).
 */
export default function parse(element, { document }) {
  // Locate slide anchors. Validated against source.html: each slide is an
  // <a> directly inside div.owl-carousel. Fall back to scoped anchors that
  // contain a slide circle/image if the carousel container class varies.
  let slides = Array.from(
    element.querySelectorAll('.owl-carousel > a, .circle-slider .owl-carousel > a'),
  );
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll('a')).filter((a) => a.querySelector('img'));
  }

  // Empty-block guard: nothing to build, unwrap the element.
  if (!slides.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  slides.forEach((slide) => {
    const href = slide.getAttribute('href');

    // Column 1: the slide image.
    const img = slide.querySelector('img');

    // Column 2: caption content. Preserve the slide link by wrapping the
    // caption text in an anchor that points at the slide's destination.
    const captionEl = slide.querySelector('p');
    const captionText = (captionEl ? captionEl.textContent : slide.textContent || '').trim();

    let contentCell;
    if (href) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      const target = slide.getAttribute('target');
      if (target) link.setAttribute('target', target);
      const rel = slide.getAttribute('rel');
      if (rel) link.setAttribute('rel', rel);
      link.textContent = captionText;
      contentCell = link;
    } else {
      contentCell = captionText;
    }

    cells.push([img || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-solutions',
    cells,
  });
  element.replaceWith(block);
}
