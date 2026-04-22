/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselBannerParser from './parsers/carousel-banner.js';
import cardsCategoryParser from './parsers/cards-category.js';
import heroTeaserParser from './parsers/hero-teaser.js';

// TRANSFORMER IMPORTS
import aashirvaadCleanupTransformer from './transformers/aashirvaad-cleanup.js';
import aashirvaadSectionsTransformer from './transformers/aashirvaad-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-banner': carouselBannerParser,
  'cards-category': cardsCategoryParser,
  'hero-teaser': heroTeaserParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  aashirvaadCleanupTransformer,
  aashirvaadSectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Aashirvaad homepage featuring brand hero, product showcases, and promotional content',
  urls: [
    'https://aashirvaad.com/',
  ],
  blocks: [
    {
      name: 'carousel-banner',
      instances: [
        '.main-banner',
        '.cmp-ourcommunity-teasercarousel-container .cmp-carousel',
      ],
    },
    {
      name: 'cards-category',
      instances: [
        '.productcategory',
        '.cmp-recipe-group',
        '.popularproducts',
        '.footprint .cmp-carousel',
      ],
    },
    {
      name: 'hero-teaser',
      instances: [
        '.cmp-teaser--first-half-center-aligned',
        '.cmp-teaser--cta',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner Carousel',
      selector: '.color-background-default',
      style: null,
      blocks: ['carousel-banner'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Product Categories',
      selector: '.color-background-default + .color-background-background-2',
      style: 'cream',
      blocks: ['cards-category'],
      defaultContent: ['.cmp-product-category-listing__title', '.cmp-product-category-listing__subTitle'],
    },
    {
      id: 'section-3',
      name: 'Video Teaser',
      selector: '.color-background-gradient-3:has(.aashirvaad-video-teaser)',
      style: 'gradient',
      blocks: [],
      defaultContent: ['.aashirvaad-video-teaser iframe'],
    },
    {
      id: 'section-4',
      name: 'Recipe Cards',
      selector: '.color-background-background-3:has(.dynamicCardsVertwo)',
      style: 'cream',
      blocks: ['cards-category'],
      defaultContent: ['.cmp-recipe-group__title', '.cmp-recipe-group__subtitle', '.cmp-recipe-group__action'],
    },
    {
      id: 'section-5',
      name: 'What Makes Us No.1 Teaser',
      selector: '.color-background-gradient-2',
      style: null,
      blocks: ['hero-teaser'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Most Loved Products',
      selector: '.color-background-background-2:has(.popularproducts)',
      style: 'cream',
      blocks: ['cards-category'],
      defaultContent: ['.cmp-popular-products__title', '.cmp-popular-products__subtitle'],
    },
    {
      id: 'section-7',
      name: 'Meri Chakki CTA',
      selector: '.color-background-gradient-3:has(.cmp-teaser--cta)',
      style: null,
      blocks: ['hero-teaser'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Our Vision',
      selector: '.color-background-background-2:has(.footprint)',
      style: 'cream',
      blocks: ['cards-category'],
      defaultContent: ['.cmp-our-foot-print__title'],
    },
    {
      id: 'section-9',
      name: 'Our Community',
      selector: '.cmp-ourcommunity-teasercarousel-container',
      style: 'cream',
      blocks: ['carousel-banner'],
      defaultContent: ['.cta-text .cmp-text'],
    },
    {
      id: 'section-10',
      name: 'Follow Us Social',
      selector: '.color-background-background-2:has(#container-bf16ed3982)',
      style: null,
      blocks: [],
      defaultContent: ['#text-ccbfbcdd3d', '#button-16b51796b6'],
    },
  ],
};

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

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
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
