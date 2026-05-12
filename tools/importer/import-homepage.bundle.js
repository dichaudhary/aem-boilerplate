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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-quote.js
  function parse(element, { document }) {
    const contentContainer = element.querySelector(
      ".nw-banner-inpage__content, .banner-content-custom"
    ) || element;
    const title = contentContainer.querySelector(
      "h1.banner-title, h1.nw-banner-media__title, h1"
    );
    const subheading = contentContainer.querySelector("h2");
    const imageContainer = element.querySelector(".bg-image-container");
    let heroImage = imageContainer ? imageContainer.querySelector("img") : null;
    const imageCaptionEl = imageContainer ? imageContainer.querySelector('.custom-img-text, [class*="img-text"]') : null;
    if (!heroImage && imageContainer) {
      const styleAttr = imageContainer.getAttribute("style") || "";
      let bgMatch = styleAttr.match(/background-image\s*:\s*url\(["']?([^"')]+)["']?\)/i);
      if (!bgMatch) {
        const doc = imageContainer.ownerDocument;
        const styleTags = doc ? doc.querySelectorAll("style") : [];
        for (const tag of styleTags) {
          const text = tag.textContent || "";
          const m = text.match(/\.bg-image-container\s*\{[^}]*background-image\s*:\s*url\(["']?([^"')]+)["']?\)/i);
          if (m) {
            bgMatch = m;
            break;
          }
        }
      }
      if (bgMatch) {
        heroImage = document.createElement("img");
        heroImage.setAttribute("src", "./images/hero-peyton.png");
      }
    }
    const selectEl = contentContainer.querySelector("select#customSelectQuote, select");
    const selectOptions = selectEl ? Array.from(selectEl.querySelectorAll("option")).map((o) => (o.textContent || "").trim()).filter((t) => t.length > 0) : [];
    const supportingLinks = Array.from(
      contentContainer.querySelectorAll('a.find-an-agent-link, a[href*="agency.nationwide.com"], a[href*="/personal/investing"]')
    ).filter((a, i, arr) => arr.indexOf(a) === i);
    const cells = [];
    if (heroImage) {
      const imageCell = [];
      if (!heroImage.getAttribute("alt")) {
        const altText = imageCaptionEl ? (imageCaptionEl.textContent || "").trim() : "He's so much more than Peyton Manning.";
        heroImage.setAttribute("alt", altText);
      }
      imageCell.push(heroImage);
      if (imageCaptionEl) {
        const caption = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = (imageCaptionEl.textContent || "").trim();
        caption.appendChild(em);
        imageCell.push(caption);
      }
      cells.push([imageCell]);
    }
    const contentCell = [];
    if (title) contentCell.push(title);
    if (subheading) contentCell.push(subheading);
    if (selectOptions.length > 0) {
      const selectLabel = document.createElement("p");
      const strongLabel = document.createElement("strong");
      strongLabel.textContent = "Insurance type";
      selectLabel.appendChild(strongLabel);
      contentCell.push(selectLabel);
      const optionList = document.createElement("ul");
      selectOptions.forEach((opt) => {
        const li = document.createElement("li");
        li.textContent = opt;
        optionList.appendChild(li);
      });
      contentCell.push(optionList);
    }
    const zipInput = contentContainer.querySelector("input#detail-banner__zip-input, input.zip-field");
    if (zipInput) {
      const zipLine = document.createElement("p");
      const zipLabel = document.createElement("strong");
      zipLabel.textContent = "ZIP Code: ";
      zipLine.appendChild(zipLabel);
      zipLine.appendChild(document.createTextNode("ZIP Code"));
      contentCell.push(zipLine);
    }
    const submitBtn = contentContainer.querySelector(
      "input#detail-banner__quote-btn, input.custom-quote-submit"
    );
    if (submitBtn) {
      const ctaLine = document.createElement("p");
      const ctaLink = document.createElement("a");
      ctaLink.setAttribute("href", "#");
      ctaLink.textContent = "Start your quote";
      ctaLine.appendChild(ctaLink);
      contentCell.push(ctaLine);
    }
    supportingLinks.forEach((link) => {
      const linkLine = document.createElement("p");
      linkLine.appendChild(link);
      contentCell.push(linkLine);
    });
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero-quote",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-action.js
  var ICON_BY_HEADING = {
    "No login required": { alt: "house icon", src: "./images/house.png" },
    "Find a local agent": { alt: "pin icon", src: "./images/pin.png" },
    "Term life insurance": { alt: "heart icon", src: "./images/heart.png" }
  };
  var SELECT_LABEL = "Select a service:";
  var FORM_LABEL = "ZIP Code";
  var FORM_PLACEHOLDER = "Enter your 5 or 9 digit ZIP Code";
  function buildCardRow(cardEl, document) {
    var _a;
    const headingText = (((_a = cardEl.querySelector("h1, h2, h3, h4, h5, h6")) == null ? void 0 : _a.textContent) || "").trim();
    const iconInfo = ICON_BY_HEADING[headingText] || { alt: "card icon", src: "" };
    let icon = null;
    if (iconInfo.src) {
      icon = document.createElement("img");
      icon.setAttribute("src", iconInfo.src);
      icon.setAttribute("alt", iconInfo.alt);
    }
    if (!icon) {
      icon = cardEl.querySelector("img");
    }
    if (icon && !icon.getAttribute("alt")) {
      icon.setAttribute("alt", iconInfo.alt);
    }
    const textCell = [];
    const heading = cardEl.querySelector("h1, h2, h3, h4, h5, h6, .custom-heading");
    if (heading) textCell.push(heading);
    const description = cardEl.querySelector(":scope > p, :scope > div > p, p");
    if (description) textCell.push(description);
    const selectEl = cardEl.querySelector("select");
    if (selectEl) {
      const options = Array.from(selectEl.querySelectorAll("option")).map((o) => (o.textContent || "").trim()).filter((t) => t.length > 0);
      if (options.length > 0) {
        const labelP = document.createElement("p");
        const labelStrong = document.createElement("strong");
        labelStrong.textContent = SELECT_LABEL;
        labelP.appendChild(labelStrong);
        textCell.push(labelP);
        const ul = document.createElement("ul");
        options.forEach((opt) => {
          const li = document.createElement("li");
          li.textContent = opt;
          ul.appendChild(li);
        });
        textCell.push(ul);
      }
      const goLine = document.createElement("p");
      const goLink = document.createElement("a");
      goLink.setAttribute("href", "#");
      goLink.textContent = "Go";
      goLine.appendChild(goLink);
      textCell.push(goLine);
    }
    const formEl = cardEl.querySelector("form");
    if (formEl) {
      const zipLabelP = document.createElement("p");
      const zipLabelStrong = document.createElement("strong");
      zipLabelStrong.textContent = FORM_LABEL;
      zipLabelP.appendChild(zipLabelStrong);
      textCell.push(zipLabelP);
      const placeholderP = document.createElement("p");
      const placeholderEm = document.createElement("em");
      placeholderEm.textContent = FORM_PLACEHOLDER;
      placeholderP.appendChild(placeholderEm);
      textCell.push(placeholderP);
      const formAction = formEl.getAttribute("action") || "https://agency.nationwide.com/search";
      const goLine = document.createElement("p");
      const goLink = document.createElement("a");
      goLink.setAttribute("href", formAction);
      goLink.textContent = "Go";
      goLine.appendChild(goLink);
      textCell.push(goLine);
    }
    const anchorCtas = Array.from(
      cardEl.querySelectorAll('a.button, a.nw-button--expand, a[class*="button"]')
    ).filter((a, i, arr) => arr.indexOf(a) === i);
    anchorCtas.forEach((a) => {
      const ctaLine = document.createElement("p");
      ctaLine.appendChild(a);
      textCell.push(ctaLine);
    });
    return [icon || "", textCell];
  }
  function parse2(element, { document }) {
    const parent = element.parentElement;
    if (!parent) return;
    const cards = Array.from(parent.querySelectorAll(":scope > .custom-tri-promo"));
    if (cards.length === 0) return;
    if (cards[0] !== element) {
      element.remove();
      return;
    }
    const cells = cards.map((card) => buildCardRow(card, document));
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-action",
      cells
    });
    parent.replaceWith(block);
  }

  // tools/importer/parsers/cards-category.js
  var CATEGORY_ICON_BY_HEADING = {
    "For you and your family": { src: "./images/person-shield.png", alt: "person shield icon" },
    "For your business": { src: "./images/open-sign.png", alt: "open sign icon" },
    "For your future": { src: "./images/shield.png", alt: "shield icon" }
  };
  function parse3(element, { document }) {
    const cardsSection = element.querySelector("section.nw-multi-option-promo, section.nw-container") || element;
    const cardEls = Array.from(cardsSection.querySelectorAll(".row > .column"));
    const cells = [];
    cardEls.forEach((card) => {
      const heading = card.querySelector('h3.mopHeading, h2, h3, h4, [class*="Heading"]');
      const description = card.querySelector("p.mopDesc, p");
      const cta = card.querySelector('a.button, a.hollow, a[class*="button"], a');
      const headingText = ((heading == null ? void 0 : heading.textContent) || "").trim();
      const iconInfo = CATEGORY_ICON_BY_HEADING[headingText];
      let icon = null;
      if (iconInfo) {
        icon = document.createElement("img");
        icon.setAttribute("src", iconInfo.src);
        icon.setAttribute("alt", iconInfo.alt);
      }
      if (!icon) {
        icon = card.querySelector("img");
      }
      if (icon && !icon.getAttribute("alt")) {
        const altText = headingText ? `${headingText} icon` : "category icon";
        icon.setAttribute("alt", altText);
      }
      const textCell = [];
      if (heading) textCell.push(heading);
      if (description) textCell.push(description);
      if (cta) textCell.push(cta);
      if (textCell.length > 0) {
        cells.push([icon || "", textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-category", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-tile.js
  function extractBackgroundImageUrl(el) {
    if (!el) return null;
    const style = el.getAttribute("style") || "";
    const match = style.match(/background-image\s*:\s*url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
    return match ? match[1] : null;
  }
  var TILE_IMAGE_BY_HEADING = {
    "Let us protect your financial future, too": "./images/tile-financial-future.jpg",
    "The importance of long-term care": "./images/tile-long-term-care.jpg",
    "Protect your small business": "./images/tile-small-business.jpg",
    "Save an average of $1,032 when you bundle home and car insurance*": "./images/tile-bundle.jpg",
    "Easy access to manage your insurance online": "./images/tile-manage-online.png"
  };
  function buildTileRow(tileAnchor, document) {
    const href = tileAnchor.getAttribute("href") || "#";
    const headingEl = tileAnchor.querySelector(
      'h2.nw-tile-block__content-subheader, h2, h3, [class*="subheader"]'
    );
    const headingText = ((headingEl == null ? void 0 : headingEl.textContent) || "").trim();
    const imageWrapper = tileAnchor.querySelector(".nw-tile-block__image");
    let imageCell = "";
    const localSrc = TILE_IMAGE_BY_HEADING[headingText];
    if (localSrc) {
      const img = document.createElement("img");
      img.setAttribute("src", localSrc);
      img.setAttribute("alt", headingText);
      imageCell = img;
    } else {
      const existingImg = (imageWrapper == null ? void 0 : imageWrapper.querySelector("img")) || tileAnchor.querySelector("img");
      if (existingImg) {
        if (!existingImg.getAttribute("alt") && headingText) {
          existingImg.setAttribute("alt", headingText);
        }
        imageCell = existingImg;
      } else {
        const bgUrl = extractBackgroundImageUrl(imageWrapper);
        if (bgUrl) {
          const img = document.createElement("img");
          img.setAttribute("src", bgUrl);
          img.setAttribute("alt", headingText || "");
          imageCell = img;
        }
      }
    }
    const textCell = [];
    if (headingEl) {
      const heading = document.createElement("h2");
      const link = document.createElement("a");
      link.setAttribute("href", href);
      link.textContent = headingText;
      heading.appendChild(link);
      textCell.push(heading);
    } else if (href && href !== "#") {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.setAttribute("href", href);
      link.textContent = href;
      p.appendChild(link);
      textCell.push(p);
    }
    return [imageCell, textCell];
  }
  function parse4(element, { document }) {
    const tileAnchors = Array.from(
      element.querySelectorAll("a.nw-tile-block__tile")
    );
    if (tileAnchors.length === 0) {
      return;
    }
    const cells = tileAnchors.map((tile) => buildTileRow(tile, document));
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-tile",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  var CTA_ICON_BY_HEADLINE = {
    "Are you a Nationwide member?": { src: "./images/handshake.png", alt: "handshake icon" },
    "Have a business to protect?": { src: "./images/storefront.png", alt: "storefront icon" }
  };
  function parse5(element, { document }) {
    const scope = element.querySelector("section.nw-cta-small, .nw-cta-small") || element;
    const headlineStrongEl = scope.querySelector(".nw-cta-small__text strong");
    const headlineText = ((headlineStrongEl == null ? void 0 : headlineStrongEl.textContent) || "").replace(/ /g, " ").trim();
    const iconInfo = CTA_ICON_BY_HEADLINE[headlineText];
    let icon = null;
    if (iconInfo) {
      icon = document.createElement("img");
      icon.setAttribute("src", iconInfo.src);
      icon.setAttribute("alt", iconInfo.alt);
    }
    if (!icon) {
      const iconContainer = scope.querySelector(".nw-cta-small__icon");
      icon = iconContainer ? iconContainer.querySelector("img") : null;
    }
    const textContainer = scope.querySelector(".nw-cta-small__text");
    const textCell = [];
    if (textContainer) {
      const headlineStrong = textContainer.querySelector("strong");
      if (headlineStrong) {
        const h = document.createElement("h3");
        h.textContent = (headlineStrong.textContent || "").replace(/ /g, " ").trim();
        textCell.push(h);
      }
      const textRoot = textContainer.querySelector(".cta-text") || textContainer;
      const descriptionDivs = Array.from(textRoot.querySelectorAll(":scope > div")).filter((d) => !d.querySelector("strong")).filter((d) => (d.textContent || "").trim().length > 0);
      descriptionDivs.forEach((d) => {
        const p = document.createElement("p");
        p.textContent = (d.textContent || "").replace(/ /g, " ").trim();
        textCell.push(p);
      });
    }
    let ctaLink = null;
    const trailingSections = Array.from(
      scope.querySelectorAll(":scope > .media-object-section")
    ).filter((s) => !s.classList.contains("nw-cta-small__icon") && !s.classList.contains("nw-cta-small__text"));
    for (const s of trailingSections) {
      const a = s.querySelector("a[href]");
      if (a) {
        ctaLink = a;
        break;
      }
    }
    if (!ctaLink) {
      ctaLink = scope.querySelector(
        'a.button, a[class*="nw-button"], a[class*="button"]'
      );
    }
    if (!ctaLink && textContainer) {
      ctaLink = textContainer.querySelector("a[href]");
    }
    if (ctaLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.setAttribute("href", ctaLink.getAttribute("href") || "#");
      a.textContent = (ctaLink.textContent || "").trim();
      p.appendChild(a);
      textCell.push(p);
    }
    const cells = [
      [icon || "", textCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-cta",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-app.js
  function parse6(element, { document }) {
    const columnDivs = Array.from(
      element.querySelectorAll(".large-6.small-12.columns.rtc-paragraph")
    );
    const [leftCol, rightCol] = columnDivs;
    const leftCell = [];
    if (leftCol) {
      const leftScope = leftCol.querySelector(":scope > span") || leftCol;
      const intro = leftScope.querySelector('.nw-text-lg, [class*="text-lg"]');
      if (intro) {
        const p = document.createElement("p");
        p.textContent = (intro.textContent || "").replace(/ /g, " ").trim();
        if (p.textContent) leftCell.push(p);
      }
      const heading = leftScope.querySelector('h1, h2, h3, h4, [class*="heading"]');
      if (heading) leftCell.push(heading);
      const candidateDivs = Array.from(leftScope.querySelectorAll(":scope > div"));
      const listItems = candidateDivs.filter((d) => {
        if (d.classList.contains("nw-text-lg")) return false;
        const text = (d.textContent || "").replace(/ /g, " ").trim();
        return text.length > 0;
      });
      if (listItems.length > 0) {
        const ul = document.createElement("ul");
        listItems.forEach((itemDiv) => {
          const li = document.createElement("li");
          const text = (itemDiv.textContent || "").replace(/ /g, " ").trim();
          if (text) {
            li.textContent = text;
            ul.appendChild(li);
          }
        });
        if (ul.children.length > 0) leftCell.push(ul);
      }
    }
    const rightCell = [];
    if (rightCol) {
      const rightScope = rightCol.querySelector(":scope > span") || rightCol;
      const qrImage = document.createElement("img");
      qrImage.setAttribute("src", "./images/qr-code.png");
      qrImage.setAttribute("alt", "Scan this QR code to download the app!");
      rightCell.push(qrImage);
      const caption = rightScope.querySelector("p");
      if (caption) rightCell.push(caption);
    }
    const cells = [
      [leftCell, rightCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-app",
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

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Nationwide.com homepage featuring hero with insurance-type selector and ZIP quote CTA, self-service tri-promo cards with dropdowns and ZIP form, 3-column category cards, tile blocks for feature promos, mobile app columns, and marketing banners.",
    urls: ["https://www.nationwide.com/"],
    blocks: [
      {
        name: "hero-quote",
        instances: ["div.nw-home-quote-banner"]
      },
      {
        name: "cards-action",
        instances: ["div.custom-tri-promo"]
      },
      {
        name: "cards-category",
        instances: ["section.nw-multi-option-promo"]
      },
      {
        name: "columns-cta",
        instances: [
          "div#p45265.nw-bg-blue-darkest.nw-small-cta",
          "div#p45310.nw-bg-blue-darkest.nw-small-cta"
        ]
      },
      {
        name: "cards-tile",
        instances: [
          "section#p30097.nw-tile-block",
          "section#p30087.nw-tile-block"
        ]
      },
      {
        name: "columns-app",
        instances: ["div#p43655.rtc-component.nw-bg-rebrand-vibrant-blue"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero banner",
        selector: "div.nw-home-quote-banner",
        style: null,
        blocks: ["hero-quote"],
        defaultContent: []
      },
      {
        id: "section-2-tri-promo",
        name: "Tri-promo action cards",
        selector: ["div.row.text-center.align-center.nw-inner-bottom"],
        style: null,
        blocks: ["cards-action"],
        defaultContent: []
      },
      {
        id: "section-3-category",
        name: "Protecting people, businesses and futures",
        selector: "div#p43486.nw-multi-option-promo",
        style: "light-grey",
        blocks: ["cards-category"],
        defaultContent: ["div#p43486 h2.nw-heading-tiempos-md"]
      },
      {
        id: "section-4-member-cta",
        name: "Are you a Nationwide member CTA",
        selector: "div#p45265.nw-bg-blue-darkest.nw-small-cta",
        style: "navy-blue",
        blocks: ["columns-cta"],
        defaultContent: []
      },
      {
        id: "section-5-tile-block-2",
        name: "Two-tile financial future + long-term care",
        selector: "section#p30097.nw-tile-block",
        style: null,
        blocks: ["cards-tile"],
        defaultContent: []
      },
      {
        id: "section-6-tile-block-3",
        name: "Three-tile small business + bundle + manage online",
        selector: "section#p30087.nw-tile-block",
        style: null,
        blocks: ["cards-tile"],
        defaultContent: []
      },
      {
        id: "section-7-most-important",
        name: "Protecting what's most important narrative",
        selector: "div#p45234.rtc-component",
        style: null,
        blocks: [],
        defaultContent: ["div#p45234 h2", "div#p45234 p"]
      },
      {
        id: "section-8-business-cta",
        name: "Have a business to protect CTA",
        selector: "div#p45310.nw-bg-blue-darkest.nw-small-cta",
        style: "navy-blue",
        blocks: ["columns-cta"],
        defaultContent: []
      },
      {
        id: "section-9-app-promo",
        name: "Mobile app promo with QR",
        selector: "div#p43655.rtc-component.nw-bg-rebrand-vibrant-blue",
        style: "vibrant-blue",
        blocks: ["columns-app"],
        defaultContent: []
      },
      {
        id: "section-10-disclaimer",
        name: "Disclaimer footnote",
        selector: "div#p44604.rtc-component",
        style: null,
        blocks: [],
        defaultContent: ["div#p44604 div.nw-text-sm"]
      }
    ]
  };
  var parsers = {
    "hero-quote": parse,
    "cards-action": parse2,
    "cards-category": parse3,
    "cards-tile": parse4,
    "columns-cta": parse5,
    "columns-app": parse6
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
  var import_homepage_default = {
    /**
     * Main transformation function
     */
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
            console.error(
              `Failed to parse ${block.name} (${block.selector}):`,
              e
            );
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
      let pathname = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      if (pathname === "") pathname = "/index";
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
  return __toCommonJS(import_homepage_exports);
})();
