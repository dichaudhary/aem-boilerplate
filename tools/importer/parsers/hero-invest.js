/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-invest variant.
 * Base block: hero
 * Variant: hero-invest
 * Source URL: https://www.nationwide.com/personal/investing/
 * Source selectors:
 *   - #main-content > div.nw-banner2.nw-banner-inpage--clip.nw-bg-rebrand-vibrant-blue
 *   - #main-content > div.nw-banner2.nw-banner-inpage--clip
 *
 * Target table structure:
 *   Row 1: block name ("hero-invest")
 *   Row 2: Hero image (from .nw-banner-inpage__media img)
 *   Row 3: Heading + description text + primary CTA button + secondary links
 *
 * Content pattern: image + heading + paragraph + button + inline links
 * Used on investing product/landing pages with side image and enrollment CTAs.
 */
export default function parse(element, { document }) {
  // ---------- Image extraction ----------
  // Image may be an <img> tag or a background-image on .nw-banner-inpage__image div
  const mediaContainer = element.querySelector('.nw-banner-inpage__media, .nw-banner-inpage__image');
  let heroImage = mediaContainer
    ? mediaContainer.querySelector('img')
    : element.querySelector('.nw-banner-inpage__image img');

  // Fallback: extract background-image URL from style attribute
  if (!heroImage) {
    const bgDiv = element.querySelector('.nw-banner-inpage__image[style*="background-image"]');
    if (bgDiv) {
      const style = bgDiv.getAttribute('style') || '';
      const match = style.match(/background-image\s*:\s*url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
      if (match) {
        heroImage = document.createElement('img');
        const src = match[1].startsWith('/') ? `https://www.nationwide.com${match[1]}` : match[1];
        heroImage.setAttribute('src', src);
        heroImage.setAttribute('alt', '');
      }
    }
  }

  // ---------- Content extraction ----------
  // Content lives in .nw-banner-inpage__content (validated against source.html)
  const contentContainer = element.querySelector('.nw-banner-inpage__content') || element;

  // Heading: h1 with class nw-heading-tiempos-mdlg (or fallback h1, h2)
  const heading = contentContainer.querySelector(
    'h1.nw-heading-tiempos-mdlg, h1.nw-heading-tiempos-md, h1, h2',
  );

  // Description text: lives in .rtc-paragraph > span
  // Structure varies: span may contain h2 + p elements, or div + p elements
  const rtcParagraph = contentContainer.querySelector('.rtc-paragraph');
  const descriptionSpan = rtcParagraph ? rtcParagraph.querySelector('span') : null;

  // Get subtitle h2 (e.g. "Nationwide can help protect your financial future.")
  const subtitle = descriptionSpan
    ? descriptionSpan.querySelector('h2, h3')
    : contentContainer.querySelector('.rtc-paragraph h2, .rtc-paragraph h3');

  // Get description paragraphs — preserve links within them
  let descriptionPs = descriptionSpan
    ? Array.from(descriptionSpan.querySelectorAll(':scope > p')).filter((p) => {
        return !p.querySelector('a.nw-button--mint, a.button, a.nw-button--primary');
      })
    : [];

  // Fallback: search rtcParagraph or contentContainer directly for <p> elements
  if (descriptionPs.length === 0 && rtcParagraph) {
    descriptionPs = Array.from(rtcParagraph.querySelectorAll('p')).filter((p) => {
      return !p.querySelector('a.nw-button--mint, a.button, a.nw-button--primary');
    });
  }
  if (descriptionPs.length === 0) {
    descriptionPs = Array.from(contentContainer.querySelectorAll('.rtc-component p, .rtc-paragraph p')).filter((p) => {
      return !p.querySelector('a.nw-button--mint, a.button, a.nw-button--primary');
    });
  }

  // Get description divs with meaningful text (fallback for other page structures)
  // Filter out utility link bars (div with only links + pipe separators)
  const descriptionDivs = descriptionSpan
    ? Array.from(descriptionSpan.querySelectorAll(':scope > div')).filter((div) => {
        const links = div.querySelectorAll('a');
        const text = (div.textContent || '').replace(/[|]/g, '').trim();
        if (links.length === 0) return text.length > 0;
        // Utility bar: multiple links separated only by pipes/whitespace
        if (links.length >= 2) {
          const linkText = Array.from(links).map((a) => a.textContent.trim()).join('');
          const nonLinkText = text.replace(new RegExp(Array.from(links).map((a) => a.textContent.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g'), '').trim();
          if (nonLinkText.length < 5) return false;
        }
        const linkText = Array.from(links).map((a) => a.textContent.trim()).join('');
        return text.length > linkText.length + 5;
      })
    : [];

  // Primary CTA button: a.button or a.nw-button--mint
  const primaryCta = contentContainer.querySelector(
    'a.nw-button--mint, a.button, a.nw-button--primary, a.nw-btn',
  );


  // ---------- Empty block guard ----------
  if (!heading && !primaryCta) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // ---------- Build cells array ----------
  const cells = [];

  // Row 2: Hero image (optional — only if present)
  if (heroImage) {
    // Filter out data URI breadcrumb icons (base64 SVGs)
    const src = heroImage.getAttribute('src') || '';
    if (!src.startsWith('data:')) {
      cells.push([heroImage]);
    }
  }

  // Row 3: Content cell — heading + description + CTA + links
  const contentCell = [];

  if (heading) contentCell.push(heading);

  // Add subtitle h2/h3 if present
  if (subtitle) {
    const h2 = document.createElement('h2');
    h2.textContent = subtitle.textContent.trim();
    contentCell.push(h2);
  }

  // Add description paragraphs — clone to preserve inline links
  // Skip utility text (Loading..., ×, NFW disclaimer codes)
  for (const p of descriptionPs) {
    const text = p.textContent.trim();
    if (!text) continue;
    if (text === 'Loading...' || text === '×' || /^NFW-\d+/.test(text)) continue;
    const para = p.cloneNode(true);
    contentCell.push(para);
  }

  // Add description text from divs (fallback for other page structures)
  for (const div of descriptionDivs) {
    const text = (div.textContent || '').trim();
    if (text) {
      const p = document.createElement('p');
      p.textContent = text;
      contentCell.push(p);
    }
  }

  // Primary CTA button
  if (primaryCta) {
    const ctaPara = document.createElement('p');
    const ctaLink = document.createElement('a');
    ctaLink.setAttribute('href', primaryCta.getAttribute('href') || '#');
    ctaLink.textContent = (primaryCta.textContent || '').trim();
    if (primaryCta.getAttribute('title')) {
      ctaLink.setAttribute('title', primaryCta.getAttribute('title'));
    }
    ctaPara.appendChild(ctaLink);
    contentCell.push(ctaPara);
  }


  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  // ---------- Assemble block ----------
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-invest',
    cells,
  });
  element.replaceWith(block);
}
