/**
 * loads and decorates the hero-inpage block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div');
  if (!cell) return;

  // The CTA paragraph is the first paragraph containing one or more links
  // (e.g. "Start your quote" + "Or call <tel>").
  const paragraphs = [...cell.querySelectorAll(':scope > p')];
  const ctaPara = paragraphs.find((p) => p.querySelector('a'));

  if (ctaPara) {
    ctaPara.classList.add('cta-row');
    // Promote the first link in the CTA row to a primary button.
    const primary = ctaPara.querySelector('a');
    if (primary) primary.classList.add('button');
  }
}
