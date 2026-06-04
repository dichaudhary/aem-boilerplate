/*
 * Accordion FAQ Block
 * Recreate an accordion for FAQ sections
 * https://www.hlx.live/developer/block-collection/accordion
 */

export default function decorate(block) {
  [...block.children].forEach((row) => {
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    summary.append(...label.childNodes);

    const body = document.createElement('div');
    body.className = 'accordion-faq-item-body';
    // Merge all cells after the first into the body
    [...row.children].slice(1).forEach((cell) => {
      body.append(...cell.childNodes);
    });

    const details = document.createElement('details');
    details.className = 'accordion-faq-item';
    details.append(summary, body);
    row.replaceWith(details);
  });
}
