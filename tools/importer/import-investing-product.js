/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroInvestParser from './parsers/hero-invest.js';
import cardsActionParser from './parsers/cards-action.js';
import cardsBenefitParser from './parsers/cards-benefit.js';
import tableCompareParser from './parsers/table-compare.js';
import cardsLifecycleParser from './parsers/cards-lifecycle.js';
import cardsTileParser from './parsers/cards-tile.js';
import columnsAppParser from './parsers/columns-app.js';
import columnsBannerParser from './parsers/columns-banner.js';
import columnsCtaParser from './parsers/columns-cta.js';
import cardsTeamParser from './parsers/cards-team.js';
import cardsServiceParser from './parsers/cards-service.js';

// TRANSFORMER IMPORTS
import nationwideCleanupTransformer from './transformers/nationwide-cleanup.js';
import nationwideSectionsTransformer from './transformers/nationwide-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-invest': heroInvestParser,
  'cards-action': cardsActionParser,
  'cards-benefit': cardsBenefitParser,
  'table-compare': tableCompareParser,
  'cards-lifecycle': cardsLifecycleParser,
  'cards-tile': cardsTileParser,
  'columns-app': columnsAppParser,
  'columns-banner': columnsBannerParser,
  'columns-cta': columnsCtaParser,
  'cards-team': cardsTeamParser,
  'cards-service': cardsServiceParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'investing-product',
  description: 'Investing product pages with hero, content sections, tile blocks, and CTAs',
  urls: [
    'https://www.nationwide.com/personal/investing/retirement-plans/',
    'https://www.nationwide.com/personal/investing/annuities/',
    'https://www.nationwide.com/personal/investing/mutual-funds/',
    'https://www.nationwide.com/personal/investing/find-financial-professional/',
  ],
  blocks: [
    { name: 'hero-invest', instances: ['#main-content > div.nw-banner2.nw-banner-inpage--clip'] },
    { name: 'cards-action', instances: ['#main-content > div.nw-multi-option-promo', '#main-content > section.nw-container:has(.nw-content-promo ul > li > a)'] },
    { name: 'cards-service', instances: ['#main-content > section.container:has(.nw-resource-promo)', '#main-content > div.rtc-component.nw-outer-bottom--md.nw-bg-gray-pale-25:has(img[src*=".svg"])'] },
    { name: 'columns-app', instances: ['#main-content > div.rtc-component.nw-outer-bottom--lg.nw-bg-rebrand-vibrant-blue'] },
    { name: 'cards-benefit', instances: ['#main-content > div.rtc-component.nw-bg-rebrand-vibrant-blue:has(.rtc-paragraph img)'] },
    { name: 'table-compare', instances: ['#main-content > div.rtc-component:has(table)'] },
    { name: 'columns-banner', instances: ['#main-content > div.rtc-component.nw-bg-gray-pale-25:has(img):has(ul)', '#main-content > div.rtc-component.nw-outer-bottom--md.nw-bg-gray-pale-25:not(:has(img[src*=".svg"]))', '#main-content > div.nw-banner-inpage'] },
    { name: 'cards-team', instances: ['#main-content > div.rtc-component.nw-outer-bottom--md:has(.rtc-paragraph span div img + h3)'] },
    { name: 'cards-service', instances: ['#main-content > div.rtc-component.nw-outer-bottom--md.nw-bg-gray-pale-25:has(img[src*=".svg"])'] },
    { name: 'cards-lifecycle', instances: ['#main-content > div.rtc-component.nw-bg-gray-pale-25:not(:has(table)):not(:has(ul))', '#main-content > div.nw-bg-gray-pale-25:has(.owl-carousel)'] },
    { name: 'cards-tile', instances: ['#main-content > section.nw-tile-block'] },
    { name: 'columns-cta', instances: ['#main-content > div.nw-bg-blue-darkest.nw-small-cta'] },
  ],
  sections: [
    { id: 'section-1-hero', name: 'Hero banner with CTA', selector: '#main-content > div.nw-banner2.nw-banner-inpage--clip', style: null, blocks: ['hero-invest'], defaultContent: [] },
    { id: 'section-2-quick-links', name: 'Quick links cards', selector: '#main-content > div.nw-multi-option-promo.nw-bg-white.nw-outer-bottom--md', style: null, blocks: ['cards-action'], defaultContent: [] },
    { id: 'section-3-lifecycle', name: 'Lifecycle navigation cards', selector: '#main-content > div.rtc-component.nw-bg-gray-pale-25', style: 'grey', blocks: ['cards-lifecycle'], defaultContent: [] },
    { id: 'section-4-default', name: 'Default content', selector: '#main-content > div.rtc-component.nw-outer-bottom--lg:nth-of-type(4)', style: null, blocks: [], defaultContent: ['#main-content > div.rtc-component.nw-outer-bottom--lg:nth-of-type(4) a'] },
    { id: 'section-5-tiles', name: 'Resources and tools tiles', selector: '#main-content > section.nw-tile-block', style: null, blocks: ['cards-tile'], defaultContent: [] },
    { id: 'section-6-app-promo', name: 'Mobile app promo', selector: '#main-content > div.rtc-component.nw-outer-bottom--lg.nw-bg-rebrand-vibrant-blue', style: 'vibrant-blue', blocks: ['columns-app'], defaultContent: [] },
    { id: 'section-7-plan-types', name: 'Plan types cards', selector: '#main-content > div.nw-multi-option-promo.nw-bg-white.nw-outer-bottom--xl', style: null, blocks: ['cards-action'], defaultContent: [] },
    { id: 'section-gap-annuities', name: 'Annuities comparison table', selector: '#main-content > div.rtc-component.nw-bg-gray-pale-25', style: 'grey', blocks: ['cards-action'], defaultContent: [] },
    { id: 'section-gap-ffp-icons', name: 'Financial specialist icons grid', selector: '#main-content > div.rtc-component.nw-outer-bottom--md:nth-of-type(4)', style: null, blocks: ['cards-action'], defaultContent: [] },
    { id: 'section-gap-ffp-columns', name: 'Two-column content with image', selector: '#main-content > div.rtc-component.nw-outer-bottom--md.nw-bg-gray-pale-25', style: 'grey', blocks: ['columns-banner'], defaultContent: [] },
    { id: 'section-gap-ffp-cta', name: 'Dark CTA strip', selector: '#main-content > div.nw-bg-blue-darkest.nw-small-cta', style: 'dark-blue', blocks: ['columns-cta'], defaultContent: [] },
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
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
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
    const { document, url, html, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip elements already replaced by a prior parser)
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

    // 4. Execute afterTransform transformers (section breaks + metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 5b. Final cleanup: remove junk paragraphs, sub-nav lists, carousel arrows
    main.querySelectorAll('p').forEach((p) => {
      const text = p.textContent.trim();
      if (text === 'Loading...' || text === '×' || text === '‹›' || /^NFW-/.test(text)) {
        p.remove();
      }
    });
    // Walk text nodes for junk that may not be in <p> tags yet (becomes <p> after markdown)
    const treeWalker = document.createTreeWalker(main, 4);
    const junkNodes = [];
    while (treeWalker.nextNode()) {
      const t = treeWalker.currentNode.textContent.trim();
      if (/^NFW-/.test(t) || t === '‹›' || t === '×' || t === 'Loading...') {
        junkNodes.push(treeWalker.currentNode);
      }
    }
    junkNodes.forEach((n) => { if (n.parentNode) n.parentNode.removeChild(n); });
    // Remove sub-navigation dropdown lists and carousel controls
    main.querySelectorAll('.nw-subnav, .nw-sub-nav, .nw-banner2__subnav, .owl-nav, .owl-dots, .owl-prev, .owl-next, [class*="carousel-nav"], [class*="slick-arrow"]').forEach((el) => el.remove());
    // Remove orphan sub-nav ULs that contain only links to sub-pages (inside hero wrapper)
    main.querySelectorAll('ul').forEach((ul) => {
      const lis = Array.from(ul.querySelectorAll('li'));
      if (lis.length < 3) return;
      const allLinks = lis.every((li) => {
        const a = li.querySelector('a');
        const h = li.querySelector('h4, h5, h3');
        return (a && li.textContent.trim() === a.textContent.trim()) || h;
      });
      const hasHeadingOnly = lis.some((li) => li.querySelector('h4, h5') && !li.querySelector('a'));
      if (allLinks && hasHeadingOnly) ul.remove();
    });

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
