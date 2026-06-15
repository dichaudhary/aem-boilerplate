/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroInpageParser from './parsers/hero-inpage.js';
import cardsArticleParser from './parsers/cards-article.js';
import cardsBopTileParser from './parsers/cards-bop-tile.js';

// TRANSFORMER IMPORTS
import nationwideCleanupTransformer from './transformers/nationwide-cleanup.js';
import nationwideSectionsTransformer from './transformers/nationwide-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'resource-hub',
  description:
    'Resource/article hub page: vibrant-blue inpage hero, intro plus in-page topic-anchor nav links, multiple article card grids grouped by topic (featured + topic sections), icon-card guidance rows, and a browse-by-topic link list.',
  urls: [
    'https://www.nationwide.com/lc/resources/cyber-resource-center/',
    'https://www.nationwide.com/lc/resources/personal-finance/',
  ],
  blocks: [
    {
      name: 'hero-inpage',
      instances: ['#main-content > div.nw-banner2.nw-banner-inpage--clip.nw-bg-rebrand-vibrant-blue'],
    },
    {
      name: 'cards-article',
      instances: [
        '#main-content > div.rtc-component.nw-outer-bottom--md:nth-of-type(3) > div.rtc-section > div.expanded.rtc-container',
        '#main-content > div.rtc-component.nw-outer-bottom--lg:nth-of-type(3) > div.rtc-section:nth-of-type(1) > div.expanded.rtc-container',
        '#main-content > div.rtc-component.nw-outer-bottom--xl:nth-of-type(4) > div.rtc-section:nth-of-type(1) > div.expanded.rtc-container',
        '#main-content > div.rtc-component.nw-outer-bottom--xl:nth-of-type(5) > div.rtc-section:nth-of-type(1) > div.expanded.rtc-container',
      ],
    },
    {
      name: 'cards-bop-tile',
      instances: [
        '#main-content > section.nw-container.text-center:nth-of-type(1)',
        '#main-content > section.nw-container.text-center.nw-outer-bottom--lg',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'section-hero',
      selector: '#main-content > div.nw-banner2.nw-banner-inpage--clip.nw-bg-rebrand-vibrant-blue',
      style: null,
      blocks: ['hero-inpage'],
      defaultContent: [],
    },
    {
      id: 'section-2-intro-topicnav',
      name: 'section-intro-topicnav',
      selector: '#main-content > div.rtc-component.nw-outer-bottom--md:nth-of-type(2)',
      style: 'light-grey',
      blocks: [],
      defaultContent: ['#main-content > div.rtc-component.nw-outer-bottom--md:nth-of-type(2)'],
    },
    {
      id: 'section-3-featured',
      name: 'Featured article cards',
      selector: '#main-content > div.rtc-component.nw-outer-bottom--md:nth-of-type(3) > div.rtc-section:nth-of-type(1)',
      style: null,
      blocks: ['cards-article'],
      defaultContent: [],
    },
    {
      id: 'section-4-best-practices',
      name: 'Best practices article cards',
      selector: '#main-content > div.rtc-component.nw-outer-bottom--md:nth-of-type(3) > div.rtc-section:nth-of-type(2)',
      style: null,
      blocks: ['cards-article'],
      defaultContent: [],
    },
    {
      id: 'section-5-cybersecurity-101',
      name: 'Cybersecurity 101 article cards',
      selector: '#main-content > div.rtc-component.nw-outer-bottom--md:nth-of-type(3) > div.rtc-section:nth-of-type(3)',
      style: null,
      blocks: ['cards-article'],
      defaultContent: [],
    },
    {
      id: 'section-6-fraud-guidance',
      name: 'Fraud guidance icon cards',
      selector: '#main-content > section.nw-container.text-center:nth-of-type(1)',
      style: null,
      blocks: ['cards-bop-tile'],
      defaultContent: [],
    },
    {
      id: 'section-7-tools',
      name: 'section-tools',
      selector: '#main-content > section.nw-container.text-center.nw-outer-bottom--lg',
      style: null,
      blocks: ['cards-bop-tile'],
      defaultContent: [],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-inpage': heroInpageParser,
  'cards-article': cardsArticleParser,
  'cards-bop-tile': cardsBopTileParser,
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
      elements.forEach((element) => {
        // Avoid double-registering the same element via overlapping selectors
        if (pageBlocks.some((b) => b.element === element)) return;
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
