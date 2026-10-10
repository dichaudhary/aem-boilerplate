/**
 * video-teaser — the full-width YouTube band (prototype `.section--video > .video-teaser`,
 * schema stardust/eds-schema/index.json sections[2]). Decode tier: template-slotted.
 *
 * Authoring: the YouTube URL is a plain link in default content directly ABOVE the block,
 * in the same section (David's Model D1 — embed URLs are never authored as a block table);
 * the block reabsorbs that link and builds the iframe. A link inside the block's own cell is
 * read the same way (decode fallback). The link's paragraph stays in the block, hidden
 * (`.video-source`), so the authored text survives for the workspace (EW1/EW5). The block tags
 * its wrapper `full-bleed`: the band is 83% of the viewport on the live page, not of the
 * 1366px content cap.
 * No exemptions: the source link moves (hidden), nothing is rebuilt.
 */

const VIDEO = /youtube\.com|youtu\.be/i;

function embedUrl(href) {
  try {
    const u = new URL(href);
    if (u.pathname.startsWith('/embed/')) return href;
    const id = u.hostname.includes('youtu.be') ? u.pathname.slice(1) : u.searchParams.get('v');
    return id ? `https://www.youtube.com/embed/${id}` : href;
  } catch {
    return href;
  }
}

function findVideoLink(block) {
  const inCell = [...block.querySelectorAll('a[href]')].find((a) => VIDEO.test(a.href));
  if (inCell) return inCell;
  const wrapper = block.parentElement?.previousElementSibling;
  if (!wrapper || !wrapper.classList.contains('default-content-wrapper')) return null;
  return [...wrapper.querySelectorAll('a[href]')].find((a) => VIDEO.test(a.href)) || null;
}

export default function decorate(block) {
  const link = findVideoLink(block);
  const container = document.createElement('div');
  container.className = 'video-container';
  const video = document.createElement('div');
  video.className = 'youtube-video';
  if (link) {
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl(link.href);
    iframe.title = 'YouTube video';
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; '
      + 'gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.loading = 'lazy';
    video.append(iframe);
    const par = link.closest('p');
    const wrapper = link.closest('.default-content-wrapper');
    const source = document.createElement('div');
    source.className = 'video-source';
    source.append(par || link);
    video.append(source);
    if (wrapper && !wrapper.childElementCount) wrapper.remove();
  }
  container.append(video);
  // leftovers pass: any other authored node in the block stays visible under the video
  const rest = [...block.querySelectorAll(':scope > div > div > *')];
  block.replaceChildren(container, ...rest);
  if (block.parentElement) block.parentElement.classList.add('full-bleed');
}
