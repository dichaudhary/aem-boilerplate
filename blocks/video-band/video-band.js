/**
 * video-band — full-width YouTube embed between the offerings and recipes bands.
 * Schema: stardust/eds-schema/index.json → sections[2] (no editable text).
 * Decode tier: template-slotted.
 *
 * Authoring rows: one cell — the iframe's accessible title paragraph and the paragraph holding
 * the embed link (https://www.youtube.com/embed/…). The iframe keeps the source's exact src
 * (same-src embed, dynamic-features #8).
 * @ew-exempt <p> embed source link — video/embed source URL (text-as-metadata)
 * @ew-exempt <p> iframe title — rendered as the iframe's title attribute (text-as-metadata)
 */

export default function decorate(block) {
  const link = block.querySelector('a[href]');
  const src = link ? link.getAttribute('href') : '';
  const frame = document.createElement('div');
  frame.className = 'video-band-frame';
  if (src) {
    const iframe = document.createElement('iframe');
    iframe.id = 'player1';
    iframe.src = src;
    iframe.width = '100%';
    iframe.height = '100%';
    const label = [...block.querySelectorAll('p')].find((p) => !p.querySelector('a'));
    iframe.title = label ? label.textContent.trim() : 'YouTube video player';
    iframe.allowFullscreen = true;
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; '
      + 'gyroscope; picture-in-picture; web-share;');
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.append(iframe);
  }
  block.replaceChildren(frame);
}
