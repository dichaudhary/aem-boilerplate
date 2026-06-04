var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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

  // tools/importer/import-insurance-landing.js
  var import_insurance_landing_exports = {};
  __export(import_insurance_landing_exports, {
    default: () => import_insurance_landing_default
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
    const ctaParas = contentContainer.querySelectorAll("p");
    for (const p of ctaParas) {
      const text = (p.textContent || "").trim();
      if (text.match(/call us|quote at|\d{3}[- ]\d{3}[- ]\d{4}/i)) {
        const phonePara = document.createElement("p");
        phonePara.textContent = text;
        const phoneLink = p.querySelector('a[href*="tel:"], a');
        if (phoneLink && phoneLink.getAttribute("href")) {
          const a = document.createElement("a");
          a.setAttribute("href", phoneLink.getAttribute("href"));
          a.textContent = phoneLink.textContent.trim();
          phonePara.textContent = text.replace(phoneLink.textContent.trim(), "");
          phonePara.appendChild(a);
        }
        contentCell.push(phonePara);
        break;
      }
    }
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

  // tools/importer/parsers/columns-video.js
  function parse2(element, { document }) {
    const videoCol = element.querySelector(".video-holder, .large-6.columns:has(iframe), .large-6.columns:has(figure)");
    const textCol = element.querySelector(".large-6.columns:not(.video-holder):not(:has(iframe))");
    const leftCell = [];
    if (videoCol) {
      const iframe = videoCol.querySelector('iframe.wistia_embed, iframe[src*="wistia"], iframe');
      if (iframe) {
        const videoSrc = iframe.getAttribute("src") || "";
        const videoTitle = iframe.getAttribute("title") || "Video";
        const a = document.createElement("a");
        a.setAttribute("href", videoSrc);
        a.textContent = videoTitle.trim() || "Video";
        leftCell.push(a);
      }
    }
    const rightCell = [];
    if (textCol) {
      const heading = textCol.querySelector('h1, h2, h3, h4, [class*="heading"]');
      if (heading) rightCell.push(heading);
      const paragraphs = Array.from(textCol.querySelectorAll("p"));
      paragraphs.forEach((p) => {
        const text = (p.textContent || "").replace(/ /g, " ").trim();
        if (text) rightCell.push(p);
      });
    }
    const cells = [
      [leftCell, rightCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-video",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-action.js
  function buildInsuranceCard(cardEl, document) {
    const icon = cardEl.querySelector("img");
    const heading = cardEl.querySelector("h3, h2, h4");
    const desc = cardEl.querySelector("p.mopDesc, p");
    const cta = cardEl.querySelector('a.button, a[class*="button"], a');
    const textCell = [];
    if (heading) {
      const h = document.createElement("h3");
      h.textContent = heading.textContent.trim();
      textCell.push(h);
    }
    if (desc) {
      const p = document.createElement("p");
      p.textContent = desc.textContent.trim();
      textCell.push(p);
    }
    if (cta) {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.setAttribute("href", cta.getAttribute("href") || "#");
      link.textContent = cta.textContent.trim();
      p.appendChild(link);
      textCell.push(p);
    }
    return [icon || "", textCell];
  }
  function buildHomepageCard(cardEl, document) {
    const headingText = (cardEl.querySelector("h1, h2, h3, h4, h5, h6")?.textContent || "").trim();
    const ICON_BY_HEADING = {
      "No login required": { alt: "house icon", src: "./images/house.svg" },
      "Find a local agent": { alt: "pin icon", src: "./images/pin.svg" },
      "Term life insurance": { alt: "heart icon", src: "./images/heart.svg" }
    };
    const iconInfo = ICON_BY_HEADING[headingText] || { alt: "card icon", src: "" };
    let icon = null;
    if (iconInfo.src) {
      icon = document.createElement("img");
      icon.setAttribute("src", iconInfo.src);
      icon.setAttribute("alt", iconInfo.alt);
    }
    if (!icon) icon = cardEl.querySelector("img");
    const textCell = [];
    const heading = cardEl.querySelector("h1, h2, h3, h4, h5, h6");
    if (heading) textCell.push(heading);
    const description = cardEl.querySelector("p");
    if (description) textCell.push(description);
    const selectEl = cardEl.querySelector("select");
    if (selectEl) {
      const options = Array.from(selectEl.querySelectorAll("option")).map((o) => o.textContent.trim()).filter((t) => t.length > 0);
      if (options.length > 0) {
        const labelP = document.createElement("p");
        const labelStrong = document.createElement("strong");
        labelStrong.textContent = "Select a service:";
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
      zipLabelStrong.textContent = "ZIP Code";
      zipLabelP.appendChild(zipLabelStrong);
      textCell.push(zipLabelP);
      const placeholderP = document.createElement("p");
      const placeholderEm = document.createElement("em");
      placeholderEm.textContent = "Enter your 5 or 9 digit ZIP Code";
      placeholderP.appendChild(placeholderEm);
      textCell.push(placeholderP);
      const goLine = document.createElement("p");
      const goLink = document.createElement("a");
      goLink.setAttribute("href", formEl.getAttribute("action") || "https://agency.nationwide.com/search");
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
  function parse3(element, { document }) {
    const columns = element.querySelectorAll(".column.small-12.large-4, .column.large-4");
    if (columns.length > 0) {
      const cells2 = Array.from(columns).map((col) => buildInsuranceCard(col, document));
      const block2 = WebImporter.Blocks.createBlock(document, {
        name: "cards-action",
        cells: cells2
      });
      element.replaceWith(block2);
      return;
    }
    const parent = element.parentElement;
    if (!parent) return;
    const cards = Array.from(parent.querySelectorAll(":scope > .custom-tri-promo"));
    if (cards.length === 0) return;
    if (cards[0] !== element) {
      element.remove();
      return;
    }
    const cells = cards.map((card) => buildHomepageCard(card, document));
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-action",
      cells
    });
    parent.replaceWith(block);
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
  function buildHomepageTileRow(tileAnchor, document) {
    const href = tileAnchor.getAttribute("href") || "#";
    const headingEl = tileAnchor.querySelector('h2, h3, [class*="subheader"]');
    const headingText = (headingEl?.textContent || "").trim();
    const imageWrapper = tileAnchor.querySelector(".nw-tile-block__image");
    let imageCell = "";
    const localSrc = TILE_IMAGE_BY_HEADING[headingText];
    if (localSrc) {
      const img = document.createElement("img");
      img.setAttribute("src", localSrc);
      img.setAttribute("alt", headingText);
      imageCell = img;
    } else {
      const existingImg = imageWrapper?.querySelector("img") || tileAnchor.querySelector("img");
      if (existingImg) {
        if (!existingImg.getAttribute("alt") && headingText) existingImg.setAttribute("alt", headingText);
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
    }
    return [imageCell, textCell];
  }
  function buildInsuranceTileRow(tileEl, document) {
    const anchor = tileEl.tagName === "A" ? tileEl : tileEl.querySelector("a");
    const href = anchor ? anchor.getAttribute("href") || "#" : "#";
    const img = tileEl.querySelector("img");
    const heading = tileEl.querySelector("h2, h3, h4, h5, h6");
    const headingText = (heading?.textContent || "").trim();
    let imageCell = "";
    if (img) {
      if (!img.getAttribute("alt") && headingText) img.setAttribute("alt", headingText);
      imageCell = img;
    }
    const textCell = [];
    if (headingText) {
      const h = document.createElement("h2");
      const link = document.createElement("a");
      link.setAttribute("href", href);
      link.textContent = headingText;
      h.appendChild(link);
      textCell.push(h);
    } else if (anchor) {
      const p = document.createElement("p");
      const link = document.createElement("a");
      link.setAttribute("href", href);
      link.textContent = anchor.textContent.trim() || href;
      p.appendChild(link);
      textCell.push(p);
    }
    const desc = tileEl.querySelector("p");
    if (desc) {
      const descText = desc.textContent.trim();
      if (descText && descText !== headingText) {
        const para = document.createElement("p");
        para.textContent = descText;
        textCell.push(para);
      }
    }
    return [imageCell, textCell];
  }
  function parse4(element, { document }) {
    const tileAnchors = Array.from(element.querySelectorAll("a.nw-tile-block__tile"));
    if (tileAnchors.length > 0) {
      const cells = tileAnchors.map((tile) => buildHomepageTileRow(tile, document));
      const block = WebImporter.Blocks.createBlock(document, { name: "cards-tile", cells });
      element.replaceWith(block);
      return;
    }
    const contentPromo = element.querySelector(".nw-content-promo");
    if (contentPromo) {
      const items = Array.from(contentPromo.querySelectorAll("ul > li"));
      if (items.length > 0) {
        const cells = items.map((li) => buildInsuranceTileRow(li, document));
        const block = WebImporter.Blocks.createBlock(document, { name: "cards-tile", cells });
        element.replaceWith(block);
        return;
      }
    }
    const resourceLinks = Array.from(element.querySelectorAll(".nw-content-promo a, .nw-tile-block__tile"));
    if (resourceLinks.length === 0) {
      const linkedCards = Array.from(element.querySelectorAll("a[href]")).filter((a) => a.querySelector("img") || a.querySelector("h2, h3, h4, h5"));
      if (linkedCards.length > 0) {
        const cells = linkedCards.map((a) => buildInsuranceTileRow(a, document));
        const block = WebImporter.Blocks.createBlock(document, { name: "cards-tile", cells });
        element.replaceWith(block);
        return;
      }
    }
    if (resourceLinks.length > 0) {
      const cells = resourceLinks.map((a) => buildInsuranceTileRow(a, document));
      const block = WebImporter.Blocks.createBlock(document, { name: "cards-tile", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/columns-banner.js
  function parse5(element, { document }) {
    const mediaContainer = element.querySelector(".nw-banner-inpage__image, .nw-banner-inpage__media img");
    const img = mediaContainer ? mediaContainer.tagName === "IMG" ? mediaContainer : mediaContainer.querySelector("img") : element.querySelector("img");
    const imageCell = [];
    if (img) {
      imageCell.push(img);
    }
    const contentContainer = element.querySelector(".nw-banner-inpage__content");
    const contentCell = [];
    if (contentContainer) {
      const heading = contentContainer.querySelector("h2, h3, h1, h4");
      if (heading) {
        contentCell.push(heading);
      }
      const paragraphs = Array.from(contentContainer.querySelectorAll(":scope > p"));
      paragraphs.forEach((p) => {
        const links = p.querySelectorAll("a[href]");
        const hasOnlyLink = links.length > 0 && p.textContent.trim() === links[0].textContent.trim();
        if (!hasOnlyLink) {
          contentCell.push(p);
        }
      });
      const allLinks = Array.from(contentContainer.querySelectorAll("a[href]"));
      allLinks.forEach((link) => {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", link.getAttribute("href") || "#");
        a.textContent = (link.textContent || "").trim();
        if (link.classList.contains("button") || link.className.includes("nw-button")) {
          a.setAttribute("class", "button");
        }
        p.appendChild(a);
        contentCell.push(p);
      });
    }
    const isImageRight = element.classList.contains("nw-banner-inpage--right");
    const cells = isImageRight ? [[contentCell, imageCell]] : [[imageCell, contentCell]];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-banner",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-info.js
  function parse6(element, { document }) {
    const elementsBeforeBlock = [];
    const heading = element.querySelector("h2");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = (heading.textContent || "").trim();
      elementsBeforeBlock.push(h2);
    }
    const introContainer = element.querySelector(".nw-container-article p, div.nw-heading-sm.nw-container-article");
    let introText = null;
    if (introContainer) {
      introText = introContainer;
    } else {
      const headingSm = element.querySelector("div.nw-heading-sm");
      if (headingSm) introText = headingSm;
    }
    if (introText && (introText.textContent || "").trim()) {
      const p = document.createElement("p");
      p.textContent = (introText.textContent || "").trim();
      elementsBeforeBlock.push(p);
    }
    const columnDivs = Array.from(
      element.querySelectorAll('.large-6.rtc-paragraph, div[class*="large-6"][class*="rtc-paragraph"]')
    );
    const colContainers = columnDivs.length >= 2 ? [columnDivs[0], columnDivs[1]] : Array.from(element.querySelectorAll(".row > div.rtc-paragraph")).slice(0, 2);
    const leftContainer = colContainers[0];
    const rightContainer = colContainers[1];
    const leftCell = [];
    const rightCell = [];
    function extractDefinitions(container, targetCell) {
      if (!container) return;
      const contentRoot = container.querySelector("span") || container;
      const children = Array.from(contentRoot.children);
      children.forEach((child) => {
        if (child.tagName === "H3" || child.tagName === "DIV" && child.classList.contains("nw-heading")) {
          const h3 = document.createElement("h3");
          const link = child.querySelector("a[href]");
          if (link) {
            const a = document.createElement("a");
            a.setAttribute("href", link.getAttribute("href") || "#");
            a.textContent = (link.textContent || "").trim();
            h3.appendChild(a);
          } else {
            h3.textContent = (child.textContent || "").trim();
          }
          targetCell.push(h3);
        } else if (child.tagName === "P" || child.tagName === "DIV" && !child.classList.contains("nw-heading")) {
          const text = (child.textContent || "").trim();
          if (text) {
            const p = document.createElement("p");
            p.textContent = text;
            targetCell.push(p);
          }
        }
      });
    }
    extractDefinitions(leftContainer, leftCell);
    extractDefinitions(rightContainer, rightCell);
    const elementsAfterBlock = [];
    const trailingFullWidthSections = Array.from(
      element.querySelectorAll('.large-12.rtc-paragraph, div[class*="large-12"][class*="rtc-paragraph"]')
    );
    trailingFullWidthSections.forEach((section) => {
      if (section.querySelector("h2") || section.querySelector(".nw-heading-sm")) return;
      if (section.querySelector(".large-6")) return;
      const trailingParagraph = section.querySelector("p") || section.querySelector("span > p");
      if (trailingParagraph && (trailingParagraph.textContent || "").trim()) {
        const p = document.createElement("p");
        const link = trailingParagraph.querySelector("a[href]");
        if (link) {
          const a = document.createElement("a");
          a.setAttribute("href", link.getAttribute("href") || "#");
          a.textContent = (link.textContent || "").trim();
          const fullText = (trailingParagraph.textContent || "").trim();
          const linkText = (link.textContent || "").trim();
          const parts = fullText.split(linkText);
          const beforeLink = parts[0] || "";
          const afterLink = parts[1] || "";
          if (beforeLink) p.appendChild(document.createTextNode(beforeLink));
          p.appendChild(a);
          if (afterLink) p.appendChild(document.createTextNode(afterLink));
        } else {
          p.textContent = (trailingParagraph.textContent || "").trim();
        }
        if ((p.textContent || "").trim()) {
          elementsAfterBlock.push(p);
        }
      }
    });
    const cells = [
      [leftCell, rightCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-info",
      cells
    });
    element.replaceWith(...elementsBeforeBlock, block, ...elementsAfterBlock);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse7(element, { document }) {
    const accordion = element.querySelector(".nw-accordion") || element;
    const panels = Array.from(accordion.querySelectorAll(".panel.panel-default, .panel-default"));
    if (panels.length === 0) {
      element.remove();
      return;
    }
    const cells = [];
    panels.forEach((panel) => {
      const questionEl = panel.querySelector(
        ".panel-title a span, .panel-title a, .panel-title span, .panel-title"
      );
      const questionText = questionEl ? questionEl.textContent.trim() : "";
      if (!questionText) return;
      const questionHeading = document.createElement("h3");
      questionHeading.textContent = questionText;
      const panelBody = panel.querySelector(".panel-body");
      const answerElements = [];
      if (panelBody) {
        const spanWrapper = panelBody.querySelector(":scope > span");
        const contentParent = spanWrapper || panelBody;
        Array.from(contentParent.children).forEach((child) => {
          if (child.classList && child.classList.contains("rtc-component") && !child.textContent.trim()) {
            return;
          }
          if (["P", "UL", "OL", "H1", "H2", "H3", "H4", "H5", "H6"].includes(child.tagName)) {
            answerElements.push(child);
          } else if (child.tagName === "DIV" && child.textContent.trim()) {
            const innerPs = Array.from(child.querySelectorAll("p, ul, ol"));
            if (innerPs.length > 0) {
              answerElements.push(...innerPs);
            } else {
              const p = document.createElement("p");
              p.textContent = child.textContent.trim();
              answerElements.push(p);
            }
          }
        });
      }
      cells.push([questionHeading, ...answerElements]);
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, {
      name: "accordion-faq",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  var CTA_ICON_BY_HEADLINE = {
    "Are you a Nationwide member?": { src: "./images/handshake.svg", alt: "handshake icon" },
    "Have a business to protect?": { src: "./images/storefront.svg", alt: "storefront icon" }
  };
  function parse8(element, { document }) {
    const scope = element.querySelector("section.nw-cta-small, .nw-cta-small") || element;
    const headlineStrongEl = scope.querySelector(".nw-cta-small__text strong");
    const headlineText = (headlineStrongEl?.textContent || "").replace(/ /g, " ").trim();
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
  function transform2(hookName, element, payload) {
    if (hookName !== "beforeTransform") return;
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument;
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        if (!sel) continue;
        try {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        } catch (e) {
        }
      }
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

  // tools/importer/import-insurance-landing.js
  var PAGE_TEMPLATE = {
    name: "insurance-landing",
    description: "Nationwide insurance category landing pages featuring product descriptions, quote CTAs, coverages/discounts cards, FAQs, and related resources.",
    urls: ["https://www.nationwide.com/personal/insurance/auto/"],
    blocks: [
      { name: "hero-quote", instances: [".nw-banner2"] },
      { name: "columns-video", instances: [".nw-video-mediamanager"] },
      { name: "cards-action", instances: [".nw-multi-option-promo"] },
      { name: "cards-tile", instances: [".nw-content-promo", "section.nw-bg-gray-pale-25"] },
      { name: "columns-banner", instances: [".nw-banner-inpage"] },
      { name: "columns-info", instances: [".rtc-component:has(.large-6.rtc-paragraph)"] },
      { name: "accordion-faq", instances: [".nw-accordion"] },
      { name: "columns-cta", instances: [".nw-small-cta"] }
    ],
    sections: [
      { id: "section-1-hero", selector: "#p38136.nw-banner2", style: "dark-blue", blocks: ["hero-quote"] },
      { id: "section-2-intro", selector: "#p38848.rtc-component", style: null, blocks: ["columns-video"] },
      { id: "section-3-coverages", selector: "#p44958.nw-multi-option-promo", style: null, blocks: ["cards-action"] },
      { id: "section-4-usage-programs", selector: "#p37552.nw-container", style: null, blocks: ["cards-tile"] },
      { id: "section-5-state-requirements", selector: "#p40928.rtc-component", style: null, blocks: [] },
      { id: "section-6-banner-control", selector: "#p37116.nw-banner-inpage", style: null, blocks: ["columns-banner"] },
      { id: "section-7-bundling", selector: ["#p44708.rtc-component", "#p42025.rtc-component"], style: null, blocks: [] },
      { id: "section-8-coverages-list", selector: "#p43606.rtc-component", style: "grey", blocks: ["columns-info"] },
      { id: "section-9-faq", selector: "#p36671", style: null, blocks: ["accordion-faq"] },
      { id: "section-10-classic-cta", selector: "#p45385.nw-small-cta", style: null, blocks: ["columns-cta"] },
      { id: "section-11-banner-claims", selector: "#p37254.nw-banner-inpage", style: null, blocks: ["columns-banner"] },
      { id: "section-12-terminology", selector: "#p42591.rtc-component", style: null, blocks: ["columns-info"] },
      { id: "section-13-resources", selector: "#p38585.nw-bg-gray-pale-25", style: "grey", blocks: ["cards-tile"] },
      { id: "section-14-disclaimers", selector: "#p39172.rtc-component", style: null, blocks: [] }
    ]
  };
  var parsers = {
    "hero-quote": parse,
    "columns-video": parse2,
    "cards-action": parse3,
    "cards-tile": parse4,
    "columns-banner": parse5,
    "columns-info": parse6,
    "accordion-faq": parse7,
    "columns-cta": parse8
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = {
      ...payload,
      template: PAGE_TEMPLATE
    };
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
  var import_insurance_landing_default = {
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
  return __toCommonJS(import_insurance_landing_exports);
})();
