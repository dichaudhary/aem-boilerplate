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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-promo.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(".bg-image-container img, .large-shrink-custom img");
    const heading = element.querySelector("h1, h2.nw-heading-tiempos-md");
    const subheading = element.querySelector(".nw-banner-inpage__content h2, .banner-content-custom h2");
    const ctaLinks = element.querySelectorAll("a.find-an-agent-link, .nw-banner-inpage__content a[href]");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    ctaLinks.forEach((link) => contentCell.push(link));
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-action.js
  function parse2(element, { document }) {
    const cards = element.querySelectorAll(".custom-tri-promo");
    const cells = [];
    cards.forEach((card) => {
      const icon = card.querySelector('.nw-fg-rebrand-vibrant-blue img, img[src^="data:image/svg"]');
      const heading = card.querySelector("h3, h3.custom-heading, h3.nw-heading-sm");
      const description = card.querySelector("p");
      const ctaLink = card.querySelector("a.button, a[href]");
      const imageCell = icon ? icon : "";
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);
      if (ctaLink) contentCell.push(ctaLink);
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-action", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-category.js
  function parse3(element, { document }) {
    const section = element.querySelector("section.nw-multi-option-promo, section.nw-container");
    const columns = section ? section.querySelectorAll(":scope .row > .column.large-4, :scope .row > div.column") : element.querySelectorAll(".row .column.large-4");
    const cells = [];
    columns.forEach((col) => {
      const icon = col.querySelector("img");
      const heading = col.querySelector("h3, h3.mopHeading");
      const description = col.querySelector("p, p.mopDesc");
      const ctaLink = col.querySelector("a.button, a[href]");
      const imageCell = icon ? icon : "";
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);
      if (ctaLink) contentCell.push(ctaLink);
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-category", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-tile.js
  function parse4(element, { document }) {
    const tiles = element.querySelectorAll("a.nw-tile-block__tile");
    const cells = [];
    tiles.forEach((tile) => {
      const image = tile.querySelector(".nw-tile-block__image img, img");
      const heading = tile.querySelector("h2.nw-tile-block__content-subheader, h2, h3");
      const href = tile.getAttribute("href");
      const imageCell = image ? image : "";
      const contentCell = [];
      if (heading) {
        if (href) {
          const link = document.createElement("a");
          link.href = href;
          link.textContent = heading.textContent.trim();
          const h2 = document.createElement("h2");
          h2.append(link);
          contentCell.push(h2);
        } else {
          contentCell.push(heading);
        }
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-tile", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-app.js
  function parse5(element, { document }) {
    const columns = element.querySelectorAll(".rtc-paragraph, .columns.large-6");
    const leftCol = columns[0];
    const rightCol = columns[1];
    const leftContent = [];
    if (leftCol) {
      const introText = leftCol.querySelector(".nw-text-lg, div.nw-text-lg");
      if (introText) {
        const p = document.createElement("p");
        p.textContent = introText.textContent.trim();
        leftContent.push(p);
      }
      const heading = leftCol.querySelector("h3, h3.nw-heading-tiempos-md");
      if (heading) leftContent.push(heading);
      const bulletDivs = leftCol.querySelectorAll("span > div:not(.nw-text-lg)");
      if (bulletDivs.length > 0) {
        const ul = document.createElement("ul");
        bulletDivs.forEach((div) => {
          const text = div.textContent.trim().replace(/^\s*/, "");
          if (text) {
            const li = document.createElement("li");
            li.textContent = text;
            ul.append(li);
          }
        });
        if (ul.children.length > 0) leftContent.push(ul);
      }
    }
    const rightContent = [];
    if (rightCol) {
      const qrImage = rightCol.querySelector("img");
      if (qrImage) rightContent.push(qrImage);
      const caption = rightCol.querySelector("p");
      if (caption) rightContent.push(caption);
    }
    const cells = [
      [leftContent, rightContent]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-app", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/nationwide-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#consent_blackbar",
        "#truste-consent-track",
        "#trustarcNoticeFrame"
      ]);
      WebImporter.DOMUtils.remove(element, [".nw-header__skip"]);
      WebImporter.DOMUtils.remove(element, ["#isPandP", "#isNvit"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["bolt-header#header", "bolt-header"]);
      WebImporter.DOMUtils.remove(element, ["footer.nw-footer", "footer#p37659"]);
      WebImporter.DOMUtils.remove(element, ["iframe"]);
      WebImporter.DOMUtils.remove(element, ['[id^="ZN_"]']);
      WebImporter.DOMUtils.remove(element, [".QSIFeedbackButton"]);
      WebImporter.DOMUtils.remove(element, ["noscript", "link"]);
    }
  }

  // tools/importer/transformers/nationwide-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const template = payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-promo": parse,
    "cards-action": parse2,
    "cards-category": parse3,
    "cards-tile": parse4,
    "columns-app": parse5
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Nationwide insurance homepage with hero, product offerings, and promotional content",
    urls: [
      "https://www.nationwide.com/"
    ],
    blocks: [
      {
        name: "hero-promo",
        instances: [".nw-home-quote-banner"]
      },
      {
        name: "cards-action",
        instances: [".custom-tri-promo"]
      },
      {
        name: "cards-category",
        instances: ["#p43486 section.nw-multi-option-promo"]
      },
      {
        name: "cards-tile",
        instances: ["section#p30097.nw-tile-block", "section#p30087.nw-tile-block"]
      },
      {
        name: "columns-app",
        instances: ["#p43655.rtc-component"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Banner",
        selector: ".nw-home-quote-banner",
        style: "vibrant-blue",
        blocks: ["hero-promo"],
        defaultContent: []
      },
      {
        id: "section-2-quick-actions",
        name: "Quick Actions",
        selector: [".row.text-center.align-center.nw-inner-bottom"],
        style: null,
        blocks: ["cards-action"],
        defaultContent: []
      },
      {
        id: "section-3-products",
        name: "Products and Categories",
        selector: "#p43486.nw-multi-option-promo",
        style: "light-grey",
        blocks: ["cards-category"],
        defaultContent: ["#p43486 h2.nw-heading-tiempos-md"]
      },
      {
        id: "section-4-member-cta",
        name: "Member CTA Banner",
        selector: "#p45265.nw-bg-blue-darkest",
        style: "navy-blue",
        blocks: [],
        defaultContent: ["#p45265 .nw-cta-small"]
      },
      {
        id: "section-5-tiles-row1",
        name: "Image Tiles Row 1",
        selector: "section#p30097.nw-tile-block",
        style: null,
        blocks: ["cards-tile"],
        defaultContent: []
      },
      {
        id: "section-6-tiles-row2",
        name: "Image Tiles Row 2",
        selector: "section#p30087.nw-tile-block",
        style: null,
        blocks: ["cards-tile"],
        defaultContent: []
      },
      {
        id: "section-7-company-info",
        name: "Company Info",
        selector: "#p45234.rtc-component",
        style: null,
        blocks: [],
        defaultContent: ["#p45234 h2", "#p45234 p"]
      },
      {
        id: "section-8-business-cta",
        name: "Business CTA Banner",
        selector: "#p45310.nw-bg-blue-darkest",
        style: "navy-blue",
        blocks: [],
        defaultContent: ["#p45310 .nw-cta-small"]
      },
      {
        id: "section-9-mobile-app",
        name: "Mobile App Promo",
        selector: "#p43655.rtc-component",
        style: "vibrant-blue",
        blocks: ["columns-app"],
        defaultContent: []
      },
      {
        id: "section-10-disclaimer",
        name: "Disclaimer",
        selector: "#p44604.rtc-component",
        style: null,
        blocks: [],
        defaultContent: ["#p44604 .nw-text-sm"]
      }
    ]
  };
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
  var import_homepage_default = {
    /**
     * Main transformation function using one input / multiple outputs pattern.
     */
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
