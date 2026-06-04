/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroInvestParser from './parsers/hero-invest.js';
import cardsInvestParser from './parsers/cards-invest.js';
import tableCompareParser from './parsers/table-compare.js';
import cardsBenefitParser from './parsers/cards-benefit.js';
import cardsServiceParser from './parsers/cards-service.js';
import columnsPromoParser from './parsers/columns-promo.js';
import columnsLinksParser from './parsers/columns-links.js';
import cardsActionParser from './parsers/cards-action.js';
import cardsTileParser from './parsers/cards-tile.js';
import columnsCtaParser from './parsers/columns-cta.js';

// TRANSFORMER IMPORTS
import nationwideCleanupTransformer from './transformers/nationwide-cleanup.js';

// PAGE TEMPLATE CONFIGURATION
// Union of all blocks across 5 investing pages.
// Selectors are class-based (not page-specific IDs) so they work on any page.
// Sections are split universally: every direct child of #main-content = one section.
const PAGE_TEMPLATE = {
  name: 'investing',
  description: 'Nationwide investing and retirement pages covering annuities, mutual funds, retirement plans, and financial professional search.',
  blocks: [
    { name: 'hero-invest', instances: ['.nw-banner2', '.nw-hero-banner'] },
    { name: 'cards-invest', instances: ['section.nw-container.text-center:has(.nw-link-list)', 'section.nw-container.text-center:has(ul > li > a)', 'section.container.text-center:has(a)'] },
    { name: 'table-compare', instances: ['.rtc-component:has(.nw-table--blue)', '.rtc-component:has(table)'] },
    { name: 'cards-benefit', instances: ['.rtc-component.nw-bg-rebrand-vibrant-blue', '.nw-benefits'] },
    { name: 'cards-service', instances: ['.nw-resource-promo'] },
    { name: 'columns-promo', instances: ['.nw-banner-inpage'] },
    { name: 'columns-links', instances: ['.rtc-component.nw-bg-gray-pale-25:has(.nw-container-article)', '.nw-media-link-list'] },
    { name: 'cards-action', instances: ['.nw-multi-option-promo'] },
    { name: 'cards-tile', instances: ['.nw-content-promo', '.nw-articles', '.nw-tile-block'] },
    { name: 'columns-cta', instances: ['.nw-small-cta', '.nw-bg-blue-darkest.nw-small-cta', '.nw-bg-blue-sea-dark.nw-small-cta'] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-invest': heroInvestParser,
  'cards-invest': cardsInvestParser,
  'table-compare': tableCompareParser,
  'cards-benefit': cardsBenefitParser,
  'cards-service': cardsServiceParser,
  'columns-promo': columnsPromoParser,
  'columns-links': columnsLinksParser,
  'cards-action': cardsActionParser,
  'cards-tile': cardsTileParser,
  'columns-cta': columnsCtaParser,
};

// Section style detection based on class patterns
const SECTION_STYLE_MAP = [
  { match: /nw-bg-gray|nw-bg-grey|gray-pale/, style: 'grey' },
  { match: /nw-bg-blue-darkest|nw-bg-rebrand/, style: 'dark-blue' },
  { match: /nw-bg-blue-sea/, style: 'dark-blue' },
  { match: /nw-banner2/, style: 'blue' },
];

function detectSectionStyle(el) {
  const classes = el.className || '';
  for (const rule of SECTION_STYLE_MAP) {
    if (rule.match.test(classes)) return rule.style;
  }
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
    if (['script', 'style', 'noscript', 'link', 'meta'].includes(tag)) return false;
    if (!child.textContent.trim() && !child.querySelector('img, video, iframe')) return false;
    return true;
  });

  if (sections.length < 2) return;

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    const style = detectSectionStyle(section);

    if (style) {
      const metadataBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style },
      });
      if (section.parentNode) {
        section.parentNode.insertBefore(metadataBlock, section.nextSibling);
      }
    }

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
        return;
      }
      elements.forEach((element) => {
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

  console.log(`[investing] Found ${pageBlocks.length} block instances on page`);
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
          console.error(`[investing] Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. afterTransform cleanup
    nationwideCleanupTransformer('afterTransform', main, payload);

    // 5. Universal section splitting
    splitSections(main, document);

    // 6. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 7. Sanitized output path
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
