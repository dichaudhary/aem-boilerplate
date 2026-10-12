/**
 * nudge — "What makes us No.1?" teaser card over a photographic ground.
 * Schema: stardust/eds-schema/index.json → sections[4] (heading, body, CTA).
 * Decode tier: template-slotted. The roti photograph is decorative (CSS background,
 * code-served from this block folder, desktop + mobile crops as on the source).
 *
 * Authoring rows: <h2> title, description paragraph, CTA paragraph (<strong><a>).
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  if (node) w.append(node);
  return w;
}

export default function decorate(block) {
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const content = wrapNode(null, 'nudge-content');
  const desc = wrapNode(null, 'nudge-desc');
  const action = wrapNode(null, 'nudge-action');
  nodes.forEach((n) => {
    if (/^H[1-6]$/.test(n.tagName)) content.append(wrapNode(n, 'nudge-title'));
    else if (n.querySelector('a')) action.append(n);
    else if (n.textContent.trim()) desc.append(n);
  });
  if (desc.children.length) content.append(desc);
  if (action.children.length) content.append(action);
  const inner = wrapNode(wrapNode(content, 'nudge-card'), 'nudge-inner');
  block.replaceChildren(inner);
}
