/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroInvestParser from './parsers/hero-invest.js';
import cardsInvestParser from './parsers/cards-invest.js';
import cardsLifecycleParser from './parsers/cards-lifecycle.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import cardsTileParser from './parsers/cards-tile.js';
import columnsPromoParser from './parsers/columns-promo.js';
import cardsActionParser from './parsers/cards-action.js';
import columnsLinksParser from './parsers/columns-links.js';

// TRANSFORMER IMPORTS
import nationwideCleanupTransformer from './transformers/nationwide-cleanup.js';
import nationwideSectionsTransformer from './transformers/nationwide-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-invest': heroInvestParser,
  'cards-invest': cardsInvestParser,
  'cards-lifecycle': cardsLifecycleParser,
  'cards-feature': cardsFeatureParser,
  'cards-tile': cardsTileParser,
  'columns-promo': columnsPromoParser,
  'cards-action': cardsActionParser,
  'columns-links': columnsLinksParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'investing-landing',
  description: 'Investing hub landing page with hero, carousels, media-object sections, tiles, and CTAs',
  urls: [
    'https://www.nationwide.com/personal/investing/',
  ],
  blocks: [
    { name: 'hero-invest', instances: ['#main-content > div.nw-banner2.nw-banner-inpage--clip.nw-bg-rebrand-vibrant-blue'] },
    { name: 'cards-invest', instances: ['#main-content > div:has(section.circle-slider):not(.nw-bg-gray-pale-25)'] },
    { name: 'cards-lifecycle', instances: ['#main-content > div.nw-bg-gray-pale-25:not(.rtc-component):not(.nw-multi-option-promo)'] },
    { name: 'cards-feature', instances: ['#main-content > div.nw-container:has(bolt-tile-group)'] },
    { name: 'cards-tile', instances: ['#main-content > section.nw-tile-block'] },
    { name: 'columns-promo', instances: ['#main-content > div.rtc-component.nw-outer-bottom--lg.nw-bg-rebrand-vibrant-blue'] },
    { name: 'cards-action', instances: ['#main-content > div.nw-multi-option-promo'] },
    { name: 'columns-links', instances: ['#main-content > div.rtc-component.nw-outer-bottom--xl:nth-of-type(10)'] },
  ],
  sections: [
    { id: 'section-1-hero', name: 'Hero banner', selector: '#main-content > div.nw-banner2.nw-banner-inpage--clip.nw-bg-rebrand-vibrant-blue', style: null, blocks: ['hero-invest'], defaultContent: [] },
    { id: 'section-2-media-objects', name: 'Financial options cards', selector: '#main-content > div:has(section.circle-slider):not(.nw-bg-gray-pale-25)', style: null, blocks: ['cards-invest'], defaultContent: [] },
    { id: 'section-3-carousel', name: 'Solutions carousel', selector: '#main-content > div.nw-bg-gray-pale-25:not(.rtc-component):not(.nw-multi-option-promo)', style: 'grey', blocks: ['cards-lifecycle'], defaultContent: [] },
    { id: 'section-4-promo-tiles', name: 'Promo tiles (bolt-tile)', selector: '#main-content > div.nw-container:has(bolt-tile-group)', style: null, blocks: ['cards-feature'], defaultContent: [] },
    { id: 'section-5-tiles', name: 'Feature tiles', selector: '#main-content > section.nw-tile-block', style: null, blocks: ['cards-tile'], defaultContent: [] },
    { id: 'section-6-promo', name: 'App promo', selector: '#main-content > div.rtc-component.nw-outer-bottom--lg.nw-bg-rebrand-vibrant-blue', style: 'vibrant-blue', blocks: ['columns-promo'], defaultContent: [] },
    { id: 'section-7-cta-cards', name: 'CTA action cards', selector: '#main-content > div.nw-multi-option-promo', style: null, blocks: ['cards-action'], defaultContent: [] },
    { id: 'section-8-links', name: 'Related links', selector: '#main-content > div.rtc-component.nw-outer-bottom--xl:nth-of-type(10)', style: 'grey', blocks: ['columns-links'], defaultContent: [] },
    { id: 'section-9-disclaimers', name: 'Disclaimers', selector: '#main-content > div.rtc-component.nw-outer-bottom--lg:nth-of-type(11)', style: null, blocks: [], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  nationwideCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [nationwideSectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
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
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
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

    // 4. Execute afterTransform transformers (section breaks + metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
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
