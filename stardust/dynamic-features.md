<!-- stardust provenance: skill=stardust:replica · phase=preserve-direction (dynamics Phases 1–3) · 2026-10-09 · input stardust/current/_dynamics.json (1 page, 24 findings) · draft stardust/dynamics/dynamic-features.generated-plan.md -->
# Dynamic features — aashirvaad.com (home page only)

Scope: one page (`/`). No sibling pages; every row is read against the home page's settled DOM.

## Listings contract
none — no listing block on the migrated page reads an index. The three first-party data files below feed fixed home-page modules and ship as the settled DOM (see Features).

## Features
| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-first-party-api-cardsinfo | first-party API GET `…/en.cardsinfo.json/…/dynamiccardsvertwo_c_642530669` (recipe cards) | A | 1/1 | static-snapshot | self | planned | settled-dom-snapshot | none — the three recipe cards render into `[data-component=recipe-group]`; the settled DOM carries them. Unfreeze: a recipe index on the new host (site-scope run). | `_dynamics.json`, page JSON `dynamic.endpoints` |
| 2 | d-productcategory-info | first-party data file `productcategory.productCategoryInfo.json` (Aashirvaad offerings) | D | 1/1 | static-snapshot | self | planned | settled-dom-snapshot | none — 5 category tiles, host-bound on the target (probe 404); authored as content. Unfreeze: owner moves the category sheet. | plan draft row 12; target probe host-bound |
| 3 | d-popularproducts-info | first-party data file `popularproducts.popularProductsInfo.json` (Most loved carousel) | D | 1/1 | static-snapshot | self | planned | settled-dom-snapshot | none — product slides authored as content from the settled DOM. | plan draft row 13 |
| 4 | d-footprint-info | first-party data file `footprint_copy.footprintsInfo.json` (Our vision / Trust / Make history tiles) | D | 1/1 | static-snapshot | self | planned | settled-dom-snapshot | none — fixed copy tiles. | plan draft row 14 |
| 5 | cr-client-rendered-slots | client-rendered slots `cmp-container`, `cmp-carousel`, `cmp-banner`, product/recipe/footprint slots | CR | 1/1 | static-snapshot | self | planned | settled-dom-snapshot | none — hydrated capture is complete (HYDRATED, 14 headings, mainTextLen 6834); no blank capture. | `_signals` in page JSON |
| 6 | a-settings-objects | CMS / app settings objects `dataLayer`, `adobeDataLayer`, `CQ` | A | 1/1 | static-snapshot | self | planned | read-settings | none — AEM Sites runtime objects; `adobeDataLayer` is re-created by the tag stack when the owner enables it (martech contract). | plan draft rows 5–7 |
| 7 | s-site-search | header search form → `…/en.customsearchresults.json/_jcr_content/root/search` | S | 1/1 | static-snapshot | needs-business-decision | scaffolded-awaiting-owner | search-index-backed | Interim: search icon + field rebuilt in the header, submit points at the source results page (`https://aashirvaad.com/us/en/search-results.html`, as captured). Owner decides when a results page exists on the new host (needs the site-scope index; out of this one-page run). Named assumption, not decided-out. | plan draft row 15 |
| 8 | v-video-youtube | YouTube embed `sbUQyvhgsGg` ("Our Community") | V | 1/1 | embed-passthrough | self | planned | media-as-url | none — public player id, re-authored as the embed URL. | plan draft row 23 |
| 9 | v-iframe-runtime | iframe without src (0×0, runtime-injected) | V | 1/1 | embed-passthrough | self | planned | embed-passthrough | Resolved from the settled DOM: it is the tag-manager / doubleclick frame, not content. Covered by the martech contract; nothing to re-author. | plan draft row 24 |
| 10 | t-tag-stack | Adobe Launch, Google Tag Manager ×3, Adobe Analytics / ECID, GA / Ads, ad / retargeting pixels | T | 1/1 | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | Owner asked to keep analytics, tags and consent. Carried over via `stardust/martech-contract.json` → `scripts/martech.js`, every route disabled; the owner turns each on. Consent model `owner-decision` (no CMP detected). | `stardust/martech-handoff.md` |
| 11 | t-asset-hosts | `s7ap1.scene7.com` (Dynamic Media imagery), `yt3.ggpht.com`, `i.ytimg.com` (YouTube thumbnails) | T | 1/1 | embed-passthrough | self | planned | asset-host | Not tags: Scene7 is the image CDN (rehosted to the new site per media-reconcile), ggpht/ytimg belong to the YouTube embed. Reclassified from "inspect". | network hosts in `_dynamics.json` |
| 12 | a-google-hosts | `www.google.com`, `www.gstatic.com`, `jnn-pa.googleapis.com` | A | 1/1 | embed-passthrough | self | planned | vendor | Reclassified from "inspect": requests made by the YouTube embed and the Google tag stack (ad pixels / reCAPTCHA assets); nothing first-party reads them. | network hosts in `_dynamics.json` |

## Decision batch
One message to the owner (recorded, hands-off interim ships):
- **Tags on the new host** (row 10): which of Adobe Launch (`launch-0a4e2b76f43e`), GTM `G-YNVEK2WX21`, `DC-8835225`, `DC-10001500` should run on the migrated site; set `enabled: true` per route in `stardust/martech-contract.json`. 607 Launch rules read old selectors — see the rewrite list in `stardust/martech-handoff.md`.
- **Site search** (row 7): the migrated home page keeps the search field; results need a results page and an index on the new host — a site-scope decision.
- **Data-fed modules** (rows 1–4): the offerings, recipe, most-loved and footprint modules are shipped as authored content. When the owner wants them sheet-driven again, the three JSON feeds move to sheets (`sync-sheets.mjs`).

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | none | no feature is decided out; every non-self row above ships an interim tier |

> **B2 verification (2026-10-09T16:59Z):** detector re-run on the home page against fresh evidence — 22 findings, 0 new, 0 gone; `dynamics-plan.mjs --target-origin https://main--5ca9e426--aemcoder.aem.page --migrated stardust/migrated`: 4 first-party API/data paths `hostBound` on the target (rows 1–4, already `static-snapshot`), scene7 imagery and the YouTube embed `alreadyDelivered` by the migrated page. Every row keeps its disposition; no new rows.

> **D2 verification (2026-10-09T19:05Z):** `stardust/dynamics/parity.json` written (12 features, 10 replayable checks); `dynamics-check.mjs --origin https://main--5ca9e426--aemcoder.aem.live` → pass 10 / fail 0 (`stardust/qa/dynamics-report.md`). Rows 1–5, 8, 9, 11, 12 are `done`: 14 recipe cards, 5 offerings tiles, 2 most-loved slides, 3 footprint tiles (2 YouTube iframes + the live site's own placeholder on card 3), 4 hero slides, 0 page errors; the Our Community embed issues 31 playback requests on click (source embed is click-to-play). Row 10 (tag stack): martech gate PASS — no tag host requested with every route disabled; `scripts/martech.js` ships. Row 7 (search) correction: the interim target named in the plan, `https://aashirvaad.com/us/en/search-results.html`, answers 404 — the source header itself is an `a[href="#"]` icon that opens an in-page overlay fed by the host-bound `customsearchresults.json`, so the delivered icon is kept exactly as captured (inert) and no substitute target was wired; the owner decision (results page + index on the new host) is unchanged.
