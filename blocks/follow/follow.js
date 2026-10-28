/**
 * follow — "Follow us" closing band (prototype section.follow, stardust/eds-schema/index.json).
 * Decode tier: template-slotted (fixed composition: heading, line(s) of text, CTA).
 * The source's blank spacer paragraph is modelled as block CSS (whitespace never survives DA).
 */

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function wrapNodes(className, nodes) {
  const w = el('div', className);
  w.append(...nodes);
  return w;
}

export default function decorate(block) {
  if (block.querySelector('.follow-title, .follow-action')) return; // EW9: re-entrant
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const paras = [...block.querySelectorAll('p')];
  const ctas = paras.filter((p) => p.querySelector('a[href]'));
  const texts = paras.filter((p) => !ctas.includes(p) && p.textContent.trim());

  const parts = [];
  if (heading) parts.push(wrapNodes('follow-title', [heading]));
  if (texts.length) parts.push(wrapNodes('follow-text', texts));
  if (ctas.length) parts.push(wrapNodes('follow-action', ctas));
  block.replaceChildren(...parts);
}
