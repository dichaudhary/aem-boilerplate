/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-resource-hub.js
  var import_resource_hub_exports = {};
  __export(import_resource_hub_exports, {
    default: () => import_resource_hub_default
  });

  // tools/importer/parsers/hero-inpage.js
  function parse(element, { document }) {
    const content = element.querySelector(".nw-banner-inpage__content") || element;
    const heading = content.querySelector('h1, h2, h3, [class*="heading"]');
    const body = content.querySelector(".rtc-component") || content;
    const image = element.querySelector(
      ".nw-banner-inpage__media picture, .nw-banner-inpage__media img"
    );
    const contentNodes = [];
    if (heading) contentNodes.push(heading);
    if (body && body !== content) {
      const supporting = Array.from(
        body.querySelectorAll(":scope > span > *, :scope > p, :scope > div")
      );
      supporting.forEach((node) => {
        if (node.closest("nav")) return;
        contentNodes.push(node);
      });
    } else {
      Array.from(content.querySelectorAll("p, .nw-text-sm")).forEach((node) => {
        if (node.closest("nav")) return;
        if (heading && heading.contains(node)) return;
        contentNodes.push(node);
      });
    }
    if (!heading && contentNodes.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) cells.push([[image]]);
    cells.push([contentNodes]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-inpage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse2(element, { document }) {
    let cardCells = Array.from(element.querySelectorAll(":scope div.columns.rtc-paragraph"));
    if (!cardCells.length) {
      cardCells = Array.from(element.querySelectorAll(":scope div.rtc-paragraph, :scope div.columns"));
    }
    const cells = [];
    cardCells.forEach((card) => {
      const wrapper = card.querySelector(":scope > span") || card;
      const img = wrapper.querySelector("img");
      let imageEl = null;
      if (img) {
        const imgLink = img.closest("a");
        imageEl = imgLink || img;
      }
      const heading = wrapper.querySelector('h3, h2, h4, [class*="heading"]');
      const description = wrapper.querySelector(":scope > p, p");
      if (!imageEl && !heading && !description) return;
      const imageCell = imageEl ? [imageEl] : [];
      const bodyCell = [];
      if (heading) bodyCell.push(heading);
      if (description) bodyCell.push(description);
      cells.push([imageCell, bodyCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-bop-tile.js
  function iconTokenFromSvg(svg) {
    var _a, _b;
    if (!svg) return null;
    let raw = svg.getAttribute("name") || (((_a = svg.querySelector("desc")) == null ? void 0 : _a.textContent) || "") || (((_b = svg.querySelector("title")) == null ? void 0 : _b.textContent) || "");
    raw = raw.trim().toLowerCase();
    if (!raw) return null;
    const slug = raw.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return slug ? `:${slug}:` : null;
  }
  function buildTileRow(tile, document) {
    var _a, _b;
    const linkEl = ((_a = tile.matches) == null ? void 0 : _a.call(tile, "a[href]")) ? tile : tile.querySelector("a[href]");
    const href = (linkEl == null ? void 0 : linkEl.getAttribute("href")) || "";
    const headingEl = tile.querySelector('h5, h2, h3, h4, h6, [class*="heading"]');
    const headingText = ((headingEl == null ? void 0 : headingEl.textContent) || "").trim();
    const svg = tile.querySelector("svg");
    const iconToken = iconTokenFromSvg(svg);
    const bodyCell = [];
    if (iconToken) {
      const iconP = document.createElement("p");
      iconP.textContent = iconToken;
      bodyCell.push(iconP);
    }
    if (headingText) {
      const heading = document.createElement(((_b = headingEl == null ? void 0 : headingEl.tagName) == null ? void 0 : _b.toLowerCase()) || "h5");
      if (href) {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = headingText;
        heading.appendChild(link);
      } else {
        heading.textContent = headingText;
      }
      bodyCell.push(heading);
    } else if (href) {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.setAttribute("href", href);
      link.textContent = href;
      p.appendChild(link);
      bodyCell.push(p);
    }
    return [bodyCell];
  }
  function parse3(element, { document }) {
    let tiles = Array.from(element.querySelectorAll("ul > li"));
    if (tiles.length === 0) {
      tiles = Array.from(element.querySelectorAll("a[href]"));
    }
    const cells = tiles.map((tile) => buildTileRow(tile, document)).filter((row) => Array.isArray(row[0]) && row[0].length > 0);
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-bop-tile",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/nationwide-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#consent_blackbar",
        "#trustarcNoticeFrame",
        "#destination_publishing_iframe_nationwidemutualinsurance_0",
        "#ZN_5AvhXVJ4YIRTDLw",
        ".QSIFeedbackButton",
        "#QSIFeedbackButton-btn",
        'iframe[src*="doubleclick.net"]',
        'iframe[src*="demdex.net"]',
        "iframe.aamIframeLoaded"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "bolt-waiting-indicator",
        "#loadingQuoteIndicator",
        "ul.nw-breadcrumb"
      ]);
      element.querySelectorAll("nav").forEach((nav) => {
        if (nav.children.length === 0 && (nav.textContent || "").trim() === "") {
          nav.remove();
        }
      });
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "bolt-header",
        "#header",
        "header",
        "footer",
        ".nw-footer",
        ".nw-header__skip",
        "#isPandP",
        "#isNvit",
        // Residual tracking / embeds that may survive past beforeTransform.
        "script",
        "style",
        "noscript",
        "link",
        "meta",
        // Safety: strip any hidden iframes not tied to authorable content.
        "iframe.ta-display-none"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("onclick");
        el.removeAttribute("onload");
        el.removeAttribute("onerror");
        el.removeAttribute("data-track");
        el.removeAttribute("data-tracking");
        el.removeAttribute("data-analytics");
        el.removeAttribute("data-at-element-click-tracking");
      });
    }
  }

  // tools/importer/transformers/nationwide-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function findSectionElement(root, selector) {
    const selectors = Array.isArray(selector) ? selector : [selector];
    for (const sel of selectors) {
      if (!sel) continue;
      try {
        const el = root.querySelector(sel);
        if (el) return el;
      } catch (e) {
      }
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.beforeTransform) {
      const template = payload && payload.template;
      const sections = template && Array.isArray(template.sections) ? template.sections : [];
      if (sections.length < 2) return;
      const doc = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const sectionEl = findSectionElement(element, section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const metadataBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionEl.parentNode) {
            sectionEl.parentNode.insertBefore(metadataBlock, sectionEl.nextSibling);
          }
        }
        if (i > 0 && sectionEl.parentNode && sectionEl.previousSibling) {
          const hr = doc.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-resource-hub.js
  var PAGE_TEMPLATE = {
    name: "resource-hub",
    description: "Resource/article hub page: vibrant-blue inpage hero, intro plus in-page topic-anchor nav links, multiple article card grids grouped by topic (featured + topic sections), icon-card guidance rows, and a browse-by-topic link list.",
    urls: [
      "https://www.nationwide.com/lc/resources/cyber-resource-center/",
      "https://www.nationwide.com/lc/resources/personal-finance/"
    ],
    blocks: [
      {
        name: "hero-inpage",
        instances: ["#main-content > div.nw-banner2.nw-banner-inpage--clip.nw-bg-rebrand-vibrant-blue"]
      },
      {
        name: "cards-article",
        instances: [
          "#main-content > div.rtc-component.nw-outer-bottom--md:nth-of-type(3) > div.rtc-section > div.expanded.rtc-container",
          "#main-content > div.rtc-component.nw-outer-bottom--lg:nth-of-type(3) > div.rtc-section:nth-of-type(1) > div.expanded.rtc-container",
          "#main-content > div.rtc-component.nw-outer-bottom--xl:nth-of-type(4) > div.rtc-section:nth-of-type(1) > div.expanded.rtc-container",
          "#main-content > div.rtc-component.nw-outer-bottom--xl:nth-of-type(5) > div.rtc-section:nth-of-type(1) > div.expanded.rtc-container"
        ]
      },
      {
        name: "cards-bop-tile",
        instances: [
          "#main-content > section.nw-container.text-center:nth-of-type(1)",
          "#main-content > section.nw-container.text-center.nw-outer-bottom--lg"
        ]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "section-hero",
        selector: "#main-content > div.nw-banner2.nw-banner-inpage--clip.nw-bg-rebrand-vibrant-blue",
        style: null,
        blocks: ["hero-inpage"],
        defaultContent: []
      },
      {
        id: "section-2-intro-topicnav",
        name: "section-intro-topicnav",
        selector: "#main-content > div.rtc-component.nw-outer-bottom--md:nth-of-type(2)",
        style: "light-grey",
        blocks: [],
        defaultContent: ["#main-content > div.rtc-component.nw-outer-bottom--md:nth-of-type(2)"]
      },
      {
        id: "section-3-featured",
        name: "Featured article cards",
        selector: "#main-content > div.rtc-component.nw-outer-bottom--md:nth-of-type(3) > div.rtc-section:nth-of-type(1)",
        style: null,
        blocks: ["cards-article"],
        defaultContent: []
      },
      {
        id: "section-4-best-practices",
        name: "Best practices article cards",
        selector: "#main-content > div.rtc-component.nw-outer-bottom--md:nth-of-type(3) > div.rtc-section:nth-of-type(2)",
        style: null,
        blocks: ["cards-article"],
        defaultContent: []
      },
      {
        id: "section-5-cybersecurity-101",
        name: "Cybersecurity 101 article cards",
        selector: "#main-content > div.rtc-component.nw-outer-bottom--md:nth-of-type(3) > div.rtc-section:nth-of-type(3)",
        style: null,
        blocks: ["cards-article"],
        defaultContent: []
      },
      {
        id: "section-6-fraud-guidance",
        name: "Fraud guidance icon cards",
        selector: "#main-content > section.nw-container.text-center:nth-of-type(1)",
        style: null,
        blocks: ["cards-bop-tile"],
        defaultContent: []
      },
      {
        id: "section-7-tools",
        name: "section-tools",
        selector: "#main-content > section.nw-container.text-center.nw-outer-bottom--lg",
        style: null,
        blocks: ["cards-bop-tile"],
        defaultContent: []
      }
    ]
  };
  var parsers = {
    "hero-inpage": parse,
    "cards-article": parse2,
    "cards-bop-tile": parse3
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
          if (pageBlocks.some((b) => b.element === element)) return;
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_resource_hub_default = {
    /**
     * Main transformation function
     */
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      main.querySelectorAll("img[src]").forEach((img) => {
        const src = img.getAttribute("src") || "";
        const m = src.match(/^https?:\/\/[^/]+(\/images\/[^?#]+)(?:[?#].*)?$/);
        if (m) {
          img.setAttribute("src", "." + m[1]);
        }
      });
      const pathname = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      const path = WebImporter.FileUtils.sanitizePath(pathname);
      return [
        {
          element: main,
          path,
          report: {
            title: document.title,
            template: PAGE_TEMPLATE.name,
            blocks: pageBlocks.map((b) => b.name)
          }
        }
      ];
    }
  };
  return __toCommonJS(import_resource_hub_exports);
})();
