/**
 * follow — "Follow us @aashirvaad" band.
 * Schema: stardust/eds-schema/index.json → sections[9] (heading, body, CTA).
 * Decode tier: template-slotted.
 *
 * Authoring rows: <h2> title, line paragraph(s), CTA paragraph (<strong><a>).
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  if (node) w.append(node);
  return w;
}

export default function decorate(block) {
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const text = wrapNode(null, 'follow-text');
  const action = wrapNode(null, 'follow-action');
  nodes.forEach((n) => {
    if (n.querySelector('a') && !/^H[1-6]$/.test(n.tagName)) action.append(n);
    else if (n.textContent.trim()) text.append(n);
  });
  const inner = wrapNode(text, 'follow-inner');
  if (action.children.length) inner.append(action);
  block.replaceChildren(inner);
}
