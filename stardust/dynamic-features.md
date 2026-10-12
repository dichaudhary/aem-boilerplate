# Dynamic features — aashirvaad.com (home page, bounded single-page replica)

Curated from `stardust/dynamics/dynamic-features.generated-plan.md` (24 detected rows, merged to 11).
Hands-off run: every non-`self` row ships its interim tier and names the owner decision.

## Listings contract

none — the single migrated page carries no listing block fed by a query index; every card band
(offerings, recipes, most loved, our vision, community) is authored as rows in the page document.

## Features

| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | cr-carousels | hero, recipe, most-loved, our-vision (360), community carousels (slick) | CR | 1/1 | rebuild-native | self | planned | block JS (arrows, dots, autoplay as observed) | — | data-component=carousel, cmp-banner |
| 2 | d-product-categories | offerings band (productCategoryInfo.json) | D | 1/1 | static-snapshot | self | planned | document-first rows | unfreeze: when category pages migrate, link targets update | productcategory.productCategoryInfo.json (host-bound on target) |
| 3 | d-popular-products | Most loved band (popularProductsInfo.json) | D | 1/1 | static-snapshot | self | planned | document-first rows | unfreeze: owner edits rows in the document | popularproducts.popularProductsInfo.json (host-bound) |
| 4 | d-footprint | Our vision band (footprintsInfo.json) | D | 1/1 | static-snapshot | self | planned | document-first rows | — | footprint_copy.footprintsInfo.json (host-bound) |
| 5 | a-recipe-cards | recipe tabs + cards (cardsinfo.json per tab) | A | 1/1 | static-snapshot | self | planned | settled DOM of each tab authored as rows; tab switching rebuilt client-only | owner: keep recipe cards in sync with the recipe section (interim: authored snapshot) | en.cardsinfo.json/…/dynamiccardsvertwo |
| 6 | s-site-search | header search (customsearchresults.json) | S | 1/1 | rebuild-native | needs-business-decision | interim | search icon opens the overlay; queries go to the source site's search until the rest of the site is migrated | owner: search corpus once more pages migrate (index-backed over the migrated pages) | cmp-search__form, fulltext |
| 7 | f-newsletter | footer "in Your Inbox" email registration | F | 1/1 | rebuild-native | needs-business-decision | scaffolded-awaiting-owner | UI rebuilt; submission shows a "no backend connected" message | owner: which backend receives sign-ups (personal data) | footer email input + consent checkbox |
| 8 | v-youtube | two YouTube embeds (recipe video, quality certificate) | V | 1/1 | embed-passthrough | self | planned | same-src iframe | — | youtube.com/embed/sbUQyvhgsGg, second embed in Our vision; i.ytimg, yt3.ggpht, www.google.com, www.gstatic.com, jnn-pa.googleapis.com are the player's own hosts |
| 9 | t-martech | Adobe Launch, Google tag (G-YNVEK2WX21, DC-8835225, DC-10001500), Adobe Analytics/ECID, ad pixels | T | 1/1 | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner | martech contract, every part disabled | owner: enable routes, rewrite Launch rules (stardust/martech-handoff.md) | assets.adobedtm.com, googletagmanager.com, demdex, omtrdc, doubleclick, connect.facebook.net |
| 10 | a-settings-objects | dataLayer, adobeDataLayer, CQ globals | A | 1/1 | static-snapshot | self | planned | not re-created; dataLayer pushes are a tagging-plan item in the martech hand-off | — | window globals |
| 11 | t-scene7-media | Dynamic Media (s7ap1.scene7.com) imagery | T | 1/1 | static-snapshot | self | planned | images rehosted to the EDS media bus at deploy | — | s7ap1.scene7.com |

## Decision batch

One message to the owner (recorded, not waited on — hands-off):
1. **Search** (#6): until the rest of the site migrates, the search overlay sends queries to the
   current site's search. Decide the corpus for an index-backed search on the new host.
2. **Newsletter** (#7): the sign-up form is rebuilt but not connected; name the service that should receive sign-ups.
3. **Tags and analytics** (#9): everything is carried over switched off; turn each part on in
   `stardust/martech-contract.json` and rewrite the Launch rules listed in `stardust/martech-handoff.md`.

## Register (decided-out)

| feature | reason | production statement |
|---|---|---|
| — | none | — |

## Re-verification (rollout B2, 2026-10-12)

Fresh `dynamics-detect.mjs --urls https://aashirvaad.com/` → 24 findings (22 third-party hosts, 4 first-party API,
1 form, 2 media, 12 client-rendered) — same set as the curated basis; `dynamics-plan.mjs --target-origin
main--f4bf5395--aemcoder.aem.page` → host-bound 2/2. Generated → curated mapping (every generated row is covered):
gen 1–3, 19, 23, 24 (google/gstatic/jnn-pa/ggpht hosts, YouTube, src-less runtime iframe = the YouTube player) → #8;
gen 4 → #5; gen 5–7 → #10; gen 8–11 → #1; gen 12 → #2; gen 13 → #3; gen 14 → #4; gen 15 → #6; gen 16 → #11;
gen 17, 18, 20–22 → #9; the footer form (forms 1) → #7. No new feature; every row keeps its disposition.
