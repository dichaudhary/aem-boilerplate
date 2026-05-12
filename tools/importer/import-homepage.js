/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroQuoteParser from './parsers/hero-quote.js';
import cardsActionParser from './parsers/cards-action.js';
import cardsCategoryParser from './parsers/cards-category.js';
import cardsTileParser from './parsers/cards-tile.js';
import columnsCtaParser from './parsers/columns-cta.js';
import columnsAppParser from './parsers/columns-app.js';

// TRANSFORMER IMPORTS
import nationwideCleanupTransformer from './transformers/nationwide-cleanup.js';
import nationwideSectionsTransformer from './transformers/nationwide-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description:
    'Nationwide.com homepage featuring hero with insurance-type selector and ZIP quote CTA, self-service tri-promo cards with dropdowns and ZIP form, 3-column category cards, tile blocks for feature promos, mobile app columns, and marketing banners.',
  urls: ['https://www.nationwide.com/'],
  blocks: [
    {
      name: 'hero-quote',
      instances: ['div.nw-home-quote-banner'],
    },
    {
      name: 'cards-action',
      instances: ['div.custom-tri-promo'],
    },
    {
      name: 'cards-category',
      instances: ['section.nw-multi-option-promo'],
    },
    {
      name: 'columns-cta',
      instances: [
        'div#p45265.nw-bg-blue-darkest.nw-small-cta',
        'div#p45310.nw-bg-blue-darkest.nw-small-cta',
      ],
    },
    {
      name: 'cards-tile',
      instances: [
        'section#p30097.nw-tile-block',
        'section#p30087.nw-tile-block',
      ],
    },
    {
      name: 'columns-app',
      instances: ['div#p43655.rtc-component.nw-bg-rebrand-vibrant-blue'],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero banner',
      selector: 'div.nw-home-quote-banner',
      style: null,
      blocks: ['hero-quote'],
      defaultContent: [],
    },
    {
      id: 'section-2-tri-promo',
      name: 'Tri-promo action cards',
      selector: ['div.row.text-center.align-center.nw-inner-bottom'],
      style: null,
      blocks: ['cards-action'],
      defaultContent: [],
    },
    {
      id: 'section-3-category',
      name: 'Protecting people, businesses and futures',
      selector: 'div#p43486.nw-multi-option-promo',
      style: 'light-grey',
      blocks: ['cards-category'],
      defaultContent: ['div#p43486 h2.nw-heading-tiempos-md'],
    },
    {
      id: 'section-4-member-cta',
      name: 'Are you a Nationwide member CTA',
      selector: 'div#p45265.nw-bg-blue-darkest.nw-small-cta',
      style: 'navy-blue',
      blocks: ['columns-cta'],
      defaultContent: [],
    },
    {
      id: 'section-5-tile-block-2',
      name: 'Two-tile financial future + long-term care',
      selector: 'section#p30097.nw-tile-block',
      style: null,
      blocks: ['cards-tile'],
      defaultContent: [],
    },
    {
      id: 'section-6-tile-block-3',
      name: 'Three-tile small business + bundle + manage online',
      selector: 'section#p30087.nw-tile-block',
      style: null,
      blocks: ['cards-tile'],
      defaultContent: [],
    },
    {
      id: 'section-7-most-important',
      name: "Protecting what's most important narrative",
      selector: 'div#p45234.rtc-component',
      style: null,
      blocks: [],
      defaultContent: ['div#p45234 h2', 'div#p45234 p'],
    },
    {
      id: 'section-8-business-cta',
      name: 'Have a business to protect CTA',
      selector: 'div#p45310.nw-bg-blue-darkest.nw-small-cta',
      style: 'navy-blue',
      blocks: ['columns-cta'],
      defaultContent: [],
    },
    {
      id: 'section-9-app-promo',
      name: 'Mobile app promo with QR',
      selector: 'div#p43655.rtc-component.nw-bg-rebrand-vibrant-blue',
      style: 'vibrant-blue',
      blocks: ['columns-app'],
      defaultContent: [],
    },
    {
      id: 'section-10-disclaimer',
      name: 'Disclaimer footnote',
      selector: 'div#p44604.rtc-component',
      style: null,
      blocks: [],
      defaultContent: ['div#p44604 div.nw-text-sm'],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-quote': heroQuoteParser,
  'cards-action': cardsActionParser,
  'cards-category': cardsCategoryParser,
  'cards-tile': cardsTileParser,
  'columns-cta': columnsCtaParser,
  'columns-app': columnsAppParser,
};

// TRANSFORMER REGISTRY - cleanup runs first, sections runs last (afterTransform)
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
  /**
   * Main transformation function
   */
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

    // 5b. Restore local asset paths — adjustImageUrls absolutizes relative
    // `./images/...` refs to the source origin (nationwide.com). We want them
    // to stay local since the PNGs are downloaded into content/images/.
    main.querySelectorAll('img[src]').forEach((img) => {
      const src = img.getAttribute('src') || '';
      const m = src.match(/^https?:\/\/[^/]+(\/images\/[^?#]+)(?:[?#].*)?$/);
      if (m) {
        img.setAttribute('src', '.' + m[1]);
      }
    });

    // 6. Sanitized path (homepage → /index)
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
