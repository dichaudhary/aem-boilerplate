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

  // tools/importer/import-investing-landing.js
  var import_investing_landing_exports = {};
  __export(import_investing_landing_exports, {
    default: () => import_investing_landing_default
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
      const para = p.cloneNode(true);
      if (para.textContent.trim()) contentCell.push(para);
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

  // tools/importer/parsers/cards-invest.js
  function parse2(element, { document }) {
    let items = Array.from(element.querySelectorAll(".owl-item > a, .owl-item a[href]"));
    if (items.length === 0) {
      const slider = element.querySelector('.circle-slider, .owl-carousel, [class*="carousel"]');
      if (slider) {
        items = Array.from(slider.querySelectorAll("a[href]")).filter(
          (a) => a.querySelector("img") || a.querySelector("p")
        );
      }
    }
    if (items.length === 0) {
      items = Array.from(element.querySelectorAll("ul.row > li.column"));
    }
    if (items.length === 0) {
      items = Array.from(element.querySelectorAll("li.column"));
    }
    if (items.length === 0) {
      items = Array.from(element.querySelectorAll("a:has(h5), a:has(h4), a:has(h3)"));
    }
    if (items.length === 0) {
      items = Array.from(element.querySelectorAll("a[href]")).filter(
        (a) => a.querySelector("img") && a.textContent.trim().length > 0
      );
    }
    if (items.length === 0) {
      return;
    }
    const cells = items.map((item) => {
      const anchor = item.tagName === "A" ? item : item.querySelector("a");
      const href = anchor ? anchor.getAttribute("href") || "" : "";
      const icon = item.querySelector("img, svg");
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
        if (desc) {
          const p = document.createElement("p");
          p.textContent = desc.textContent.trim();
          contentCell.push(p);
        }
      } else if (desc && href) {
        const h = document.createElement("h3");
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = desc.textContent.trim();
        h.appendChild(link);
        contentCell.push(h);
      } else if (href) {
        const p = document.createElement("p");
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = (anchor ? anchor.textContent.trim() : "") || href;
        p.appendChild(link);
        contentCell.push(p);
      }
      if (icon && icon.tagName === "IMG" && !icon.getAttribute("alt") && (heading || desc)) {
        const altText = heading ? heading.textContent.trim() : desc.textContent.trim();
        icon.setAttribute("alt", altText + " icon");
      }
      let imageCell = icon || "";
      if (icon && icon.tagName === "svg") {
        const titleEl = icon.querySelector("title");
        if (titleEl) {
          const img = document.createElement("img");
          img.setAttribute("alt", titleEl.textContent.trim());
          img.setAttribute("src", "");
          imageCell = img;
        }
      }
      return [imageCell, contentCell];
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-invest", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-lifecycle.js
  function parse3(element, { document }) {
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

  // tools/importer/parsers/cards-feature.js
  function parse4(element, { document }) {
    const boltTiles = Array.from(element.querySelectorAll("bolt-tile[href]"));
    if (boltTiles.length === 0) {
      return;
    }
    const cells = boltTiles.map((tile) => {
      const href = tile.getAttribute("href") || "#";
      const label = tile.getAttribute("label") || "";
      const imgSrc = tile.getAttribute("img") || "";
      const desc = tile.querySelector("p");
      const descText = desc ? desc.textContent.trim() : "";
      let imageCell = "";
      if (imgSrc) {
        const img = document.createElement("img");
        img.setAttribute("src", imgSrc.startsWith("/") ? `https://www.nationwide.com${imgSrc}` : imgSrc);
        img.setAttribute("alt", label);
        imageCell = img;
      }
      const textCell = [];
      if (label) {
        const h = document.createElement("h2");
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = label;
        h.appendChild(link);
        textCell.push(h);
      }
      if (descText) {
        const p = document.createElement("p");
        p.textContent = descText;
        textCell.push(p);
      }
      return [imageCell, textCell];
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
      element.replaceWith(block);
    }
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
  function parse5(element, { document }) {
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

  // tools/importer/parsers/columns-promo.js
  function parse6(element, { document }) {
    const centeredHeadingRow = element.querySelector(".row.columns.text-center, .row.text-center");
    const topHeading = centeredHeadingRow ? centeredHeadingRow.querySelector('h1, h2, h3, h4, [class*="heading"]') : null;
    const contentRows = Array.from(
      element.querySelectorAll(".row.nw-inner-bun--sm, .row.nw-inner-bun")
    );
    if (contentRows.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const leftCell = [];
    if (topHeading) {
      leftCell.push(topHeading);
    }
    const firstRow = contentRows[0];
    const firstRowCols = Array.from(
      firstRow.querySelectorAll(':scope > [class*="columns"][class*="rtc-paragraph"]')
    );
    if (firstRowCols.length >= 2) {
      let textCol = null;
      let imageCol = null;
      const firstColIsSmall = firstRowCols[0].className.includes("large-3") || firstRowCols[0].className.includes("large-4");
      if (firstColIsSmall) {
        imageCol = firstRowCols[0];
        textCol = firstRowCols[1];
      } else {
        textCol = firstRowCols[0];
        imageCol = firstRowCols[1];
      }
      if (textCol) {
        const textScope = textCol.querySelector(":scope > span") || textCol;
        const intro = textScope.querySelector('.nw-text-lg, [class*="text-lg"]');
        if (intro) {
          const p = document.createElement("p");
          p.textContent = (intro.textContent || "").replace(/ /g, " ").trim();
          if (p.textContent) leftCell.push(p);
        }
        const heading = textScope.querySelector('h1, h2, h3, h4, [class*="heading"]');
        if (heading && heading !== topHeading) leftCell.push(heading);
        const paragraphs = Array.from(textScope.querySelectorAll(":scope > p"));
        paragraphs.forEach((p) => {
          if (p.textContent.trim()) leftCell.push(p);
        });
        const candidateDivs = Array.from(textScope.querySelectorAll(":scope > div"));
        const listItems = candidateDivs.filter((d) => {
          if (d.classList.contains("nw-text-lg")) return false;
          if (d.querySelector("h1, h2, h3, h4")) return false;
          const text = (d.textContent || "").replace(/ /g, " ").trim();
          return text.length > 0;
        });
        if (listItems.length > 0) {
          const ul = document.createElement("ul");
          listItems.forEach((itemDiv) => {
            const li = document.createElement("li");
            const text = (itemDiv.textContent || "").replace(/ /g, " ").trim();
            if (text) {
              li.textContent = text;
              ul.appendChild(li);
            }
          });
          if (ul.children.length > 0) leftCell.push(ul);
        }
        const existingUl = textScope.querySelector("ul");
        if (existingUl && listItems.length === 0) {
          leftCell.push(existingUl);
        }
        const ctaLinks = Array.from(textScope.querySelectorAll("a")).filter((a) => !a.closest(".nw-text-lg") && !a.querySelector("img"));
        ctaLinks.forEach((link) => leftCell.push(link));
      }
      if (imageCol && firstColIsSmall) {
        const icon = imageCol.querySelector("img");
        if (icon) {
          leftCell.splice(topHeading ? 1 : 0, 0, icon);
        }
      }
    } else if (firstRowCols.length === 1) {
      const scope = firstRowCols[0].querySelector(":scope > span") || firstRowCols[0];
      const heading = scope.querySelector("h1, h2, h3, h4");
      if (heading) leftCell.push(heading);
      const paras = Array.from(scope.querySelectorAll("p"));
      paras.forEach((p) => {
        if (p.textContent.trim()) leftCell.push(p);
      });
    }
    const rightCell = [];
    if (firstRowCols.length >= 2) {
      const firstColIsSmall = firstRowCols[0].className.includes("large-3") || firstRowCols[0].className.includes("large-4");
      if (!firstColIsSmall) {
        const rightScope = firstRowCols[1].querySelector(":scope > span") || firstRowCols[1];
        const imageLinks = Array.from(rightScope.querySelectorAll("a:has(img)"));
        const standaloneImages = Array.from(rightScope.querySelectorAll("img")).filter((img) => !img.closest("a"));
        if (imageLinks.length > 0) {
          imageLinks.forEach((link) => rightCell.push(link));
        }
        if (standaloneImages.length > 0) {
          standaloneImages.forEach((img) => rightCell.push(img));
        }
        const captions = Array.from(rightScope.querySelectorAll("p"));
        captions.forEach((cap) => {
          if (cap.textContent.trim()) rightCell.push(cap);
        });
      }
    }
    if (contentRows.length > 1) {
      const secondRow = contentRows[1];
      const secondRowCols = Array.from(
        secondRow.querySelectorAll(':scope > [class*="columns"][class*="rtc-paragraph"]')
      );
      secondRowCols.forEach((col) => {
        const scope = col.querySelector(":scope > span") || col;
        const nwTextDiv = scope.querySelector('.nw-text-lg, [class*="text-lg"]');
        const contentScope = nwTextDiv || scope;
        const appLinks = Array.from(contentScope.querySelectorAll("a:has(img)"));
        if (appLinks.length > 0) {
          appLinks.forEach((link) => rightCell.push(link));
        } else {
          const imgs = Array.from(contentScope.querySelectorAll("img"));
          imgs.forEach((img) => rightCell.push(img));
        }
        const textContent = (contentScope.textContent || "").replace(/ /g, " ").trim().replace(/\s+/g, " ");
        const imgTexts = Array.from(contentScope.querySelectorAll("img")).map((img) => img.alt).join("");
        const pureText = textContent.replace(imgTexts, "").trim();
        if (pureText) {
          const label = document.createElement("p");
          label.textContent = pureText;
          rightCell.push(label);
        }
      });
    }
    if (leftCell.length === 0 && rightCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [
      [leftCell, rightCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-promo",
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
  function parse7(element, { document }) {
    const columns = element.querySelectorAll(
      ".nw-card--action, .column.small-12.large-4, .column.large-4"
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

  // tools/importer/parsers/columns-links.js
  function parse8(element, { document }) {
    const elementsBeforeBlock = [];
    const heading = element.querySelector("h2, h3");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = (heading.textContent || "").trim();
      elementsBeforeBlock.push(h2);
    }
    let linkItems = Array.from(
      element.querySelectorAll(".owl-item a[href], .owl-stage a[href]")
    );
    if (linkItems.length === 0) {
      linkItems = Array.from(
        element.querySelectorAll("section a[href], .circle-slider a[href]")
      );
    }
    if (linkItems.length === 0) {
      linkItems = Array.from(element.querySelectorAll("a[href]")).filter(
        (a) => a.querySelector("img") || a.querySelector("picture")
      );
    }
    const seenHrefs = /* @__PURE__ */ new Set();
    const uniqueLinks = [];
    linkItems.forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (href && !seenHrefs.has(href)) {
        seenHrefs.add(href);
        uniqueLinks.push(a);
      }
    });
    if (uniqueLinks.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = uniqueLinks.map((linkEl) => {
      const img = linkEl.querySelector(".circle-slider__circle img, img");
      const labelP = linkEl.querySelector("p");
      const linkText = labelP ? (labelP.textContent || "").trim() : (linkEl.textContent || "").trim();
      const imgCell = [];
      if (img) {
        const newImg = document.createElement("img");
        newImg.setAttribute("src", img.getAttribute("src") || "");
        if (img.getAttribute("alt")) {
          newImg.setAttribute("alt", img.getAttribute("alt"));
        }
        imgCell.push(newImg);
      }
      const linkCell = [];
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.setAttribute("href", linkEl.getAttribute("href") || "#");
      a.textContent = linkText;
      p.appendChild(a);
      linkCell.push(p);
      return [imgCell.length > 0 ? imgCell : "", linkCell];
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-links",
      cells
    });
    element.replaceWith(...elementsBeforeBlock, block);
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

  // tools/importer/import-investing-landing.js
  var parsers = {
    "hero-invest": parse,
    "cards-invest": parse2,
    "cards-lifecycle": parse3,
    "cards-feature": parse4,
    "cards-tile": parse5,
    "columns-promo": parse6,
    "cards-action": parse7,
    "columns-links": parse8
  };
  var PAGE_TEMPLATE = {
    name: "investing-landing",
    description: "Investing hub landing page with hero, carousels, media-object sections, tiles, and CTAs",
    urls: [
      "https://www.nationwide.com/personal/investing/"
    ],
    blocks: [
      { name: "hero-invest", instances: ["#main-content > div.nw-banner2.nw-banner-inpage--clip.nw-bg-rebrand-vibrant-blue"] },
      { name: "cards-invest", instances: ["#main-content > div:has(section.circle-slider):not(.nw-bg-gray-pale-25)"] },
      { name: "cards-lifecycle", instances: ["#main-content > div.nw-bg-gray-pale-25:not(.rtc-component):not(.nw-multi-option-promo)"] },
      { name: "cards-feature", instances: ["#main-content > div.nw-container:has(bolt-tile-group)"] },
      { name: "cards-tile", instances: ["#main-content > section.nw-tile-block"] },
      { name: "columns-promo", instances: ["#main-content > div.rtc-component.nw-outer-bottom--lg.nw-bg-rebrand-vibrant-blue"] },
      { name: "cards-action", instances: ["#main-content > div.nw-multi-option-promo"] },
      { name: "columns-links", instances: ["#main-content > div.rtc-component.nw-outer-bottom--xl:nth-of-type(10)"] }
    ],
    sections: [
      { id: "section-1-hero", name: "Hero banner", selector: "#main-content > div.nw-banner2.nw-banner-inpage--clip.nw-bg-rebrand-vibrant-blue", style: null, blocks: ["hero-invest"], defaultContent: [] },
      { id: "section-2-media-objects", name: "Financial options cards", selector: "#main-content > div:has(section.circle-slider):not(.nw-bg-gray-pale-25)", style: null, blocks: ["cards-invest"], defaultContent: [] },
      { id: "section-3-carousel", name: "Solutions carousel", selector: "#main-content > div.nw-bg-gray-pale-25:not(.rtc-component):not(.nw-multi-option-promo)", style: "grey", blocks: ["cards-lifecycle"], defaultContent: [] },
      { id: "section-4-promo-tiles", name: "Promo tiles (bolt-tile)", selector: "#main-content > div.nw-container:has(bolt-tile-group)", style: null, blocks: ["cards-feature"], defaultContent: [] },
      { id: "section-5-tiles", name: "Feature tiles", selector: "#main-content > section.nw-tile-block", style: null, blocks: ["cards-tile"], defaultContent: [] },
      { id: "section-6-promo", name: "App promo", selector: "#main-content > div.rtc-component.nw-outer-bottom--lg.nw-bg-rebrand-vibrant-blue", style: "vibrant-blue", blocks: ["columns-promo"], defaultContent: [] },
      { id: "section-7-cta-cards", name: "CTA action cards", selector: "#main-content > div.nw-multi-option-promo", style: null, blocks: ["cards-action"], defaultContent: [] },
      { id: "section-8-links", name: "Related links", selector: "#main-content > div.rtc-component.nw-outer-bottom--xl:nth-of-type(10)", style: "grey", blocks: ["columns-links"], defaultContent: [] },
      { id: "section-9-disclaimers", name: "Disclaimers", selector: "#main-content > div.rtc-component.nw-outer-bottom--lg:nth-of-type(11)", style: null, blocks: [], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
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
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
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
  var import_investing_landing_default = {
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
  return __toCommonJS(import_investing_landing_exports);
})();
