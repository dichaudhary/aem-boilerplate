/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-video variant.
 * Base: columns (variant: columns-video)
 * Source URL: https://www.nationwide.com/personal/insurance/auto/
 * Source selector: #p75050.nw-video-mediamanager
 *
 * Target table structure (from columns library example):
 *   Row 1: block name ("columns-video")
 *   Row 2: 2 cells — [video embed link] | [heading + description paragraph]
 *
 * Source DOM shape (validated against
 * migration-work/block-context/columns-video/source.html):
 *   div#p75050.nw-video-mediamanager
 *     └── div.row.nw-inner-bun--sm
 *           ├── div.large-6.small-12.columns.video-holder        // LEFT col
 *           │     └── figure.video--mediaManager
 *           │           └── div.video__wrapper
 *           │                 └── div.video-player
 *           │                       └── iframe.wistia_embed
 *           └── div.large-6.small-12.columns                     // RIGHT col
 *                 ├── h3.nw-heading-sm   ("Benefits of auto insurance")
 *                 └── p                  (description text)
 *
 * The video embed is a Wistia iframe. The parser extracts the iframe src URL
 * and creates a clickable link so the importer can resolve it as an embed.
 * The right column contains a heading and descriptive paragraph.
 */

export default function parse(element, { document }) {
  // Locate the two grid columns (Foundation 6 responsive grid classes).
  // The video column has .video-holder; the text column is the other .large-6.
  const videoCol = element.querySelector('.video-holder, .large-6.columns:has(iframe), .large-6.columns:has(figure)');
  const textCol = element.querySelector('.large-6.columns:not(.video-holder):not(:has(iframe))');

  // ---------- Column 1: Video embed ----------
  const leftCell = [];

  if (videoCol) {
    // Extract the Wistia iframe src URL
    const iframe = videoCol.querySelector('iframe.wistia_embed, iframe[src*="wistia"], iframe');
    if (iframe) {
      const videoSrc = iframe.getAttribute('src') || '';
      const videoTitle = iframe.getAttribute('title') || 'Video';
      // Create a link to the video embed URL so the importer treats it as embedded media
      const a = document.createElement('a');
      a.setAttribute('href', videoSrc);
      a.textContent = videoTitle.trim() || 'Video';
      leftCell.push(a);
    }
  }

  // ---------- Column 2: Heading + description ----------
  const rightCell = [];

  if (textCol) {
    // Heading (h3 in source, with fallbacks for variation)
    const heading = textCol.querySelector('h1, h2, h3, h4, [class*="heading"]');
    if (heading) rightCell.push(heading);

    // Description paragraph(s)
    const paragraphs = Array.from(textCol.querySelectorAll('p'));
    paragraphs.forEach((p) => {
      const text = (p.textContent || '').replace(/ /g, ' ').trim();
      if (text) rightCell.push(p);
    });
  }

  // Build the cells matching the columns library example:
  // Row 1 (block name) is added automatically by createBlock; we supply Row 2.
  const cells = [
    [leftCell, rightCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-video',
    cells,
  });

  element.replaceWith(block);
}
