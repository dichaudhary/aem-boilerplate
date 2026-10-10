/**
 * teaser — the two 1140×312 promo bands (prototype `.teaser--center` = variant `no1`,
 * `.teaser--cta` = variant `cta`; schema stardust/eds-schema/index.json sections[4] and [6]).
 * Decode tier: template-slotted.
 *
 * Authoring (one row, two cells, order-agnostic):
 *   - media cell: the desktop background image, then the ≤1023px rendition
 *   - copy cell: heading (h2), description paragraph(s), CTA `<strong><a>`
 *   The `cta` variant has only the CTA; the whole band links to its href (CSS stretched
 *   link on the authored anchor — no anchor is manufactured).
 * No exemptions: every authored text moves (EW1)
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const MEDIA = 'picture, img';
const isMedia = (el) => el.matches(MEDIA) || !!el.querySelector(MEDIA);
const hasLink = (el) => el.matches('a[href]') || !!el.querySelector('a[href]');

export default function decorate(block) {
  const nodes = [...block.querySelectorAll(':scope > div > div')].flatMap((c) => [...c.children]);
  if (!nodes.length) return;
  const media = nodes.filter(isMedia);
  const heading = nodes.find((n) => n.matches('h1, h2, h3, h4, h5, h6'));
  const ctas = nodes.filter((n) => !isMedia(n) && n !== heading && hasLink(n));
  const body = nodes.filter((n) => !media.includes(n) && n !== heading && !ctas.includes(n));

  const box = document.createElement('div');
  box.className = 'teaser-box';
  if (media.length) {
    const bg = document.createElement('div');
    bg.className = 'teaser-bg';
    bg.append(wrapNode(media[0], 'teaser-bg-desktop'));
    if (media[1]) bg.append(wrapNode(media[1], 'teaser-bg-mobile'));
    box.append(bg);
  }
  const content = document.createElement('div');
  content.className = 'teaser-content';
  if (heading) content.append(wrapNode(heading, 'teaser-title'));
  if (body.length) {
    const desc = document.createElement('div');
    desc.className = 'teaser-description';
    desc.append(...body);
    content.append(desc);
  }
  if (ctas.length) {
    const action = document.createElement('div');
    action.className = 'teaser-action';
    action.append(...ctas);
    content.append(action);
  }
  box.append(content);
  block.replaceChildren(box);
}
