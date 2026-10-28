# Dynamic features — aashirvaad.com (home page, bounded single-page replica)

Curated from `stardust/dynamics/dynamic-features.generated-plan.md` (24 draft rows → 14 features).
Target host probed: `main--683f0604--aemcoder.aem.page` (the source's `/content/…` JSON paths 404 there — host-bound).

## Listings contract
none — the page has no index-fed listing blocks. The three data-fed bands (offerings, most loved, our vision)
and the recipe tabs are document-first: their item text is authored as block rows (snapshot of the source JSON
/ settled DOM, 2026-10-22).

## Features
| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | hero-carousel | hero banner carousel (4 slides, arrows, dots, desktop/mobile renditions) | CR | 1/1 | rebuild-native | block | self | pending | settled-dom-snapshot + carousel JS | — | `.cmp-banner` ×4, slick |
| 2 | offerings | "Aashirvaad offerings" category grid (5) from `productcategory.productCategoryInfo.json` | D | 1/1 | data-fed | content | self | pending | sheet-sync → authored rows | none (snapshot from the source origin) | dead on target (404); `stardust/current/data/productcategory.json` |
| 3 | recipe-tabs | recipe tabs (3) + carousel of cards from `cardsinfo.json` (14 / 6 / 17 cards) | A | 1/1 | data-fed | block | self | pending | off-origin-data → authored rows per tab | none — interim: all three tabs authored from the settled DOM; live API stays on the source | `stardust/current/data/recipe-tabs.json` |
| 4 | most-loved | "Most loved" product carousel (2) from `popularproducts.popularProductsInfo.json` | D | 1/1 | data-fed | block | self | pending | sheet-sync → authored rows | none | dead on target (404); `stardust/current/data/popularproducts.json` |
| 5 | our-vision | "Our vision" cards (3, card 1 with YouTube) from `footprint_copy.footprintsInfo.json`; carousel on mobile | D | 1/1 | data-fed | block | self | pending | sheet-sync → authored rows | none | dead on target (404); `stardust/current/data/footprints.json` |
| 6 | community-carousel | "Our Community" teaser carousel (3) | CR | 1/1 | rebuild-native | block | self | pending | carousel JS | — | slick |
| 7 | youtube | YouTube players (recipe video `sbUQyvhgsGg`, vision card `iFqqEJH4Mnw`) — incl. youtube internals (www.google.com, www.gstatic.com, jnn-pa.googleapis.com, yt3.ggpht.com) | V | 1/1 | embed-passthrough | content | self | pending | media-as-url | none (player ids are public) | iframes `#player1`, `#widget2` |
| 8 | header-megamenu | header "Our Products" mega menu (17 categories) + CSR submenu, mobile hamburger drawer | R | 1/1 | rebuild-native | runtime | self | pending | chrome | — | `.cmp-header__nav-group` |
| 9 | site-search | header search overlay → `/content/…/en.customsearchresults.json` | S | 1/1 | index-backed | widget | self | pending | search-index-backed | none (corpus = the migrated pages: 1 page in this run — parity note) | `.cmp-search__form` |
| 10 | newsletter | footer newsletter sign-up (email + consent checkbox + "Register Now") | F | 1/1 | rebuild-native | block | needs-business-decision | pending | form, local capture | **owner:** which backend receives sign-ups — interim: UI rebuilt, submission shows "no backend connected" | `.cmp-footer__nav-subscribe` |
| 11 | images | Scene7 renditions (`s7ap1.scene7.com`) | T→asset | 1/1 | static-snapshot | content | self | pending | rehost | — reason: rendition URLs are rehosted as page media; unfreeze: owner moves DAM to the new host | 45 files in `stardust/current/assets/media/` |
| 12 | tags | Adobe Launch (607 rules / 272 data elements), Adobe Analytics + ECID (demdex, omtrdc), Web SDK (Alloy hidden iframe), Google Tag Manager / gtag (G-YNVEK2WX21, DC-8835225, DC-10001500), ad pixels (Facebook signals, DoubleClick); data layers `dataLayer`, `adobeDataLayer` | T | 1/1 | embed-passthrough | embed | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | **owner:** enable each route in `stardust/martech-contract.json` (all carried over disabled) | `stardust/martech/`, `stardust/martech-handoff.md` |
| 13 | client-rendered-slots | AEM container / carousel / banner hydration (settled DOM) | CR | 1/1 | static-snapshot | content | self | pending | settled-dom-snapshot | — reason: settled DOM is the content; unfreeze: never (no consumer) | crawl `HYDRATED` |
| 14 | aem-runtime-globals | `CQ` (AEM author runtime global) | A | 1/1 | static-snapshot | content | self | pending | read-settings | — reason: platform global with no consumer on EDS; nothing to carry | `globalState` |

## Decision batch
One message to the site owner (hands-off: interim paths ship, each decision is a named assumption):
1. **Newsletter backend** (row 10): where should footer sign-ups go (CRM / email service / sheet)? Interim: the form renders and validates, submission shows a "no backend connected" notice.
2. **Tags and consent** (row 12): every tag-manager route, analytics and pixel is carried over **disabled** in `stardust/martech-contract.json`; turn on each part (and supply the Launch/GTM property decision for the new host) per `stardust/martech-handoff.md`.
3. **Recipe data** (row 3): the recipe cards are a snapshot of the three tabs on 2026-10-22; decide whether the new site should read a live recipe index once the recipe pages migrate.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | none | — |
