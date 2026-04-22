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

  // tools/importer/parsers/carousel-banner.js
  function parse(element, { document }) {
    let slides = element.querySelectorAll(".cmp-carousel__item");
    if (!slides.length) {
      slides = element.querySelectorAll(".slick-slide");
    }
    if (!slides.length) {
      const track = element.querySelector(".slick-track, .cmp-carousel__container");
      if (track) {
        slides = track.children;
      }
    }
    const cells = [];
    Array.from(slides).forEach((slide) => {
      let image = slide.querySelector("img.cmp-banner__image");
      if (!image) {
        const banner = slide.querySelector(".cmp-banner");
        if (banner) {
          image = banner.querySelector(":scope > img");
        }
      }
      if (!image) {
        const allImages = slide.querySelectorAll("img");
        for (const img of allImages) {
          if (!img.closest(".cmp-banner__item-logo")) {
            image = img;
            break;
          }
        }
      }
      if (!image) {
        const teaser = slide.querySelector(".cmp-teaser[data-background-image-desktop]");
        if (teaser) {
          const bgUrl = teaser.getAttribute("data-background-image-desktop");
          if (bgUrl) {
            image = document.createElement("img");
            image.src = bgUrl;
            image.alt = "";
          }
        }
      }
      if (!image) return;
      const heading = slide.querySelector(
        'h2.cmp-banner__title, h1.cmp-banner__title, h3.cmp-banner__title, h2.cmp-teaser__title, h1.cmp-teaser__title, [class*="banner__title"], [class*="teaser__title"], h2, h1'
      );
      let descriptionText = "";
      const bannerSubtitle = slide.querySelector('h3.cmp-banner__sub-title, [class*="banner__sub-title"]');
      if (bannerSubtitle) {
        descriptionText = bannerSubtitle.textContent.trim();
      } else {
        const teaserDesc = slide.querySelector(".cmp-teaser__description p, .cmp-teaser__description");
        if (teaserDesc) {
          descriptionText = teaserDesc.textContent.trim();
        }
      }
      const cta = slide.querySelector(
        ".cmp-button--primary-anchor a.cmp-button, .cmp-teaser__action-container a.cmp-button, a.cmp-button, .button a[href]"
      );
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (descriptionText) {
        const descP = document.createElement("p");
        descP.textContent = descriptionText;
        contentCell.push(descP);
      }
      if (cta) contentCell.push(cta);
      cells.push([image, contentCell]);
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "carousel-banner", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/cards-category.js
  function parse2(element, { document }) {
    const cells = [];
    const categoryItems = element.querySelectorAll(".cmp-categorylist");
    if (categoryItems.length > 0) {
      categoryItems.forEach((item) => {
        const link = item.querySelector("a.cmp-categorylist__item");
        const img = item.querySelector("img.cmp-categorylist__image");
        const nameSpan = item.querySelector("span.cmp-categorylist__name");
        const col1 = [];
        if (img && link) {
          const a = document.createElement("a");
          a.href = link.href;
          a.appendChild(img.cloneNode(true));
          col1.push(a);
        } else if (img) {
          col1.push(img);
        }
        const col2 = [];
        if (nameSpan) {
          const h3 = document.createElement("h3");
          if (link) {
            const a = document.createElement("a");
            a.href = link.href;
            a.textContent = nameSpan.textContent.trim();
            h3.appendChild(a);
          } else {
            h3.textContent = nameSpan.textContent.trim();
          }
          col2.push(h3);
        }
        if (col1.length > 0 || col2.length > 0) {
          cells.push([col1, col2]);
        }
      });
      const block = WebImporter.Blocks.createBlock(document, { name: "cards-category", cells });
      element.replaceWith(block);
      return;
    }
    const recipeCards = element.querySelectorAll(".cmp-recipe-group__carousel-item a.cmp-card--recipe, .cmp-recipe-group__content a.cmp-card--recipe");
    if (recipeCards.length > 0) {
      recipeCards.forEach((card) => {
        const img = card.querySelector(".cmp-card__image img");
        const title = card.querySelector(".cmp-card__title h4, .cmp-card__title h3, .cmp-card__title");
        const tag = card.querySelector(".cmp-card__tag-wrapper p");
        const time = card.querySelector(".cmp-card__time-in-minutes p");
        const difficulty = card.querySelector(".cmp-card__difficulty-level p");
        const col1 = [];
        if (img) {
          col1.push(img);
        }
        const col2 = [];
        if (title) {
          const titleText = title.textContent.trim();
          if (titleText) {
            const h3 = document.createElement("h3");
            if (card.href) {
              const a = document.createElement("a");
              a.href = card.href;
              a.textContent = titleText;
              h3.appendChild(a);
            } else {
              h3.textContent = titleText;
            }
            col2.push(h3);
          }
        }
        const descParts = [];
        if (tag && tag.textContent.trim()) descParts.push(tag.textContent.trim());
        if (time && time.textContent.trim()) descParts.push(time.textContent.trim());
        if (difficulty && difficulty.textContent.trim()) descParts.push(difficulty.textContent.trim());
        if (descParts.length > 0) {
          const p = document.createElement("p");
          p.textContent = descParts.join(" | ");
          col2.push(p);
        }
        if (col1.length > 0 || col2.length > 0) {
          cells.push([col1, col2]);
        }
      });
      const block = WebImporter.Blocks.createBlock(document, { name: "cards-category", cells });
      element.replaceWith(block);
      return;
    }
    const productItems = element.querySelectorAll(".cmp-popular-products__carousel-item");
    if (productItems.length > 0) {
      productItems.forEach((item) => {
        const img = item.querySelector(".cmp-popular-products__image img");
        const imgLink = item.querySelector(".cmp-popular-products__image a");
        const nameEl = item.querySelector(".cmp-popular-products__product-name");
        const descEl = item.querySelector(".cmp-popular-products__product-details");
        const btnEl = item.querySelector(".cmp-button__text");
        const col1 = [];
        if (img && imgLink) {
          const a = document.createElement("a");
          a.href = imgLink.href;
          a.appendChild(img.cloneNode(true));
          col1.push(a);
        } else if (img) {
          col1.push(img);
        }
        const col2 = [];
        if (nameEl) {
          const nameText = nameEl.getAttribute("data-title") || nameEl.textContent.trim();
          if (nameText) {
            const h3 = document.createElement("h3");
            h3.textContent = nameText;
            col2.push(h3);
          }
        }
        if (descEl && descEl.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = descEl.textContent.trim();
          col2.push(p);
        }
        if (btnEl && imgLink) {
          const a = document.createElement("a");
          a.href = imgLink.href;
          a.textContent = btnEl.textContent.trim();
          col2.push(a);
        }
        if (col1.length > 0 || col2.length > 0) {
          cells.push([col1, col2]);
        }
      });
      const block = WebImporter.Blocks.createBlock(document, { name: "cards-category", cells });
      element.replaceWith(block);
      return;
    }
    const footprintItems = element.querySelectorAll(".cmp-our-foot-print__carousel-item, .cmp-carousel__item");
    if (footprintItems.length > 0) {
      footprintItems.forEach((item) => {
        const img = item.querySelector(".cmp-card__image img");
        const videoEl = item.querySelector(".cmp-video");
        const titleEl = item.querySelector(".cmp-card__title");
        const descEl = item.querySelector(".cmp-card__desc");
        const col1 = [];
        if (img) {
          col1.push(img);
        } else if (videoEl) {
          const p = document.createElement("p");
          p.textContent = "(video)";
          col1.push(p);
        }
        const col2 = [];
        if (titleEl && titleEl.textContent.trim()) {
          const h3 = document.createElement("h3");
          h3.textContent = titleEl.textContent.trim();
          col2.push(h3);
        }
        if (descEl && descEl.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = descEl.textContent.trim();
          col2.push(p);
        }
        if (col1.length > 0 || col2.length > 0) {
          cells.push([col1, col2]);
        }
      });
      const block = WebImporter.Blocks.createBlock(document, { name: "cards-category", cells });
      element.replaceWith(block);
      return;
    }
    const genericItems = element.querySelectorAll('.card, [class*="card"], [class*="item"]');
    if (genericItems.length > 0) {
      genericItems.forEach((item) => {
        const img = item.querySelector("img");
        const heading = item.querySelector('h1, h2, h3, h4, h5, h6, [class*="title"], [class*="name"]');
        const desc = item.querySelector('p, [class*="desc"], [class*="details"]');
        const col1 = [];
        if (img) col1.push(img);
        const col2 = [];
        if (heading) {
          const h3 = document.createElement("h3");
          h3.textContent = heading.textContent.trim();
          col2.push(h3);
        }
        if (desc && desc.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = desc.textContent.trim();
          col2.push(p);
        }
        if (col1.length > 0 || col2.length > 0) {
          cells.push([col1, col2]);
        }
      });
    }
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "cards-category", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/hero-teaser.js
  function parse3(element, { document }) {
    const teaserEl = element.querySelector(".cmp-teaser") || element;
    const bgImageUrl = teaserEl.getAttribute("data-background-image-desktop") || teaserEl.getAttribute("data-background-image-mobile");
    let bgImage = element.querySelector("img");
    if (!bgImage && bgImageUrl) {
      bgImage = document.createElement("img");
      bgImage.src = bgImageUrl;
      bgImage.alt = "";
    }
    const heading = element.querySelector(".cmp-teaser__title, h1, h2, h3");
    const description = element.querySelector(".cmp-teaser__description p");
    const ctaAnchors = Array.from(
      element.querySelectorAll(".cmp-teaser__action-container a")
    );
    if (ctaAnchors.length === 0) {
      const wrapperLink = element.querySelector("a.cmp-teaser__link");
      if (wrapperLink) {
        const buttonText = element.querySelector(".cmp-button__text");
        const ctaLink = document.createElement("a");
        ctaLink.href = wrapperLink.href;
        ctaLink.textContent = buttonText ? buttonText.textContent.trim() : wrapperLink.textContent.trim();
        ctaAnchors.push(ctaLink);
      }
    }
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentContainer = document.createElement("div");
    let hasContent = false;
    if (heading) {
      contentContainer.appendChild(heading);
      hasContent = true;
    }
    if (description) {
      contentContainer.appendChild(description);
      hasContent = true;
    }
    for (const cta of ctaAnchors) {
      contentContainer.appendChild(cta);
      hasContent = true;
    }
    if (hasContent) {
      cells.push([contentContainer]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/aashirvaad-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".slick-arrow",
        ".slick-dots"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".icon-open-card-popup"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--header"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--footer"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".cmp-search"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "source",
        "link",
        "noscript"
      ]);
      const emptyIframes = element.querySelectorAll("iframe:not([src])");
      emptyIframes.forEach((iframe) => {
        iframe.remove();
      });
    }
  }

  // tools/importer/transformers/aashirvaad-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var SELECTOR_FALLBACKS = {
    ".color-background-default + .color-background-background-2": ".color-background-background-2:has(.productcategory)"
  };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const document = element.ownerDocument;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        let sectionEl = element.querySelector(section.selector);
        if (!sectionEl && SELECTOR_FALLBACKS[section.selector]) {
          sectionEl = element.querySelector(SELECTOR_FALLBACKS[section.selector]);
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(sectionMetadata);
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
    "carousel-banner": parse,
    "cards-category": parse2,
    "hero-teaser": parse3
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Aashirvaad homepage featuring brand hero, product showcases, and promotional content",
    urls: [
      "https://aashirvaad.com/"
    ],
    blocks: [
      {
        name: "carousel-banner",
        instances: [
          ".main-banner",
          ".cmp-ourcommunity-teasercarousel-container .cmp-carousel"
        ]
      },
      {
        name: "cards-category",
        instances: [
          ".productcategory",
          ".cmp-recipe-group",
          ".popularproducts",
          ".footprint .cmp-carousel"
        ]
      },
      {
        name: "hero-teaser",
        instances: [
          ".cmp-teaser--first-half-center-aligned",
          ".cmp-teaser--cta"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner Carousel",
        selector: ".color-background-default",
        style: null,
        blocks: ["carousel-banner"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Product Categories",
        selector: ".color-background-default + .color-background-background-2",
        style: "cream",
        blocks: ["cards-category"],
        defaultContent: [".cmp-product-category-listing__title", ".cmp-product-category-listing__subTitle"]
      },
      {
        id: "section-3",
        name: "Video Teaser",
        selector: ".color-background-gradient-3:has(.aashirvaad-video-teaser)",
        style: "gradient",
        blocks: [],
        defaultContent: [".aashirvaad-video-teaser iframe"]
      },
      {
        id: "section-4",
        name: "Recipe Cards",
        selector: ".color-background-background-3:has(.dynamicCardsVertwo)",
        style: "cream",
        blocks: ["cards-category"],
        defaultContent: [".cmp-recipe-group__title", ".cmp-recipe-group__subtitle", ".cmp-recipe-group__action"]
      },
      {
        id: "section-5",
        name: "What Makes Us No.1 Teaser",
        selector: ".color-background-gradient-2",
        style: null,
        blocks: ["hero-teaser"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Most Loved Products",
        selector: ".color-background-background-2:has(.popularproducts)",
        style: "cream",
        blocks: ["cards-category"],
        defaultContent: [".cmp-popular-products__title", ".cmp-popular-products__subtitle"]
      },
      {
        id: "section-7",
        name: "Meri Chakki CTA",
        selector: ".color-background-gradient-3:has(.cmp-teaser--cta)",
        style: null,
        blocks: ["hero-teaser"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Our Vision",
        selector: ".color-background-background-2:has(.footprint)",
        style: "cream",
        blocks: ["cards-category"],
        defaultContent: [".cmp-our-foot-print__title"]
      },
      {
        id: "section-9",
        name: "Our Community",
        selector: ".cmp-ourcommunity-teasercarousel-container",
        style: "cream",
        blocks: ["carousel-banner"],
        defaultContent: [".cta-text .cmp-text"]
      },
      {
        id: "section-10",
        name: "Follow Us Social",
        selector: ".color-background-background-2:has(#container-bf16ed3982)",
        style: null,
        blocks: [],
        defaultContent: ["#text-ccbfbcdd3d", "#button-16b51796b6"]
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
    transform: (payload) => {
      const { document, url, params } = payload;
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
