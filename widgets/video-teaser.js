/**
 * video-teaser widget — the home page's YouTube teaser band (prototype section.video-teaser).
 * Authored as a plain default-content link to /widgets/video-teaser.html?src=<embed URL>&title=…
 * (a video URL never rides a block table, D1); the widget block copies the query params into
 * data attributes before this runs.
 */
export default function decorate(widget) {
  const frame = widget.querySelector('.video-teaser-frame');
  const { src, title } = widget.dataset;
  if (!frame || !src || frame.querySelector('iframe')) return;
  const iframe = document.createElement('iframe');
  iframe.title = title || '';
  iframe.loading = 'lazy';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.src = src;
  frame.append(iframe);
}
