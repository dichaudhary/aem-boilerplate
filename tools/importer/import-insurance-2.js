/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroQuoteParser from './parsers/hero-quote.js';
import columnsVideoParser from './parsers/columns-video.js';
import cardsActionParser from './parsers/cards-action.js';
import cardsTileParser from './parsers/cards-tile.js';
import columnsBannerParser from './parsers/columns-banner.js';
import columnsInfoParser from './parsers/columns-info.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import columnsCtaParser from './parsers/columns-cta.js';

// TRANSFORMER IMPORTS
import nationwideCleanupTransformer from './transformers/nationwide-cleanup.js';

// PAGE TEMPLATE CONFIGURATION
// Union of all blocks across 15 insurance pages.
// Selectors are class-based (not page-specific IDs) so they work on any page.
// Sections are split universally: every direct child of #main-content = one section.
const PAGE_TEMPLATE = {
  name: 'insurance-2',
  description: 'Nationwide insurance pages — union template with universal section splitting.',
  blocks: [
    { name: 'hero-quote', instances: ['.nw-banner2', '.nw-home-quote-banner', "[class*='banner2']"] },
    { name: 'columns-video', instances: ['.nw-video-mediamanager', ".rtc-component:has(iframe[src*='wistia'])"] },
    { name: 'cards-action', instances: ['.nw-multi-option-promo'] },
    { name: 'cards-tile', instances: ['.nw-content-promo', 'section.nw-bg-gray-pale-25', '.nw-tile-block'] },
    { name: 'columns-banner', instances: ['.nw-banner-inpage'] },
    { name: 'columns-info', instances: [".rtc-component:has(.large-6.rtc-paragraph)", ".rtc-component:has(.large-6)"] },
    { name: 'accordion-faq', instances: ['.nw-accordion'] },
    { name: 'columns-cta', instances: ['.nw-small-cta'] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-quote': heroQuoteParser,
  'columns-video': columnsVideoParser,
  'cards-action': cardsActionParser,
  'cards-tile': cardsTileParser,
  'columns-banner': columnsBannerParser,
  'columns-info': columnsInfoParser,
  'accordion-faq': accordionFaqParser,
  'columns-cta': columnsCtaParser,
};

// Section style detection based on class patterns
const SECTION_STYLE_MAP = [
  { match: /nw-bg-gray|nw-bg-grey|gray-pale/, style: 'grey' },
  { match: /nw-bg-blue-darkest|nw-bg-rebrand/, style: 'dark-blue' },
  { match: /nw-banner2/, style: 'blue' },
];

function detectSectionStyle(el) {
  const classes = el.className || '';
  for (const rule of SECTION_STYLE_MAP) {
    if (rule.match.test(classes)) return rule.style;
  }
  // Check computed background
  return null;
}

/**
 * Universal section splitting: find every direct child of #main-content
 * and insert <hr> between them. Add Section Metadata where styling is detected.
 */
function splitSections(main, doc) {
  const mainContent = main.querySelector('#main-content, [role="main"], main');
  if (!mainContent) return;

  const sections = Array.from(mainContent.children).filter((child) => {
    const tag = child.tagName.toLowerCase();
    // Skip script, style, empty divs
    if (['script', 'style', 'noscript', 'link', 'meta'].includes(tag)) return false;
    if (!child.textContent.trim() && !child.querySelector('img, video, iframe')) return false;
    return true;
  });

  if (sections.length < 2) return;

  // Walk in reverse to avoid shifting positions
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    const style = detectSectionStyle(section);

    // Insert Section Metadata block after this section (if styled)
    if (style) {
      const metadataBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style },
      });
      if (section.parentNode) {
        section.parentNode.insertBefore(metadataBlock, section.nextSibling);
      }
    }

    // Insert <hr> before every non-first section
    if (i > 0 && section.parentNode) {
      const hr = doc.createElement('hr');
      section.parentNode.insertBefore(hr, section);
    }
  }
}

/**
 * Find all blocks on the page using class-based selectors.
 * Each selector is tried — if no match, block is silently skipped.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      let elements;
      try {
        elements = document.querySelectorAll(selector);
      } catch (e) {
        return; // invalid selector on this page — skip
      }
      elements.forEach((element) => {
        // Avoid parsing the same DOM element twice
        const key = element.getAttribute('id') || element.className + element.textContent.substring(0, 50);
        if (seen.has(key)) return;
        seen.add(key);
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
        });
      });
    });
  });

  console.log(`[insurance-2] Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. beforeTransform cleanup (remove header, footer, widgets)
    nationwideCleanupTransformer('beforeTransform', main, payload);

    // 2. Find blocks using class-based selectors
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`[insurance-2] Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. afterTransform cleanup
    nationwideCleanupTransformer('afterTransform', main, payload);

    // 5. Universal section splitting (no page-specific selectors needed)
    splitSections(main, document);

    // 6. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 7. Sanitized output path → content/personal/insurance-2/{page}/index
    let pathname = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html$/, '');
    if (pathname === '') pathname = '/index';
    const path = WebImporter.FileUtils.sanitizePath(pathname);

    return [
      {
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name),
        },
      },
    ];
  },
};
