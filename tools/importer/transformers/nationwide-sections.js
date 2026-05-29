/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Nationwide section boundaries.
 *
 * Iterates over payload.template.sections in reverse order and, for each
 * section, inserts a Section Metadata block (when section.style is set) after
 * the section element and an <hr> before it (for every non-first section).
 * Runs in afterTransform only so it operates on the DOM produced once block
 * parsers have already converted block containers into tables.
 *
 * Section selectors come from tools/importer/page-templates.json
 * (templates[0].sections[]) and were verified against
 * migration-work/cleaned.html — see nationwide-cleanup.js for details on the
 * DOM shape.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

/**
 * Resolve the DOM element for a section. The section.selector field may be a
 * string or an array of strings — try each until one matches inside `root`.
 * Falls back to trying class-only selectors (strip ID portion) when the full
 * selector contains a page-specific ID (e.g., #p38136.nw-banner2).
 */
function findSectionElement(root, selector) {
  const selectors = Array.isArray(selector) ? selector : [selector];
  for (const sel of selectors) {
    if (!sel) continue;
    try {
      const el = root.querySelector(sel);
      if (el) return el;
    } catch (e) {
      // Invalid selector – skip.
    }
    // Fallback: strip page-specific IDs (e.g., #p38136.nw-banner2 → .nw-banner2)
    const fallback = sel.replace(/#p\d+/g, '');
    if (fallback && fallback !== sel) {
      try {
        const el = root.querySelector(fallback);
        if (el) return el;
      } catch (e) { /* skip */ }
    }
  }
  return null;
}

/**
 * For insurance-landing pages: detect section boundaries by finding the block
 * instance selectors directly. This works even when page-specific IDs differ.
 */
function findSectionByBlockSelector(root, section, template) {
  if (!section.blocks || section.blocks.length === 0) return null;
  const blockName = section.blocks[0];
  const blockDef = (template.blocks || []).find((b) => b.name === blockName);
  if (!blockDef || !blockDef.instances) return null;
  for (const inst of blockDef.instances) {
    try {
      const el = root.querySelector(inst);
      if (el) return el;
    } catch (e) { /* skip */ }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;

    const doc = element.ownerDocument;

    // Walk sections in reverse so inserting nodes does not shift upcoming
    // sections' DOM positions.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      let sectionEl = findSectionElement(element, section.selector);
      // Fallback: find by block instance selector
      if (!sectionEl) {
        sectionEl = findSectionByBlockSelector(element, section, template);
      }
      if (!sectionEl) continue;

      // 1. Section Metadata block (only when a style is specified).
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        if (sectionEl.parentNode) {
          sectionEl.parentNode.insertBefore(metadataBlock, sectionEl.nextSibling);
        }
      }

      // 2. Section break <hr> before every non-first section (only when
      // there is real content preceding the section element).
      if (i > 0 && sectionEl.parentNode && sectionEl.previousSibling) {
        const hr = doc.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
