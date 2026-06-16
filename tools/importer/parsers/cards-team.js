/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-team variant.
 * Base block: cards
 * Source: https://www.nationwide.com/personal/investing/find-financial-professional/
 * Generated: 2026-06-02
 *
 * Handles team member profiles in rtc-paragraph columns:
 *   div.rtc-component > div.rtc-section > div.rtc-container > div.row > div.rtc-paragraph
 *   Each rtc-paragraph contains: span > div with img + h3 + p(title) + p(quote)
 *
 * Target table structure:
 *   Row 1: section heading (optional)
 *   Row 2..N: one row per team member, 2 columns — [image] | [name + title + quote]
 */

export default function parse(element, { document }) {
  const paragraphs = Array.from(element.querySelectorAll('.rtc-paragraph'));

  // Validate: team members have img + h3 name inside span > div
  const teamMembers = paragraphs.filter((p) => {
    const span = p.querySelector('span');
    if (!span) return false;
    const div = span.querySelector('div');
    if (!div) return false;
    return div.querySelector('img') && div.querySelector('h3');
  });

  if (teamMembers.length < 2) {
    return;
  }

  const cells = [];

  // Extract section heading if present
  const sectionHeading = element.querySelector('.rtc-section h3, .rtc-section h2');
  if (sectionHeading) {
    const h = document.createElement('h3');
    h.textContent = sectionHeading.textContent.trim();
    cells.push([[h]]);
  }

  teamMembers.forEach((member) => {
    const span = member.querySelector('span');
    const div = span.querySelector('div');
    const img = div.querySelector('img');
    const name = div.querySelector('h3');
    const titleP = div.querySelector('p strong');
    const quoteP = Array.from(div.querySelectorAll('p')).find(
      (p) => !p.querySelector('strong') && p.textContent.trim().length > 20,
    );

    let imageCell = '';
    if (img) {
      const imgEl = document.createElement('img');
      const src = img.getAttribute('src') || '';
      imgEl.setAttribute('src', src.startsWith('/') ? `https://www.nationwide.com${src}` : src);
      imgEl.setAttribute('alt', img.getAttribute('alt') || '');
      imageCell = imgEl;
    }

    const textCell = [];
    if (name) {
      const h3 = document.createElement('h3');
      h3.textContent = name.textContent.trim();
      textCell.push(h3);
    }
    if (titleP) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = titleP.textContent.trim();
      p.appendChild(strong);
      textCell.push(p);
    }
    if (quoteP) {
      const p = document.createElement('p');
      p.textContent = quoteP.textContent.trim();
      textCell.push(p);
    }

    if (imageCell || textCell.length > 0) {
      cells.push([imageCell, textCell]);
    }
  });

  if (cells.length < 2) {
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-team', cells });
  element.replaceWith(block);
}
