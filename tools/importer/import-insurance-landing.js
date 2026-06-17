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
import nationwideSectionsTransformer from './transformers/nationwide-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'insurance-landing',
  description:
    'Nationwide insurance category landing pages featuring product descriptions, quote CTAs, coverages/discounts cards, FAQs, and related resources.',
  urls: ['https://www.nationwide.com/personal/insurance/auto/'],
  blocks: [
    { name: 'hero-quote', instances: ['.nw-banner2'] },
    { name: 'columns-video', instances: ['.nw-video-mediamanager'] },
    { name: 'cards-action', instances: ['.nw-multi-option-promo'] },
    { name: 'cards-tile', instances: ['.nw-content-promo', 'section.nw-bg-gray-pale-25'] },
    { name: 'columns-banner', instances: ['.nw-banner-inpage'] },
    { name: 'columns-info', instances: ['.rtc-component:has(.large-6.rtc-paragraph)'] },
    { name: 'accordion-faq', instances: ['.nw-accordion'] },
    { name: 'columns-cta', instances: ['.nw-small-cta'] },
  ],
  sections: [],
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

// TRANSFORMER REGISTRY
const transformers = [
  nationwideCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1
    ? [nationwideSectionsTransformer]
    : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(
            `Failed to parse ${block.name} (${block.selector}):`,
            e,
          );
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform cleanup + section breaks/metadata
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path
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
