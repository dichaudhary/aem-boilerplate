/* eslint-disable */
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

  // tools/importer/import-investing.js
  var import_investing_exports = {};
  __export(import_investing_exports, {
    default: () => import_investing_default
  });

  // tools/importer/parsers/hero-invest.js
  function parse(element, { document }) {
    const heroImage = element.querySelector(
      ".nw-banner-inpage__image img, .nw-banner-inpage__media img"
    );
    const contentContainer = element.querySelector(
      ".nw-banner-inpage__content"
    ) || element;
    const title = contentContainer.querySelector(
      'h1.nw-heading-tiempos-mdlg, h1[class*="nw-heading"], h1, h2'
    );
    const subtitleEl = contentContainer.querySelector(
      ".rtc-component p.nw-text-lg, .rtc-component .rtc-paragraph p"
    );
    const contactDivs = Array.from(
      contentContainer.querySelectorAll(".rtc-component .rtc-paragraph > span > div")
    ).filter((div) => div.textContent.trim().length > 0);
    const cells = [];
    if (heroImage) {
      const src = heroImage.getAttribute("src") || "";
      if (!src.startsWith("data:")) {
        cells.push([heroImage]);
      }
    }
    const contentCell = [];
    if (title) {
      contentCell.push(title);
    }
    if (subtitleEl) {
      contentCell.push(subtitleEl);
    }
    if (contactDivs.length > 0) {
      contactDivs.forEach((div) => {
        contentCell.push(div);
      });
    } else {
      const fallbackContent = Array.from(
        contentContainer.querySelectorAll(".rtc-component div:not(.rtc-container):not(.rtc-paragraph):not(.row):not(.columns)")
      ).filter((el) => {
        const text = el.textContent.trim();
        return text.length > 0 && el.querySelector("a");
      });
      fallbackContent.forEach((el) => {
        contentCell.push(el);
      });
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero-invest",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-invest.js
  function parse2(element, { document }) {
    let items = Array.from(element.querySelectorAll("ul.row > li.column"));
    if (items.length === 0) {
      items = Array.from(element.querySelectorAll("li.column"));
    }
    if (items.length === 0) {
      items = Array.from(element.querySelectorAll("a:has(h5), a:has(h4), a:has(h3)"));
    }
    const cells = items.map((item) => {
      const anchor = item.querySelector("a") || item;
      const href = anchor.getAttribute("href") || "";
      const icon = item.querySelector("img");
      const heading = item.querySelector("h5, h4, h3, h6, h2");
      const desc = item.querySelector("p");
      const contentCell = [];
      if (heading) {
        const h = document.createElement("h3");
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = heading.textContent.trim();
        h.appendChild(link);
        contentCell.push(h);
      }
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        contentCell.push(p);
      }
      if (!heading && href) {
        const p = document.createElement("p");
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = anchor.textContent.trim() || href;
        p.appendChild(link);
        contentCell.push(p);
      }
      if (icon && !icon.getAttribute("alt") && heading) {
        icon.setAttribute("alt", heading.textContent.trim() + " icon");
      }
      return [icon || "", contentCell];
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-invest", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-compare.js
  function parse3(element, { document }) {
    const table = element.matches("table") ? element : element.querySelector("table.nw-table--blue, table");
    if (!table) {
      return;
    }
    const rows = Array.from(table.querySelectorAll("tr"));
    const cells = [];
    rows.forEach((row) => {
      const cellElements = Array.from(row.querySelectorAll("th, td"));
      const rowCells = cellElements.map((cell) => {
        const text = (cell.textContent || "").trim();
        if (text) {
          return text;
        }
        return "";
      });
      cells.push(rowCells);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "table-compare",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-benefit.js
  function parse4(element, { document }) {
    const cardEls = Array.from(
      element.querySelectorAll(".rtc-paragraph, .large-4.columns, .nw-card-set > div, .rtc-container .columns")
    ).filter((el) => el.querySelector("img") || el.querySelector("h3, h4"));
    const uniqueCards = [...new Set(cardEls)];
    const cells = [];
    uniqueCards.forEach((card) => {
      const icon = card.querySelector("img");
      if (icon && !icon.getAttribute("alt")) {
        const heading2 = card.querySelector("h3, h4, h2");
        icon.setAttribute("alt", heading2 ? `${heading2.textContent.trim()} icon` : "benefit icon");
      }
      const heading = card.querySelector("h3.nw-heading-sm, h3, h4, h2");
      const description = card.querySelector("p");
      const cta = card.querySelector("a[href]");
      const textCell = [];
      if (heading) textCell.push(heading);
      if (description) textCell.push(description);
      if (cta) textCell.push(cta);
      if (textCell.length > 0 || icon) {
        cells.push([icon || "", textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-benefit", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-service.js
  function parse5(element, { document }) {
    const cards = Array.from(
      element.querySelectorAll(".nw-resource-promo .column, .nw-resource-promo > .column")
    );
    const cardElements = cards.length > 0 ? cards : Array.from(element.querySelectorAll(".column"));
    if (cardElements.length === 0) return;
    const uniqueCards = [...new Set(cardElements)];
    const cells = uniqueCards.map((col) => {
      const anchor = col.querySelector("a[href]");
      const href = anchor ? anchor.getAttribute("href") || "" : "";
      const titleEl = col.querySelector(".nw-resource-promo__title, h3, h2, h4");
      const titleText = titleEl ? titleEl.textContent.trim() : "";
      const descEl = col.querySelector(".nw-resource-promo__content, p, .description");
      const descText = descEl ? descEl.textContent.trim() : "";
      const contentCell = [];
      if (titleText) {
        const heading = document.createElement("h3");
        if (href) {
          const link = document.createElement("a");
          link.setAttribute("href", href);
          link.textContent = titleText;
          heading.appendChild(link);
        } else {
          heading.textContent = titleText;
        }
        contentCell.push(heading);
      }
      if (descText) {
        const para = document.createElement("p");
        para.textContent = descText;
        contentCell.push(para);
      }
      return [contentCell];
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-service", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse6(element, { document }) {
    const mediaContainer = element.querySelector(".nw-banner-inpage__image, .nw-banner-inpage__media img");
    const img = mediaContainer ? mediaContainer.tagName === "IMG" ? mediaContainer : mediaContainer.querySelector("img") : element.querySelector("img");
    const imageCell = [];
    if (img) {
      imageCell.push(img);
    }
    const contentContainer = element.querySelector(".nw-banner-inpage__content");
    const contentCell = [];
    if (contentContainer) {
      const heading = contentContainer.querySelector("h3, h2, h1, h4");
      if (heading) {
        contentCell.push(heading);
      }
      const paragraphs = Array.from(contentContainer.querySelectorAll(":scope > p"));
      paragraphs.forEach((p) => {
        contentCell.push(p);
      });
      const buttonBody = contentContainer.querySelector(".button-body");
      const ctaLinks = buttonBody ? Array.from(buttonBody.querySelectorAll("a[href]")) : Array.from(contentContainer.querySelectorAll(":scope > a[href], :scope > p > a[href]"));
      ctaLinks.forEach((link) => {
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
      name: "columns-promo",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-links.js
  function parse7(element, { document }) {
    let columnDivs = Array.from(
      element.querySelectorAll(".large-6.rtc-paragraph")
    );
    if (columnDivs.length < 2) {
      columnDivs = Array.from(
        element.querySelectorAll(".rtc-paragraph")
      );
    }
    if (columnDivs.length < 2) {
      columnDivs = Array.from(
        element.querySelectorAll('.row > div[class*="columns"]')
      );
    }
    const leftContainer = columnDivs[0] || null;
    const rightContainer = columnDivs[1] || null;
    function extractLinks(container) {
      const cellContent = [];
      if (!container) return cellContent;
      const contentRoot = container.querySelector(":scope > span") || container;
      const allLinks = Array.from(contentRoot.querySelectorAll("a[href]"));
      allLinks.forEach((link) => {
        const href = link.getAttribute("href") || "#";
        const linkText = (link.textContent || "").trim();
        if (!linkText) return;
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", href);
        a.textContent = linkText;
        p.appendChild(a);
        const parentEl = link.parentElement;
        if (parentEl && parentEl.tagName === "P") {
          const fullText = (parentEl.textContent || "").trim();
          const suffix = fullText.replace(linkText, "").trim();
          if (suffix) {
            p.appendChild(document.createTextNode(" " + suffix));
          }
        }
        cellContent.push(p);
      });
      return cellContent;
    }
    const leftCell = extractLinks(leftContainer);
    const rightCell = extractLinks(rightContainer);
    if (leftCell.length === 0 && rightCell.length === 0) {
      const allLinks = Array.from(element.querySelectorAll("a[href]"));
      allLinks.forEach((link) => {
        const href = link.getAttribute("href") || "#";
        const linkText = (link.textContent || "").trim();
        if (!linkText) return;
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", href);
        a.textContent = linkText;
        p.appendChild(a);
        leftCell.push(p);
      });
    }
    const cells = [
      [leftCell, rightCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-links",
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
    var _a;
    const headingText = (((_a = cardEl.querySelector("h1, h2, h3, h4, h5, h6")) == null ? void 0 : _a.textContent) || "").trim();
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
  function parse8(element, { document }) {
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
    const headingText = ((heading == null ? void 0 : heading.textContent) || "").trim();
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
  function buildArticleTileRow(container, document) {
    const anchor = container.tagName === "A" ? container : container.querySelector("a.nw-articles__tile, a");
    if (!anchor) return null;
    const href = anchor.getAttribute("href") || "#";
    const img = anchor.querySelector("img");
    const titleSpan = anchor.querySelector("span.nw-articles__tile-title, span");
    const titleText = titleSpan ? titleSpan.textContent.trim() : anchor.textContent.trim();
    if (!titleText) return null;
    let imageCell = "";
    if (img) {
      if (!img.getAttribute("alt")) {
        img.setAttribute("alt", titleText);
      }
      imageCell = img;
    }
    const textCell = [];
    const p = document.createElement("p");
    const link = document.createElement("a");
    link.setAttribute("href", href);
    link.textContent = titleText;
    p.appendChild(link);
    textCell.push(p);
    return [imageCell, textCell];
  }
  function parse9(element, { document }) {
    const articleTileContainers = Array.from(element.querySelectorAll(".nw-articles__tile-container"));
    if (articleTileContainers.length > 0) {
      const cells = articleTileContainers.map((container) => buildArticleTileRow(container, document)).filter(Boolean);
      if (cells.length > 0) {
        const block = WebImporter.Blocks.createBlock(document, { name: "cards-tile", cells });
        element.replaceWith(block);
        return;
      }
    }
    const articleTiles = Array.from(element.querySelectorAll("a.nw-articles__tile"));
    if (articleTiles.length > 0) {
      const cells = articleTiles.map((anchor) => buildArticleTileRow(anchor, document)).filter(Boolean);
      if (cells.length > 0) {
        const block = WebImporter.Blocks.createBlock(document, { name: "cards-tile", cells });
        element.replaceWith(block);
        return;
      }
    }
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

  // tools/importer/parsers/columns-cta.js
  function parse10(element, { document }) {
    const scope = element.querySelector("section.nw-cta-small, .nw-cta-small") || element;
    const iconContainer = scope.querySelector(".nw-cta-small__icon");
    const icon = iconContainer ? iconContainer.querySelector("img") : null;
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
        Array.from(d.childNodes).forEach((node) => {
          p.appendChild(node.cloneNode(true));
        });
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
        "iframe.aamIframeLoaded",
        "bolt-waiting-indicator"
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
        // Breadcrumbs (inside main, non-authorable navigation)
        ".nw-breadcrumb",
        // Sticky CTA bar (global widget, not page-level authorable content)
        ".nw-sticky-cta",
        "#nw-sticky-cta__trigger",
        // Legal aside
        "aside.urbo",
        // Residual tracking / embeds that may survive past beforeTransform.
        "script",
        "style",
        "noscript",
        "link",
        "meta",
        // Safety: strip any remaining iframes not tied to authorable content.
        "iframe"
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

  // tools/importer/import-investing.js
  var PAGE_TEMPLATE = {
    name: "investing",
    description: "Nationwide investing and retirement pages covering annuities, mutual funds, retirement plans, and financial professional search.",
    blocks: [
      { name: "hero-invest", instances: [".nw-banner2", ".nw-hero-banner"] },
      { name: "cards-invest", instances: ["section.nw-container.text-center:has(.nw-link-list)", "section.nw-container.text-center:has(ul > li > a)", "section.container.text-center:has(a)"] },
      { name: "table-compare", instances: [".rtc-component:has(.nw-table--blue)", ".rtc-component:has(table)"] },
      { name: "cards-benefit", instances: [".rtc-component.nw-bg-rebrand-vibrant-blue", ".nw-benefits"] },
      { name: "cards-service", instances: [".nw-resource-promo"] },
      { name: "columns-promo", instances: [".nw-banner-inpage"] },
      { name: "columns-links", instances: [".rtc-component.nw-bg-gray-pale-25:has(.nw-container-article)", ".nw-media-link-list"] },
      { name: "cards-action", instances: [".nw-multi-option-promo"] },
      { name: "cards-tile", instances: [".nw-content-promo", ".nw-articles", ".nw-tile-block"] },
      { name: "columns-cta", instances: [".nw-small-cta", ".nw-bg-blue-darkest.nw-small-cta", ".nw-bg-blue-sea-dark.nw-small-cta"] }
    ]
  };
  var parsers = {
    "hero-invest": parse,
    "cards-invest": parse2,
    "table-compare": parse3,
    "cards-benefit": parse4,
    "cards-service": parse5,
    "columns-promo": parse6,
    "columns-links": parse7,
    "cards-action": parse8,
    "cards-tile": parse9,
    "columns-cta": parse10
  };
  var SECTION_STYLE_MAP = [
    { match: /nw-bg-gray|nw-bg-grey|gray-pale/, style: "grey" },
    { match: /nw-bg-blue-darkest|nw-bg-rebrand/, style: "dark-blue" },
    { match: /nw-bg-blue-sea/, style: "dark-blue" },
    { match: /nw-banner2/, style: "blue" }
  ];
  function detectSectionStyle(el) {
    const classes = el.className || "";
    for (const rule of SECTION_STYLE_MAP) {
      if (rule.match.test(classes)) return rule.style;
    }
    return null;
  }
  function splitSections(main, doc) {
    const mainContent = main.querySelector('#main-content, [role="main"], main');
    if (!mainContent) return;
    const sections = Array.from(mainContent.children).filter((child) => {
      const tag = child.tagName.toLowerCase();
      if (["script", "style", "noscript", "link", "meta"].includes(tag)) return false;
      if (!child.textContent.trim() && !child.querySelector("img, video, iframe")) return false;
      return true;
    });
    if (sections.length < 2) return;
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const style = detectSectionStyle(section);
      if (style) {
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style }
        });
        if (section.parentNode) {
          section.parentNode.insertBefore(metadataBlock, section.nextSibling);
        }
      }
      if (i > 0 && section.parentNode) {
        const hr = doc.createElement("hr");
        section.parentNode.insertBefore(hr, section);
      }
    }
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        let elements;
        try {
          elements = document.querySelectorAll(selector);
        } catch (e) {
          return;
        }
        elements.forEach((element) => {
          const key = element.getAttribute("id") || element.className + element.textContent.substring(0, 50);
          if (seen.has(key)) return;
          seen.add(key);
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element
          });
        });
      });
    });
    console.log(`[investing] Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_investing_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      transform("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`[investing] Failed to parse ${block.name} (${block.selector}):`, e);
          }
        }
      });
      transform("afterTransform", main, payload);
      splitSections(main, document);
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
  return __toCommonJS(import_investing_exports);
})();
