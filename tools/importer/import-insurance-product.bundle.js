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

  // tools/importer/import-insurance-product.js
  var import_insurance_product_exports = {};
  __export(import_insurance_product_exports, {
    default: () => import_insurance_product_default
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

  // tools/importer/parsers/cards-coverage.js
  function parse2(element, { document }) {
    let cardEls = Array.from(element.querySelectorAll(
      ':scope div.row > div[class*="column"], :scope div.row > div[class*="large-"]'
    ));
    if (cardEls.length === 0) {
      cardEls = Array.from(element.querySelectorAll('div[class*="column"]')).filter((col) => col.querySelector('h3, h2, [class*="Heading"]'));
    }
    const cells = [];
    cardEls.forEach((card) => {
      const icon = card.querySelector("svg, picture, img");
      const heading = card.querySelector('h3.mopHeading, h3, h4, [class*="Heading"]');
      const description = card.querySelector("p.mopDesc, p");
      const link = card.querySelector("a.button, a.hollow, a[href]");
      const body = [];
      if (icon) body.push(icon);
      if (heading) body.push(heading);
      if (description) body.push(description);
      if (link) body.push(link);
      if (body.length === 0) return;
      cells.push([body]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-coverage", cells });
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

  // tools/importer/parsers/columns-checklist.js
  function parse4(element, { document }) {
    const heading = element.querySelector(
      'h1, h2, h3, .nw-heading-tiempos-md, [class*="heading"]'
    );
    const columnDivs = Array.from(
      element.querySelectorAll(".large-6.small-12.columns.rtc-paragraph")
    );
    const [leftCol, rightCol] = columnDivs;
    function buildList(col) {
      if (!col) return null;
      const scope = col.querySelector(":scope > span") || col;
      const statements = Array.from(scope.querySelectorAll("p"));
      if (statements.length === 0) return null;
      const ul = document.createElement("ul");
      statements.forEach((p) => {
        const clone = p.cloneNode(true);
        clone.querySelectorAll("img").forEach((img) => img.remove());
        const li = document.createElement("li");
        Array.from(clone.childNodes).forEach((node) => {
          if (node.nodeType === 3) {
            const text = (node.textContent || "").replace(/ /g, " ");
            if (text.trim()) {
              li.appendChild(document.createTextNode(text.replace(/\s+/g, " ")));
            }
          } else {
            li.appendChild(node);
          }
        });
        if (li.firstChild && li.firstChild.nodeType === 3) {
          li.firstChild.textContent = li.firstChild.textContent.replace(/^\s+/, "");
        }
        if ((li.textContent || "").trim()) ul.appendChild(li);
      });
      return ul.children.length > 0 ? ul : null;
    }
    const leftList = buildList(leftCol);
    const rightList = buildList(rightCol);
    if (!heading && !leftList && !rightList) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (heading) {
      cells.push([heading]);
    }
    cells.push([leftList || "", rightList || ""]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-checklist",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-coverage.js
  function parse5(element, { document }) {
    const columnEls = Array.from(
      element.querySelectorAll('div.columns.rtc-paragraph, div[class*="columns"].rtc-paragraph')
    );
    const columnCells = columnEls.map((colEl) => {
      const root = colEl.querySelector(":scope > span") || colEl;
      const cellContent = [];
      Array.from(root.children).forEach((child) => {
        const tag = child.tagName ? child.tagName.toLowerCase() : "";
        const text = (child.textContent || "").replace(/ /g, " ").trim();
        if (!text) return;
        if (/^h[1-6]$/.test(tag)) {
          cellContent.push(child);
        } else {
          if (tag === "p") {
            cellContent.push(child);
          } else {
            const p = document.createElement("p");
            p.textContent = text;
            cellContent.push(p);
          }
        }
      });
      return cellContent;
    }).filter((cell) => cell.length > 0);
    if (columnCells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [columnCells];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-coverage",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-solutions.js
  function parse6(element, { document }) {
    let slides = Array.from(
      element.querySelectorAll(".owl-carousel > a, .circle-slider .owl-carousel > a")
    );
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll("a")).filter((a) => a.querySelector("img"));
    }
    if (!slides.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    slides.forEach((slide) => {
      const href = slide.getAttribute("href");
      const img = slide.querySelector("img");
      const captionEl = slide.querySelector("p");
      const captionText = (captionEl ? captionEl.textContent : slide.textContent || "").trim();
      let contentCell;
      if (href) {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        const target = slide.getAttribute("target");
        if (target) link.setAttribute("target", target);
        const rel = slide.getAttribute("rel");
        if (rel) link.setAttribute("rel", rel);
        link.textContent = captionText;
        contentCell = link;
      } else {
        contentCell = captionText;
      }
      cells.push([img || "", contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "carousel-solutions",
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

  // tools/importer/import-insurance-product.js
  var PAGE_TEMPLATE = {
    name: "insurance-product",
    description: "Insurance product marketing page: vibrant-blue inpage hero with quote CTA, intro narrative, coverage icon-cards, industry-specific BOP tiles, how-to-get-insurance list, why-choose checklist, additional-coverage multi-column list, solutions carousel, and find-an-agent ZIP form.",
    urls: ["https://www.nationwide.com/business/insurance/business-owners-policy-bop/"],
    blocks: [
      {
        name: "hero-inpage",
        instances: ["#main-content > div.nw-banner2.nw-banner-inpage--clip.nw-bg-rebrand-vibrant-blue"]
      },
      {
        name: "cards-coverage",
        instances: ["#main-content > div.nw-multi-option-promo.nw-bg-white.nw-outer-bottom--xl"]
      },
      {
        name: "cards-bop-tile",
        instances: [
          "#main-content > section.nw-container.text-center:nth-of-type(1)",
          "#main-content > section.nw-container.text-center.nw-outer-bottom--xl"
        ]
      },
      {
        name: "columns-checklist",
        instances: ["#main-content > div.rtc-component.nw-outer-bottom--lg.nw-bg-rebrand-vibrant-blue"]
      },
      {
        name: "columns-coverage",
        instances: ["#main-content > div.rtc-component.nw-outer-bottom--lg:nth-of-type(8)"]
      },
      {
        name: "carousel-solutions",
        instances: ["#main-content > div.nw-bg-gray-pale-25"]
      },
      {
        name: "form",
        instances: ["#main-content > div.nw__find-agent.nw-outer-bottom--md.nw-bg-rebrand-vibrant-blue"]
      }
    ],
    sections: [
      {
        id: "rc3",
        name: "section-hero",
        selector: "#main-content > div.nw-banner2.nw-banner-inpage--clip.nw-bg-rebrand-vibrant-blue",
        style: null,
        blocks: ["hero-inpage"],
        defaultContent: []
      },
      {
        id: "rc4",
        name: "Intro narrative",
        selector: "#main-content > div.rtc-component.nw-outer-bottom--sm",
        style: null,
        blocks: [],
        defaultContent: ["#main-content > div.rtc-component.nw-outer-bottom--sm"]
      },
      {
        id: "rc5",
        name: "Do you need a BOP",
        selector: "#main-content > div.rtc-component.nw-outer-bottom--md",
        style: null,
        blocks: [],
        defaultContent: ["#main-content > div.rtc-component.nw-outer-bottom--md"]
      },
      {
        id: "rc6",
        name: "What does a BOP cover",
        selector: "#main-content > div.nw-multi-option-promo.nw-bg-white.nw-outer-bottom--xl",
        style: null,
        blocks: ["cards-coverage"],
        defaultContent: []
      },
      {
        id: "rc7",
        name: "Industry intro",
        selector: "#main-content > div.rtc-component:nth-of-type(5)",
        style: null,
        blocks: [],
        defaultContent: ["#main-content > div.rtc-component:nth-of-type(5)"]
      },
      {
        id: "rc8",
        name: "Industry tiles row 1",
        selector: "#main-content > section.nw-container.text-center:nth-of-type(1)",
        style: null,
        blocks: ["cards-bop-tile"],
        defaultContent: []
      },
      {
        id: "rc9",
        name: "Industry tiles row 2",
        selector: "#main-content > section.nw-container.text-center.nw-outer-bottom--xl",
        style: null,
        blocks: ["cards-bop-tile"],
        defaultContent: []
      },
      {
        id: "rc10",
        name: "How to get business insurance",
        selector: "#main-content > div.rtc-component:nth-of-type(6)",
        style: null,
        blocks: [],
        defaultContent: ["#main-content > div.rtc-component:nth-of-type(6)"]
      },
      {
        id: "rc11",
        name: "section-why-choose",
        selector: "#main-content > div.rtc-component.nw-outer-bottom--lg.nw-bg-rebrand-vibrant-blue",
        style: "vibrant-blue",
        blocks: ["columns-checklist"],
        defaultContent: []
      },
      {
        id: "rc12",
        name: "Additional coverage options",
        selector: "#main-content > div.rtc-component.nw-outer-bottom--lg:nth-of-type(8)",
        style: null,
        blocks: ["columns-coverage"],
        defaultContent: []
      },
      {
        id: "rc13",
        name: "section-shop-cta",
        selector: "#main-content > div.nw-bg-blue-sea-dark.nw-small-cta",
        style: "dark-blue",
        blocks: [],
        defaultContent: ["#main-content > div.nw-bg-blue-sea-dark.nw-small-cta"]
      },
      {
        id: "rc14",
        name: "section-solutions",
        selector: "#main-content > div.nw-bg-gray-pale-25",
        style: "light-grey",
        blocks: ["carousel-solutions"],
        defaultContent: []
      },
      {
        id: "rc15",
        name: "section-find-agent",
        selector: "#main-content > div.nw__find-agent.nw-outer-bottom--md.nw-bg-rebrand-vibrant-blue",
        style: "vibrant-blue",
        blocks: ["form"],
        defaultContent: []
      },
      {
        id: "rc16",
        name: "Legal disclaimer",
        selector: "#main-content > div.rtc-component.nw-outer-bottom--lg:nth-of-type(12)",
        style: null,
        blocks: [],
        defaultContent: ["#main-content > div.rtc-component.nw-outer-bottom--lg:nth-of-type(12)"]
      }
    ]
  };
  var parsers = {
    "hero-inpage": parse,
    "cards-coverage": parse2,
    "cards-bop-tile": parse3,
    "columns-checklist": parse4,
    "columns-coverage": parse5,
    "carousel-solutions": parse6
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
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
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
  var import_insurance_product_default = {
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
  return __toCommonJS(import_insurance_product_exports);
})();
