/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - Import all parsers needed for this template
import heroPromoParser from './parsers/hero-promo.js';
import cardsActionParser from './parsers/cards-action.js';
import cardsCategoryParser from './parsers/cards-category.js';
import cardsTileParser from './parsers/cards-tile.js';
import columnsAppParser from './parsers/columns-app.js';

// TRANSFORMER IMPORTS - Import all transformers found in tools/importer/transformers/
import cleanupTransformer from './transformers/nationwide-cleanup.js';
import sectionsTransformer from './transformers/nationwide-sections.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero-promo': heroPromoParser,
  'cards-action': cardsActionParser,
  'cards-category': cardsCategoryParser,
  'cards-tile': cardsTileParser,
  'columns-app': columnsAppParser,
};

// TRANSFORMER REGISTRY - Array of transformer functions
// Cleanup runs first, sections runs after (in afterTransform hook)
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Nationwide insurance homepage with hero, product offerings, and promotional content',
  urls: [
    'https://www.nationwide.com/',
  ],
  blocks: [
    {
      name: 'hero-promo',
      instances: ['.nw-home-quote-banner'],
    },
    {
      name: 'cards-action',
      instances: ['.custom-tri-promo'],
    },
    {
      name: 'cards-category',
      instances: ['#p43486 section.nw-multi-option-promo'],
    },
    {
      name: 'cards-tile',
      instances: ['section#p30097.nw-tile-block', 'section#p30087.nw-tile-block'],
    },
    {
      name: 'columns-app',
      instances: ['#p43655.rtc-component'],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Banner',
      selector: '.nw-home-quote-banner',
      style: 'vibrant-blue',
      blocks: ['hero-promo'],
      defaultContent: [],
    },
    {
      id: 'section-2-quick-actions',
      name: 'Quick Actions',
      selector: ['.row.text-center.align-center.nw-inner-bottom'],
      style: null,
      blocks: ['cards-action'],
      defaultContent: [],
    },
    {
      id: 'section-3-products',
      name: 'Products and Categories',
      selector: '#p43486.nw-multi-option-promo',
      style: 'light-grey',
      blocks: ['cards-category'],
      defaultContent: ['#p43486 h2.nw-heading-tiempos-md'],
    },
    {
      id: 'section-4-member-cta',
      name: 'Member CTA Banner',
      selector: '#p45265.nw-bg-blue-darkest',
      style: 'navy-blue',
      blocks: [],
      defaultContent: ['#p45265 .nw-cta-small'],
    },
    {
      id: 'section-5-tiles-row1',
      name: 'Image Tiles Row 1',
      selector: 'section#p30097.nw-tile-block',
      style: null,
      blocks: ['cards-tile'],
      defaultContent: [],
    },
    {
      id: 'section-6-tiles-row2',
      name: 'Image Tiles Row 2',
      selector: 'section#p30087.nw-tile-block',
      style: null,
      blocks: ['cards-tile'],
      defaultContent: [],
    },
    {
      id: 'section-7-company-info',
      name: 'Company Info',
      selector: '#p45234.rtc-component',
      style: null,
      blocks: [],
      defaultContent: ['#p45234 h2', '#p45234 p'],
    },
    {
      id: 'section-8-business-cta',
      name: 'Business CTA Banner',
      selector: '#p45310.nw-bg-blue-darkest',
      style: 'navy-blue',
      blocks: [],
      defaultContent: ['#p45310 .nw-cta-small'],
    },
    {
      id: 'section-9-mobile-app',
      name: 'Mobile App Promo',
      selector: '#p43655.rtc-component',
      style: 'vibrant-blue',
      blocks: ['columns-app'],
      defaultContent: [],
    },
    {
      id: 'section-10-disclaimer',
      name: 'Disclaimer',
      selector: '#p44604.rtc-component',
      style: null,
      blocks: [],
      defaultContent: ['#p44604 .nw-text-sm'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
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
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
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

// EXPORT DEFAULT CONFIGURATION
export default {
  /**
   * Main transformation function using one input / multiple outputs pattern.
   */
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
