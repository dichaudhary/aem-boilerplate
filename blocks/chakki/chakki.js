/**
 * chakki — "Meri Chakki" customise-your-atta teaser: a whole-card link with one CTA.
 * Schema: stardust/eds-schema/index.json → sections[6] (one CTA).
 * Decode tier: template-slotted. The card artwork is decorative (CSS background, desktop +
 * mobile crops code-served from this block folder, as on the source).
 *
 * Authoring rows: one CTA paragraph (<strong><a href="https://aashirvaadchakki.com/">…</a>).
 * The authored anchor is the card's link (stretched over the card in CSS) and opens in a new
 * tab as on the source.
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  if (node) w.append(node);
  return w;
}

export default function decorate(block) {
  const nodes = [...block.querySelectorAll(':scope > div > div > *')]
    .filter((n) => n.textContent.trim() || n.querySelector('a, picture, img'));
  const content = wrapNode(null, 'chakki-content');
  nodes.forEach((n) => content.append(n));
  block.querySelectorAll('a[href]').forEach((a) => {
    a.target = '_blank';
  });
  const card = wrapNode(content, 'chakki-card');
  block.replaceChildren(wrapNode(card, 'chakki-inner'));
}
