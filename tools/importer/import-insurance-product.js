/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroInpageParser from './parsers/hero-inpage.js';
import cardsCoverageParser from './parsers/cards-coverage.js';
import cardsBopTileParser from './parsers/cards-bop-tile.js';
import columnsChecklistParser from './parsers/columns-checklist.js';
import columnsCoverageParser from './parsers/columns-coverage.js';
import carouselSolutionsParser from './parsers/carousel-solutions.js';

// TRANSFORMER IMPORTS
import nationwideCleanupTransformer from './transformers/nationwide-cleanup.js';
import nationwideSectionsTransformer from './transformers/nationwide-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'insurance-product',
  description:
    'Insurance product marketing page: vibrant-blue inpage hero with quote CTA, intro narrative, coverage icon-cards, industry-specific BOP tiles, how-to-get-insurance list, why-choose checklist, additional-coverage multi-column list, solutions carousel, and find-an-agent ZIP form.',
  urls: ['https://www.nationwide.com/business/insurance/business-owners-policy-bop/'],
  blocks: [
    {
      name: 'hero-inpage',
      instances: ['#main-content > div.nw-banner2.nw-banner-inpage--clip.nw-bg-rebrand-vibrant-blue'],
    },
    {
      name: 'cards-coverage',
      instances: ['#main-content > div.nw-multi-option-promo.nw-bg-white.nw-outer-bottom--xl'],
    },
    {
      name: 'cards-bop-tile',
      instances: [
        '#main-content > section.nw-container.text-center:nth-of-type(1)',
        '#main-content > section.nw-container.text-center.nw-outer-bottom--xl',
      ],
    },
    {
      name: 'columns-checklist',
      instances: ['#main-content > div.rtc-component.nw-outer-bottom--lg.nw-bg-rebrand-vibrant-blue'],
    },
    {
      name: 'columns-coverage',
      instances: ['#main-content > div.rtc-component.nw-outer-bottom--lg:nth-of-type(8)'],
    },
    {
      name: 'carousel-solutions',
      instances: ['#main-content > div.nw-bg-gray-pale-25'],
    },
    {
      name: 'form',
      instances: ['#main-content > div.nw__find-agent.nw-outer-bottom--md.nw-bg-rebrand-vibrant-blue'],
    },
  ],
  sections: [
    {
      id: 'rc3',
      name: 'section-hero',
      selector: '#main-content > div.nw-banner2.nw-banner-inpage--clip.nw-bg-rebrand-vibrant-blue',
      style: null,
      blocks: ['hero-inpage'],
      defaultContent: [],
    },
    {
      id: 'rc4',
      name: 'Intro narrative',
      selector: '#main-content > div.rtc-component.nw-outer-bottom--sm',
      style: null,
      blocks: [],
      defaultContent: ['#main-content > div.rtc-component.nw-outer-bottom--sm'],
    },
    {
      id: 'rc5',
      name: 'Do you need a BOP',
      selector: '#main-content > div.rtc-component.nw-outer-bottom--md',
      style: null,
      blocks: [],
      defaultContent: ['#main-content > div.rtc-component.nw-outer-bottom--md'],
    },
    {
      id: 'rc6',
      name: 'What does a BOP cover',
      selector: '#main-content > div.nw-multi-option-promo.nw-bg-white.nw-outer-bottom--xl',
      style: null,
      blocks: ['cards-coverage'],
      defaultContent: [],
    },
    {
      id: 'rc7',
      name: 'Industry intro',
      selector: '#main-content > div.rtc-component:nth-of-type(5)',
      style: null,
      blocks: [],
      defaultContent: ['#main-content > div.rtc-component:nth-of-type(5)'],
    },
    {
      id: 'rc8',
      name: 'Industry tiles row 1',
      selector: '#main-content > section.nw-container.text-center:nth-of-type(1)',
      style: null,
      blocks: ['cards-bop-tile'],
      defaultContent: [],
    },
    {
      id: 'rc9',
      name: 'Industry tiles row 2',
      selector: '#main-content > section.nw-container.text-center.nw-outer-bottom--xl',
      style: null,
      blocks: ['cards-bop-tile'],
      defaultContent: [],
    },
    {
      id: 'rc10',
      name: 'How to get business insurance',
      selector: '#main-content > div.rtc-component:nth-of-type(6)',
      style: null,
      blocks: [],
      defaultContent: ['#main-content > div.rtc-component:nth-of-type(6)'],
    },
    {
      id: 'rc11',
      name: 'section-why-choose',
      selector: '#main-content > div.rtc-component.nw-outer-bottom--lg.nw-bg-rebrand-vibrant-blue',
      style: 'vibrant-blue',
      blocks: ['columns-checklist'],
      defaultContent: [],
    },
    {
      id: 'rc12',
      name: 'Additional coverage options',
      selector: '#main-content > div.rtc-component.nw-outer-bottom--lg:nth-of-type(8)',
      style: null,
      blocks: ['columns-coverage'],
      defaultContent: [],
    },
    {
      id: 'rc13',
      name: 'section-shop-cta',
      selector: '#main-content > div.nw-bg-blue-sea-dark.nw-small-cta',
      style: 'dark-blue',
      blocks: [],
      defaultContent: ['#main-content > div.nw-bg-blue-sea-dark.nw-small-cta'],
    },
    {
      id: 'rc14',
      name: 'section-solutions',
      selector: '#main-content > div.nw-bg-gray-pale-25',
      style: 'light-grey',
      blocks: ['carousel-solutions'],
      defaultContent: [],
    },
    {
      id: 'rc15',
      name: 'section-find-agent',
      selector: '#main-content > div.nw__find-agent.nw-outer-bottom--md.nw-bg-rebrand-vibrant-blue',
      style: 'vibrant-blue',
      blocks: ['form'],
      defaultContent: [],
    },
    {
      id: 'rc16',
      name: 'Legal disclaimer',
      selector: '#main-content > div.rtc-component.nw-outer-bottom--lg:nth-of-type(12)',
      style: null,
      blocks: [],
      defaultContent: ['#main-content > div.rtc-component.nw-outer-bottom--lg:nth-of-type(12)'],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-inpage': heroInpageParser,
  'cards-coverage': cardsCoverageParser,
  'cards-bop-tile': cardsBopTileParser,
  'columns-checklist': columnsChecklistParser,
  'columns-coverage': columnsCoverageParser,
  'carousel-solutions': carouselSolutionsParser,
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

    // 3. Parse each block (skip those already replaced/detached by a prior parser)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
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

    // 4. afterTransform cleanup + section breaks/metadata
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 5b. Restore local asset paths — adjustImageUrls absolutizes relative
    // `./images/...` refs to the source origin. Keep them local since the
    // images are downloaded into content/images/.
    main.querySelectorAll('img[src]').forEach((img) => {
      const src = img.getAttribute('src') || '';
      const m = src.match(/^https?:\/\/[^/]+(\/images\/[^?#]+)(?:[?#].*)?$/);
      if (m) {
        img.setAttribute('src', '.' + m[1]);
      }
    });

    // 6. Sanitized path
    const pathname = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html$/, '');
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
