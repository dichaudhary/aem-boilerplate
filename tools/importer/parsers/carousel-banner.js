/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-banner
 * Base block: carousel
 * Source: https://aashirvaad.com/
 * Selectors: .main-banner, .cmp-ourcommunity-teasercarousel-container .cmp-carousel
 * Generated: 2026-04-22
 *
 * Handles two carousel structures:
 * 1. Banner-style (.main-banner): slides with <img> tags, .cmp-banner__title, h3.cmp-banner__sub-title
 * 2. Teaser-style (community carousel): slides with data-background-image-desktop attr, .cmp-teaser__title, .cmp-teaser__description
 *
 * Target table: 2 columns per row. Col1 = slide image, Col2 = heading + description + optional CTA link.
 */
export default function parse(element, { document }) {
  // Find all carousel slide items
  // Primary: .cmp-carousel__item (used in both banner and teaser carousels)
  // Fallback: .slick-slide for slick-based carousels
  let slides = element.querySelectorAll('.cmp-carousel__item');
  if (!slides.length) {
    slides = element.querySelectorAll('.slick-slide');
  }
  if (!slides.length) {
    const track = element.querySelector('.slick-track, .cmp-carousel__container');
    if (track) {
      slides = track.children;
    }
  }

  const cells = [];

  Array.from(slides).forEach((slide) => {
    // --- IMAGE (col1) ---
    // Strategy 1: Banner-style - look for <img> tags
    let image = slide.querySelector('img.cmp-banner__image');
    if (!image) {
      const banner = slide.querySelector('.cmp-banner');
      if (banner) {
        image = banner.querySelector(':scope > img');
      }
    }
    if (!image) {
      // General img fallback: first img that is not the logo
      const allImages = slide.querySelectorAll('img');
      for (const img of allImages) {
        if (!img.closest('.cmp-banner__item-logo')) {
          image = img;
          break;
        }
      }
    }

    // Strategy 2: Teaser-style - background image via data attribute
    // If no <img> found, create one from data-background-image-desktop
    if (!image) {
      const teaser = slide.querySelector('.cmp-teaser[data-background-image-desktop]');
      if (teaser) {
        const bgUrl = teaser.getAttribute('data-background-image-desktop');
        if (bgUrl) {
          image = document.createElement('img');
          image.src = bgUrl;
          image.alt = '';
        }
      }
    }

    // Skip slide if no image found at all
    if (!image) return;

    // --- HEADING ---
    // Banner-style: h2.cmp-banner__title
    // Teaser-style: h2.cmp-teaser__title
    // Fallback: any h1/h2
    const heading = slide.querySelector(
      'h2.cmp-banner__title, h1.cmp-banner__title, h3.cmp-banner__title, '
      + 'h2.cmp-teaser__title, h1.cmp-teaser__title, '
      + '[class*="banner__title"], [class*="teaser__title"], '
      + 'h2, h1'
    );

    // --- DESCRIPTION ---
    // Banner-style: h3.cmp-banner__sub-title
    // Teaser-style: .cmp-teaser__description p
    // Fallback: elements with subtitle/description classes
    let descriptionText = '';
    const bannerSubtitle = slide.querySelector('h3.cmp-banner__sub-title, [class*="banner__sub-title"]');
    if (bannerSubtitle) {
      descriptionText = bannerSubtitle.textContent.trim();
    } else {
      const teaserDesc = slide.querySelector('.cmp-teaser__description p, .cmp-teaser__description');
      if (teaserDesc) {
        descriptionText = teaserDesc.textContent.trim();
      }
    }

    // --- CTA ---
    // Both styles use a.cmp-button inside .cmp-button--primary-anchor
    // Teaser-style also has .cmp-teaser__action-container
    const cta = slide.querySelector(
      '.cmp-button--primary-anchor a.cmp-button, '
      + '.cmp-teaser__action-container a.cmp-button, '
      + 'a.cmp-button, .button a[href]'
    );

    // Build content cell (col2): heading + description + optional CTA
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (descriptionText) {
      const descP = document.createElement('p');
      descP.textContent = descriptionText;
      contentCell.push(descP);
    }
    if (cta) contentCell.push(cta);

    // Each row: [image, content]
    cells.push([image, contentCell]);
  });

  // Only create block if we found at least one slide
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-banner', cells });
    element.replaceWith(block);
  }
}
