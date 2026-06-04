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

  // tools/importer/import-investing-product.js
  var import_investing_product_exports = {};
  __export(import_investing_product_exports, {
    default: () => import_investing_product_default
  });

  // tools/importer/parsers/hero-invest.js
  function parse(element, { document }) {
    const mediaContainer = element.querySelector(".nw-banner-inpage__media, .nw-banner-inpage__image");
    let heroImage = mediaContainer ? mediaContainer.querySelector("img") : element.querySelector(".nw-banner-inpage__image img");
    if (!heroImage) {
      const bgDiv = element.querySelector('.nw-banner-inpage__image[style*="background-image"]');
      if (bgDiv) {
        const style = bgDiv.getAttribute("style") || "";
        const match = style.match(/background-image\s*:\s*url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
        if (match) {
          heroImage = document.createElement("img");
          const src = match[1].startsWith("/") ? `https://www.nationwide.com${match[1]}` : match[1];
          heroImage.setAttribute("src", src);
          heroImage.setAttribute("alt", "");
        }
      }
    }
    const contentContainer = element.querySelector(".nw-banner-inpage__content") || element;
    const heading = contentContainer.querySelector(
      "h1.nw-heading-tiempos-mdlg, h1.nw-heading-tiempos-md, h1, h2"
    );
    const rtcParagraph = contentContainer.querySelector(".rtc-paragraph");
    const descriptionSpan = rtcParagraph ? rtcParagraph.querySelector("span") : null;
    const subtitle = descriptionSpan ? descriptionSpan.querySelector("h2, h3") : contentContainer.querySelector(".rtc-paragraph h2, .rtc-paragraph h3");
    let descriptionPs = descriptionSpan ? Array.from(descriptionSpan.querySelectorAll(":scope > p")).filter((p) => {
      return !p.querySelector("a.nw-button--mint, a.button, a.nw-button--primary");
    }) : [];
    if (descriptionPs.length === 0 && rtcParagraph) {
      descriptionPs = Array.from(rtcParagraph.querySelectorAll("p")).filter((p) => {
        return !p.querySelector("a.nw-button--mint, a.button, a.nw-button--primary");
      });
    }
    if (descriptionPs.length === 0) {
      descriptionPs = Array.from(contentContainer.querySelectorAll(".rtc-component p, .rtc-paragraph p")).filter((p) => {
        return !p.querySelector("a.nw-button--mint, a.button, a.nw-button--primary");
      });
    }
    const descriptionDivs = descriptionSpan ? Array.from(descriptionSpan.querySelectorAll(":scope > div")).filter((div) => {
      const links = div.querySelectorAll("a");
      const text = (div.textContent || "").replace(/[|]/g, "").trim();
      if (links.length === 0) return text.length > 0;
      if (links.length >= 2) {
        const linkText2 = Array.from(links).map((a) => a.textContent.trim()).join("");
        const nonLinkText = text.replace(new RegExp(Array.from(links).map((a) => a.textContent.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g"), "").trim();
        if (nonLinkText.length < 5) return false;
      }
      const linkText = Array.from(links).map((a) => a.textContent.trim()).join("");
      return text.length > linkText.length + 5;
    }) : [];
    const primaryCta = contentContainer.querySelector(
      "a.nw-button--mint, a.button, a.nw-button--primary, a.nw-btn"
    );
    if (!heading && !primaryCta) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (heroImage) {
      const src = heroImage.getAttribute("src") || "";
      if (!src.startsWith("data:")) {
        cells.push([heroImage]);
      }
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subtitle) {
      const h2 = document.createElement("h2");
      h2.textContent = subtitle.textContent.trim();
      contentCell.push(h2);
    }
    for (const p of descriptionPs) {
      const text = p.textContent.trim();
      if (!text) continue;
      if (text === "Loading..." || text === "\xD7" || /^NFW-\d+/.test(text)) continue;
      const para = p.cloneNode(true);
      contentCell.push(para);
    }
    for (const div of descriptionDivs) {
      const text = (div.textContent || "").trim();
      if (text) {
        const p = document.createElement("p");
        p.textContent = text;
        contentCell.push(p);
      }
    }
    if (primaryCta) {
      const ctaPara = document.createElement("p");
      const ctaLink = document.createElement("a");
      ctaLink.setAttribute("href", primaryCta.getAttribute("href") || "#");
      ctaLink.textContent = (primaryCta.textContent || "").trim();
      if (primaryCta.getAttribute("title")) {
        ctaLink.setAttribute("title", primaryCta.getAttribute("title"));
      }
      ctaPara.appendChild(ctaLink);
      contentCell.push(ctaPara);
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

  // tools/importer/parsers/cards-action.js
  function buildInsuranceCard(cardEl, document) {
    const svg = cardEl.querySelector("svg");
    const img = cardEl.querySelector("img");
    let iconCell = "";
    if (svg) {
      const desc2 = svg.querySelector("desc");
      const altText = desc2 ? desc2.textContent.trim() : "icon";
      const svgClone = svg.cloneNode(true);
      const serialized = new XMLSerializer().serializeToString(svgClone);
      const dataUri = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(serialized)));
      const iconImg = document.createElement("img");
      iconImg.src = dataUri;
      iconImg.alt = altText;
      iconCell = iconImg;
    } else if (img) {
      if (!img.getAttribute("alt")) {
        const heading2 = cardEl.querySelector("h3, h4");
        img.setAttribute("alt", heading2 ? heading2.textContent.trim() + " icon" : "icon");
      }
      iconCell = img;
    }
    const heading = cardEl.querySelector("h3.mopHeading, h3.nw-heading-sm, h3, h4");
    const desc = cardEl.querySelector("p.mopDesc, p");
    const cta = cardEl.querySelector('a.button, a[class*="nw-button"], a[href]');
    const textCell = [];
    if (heading) textCell.push(heading);
    if (desc) textCell.push(desc);
    if (cta) textCell.push(cta);
    return [iconCell, textCell];
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
  function buildContentPromoCard(li, document) {
    const link = li.querySelector("a");
    if (!link) return null;
    const img = li.querySelector("img");
    const heading = li.querySelector("h5, h4, h3");
    const desc = li.querySelector("p") || li.querySelector("a + a");
    const iconCell = img || "";
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (desc) contentCell.push(desc);
    if (heading && heading.closest("a")) {
      const ctaP = document.createElement("p");
      const ctaA = document.createElement("a");
      ctaA.setAttribute("href", heading.closest("a").getAttribute("href") || "#");
      ctaA.textContent = heading.textContent.trim();
      ctaP.appendChild(ctaA);
      contentCell.push(ctaP);
    }
    return [iconCell, contentCell];
  }
  function parse2(element, { document }) {
    const columns = element.querySelectorAll(
      ".nw-card--action, .column.small-12.large-4, .column.large-4, .column.small-12.large-3"
    );
    if (columns.length > 0) {
      const uniqueCards = [...new Set(Array.from(columns))];
      const cells2 = uniqueCards.filter((col) => col.querySelector("h3, h4, svg, img")).map((col) => buildInsuranceCard(col, document));
      const block2 = WebImporter.Blocks.createBlock(document, {
        name: "cards-action",
        cells: cells2
      });
      element.replaceWith(block2);
      return;
    }
    const contentPromoList = element.querySelector(".nw-content-promo ul, ul:has(> li > a > h5), ul:has(> li > a > h4)");
    if (contentPromoList) {
      const listItems = Array.from(contentPromoList.querySelectorAll(":scope > li"));
      const cells2 = listItems.map((li) => buildContentPromoCard(li, document)).filter(Boolean);
      if (cells2.length > 0) {
        const sectionHeading = element.querySelector("h2");
        const allCells = [];
        if (sectionHeading) allCells.push([sectionHeading]);
        allCells.push(...cells2);
        const block2 = WebImporter.Blocks.createBlock(document, {
          name: "cards-action",
          cells: allCells
        });
        element.replaceWith(block2);
        return;
      }
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

  // tools/importer/parsers/cards-benefit.js
  function parse3(element, { document }) {
    const items = element.querySelectorAll(".rtc-paragraph");
    if (items.length === 0) return;
    const hasSmallIcons = Array.from(items).some((item) => {
      const img = item.querySelector("img");
      if (!img) return false;
      const style = img.getAttribute("style") || "";
      return style.includes("60px") || style.includes("48px") || style.includes("64px");
    });
    if (!hasSmallIcons) return;
    const sectionHeading = element.querySelector("h2");
    const cells = [];
    if (sectionHeading) {
      cells.push([sectionHeading]);
    }
    Array.from(items).forEach((item) => {
      const span = item.querySelector("span") || item;
      const img = span.querySelector("img");
      const heading = span.querySelector("h3, h4");
      const desc = span.querySelector("p");
      if (!img && !heading) return;
      const iconCell = img ? img : "";
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (desc) contentCell.push(desc);
      cells.push([iconCell, contentCell]);
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-benefit",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-compare.js
  function parse4(element, { document }) {
    const table = element.querySelector("table");
    if (!table) return;
    const sectionHeading = element.querySelector("h2");
    const thead = table.querySelector("thead");
    const tbody = table.querySelector("tbody");
    if (!thead || !tbody) return;
    const headerCells = Array.from(thead.querySelectorAll("th, td")).map(
      (cell) => cell.textContent.trim()
    );
    const bodyRows = Array.from(tbody.querySelectorAll("tr")).map(
      (row) => Array.from(row.querySelectorAll("td, th")).map((cell) => cell.textContent.trim())
    );
    if (headerCells.length === 0 || bodyRows.length === 0) return;
    const cells = [];
    if (sectionHeading) {
      cells.push([sectionHeading]);
    }
    cells.push(headerCells);
    bodyRows.forEach((row) => {
      cells.push(row);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "table-compare",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-lifecycle.js
  function parse5(element, { document }) {
    const owlItems = Array.from(element.querySelectorAll(".owl-item > a[href]"));
    const rtcItems = Array.from(element.querySelectorAll(".rtc-paragraph"));
    const validRtcItems = rtcItems.filter((item) => {
      const hasImg = !!item.querySelector("img");
      const links = Array.from(item.querySelectorAll("a[href]"));
      const textLink = links.find((a) => a.textContent.trim().length > 0);
      const linkText = textLink ? textLink.textContent.trim() : "";
      return hasImg && linkText && linkText.length < 80;
    });
    if (owlItems.length < 2 && validRtcItems.length < 2) {
      return;
    }
    const cells = [];
    const sectionHeading = element.querySelector("h2");
    const sectionSubtitle = element.querySelector("div.nw-heading, div.nw-heading-sm, .nw-heading");
    if (sectionHeading || sectionSubtitle) {
      const headerCell = [];
      if (sectionHeading) {
        const h2 = document.createElement("h2");
        h2.textContent = sectionHeading.textContent.trim();
        headerCell.push(h2);
      }
      if (sectionSubtitle) {
        const p = document.createElement("p");
        p.textContent = sectionSubtitle.textContent.trim();
        headerCell.push(p);
      }
      cells.push([headerCell]);
    }
    if (owlItems.length >= 2) {
      owlItems.forEach((anchor) => {
        const img = anchor.querySelector("img");
        const label = anchor.querySelector("p");
        const href = anchor.getAttribute("href") || "#";
        const labelText = label ? label.textContent.trim() : "";
        let imageCell = "";
        if (img) {
          if (!img.getAttribute("alt") && labelText) {
            img.setAttribute("alt", labelText);
          }
          imageCell = img;
        }
        const textCell = [];
        if (labelText) {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = labelText;
          p.appendChild(a);
          textCell.push(p);
        }
        if (imageCell || textCell.length > 0) {
          cells.push([imageCell, textCell]);
        }
      });
    } else {
      validRtcItems.forEach((item) => {
        const img = item.querySelector("img");
        const links = Array.from(item.querySelectorAll("a[href]"));
        const link = links.find((a) => a.textContent.trim().length > 0) || links[0];
        const href = link ? link.getAttribute("href") || "#" : "#";
        const linkText = link ? link.textContent.trim() : "";
        let imageCell = "";
        if (img) {
          if (!img.getAttribute("alt") && linkText) {
            img.setAttribute("alt", linkText);
          }
          imageCell = img;
        }
        const textCell = [];
        if (linkText) {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.setAttribute("href", href);
          a.textContent = linkText;
          p.appendChild(a);
          textCell.push(p);
        }
        if (imageCell || textCell.length > 0) {
          cells.push([imageCell, textCell]);
        }
      });
    }
    if (cells.length < 2) {
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-lifecycle", cells });
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
  function parse6(element, { document }) {
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
    const linkedCards = Array.from(element.querySelectorAll("a[href]")).filter((a) => a.querySelector("img") || a.querySelector("h2, h3, h4, h5"));
    if (linkedCards.length > 0) {
      const cells = linkedCards.map((a) => buildInsuranceTileRow(a, document));
      const block = WebImporter.Blocks.createBlock(document, { name: "cards-tile", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/columns-app.js
  function parseRetirementApp(element, document) {
    const heading = element.querySelector('.row.columns.text-center h3, h3[class*="heading-tiempos"]');
    const iconCol = element.querySelector(".large-3.columns.rtc-paragraph");
    const descCol = element.querySelector(".large-9.columns.rtc-paragraph");
    const qrCols = element.querySelectorAll(".large-6.small-12.columns.rtc-paragraph");
    const leftCell = [];
    const rightCell = [];
    if (heading) {
      const h3 = document.createElement("h3");
      h3.textContent = heading.textContent.trim();
      leftCell.push(h3);
    }
    if (descCol) {
      const scope = descCol.querySelector(":scope > span") || descCol;
      const p = scope.querySelector("p");
      if (p) leftCell.push(p);
      const ul = scope.querySelector("ul");
      if (ul) leftCell.push(ul);
    }
    if (iconCol) {
      const img = iconCol.querySelector("img");
      if (img) rightCell.push(img);
    }
    qrCols.forEach((col) => {
      const scope = col.querySelector(":scope > span") || col;
      const imgs = scope.querySelectorAll("img");
      const texts = [];
      const textDiv = scope.querySelector(".nw-text-lg, div");
      if (textDiv) {
        const walker = document.createTreeWalker(textDiv, 4);
        while (walker.nextNode()) {
          const t = walker.currentNode.textContent.trim();
          if (t && !t.startsWith("http")) texts.push(t);
        }
      }
      imgs.forEach((img) => rightCell.push(img));
      texts.forEach((t) => {
        const p = document.createElement("p");
        p.textContent = t;
        rightCell.push(p);
      });
    });
    const cells = [[leftCell, rightCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-app", cells });
    element.replaceWith(block);
  }
  function parseHomepageApp(element, document) {
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
      const imgs = rightScope.querySelectorAll("img");
      imgs.forEach((img) => rightCell.push(img));
      const caption = rightScope.querySelector("p");
      if (caption) rightCell.push(caption);
    }
    const cells = [[leftCell, rightCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-app", cells });
    element.replaceWith(block);
  }
  function parse7(element, { document }) {
    const hasIconDescLayout = element.querySelector(".large-3.columns.rtc-paragraph") && element.querySelector(".large-9.columns.rtc-paragraph");
    if (hasIconDescLayout) {
      parseRetirementApp(element, document);
      return;
    }
    const large6Cols = element.querySelectorAll(".large-6.small-12.columns.rtc-paragraph");
    if (large6Cols.length >= 2) {
      parseHomepageApp(element, document);
      return;
    }
  }

  // tools/importer/parsers/columns-banner.js
  function parse8(element, { document }) {
    const isBannerInpage = element.classList.contains("nw-banner-inpage");
    if (isBannerInpage) {
      parseBannerInpage(element, document);
    } else {
      parseRtcColumns(element, document);
    }
  }
  function parseBannerInpage(element, document) {
    const mediaContainer = element.querySelector(".nw-banner-inpage__media");
    let img = null;
    if (mediaContainer) {
      img = mediaContainer.querySelector("img");
      if (!img) {
        const bgDiv = mediaContainer.querySelector(".nw-banner-inpage__image");
        if (bgDiv) {
          const style = bgDiv.getAttribute("style") || "";
          const bgMatch = style.match(/background-image\s*:\s*url\(([^)]+)\)/i);
          if (bgMatch) {
            const bgUrl = bgMatch[1].replace(/['"]/g, "");
            img = document.createElement("img");
            img.setAttribute("src", bgUrl);
            img.setAttribute("alt", "");
          }
        }
      }
    }
    if (!img) {
      img = element.querySelector("img");
    }
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
        const isCTAOnly = links.length === 1 && (links[0].classList.contains("button") || links[0].className.includes("nw-button")) && p.textContent.trim() === links[0].textContent.trim();
        if (isCTAOnly) {
          contentCell.push(p);
        } else if (p.textContent.trim()) {
          contentCell.push(p);
        }
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
  function parseRtcColumns(element, document) {
    let columnDivs = Array.from(
      element.querySelectorAll(".row > .rtc-paragraph")
    );
    if (columnDivs.length < 2) {
      columnDivs = Array.from(
        element.querySelectorAll('.row > div[class*="columns"]')
      );
    }
    if (columnDivs.length < 2) {
      const row = element.querySelector(".row");
      if (row) {
        columnDivs = Array.from(row.querySelectorAll(":scope > div"));
      }
    }
    let imageCol = null;
    let contentCol = null;
    for (const col of columnDivs) {
      const hasImg = col.querySelector("img");
      const hasTextContent = col.querySelector("h1, h2, h3, h4, ul, ol");
      if (hasImg && !hasTextContent) {
        imageCol = col;
      } else if (hasTextContent) {
        contentCol = col;
      }
    }
    if (!imageCol && !contentCol && columnDivs.length >= 2) {
      if (columnDivs[0].querySelector("img")) {
        imageCol = columnDivs[0];
        contentCol = columnDivs[1];
      } else {
        contentCol = columnDivs[0];
        imageCol = columnDivs[1];
      }
    } else if (!imageCol && contentCol && columnDivs.length >= 2) {
      for (const col of columnDivs) {
        if (col !== contentCol && col.querySelector("img")) {
          imageCol = col;
          break;
        }
      }
    }
    const imageCell = [];
    if (imageCol) {
      const img = imageCol.querySelector("img");
      if (img) {
        imageCell.push(img);
      }
    }
    const contentCell = [];
    if (contentCol) {
      const contentRoot = contentCol.querySelector(":scope > span") || contentCol;
      const heading = contentRoot.querySelector("h2, h3, h4, h1");
      if (heading) {
        contentCell.push(heading);
      }
      const paragraphs = Array.from(contentRoot.querySelectorAll(":scope > p"));
      paragraphs.forEach((p) => {
        const textContent = (p.textContent || "").trim();
        if (textContent) {
          contentCell.push(p);
        }
      });
      const lists = Array.from(contentRoot.querySelectorAll(":scope > ul, :scope > ol"));
      lists.forEach((list) => {
        contentCell.push(list);
      });
      const ctaContainer = contentRoot.querySelector(".button-body, .nw-button-container");
      if (ctaContainer) {
        const ctaLinks = Array.from(ctaContainer.querySelectorAll("a[href]"));
        ctaLinks.forEach((link) => {
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.setAttribute("href", link.getAttribute("href") || "#");
          a.textContent = (link.textContent || "").trim();
          p.appendChild(a);
          contentCell.push(p);
        });
      } else {
        const standaloneLinks = Array.from(
          contentRoot.querySelectorAll(":scope > a[href], :scope > div:not(.row) > a[href]")
        );
        standaloneLinks.forEach((link) => {
          const linkText = (link.textContent || "").trim();
          if (!linkText) return;
          if (link.querySelector("img") && !linkText.replace(/\s/g, "")) return;
          const p = document.createElement("p");
          const a = document.createElement("a");
          a.setAttribute("href", link.getAttribute("href") || "#");
          a.textContent = linkText;
          p.appendChild(a);
          contentCell.push(p);
        });
      }
    }
    if (imageCell.length === 0 && contentCell.length === 0) {
      return;
    }
    let cells;
    if (imageCol && contentCol) {
      const imageIndex = columnDivs.indexOf(imageCol);
      const contentIndex = columnDivs.indexOf(contentCol);
      if (imageIndex < contentIndex) {
        cells = [[imageCell, contentCell]];
      } else {
        cells = [[contentCell, imageCell]];
      }
    } else {
      cells = [[imageCell, contentCell]];
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-banner",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse9(element, { document }) {
    const scope = element.querySelector("section.nw-cta-small, .nw-cta-small") || element;
    const iconContainer = scope.querySelector(".nw-cta-small__icon");
    const icon = iconContainer ? iconContainer.querySelector("img") : null;
    const textContainer = scope.querySelector(".nw-cta-small__text");
    const textCell = [];
    if (textContainer) {
      const headlineStrong = textContainer.querySelector("strong");
      if (headlineStrong) {
        const h = document.createElement("h3");
        h.textContent = (headlineStrong.textContent || "").replace(/\s+/g, " ").trim();
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
      const bolt = scope.querySelector("bolt-button");
      if (bolt) {
        ctaLink = bolt.querySelector("a[href]") || (bolt.tagName === "A" ? bolt : null);
      }
    }
    if (!ctaLink) {
      ctaLink = scope.querySelector(
        'a.bolt-button, a.button, a[class*="nw-button"], a[class*="button"]'
      );
    }
    if (!ctaLink) {
      const allLinks = Array.from(scope.querySelectorAll("a[href]"));
      ctaLink = allLinks.find((a) => {
        const href = a.getAttribute("href") || "";
        return !href.startsWith("tel:") && !a.closest(".cta-text");
      }) || null;
    }
    if (ctaLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.setAttribute("href", ctaLink.getAttribute("href") || "#");
      a.textContent = (ctaLink.textContent || "").trim();
      p.appendChild(a);
      textCell.push(p);
    }
    if (!icon && textCell.length === 0) {
      return;
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

  // tools/importer/parsers/cards-team.js
  function parse10(element, { document }) {
    const paragraphs = Array.from(element.querySelectorAll(".rtc-paragraph"));
    const teamMembers = paragraphs.filter((p) => {
      const span = p.querySelector("span");
      if (!span) return false;
      const div = span.querySelector("div");
      if (!div) return false;
      return div.querySelector("img") && div.querySelector("h3");
    });
    if (teamMembers.length < 2) {
      return;
    }
    const cells = [];
    const sectionHeading = element.querySelector(".rtc-section h3, .rtc-section h2");
    if (sectionHeading) {
      const h = document.createElement("h3");
      h.textContent = sectionHeading.textContent.trim();
      cells.push([[h]]);
    }
    teamMembers.forEach((member) => {
      const span = member.querySelector("span");
      const div = span.querySelector("div");
      const img = div.querySelector("img");
      const name = div.querySelector("h3");
      const titleP = div.querySelector("p strong");
      const quoteP = Array.from(div.querySelectorAll("p")).find(
        (p) => !p.querySelector("strong") && p.textContent.trim().length > 20
      );
      let imageCell = "";
      if (img) {
        const imgEl = document.createElement("img");
        const src = img.getAttribute("src") || "";
        imgEl.setAttribute("src", src.startsWith("/") ? `https://www.nationwide.com${src}` : src);
        imgEl.setAttribute("alt", img.getAttribute("alt") || "");
        imageCell = imgEl;
      }
      const textCell = [];
      if (name) {
        const h3 = document.createElement("h3");
        h3.textContent = name.textContent.trim();
        textCell.push(h3);
      }
      if (titleP) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = titleP.textContent.trim();
        p.appendChild(strong);
        textCell.push(p);
      }
      if (quoteP) {
        const p = document.createElement("p");
        p.textContent = quoteP.textContent.trim();
        textCell.push(p);
      }
      if (imageCell || textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
    if (cells.length < 2) {
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-team", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-service.js
  function parseResourcePromo(element, document) {
    const heading = element.querySelector("h2");
    const links = Array.from(element.querySelectorAll(".nw-resource-promo a[href], .nw-resource-promo .column a[href]"));
    if (links.length === 0) return;
    const cells = [];
    if (heading) {
      cells.push([[heading]]);
    }
    links.forEach((link) => {
      const h3 = link.querySelector("h3, h4");
      const descEl = link.querySelector(".nw-resource-promo__content, div:not(:has(h3)):not(:has(h4))");
      const href = link.getAttribute("href") || "#";
      const contentCell = [];
      if (h3) {
        const newH3 = document.createElement("h3");
        const a = document.createElement("a");
        a.setAttribute("href", href);
        a.textContent = h3.textContent.trim();
        newH3.appendChild(a);
        contentCell.push(newH3);
      }
      if (descEl && descEl.textContent.trim()) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", href);
        a.textContent = descEl.textContent.trim();
        p.appendChild(a);
        contentCell.push(p);
      }
      if (contentCell.length > 0) {
        cells.push(["", contentCell]);
      }
    });
    if (cells.length < 2) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-service", cells });
    element.replaceWith(block);
  }
  function parse11(element, { document }) {
    const resourcePromo = element.querySelector(".nw-resource-promo");
    if (resourcePromo) {
      parseResourcePromo(element, document);
      return;
    }
    const contentCol = element.querySelector(".rtc-paragraph span");
    if (!contentCol) return;
    const heading = contentCol.querySelector("h2");
    const icons = Array.from(contentCol.querySelectorAll('img[src*=".svg"], img[alt]')).filter(
      (img) => {
        const src = img.getAttribute("src") || "";
        const style = img.getAttribute("style") || "";
        return src.includes(".svg") || style.includes("59px") || style.includes("float");
      }
    );
    if (!heading || icons.length < 2) {
      return;
    }
    const cells = [];
    const h2 = document.createElement("h2");
    h2.textContent = heading.textContent.trim();
    cells.push([[h2]]);
    icons.forEach((icon) => {
      const iconSrc = icon.getAttribute("src") || "";
      const iconAlt = icon.getAttribute("alt") || "";
      let textDiv = icon.nextElementSibling;
      if (!textDiv || !textDiv.querySelector) {
        const parent = icon.parentElement;
        if (parent) textDiv = parent.nextElementSibling;
      }
      if (!textDiv || !textDiv.textContent.trim()) {
        const parent = icon.closest('div[style*="clear"]') || icon.parentElement;
        if (parent) {
          textDiv = parent.querySelector('div[style*="margin-left"]');
        }
      }
      const titleEl = textDiv ? textDiv.querySelector("span.nw-heading, strong") : null;
      const titleText = titleEl ? titleEl.textContent.trim() : "";
      const fullText = textDiv ? textDiv.textContent.trim() : "";
      const descText = titleText ? fullText.replace(titleText, "").trim() : fullText;
      let imageCell = "";
      if (iconSrc) {
        const img = document.createElement("img");
        img.setAttribute("src", iconSrc.startsWith("/") ? `https://www.nationwide.com${iconSrc}` : iconSrc);
        img.setAttribute("alt", iconAlt);
        imageCell = img;
      }
      const textCell = [];
      if (titleText) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = titleText;
        p.appendChild(strong);
        textCell.push(p);
      }
      if (descText) {
        const p = document.createElement("p");
        p.textContent = descText;
        textCell.push(p);
      }
      if (imageCell || textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
    const sideImg = element.querySelector(".rtc-paragraph img.rtc-column-image");
    if (sideImg) {
      const src = sideImg.getAttribute("src") || "";
      const img = document.createElement("img");
      img.setAttribute("src", src.startsWith("/") ? `https://www.nationwide.com${src}` : src);
      img.setAttribute("alt", sideImg.getAttribute("alt") || "");
      cells.push([img]);
    }
    if (cells.length < 3) {
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-service", cells });
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
        ".owl-nav",
        ".owl-dots",
        ".owl-prev",
        ".owl-next"
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
        "script",
        "style",
        "noscript",
        "link",
        "meta",
        "iframe.ta-display-none",
        // Sub-navigation overlays (product page dropdowns)
        ".nw-subnav",
        ".nw-sub-nav",
        ".nw-banner2__subnav"
      ]);
      const junkPs = element.querySelectorAll("p");
      for (let i = junkPs.length - 1; i >= 0; i -= 1) {
        const p = junkPs[i];
        const text = p.textContent.trim();
        if (text === "Loading..." || text === "\xD7" || /^NFW-[\w.]+/.test(text)) {
          if (p.parentNode) p.parentNode.removeChild(p);
        }
      }
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
      const fallback = sel.replace(/#p\d+/g, "");
      if (fallback && fallback !== sel) {
        try {
          const el = root.querySelector(fallback);
          if (el) return el;
        } catch (e) {
        }
      }
    }
    return null;
  }
  function findSectionByBlockSelector(root, section, template) {
    if (!section.blocks || section.blocks.length === 0) return null;
    const blockName = section.blocks[0];
    const blockDef = (template.blocks || []).find((b) => b.name === blockName);
    if (!blockDef || !blockDef.instances) return null;
    for (const inst of blockDef.instances) {
      try {
        const el = root.querySelector(inst);
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
      const processed = /* @__PURE__ */ new Set();
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        let sectionEl = findSectionElement(element, section.selector);
        if (!sectionEl) {
          sectionEl = findSectionByBlockSelector(element, section, template);
        }
        if (!sectionEl) continue;
        if (processed.has(sectionEl)) continue;
        processed.add(sectionEl);
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

  // tools/importer/import-investing-product.js
  var parsers = {
    "hero-invest": parse,
    "cards-action": parse2,
    "cards-benefit": parse3,
    "table-compare": parse4,
    "cards-lifecycle": parse5,
    "cards-tile": parse6,
    "columns-app": parse7,
    "columns-banner": parse8,
    "columns-cta": parse9,
    "cards-team": parse10,
    "cards-service": parse11
  };
  var PAGE_TEMPLATE = {
    name: "investing-product",
    description: "Investing product pages with hero, content sections, tile blocks, and CTAs",
    urls: [
      "https://www.nationwide.com/personal/investing/retirement-plans/",
      "https://www.nationwide.com/personal/investing/annuities/",
      "https://www.nationwide.com/personal/investing/mutual-funds/",
      "https://www.nationwide.com/personal/investing/find-financial-professional/"
    ],
    blocks: [
      { name: "hero-invest", instances: ["#main-content > div.nw-banner2.nw-banner-inpage--clip"] },
      { name: "cards-action", instances: ["#main-content > div.nw-multi-option-promo", "#main-content > section.nw-container:has(.nw-content-promo ul > li > a)"] },
      { name: "cards-service", instances: ["#main-content > section.container:has(.nw-resource-promo)", '#main-content > div.rtc-component.nw-outer-bottom--md.nw-bg-gray-pale-25:has(img[src*=".svg"])'] },
      { name: "columns-app", instances: ["#main-content > div.rtc-component.nw-outer-bottom--lg.nw-bg-rebrand-vibrant-blue"] },
      { name: "cards-benefit", instances: ["#main-content > div.rtc-component.nw-bg-rebrand-vibrant-blue:has(.rtc-paragraph img)"] },
      { name: "table-compare", instances: ["#main-content > div.rtc-component:has(table)"] },
      { name: "columns-banner", instances: ["#main-content > div.rtc-component.nw-bg-gray-pale-25:has(img):has(ul)", '#main-content > div.rtc-component.nw-outer-bottom--md.nw-bg-gray-pale-25:not(:has(img[src*=".svg"]))', "#main-content > div.nw-banner-inpage"] },
      { name: "cards-team", instances: ["#main-content > div.rtc-component.nw-outer-bottom--md:has(.rtc-paragraph span div img + h3)"] },
      { name: "cards-service", instances: ['#main-content > div.rtc-component.nw-outer-bottom--md.nw-bg-gray-pale-25:has(img[src*=".svg"])'] },
      { name: "cards-lifecycle", instances: ["#main-content > div.rtc-component.nw-bg-gray-pale-25:not(:has(table)):not(:has(ul))", "#main-content > div.nw-bg-gray-pale-25:has(.owl-carousel)"] },
      { name: "cards-tile", instances: ["#main-content > section.nw-tile-block"] },
      { name: "columns-cta", instances: ["#main-content > div.nw-bg-blue-darkest.nw-small-cta"] }
    ],
    sections: [
      { id: "section-1-hero", name: "Hero banner with CTA", selector: "#main-content > div.nw-banner2.nw-banner-inpage--clip", style: null, blocks: ["hero-invest"], defaultContent: [] },
      { id: "section-2-quick-links", name: "Quick links cards", selector: "#main-content > div.nw-multi-option-promo.nw-bg-white.nw-outer-bottom--md", style: null, blocks: ["cards-action"], defaultContent: [] },
      { id: "section-3-lifecycle", name: "Lifecycle navigation cards", selector: "#main-content > div.rtc-component.nw-bg-gray-pale-25", style: "grey", blocks: ["cards-lifecycle"], defaultContent: [] },
      { id: "section-4-default", name: "Default content", selector: "#main-content > div.rtc-component.nw-outer-bottom--lg:nth-of-type(4)", style: null, blocks: [], defaultContent: ["#main-content > div.rtc-component.nw-outer-bottom--lg:nth-of-type(4) a"] },
      { id: "section-5-tiles", name: "Resources and tools tiles", selector: "#main-content > section.nw-tile-block", style: null, blocks: ["cards-tile"], defaultContent: [] },
      { id: "section-6-app-promo", name: "Mobile app promo", selector: "#main-content > div.rtc-component.nw-outer-bottom--lg.nw-bg-rebrand-vibrant-blue", style: "vibrant-blue", blocks: ["columns-app"], defaultContent: [] },
      { id: "section-7-plan-types", name: "Plan types cards", selector: "#main-content > div.nw-multi-option-promo.nw-bg-white.nw-outer-bottom--xl", style: null, blocks: ["cards-action"], defaultContent: [] },
      { id: "section-gap-annuities", name: "Annuities comparison table", selector: "#main-content > div.rtc-component.nw-bg-gray-pale-25", style: "grey", blocks: ["cards-action"], defaultContent: [] },
      { id: "section-gap-ffp-icons", name: "Financial specialist icons grid", selector: "#main-content > div.rtc-component.nw-outer-bottom--md:nth-of-type(4)", style: null, blocks: ["cards-action"], defaultContent: [] },
      { id: "section-gap-ffp-columns", name: "Two-column content with image", selector: "#main-content > div.rtc-component.nw-outer-bottom--md.nw-bg-gray-pale-25", style: "grey", blocks: ["columns-banner"], defaultContent: [] },
      { id: "section-gap-ffp-cta", name: "Dark CTA strip", selector: "#main-content > div.nw-bg-blue-darkest.nw-small-cta", style: "dark-blue", blocks: ["columns-cta"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_investing_product_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
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
      main.querySelectorAll("p").forEach((p) => {
        const text = p.textContent.trim();
        if (text === "Loading..." || text === "\xD7" || text === "\u2039\u203A" || /^NFW-/.test(text)) {
          p.remove();
        }
      });
      const treeWalker = document.createTreeWalker(main, 4);
      const junkNodes = [];
      while (treeWalker.nextNode()) {
        const t = treeWalker.currentNode.textContent.trim();
        if (/^NFW-/.test(t) || t === "\u2039\u203A" || t === "\xD7" || t === "Loading...") {
          junkNodes.push(treeWalker.currentNode);
        }
      }
      junkNodes.forEach((n) => {
        if (n.parentNode) n.parentNode.removeChild(n);
      });
      main.querySelectorAll('.nw-subnav, .nw-sub-nav, .nw-banner2__subnav, .owl-nav, .owl-dots, .owl-prev, .owl-next, [class*="carousel-nav"], [class*="slick-arrow"]').forEach((el) => el.remove());
      main.querySelectorAll("ul").forEach((ul) => {
        const lis = Array.from(ul.querySelectorAll("li"));
        if (lis.length < 3) return;
        const allLinks = lis.every((li) => {
          const a = li.querySelector("a");
          const h = li.querySelector("h4, h5, h3");
          return a && li.textContent.trim() === a.textContent.trim() || h;
        });
        const hasHeadingOnly = lis.some((li) => li.querySelector("h4, h5") && !li.querySelector("a"));
        if (allLinks && hasHeadingOnly) ul.remove();
      });
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
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
  return __toCommonJS(import_investing_product_exports);
})();
