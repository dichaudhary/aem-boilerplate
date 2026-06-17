/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq variant.
 * Source selector: .nw-accordion
 *
 * Source structure (insurance landing pages):
 *   .nw-accordion > .panel-group > .panel.panel-default items
 *   Each panel has:
 *     - .panel-heading h4.panel-title > a.accordion-toggle > span (question)
 *     - .panel-collapse .panel-body > span (answer: paragraphs, lists, links)
 *
 * Target table structure (accordion block):
 *   Row 1: block name ("accordion-faq")
 *   Row 2..N: one row per FAQ item — single cell containing [question heading, answer content]
 */

export default function parse(element, { document }) {
  // Find the accordion container within this element
  const accordion = element.querySelector('.nw-accordion') || element;
  const panels = Array.from(accordion.querySelectorAll('.panel.panel-default, .panel-default'));

  if (panels.length === 0) {
    // No accordion panels found — might be a heading-only sibling, remove it
    element.remove();
    return;
  }

  const cells = [];

  panels.forEach((panel) => {
    // Extract question text from panel heading
    const questionEl = panel.querySelector(
      '.panel-title a span, .panel-title a, .panel-title span, .panel-title',
    );
    const questionText = questionEl ? questionEl.textContent.trim() : '';
    if (!questionText) return;

    const questionHeading = document.createElement('h3');
    questionHeading.textContent = questionText;

    // Extract answer content from panel body
    const panelBody = panel.querySelector('.panel-body');
    const answerElements = [];

    if (panelBody) {
      const spanWrapper = panelBody.querySelector(':scope > span');
      const contentParent = spanWrapper || panelBody;

      Array.from(contentParent.children).forEach((child) => {
        if (child.classList && child.classList.contains('rtc-component') && !child.textContent.trim()) {
          return;
        }
        if (['P', 'UL', 'OL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(child.tagName)) {
          answerElements.push(child);
        } else if (child.tagName === 'DIV' && child.textContent.trim()) {
          const innerPs = Array.from(child.querySelectorAll('p, ul, ol'));
          if (innerPs.length > 0) {
            answerElements.push(...innerPs);
          } else {
            const p = document.createElement('p');
            p.textContent = child.textContent.trim();
            answerElements.push(p);
          }
        }
      });
    }

    cells.push([questionHeading, ...answerElements]);
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'accordion-faq',
    cells,
  });

  element.replaceWith(block);
}
