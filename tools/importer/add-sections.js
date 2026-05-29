#!/usr/bin/env node
/* eslint-disable */
/**
 * Post-processor: Add section breaks to insurance-landing .plain.html files.
 *
 * Reads the page-templates.json section definitions and splits existing
 * single-section content into multiple top-level <div> sections based on
 * block class names found in the content.
 *
 * Usage: node tools/importer/add-sections.js
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.resolve(__dirname, '../../content');
const TEMPLATES_FILE = path.resolve(__dirname, 'page-templates.json');

// Section styles keyed by block name (from page-templates.json)
const SECTION_STYLES = {
  'hero-quote': 'dark-blue',
  'columns-info': 'grey', // section-8 (coverages list)
};

// Blocks that mark a new section boundary
const SECTION_BLOCKS = [
  'hero-quote',
  'columns-video',
  'cards-action',
  'cards-tile',
  'columns-banner',
  'columns-info',
  'accordion-faq',
  'columns-cta',
];

function createSectionMetadata(style) {
  return `<div class="section-metadata"><div><div>style</div><div>${style}</div></div></div>`;
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Parse top-level divs
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM(`<body>${content}</body>`);
  const body = dom.window.document.body;
  const topDivs = Array.from(body.children).filter(el => el.tagName === 'DIV');

  if (topDivs.length > 3) {
    // Already has sections, skip
    console.log(`  SKIP (already has ${topDivs.length} sections)`);
    return false;
  }

  // Find the main content div (usually the first and only)
  const mainDiv = topDivs[0];
  if (!mainDiv) {
    console.log('  SKIP (no content div)');
    return false;
  }

  // Get all children of the main div
  const children = Array.from(mainDiv.children);

  // Find section boundaries based on block class names
  const sections = [];
  let currentSection = [];
  let currentStyle = null;

  for (const child of children) {
    const childClasses = child.className || '';
    const isBlock = SECTION_BLOCKS.some(b => childClasses.includes(b));
    const isMetadata = childClasses.includes('metadata') && !childClasses.includes('section-metadata');

    if (isBlock && currentSection.length > 0) {
      // Close previous section
      sections.push({ elements: currentSection, style: currentStyle });
      currentSection = [];
      currentStyle = null;
    }

    // Detect style for this section
    if (childClasses.includes('hero-quote')) {
      currentStyle = 'dark-blue';
    }

    if (isMetadata) {
      // Metadata block goes in its own section at the end
      if (currentSection.length > 0) {
        sections.push({ elements: currentSection, style: currentStyle });
        currentSection = [];
        currentStyle = null;
      }
      sections.push({ elements: [child], style: null, isMetadata: true });
    } else {
      currentSection.push(child);
    }
  }

  // Close last section
  if (currentSection.length > 0) {
    sections.push({ elements: currentSection, style: currentStyle });
  }

  if (sections.length <= 1) {
    console.log('  SKIP (could not identify section boundaries)');
    return false;
  }

  // Build output
  const outputLines = [];
  for (const section of sections) {
    const innerHtml = section.elements.map(el => el.outerHTML).join('');
    let sectionHtml = innerHtml;
    if (section.style) {
      sectionHtml += createSectionMetadata(section.style);
    }
    outputLines.push(`<div>${sectionHtml}</div>`);
  }

  fs.writeFileSync(filePath, outputLines.join('\n') + '\n');
  console.log(`  DONE (${sections.length} sections)`);
  return true;
}

// Find all insurance-landing pages
const insuranceDir = path.join(CONTENT_DIR, 'personal', 'insurance');
if (!fs.existsSync(insuranceDir)) {
  console.error('Insurance content directory not found');
  process.exit(1);
}

const files = fs.readdirSync(insuranceDir)
  .filter(f => f.endsWith('.plain.html'))
  .map(f => path.join(insuranceDir, f));

console.log(`Processing ${files.length} insurance-landing pages...`);
for (const file of files) {
  const name = path.basename(file, '.plain.html');
  process.stdout.write(`${name}: `);
  try {
    processFile(file);
  } catch (e) {
    console.log(`  ERROR: ${e.message}`);
  }
}
