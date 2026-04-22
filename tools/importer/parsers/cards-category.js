/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-category variant.
 * Base block: cards
 * Source: https://aashirvaad.com/
 * Generated: 2026-04-22
 *
 * Handles four distinct source patterns:
 * 1. .productcategory — product category grid (image + name links)
 * 2. .cmp-recipe-group — recipe cards (image + title + tag + time/difficulty)
 * 3. .popularproducts — product showcase (image + name + description + CTA)
 * 4. .footprint .cmp-carousel — vision cards (video/media + title + description)
 *
 * Target structure (from library example):
 *   Each row = 1 card: col1 = image/media, col2 = text content (heading, description)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: .productcategory — product category listing
  const categoryItems = element.querySelectorAll('.cmp-categorylist');
  if (categoryItems.length > 0) {
    categoryItems.forEach((item) => {
      const link = item.querySelector('a.cmp-categorylist__item');
      const img = item.querySelector('img.cmp-categorylist__image');
      const nameSpan = item.querySelector('span.cmp-categorylist__name');

      // Col 1: image (wrapped in link if available)
      const col1 = [];
      if (img && link) {
        const a = document.createElement('a');
        a.href = link.href;
        a.appendChild(img.cloneNode(true));
        col1.push(a);
      } else if (img) {
        col1.push(img);
      }

      // Col 2: category name as heading, wrapped in link
      const col2 = [];
      if (nameSpan) {
        const h3 = document.createElement('h3');
        if (link) {
          const a = document.createElement('a');
          a.href = link.href;
          a.textContent = nameSpan.textContent.trim();
          h3.appendChild(a);
        } else {
          h3.textContent = nameSpan.textContent.trim();
        }
        col2.push(h3);
      }

      if (col1.length > 0 || col2.length > 0) {
        cells.push([col1, col2]);
      }
    });

    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
    element.replaceWith(block);
    return;
  }

  // Pattern 2: .cmp-recipe-group — recipe cards
  const recipeCards = element.querySelectorAll('.cmp-recipe-group__carousel-item a.cmp-card--recipe, .cmp-recipe-group__content a.cmp-card--recipe');
  if (recipeCards.length > 0) {
    recipeCards.forEach((card) => {
      const img = card.querySelector('.cmp-card__image img');
      const title = card.querySelector('.cmp-card__title h4, .cmp-card__title h3, .cmp-card__title');
      const tag = card.querySelector('.cmp-card__tag-wrapper p');
      const time = card.querySelector('.cmp-card__time-in-minutes p');
      const difficulty = card.querySelector('.cmp-card__difficulty-level p');

      // Col 1: card image (may be lazy-loaded / empty)
      const col1 = [];
      if (img) {
        col1.push(img);
      }

      // Col 2: text content — title as heading, description as tag + time + difficulty
      const col2 = [];
      if (title) {
        const titleText = title.textContent.trim();
        if (titleText) {
          const h3 = document.createElement('h3');
          if (card.href) {
            const a = document.createElement('a');
            a.href = card.href;
            a.textContent = titleText;
            h3.appendChild(a);
          } else {
            h3.textContent = titleText;
          }
          col2.push(h3);
        }
      }

      // Build description from tag, time, difficulty
      const descParts = [];
      if (tag && tag.textContent.trim()) descParts.push(tag.textContent.trim());
      if (time && time.textContent.trim()) descParts.push(time.textContent.trim());
      if (difficulty && difficulty.textContent.trim()) descParts.push(difficulty.textContent.trim());
      if (descParts.length > 0) {
        const p = document.createElement('p');
        p.textContent = descParts.join(' | ');
        col2.push(p);
      }

      if (col1.length > 0 || col2.length > 0) {
        cells.push([col1, col2]);
      }
    });

    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
    element.replaceWith(block);
    return;
  }

  // Pattern 3: .popularproducts — popular product showcase
  const productItems = element.querySelectorAll('.cmp-popular-products__carousel-item');
  if (productItems.length > 0) {
    productItems.forEach((item) => {
      const img = item.querySelector('.cmp-popular-products__image img');
      const imgLink = item.querySelector('.cmp-popular-products__image a');
      const nameEl = item.querySelector('.cmp-popular-products__product-name');
      const descEl = item.querySelector('.cmp-popular-products__product-details');
      const btnEl = item.querySelector('.cmp-button__text');

      // Col 1: product image (may be lazy-loaded / empty)
      const col1 = [];
      if (img && imgLink) {
        const a = document.createElement('a');
        a.href = imgLink.href;
        a.appendChild(img.cloneNode(true));
        col1.push(a);
      } else if (img) {
        col1.push(img);
      }

      // Col 2: product name as heading + description + CTA
      const col2 = [];
      if (nameEl) {
        const nameText = nameEl.getAttribute('data-title') || nameEl.textContent.trim();
        if (nameText) {
          const h3 = document.createElement('h3');
          h3.textContent = nameText;
          col2.push(h3);
        }
      }
      if (descEl && descEl.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = descEl.textContent.trim();
        col2.push(p);
      }
      if (btnEl && imgLink) {
        const a = document.createElement('a');
        a.href = imgLink.href;
        a.textContent = btnEl.textContent.trim();
        col2.push(a);
      }

      if (col1.length > 0 || col2.length > 0) {
        cells.push([col1, col2]);
      }
    });

    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
    element.replaceWith(block);
    return;
  }

  // Pattern 4: .footprint .cmp-carousel — vision / footprint cards
  const footprintItems = element.querySelectorAll('.cmp-our-foot-print__carousel-item, .cmp-carousel__item');
  if (footprintItems.length > 0) {
    footprintItems.forEach((item) => {
      const img = item.querySelector('.cmp-card__image img');
      const videoEl = item.querySelector('.cmp-video');
      const titleEl = item.querySelector('.cmp-card__title');
      const descEl = item.querySelector('.cmp-card__desc');

      // Col 1: image or video placeholder
      const col1 = [];
      if (img) {
        col1.push(img);
      } else if (videoEl) {
        // Video content — create a placeholder description
        const p = document.createElement('p');
        p.textContent = '(video)';
        col1.push(p);
      }

      // Col 2: title as heading + description
      const col2 = [];
      if (titleEl && titleEl.textContent.trim()) {
        const h3 = document.createElement('h3');
        h3.textContent = titleEl.textContent.trim();
        col2.push(h3);
      }
      if (descEl && descEl.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = descEl.textContent.trim();
        col2.push(p);
      }

      if (col1.length > 0 || col2.length > 0) {
        cells.push([col1, col2]);
      }
    });

    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
    element.replaceWith(block);
    return;
  }

  // Fallback: generic card-like items with image + text
  const genericItems = element.querySelectorAll('.card, [class*="card"], [class*="item"]');
  if (genericItems.length > 0) {
    genericItems.forEach((item) => {
      const img = item.querySelector('img');
      const heading = item.querySelector('h1, h2, h3, h4, h5, h6, [class*="title"], [class*="name"]');
      const desc = item.querySelector('p, [class*="desc"], [class*="details"]');

      const col1 = [];
      if (img) col1.push(img);

      const col2 = [];
      if (heading) {
        const h3 = document.createElement('h3');
        h3.textContent = heading.textContent.trim();
        col2.push(h3);
      }
      if (desc && desc.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        col2.push(p);
      }

      if (col1.length > 0 || col2.length > 0) {
        cells.push([col1, col2]);
      }
    });
  }

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
    element.replaceWith(block);
  }
}
