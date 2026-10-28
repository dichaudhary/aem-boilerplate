<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-22T07:45:02.718Z · input stardust/current/_dynamics.json (1 pages, 24 findings) · target probe https://main--683f0604--aemcoder.aem.page · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-www-gstatic-com | A | unknown third-party host www.gstatic.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-unknown-third-party-host-jnn-pa-googleapis-com | A | unknown third-party host jnn-pa.googleapis.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-first-party-api-get-content-itc-foods-brands-aashirvaad-us | A | first-party API GET /content/itc-foods-brands/aashirvaad/us/en.cardsinfo.json/jcr:content/root/container/container/container_2037180742_1851074617/dynamiccardsvertwo_c_642530669 | 1/1 (reach 1/1) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 5 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 1/1 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 6 | a-cms-app-settings-object-adobedatalayer | A | CMS / app settings object adobeDataLayer | 1/1 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 7 | a-cms-app-settings-object-cq | A | CMS / app settings object CQ | 1/1 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 8 | cr-client-rendered-slot-cmp-container | CR | client-rendered slot cmp-container | 1/1 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 9 | cr-client-rendered-slot-cmp-carousel | CR | client-rendered slot cmp-carousel | 1/1 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 10 | cr-client-rendered-slot-cmp-banner | CR | client-rendered slot cmp-banner | 1/1 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 11 | cr-client-rendered-slot | CR | client-rendered slot  | 1/1 | static-snapshot | content | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 12 | d-first-party-data-file-get-content-itc-foods-brands-aashirv | D | first-party data file GET /content/itc-foods-brands/aashirvaad/us/en/jcr:content/root/container/container/container_565442740/popularproducts.popularProductsInfo.json | 1/1 (reach 1/1) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 13 | d-first-party-data-file-get-content-itc-foods-brands-aashirv | D | first-party data file GET /content/itc-foods-brands/aashirvaad/us/en/jcr:content/root/container/container/container/footprint_copy.footprintsInfo.json | 1/1 (reach 1/1) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 14 | d-first-party-data-file-get-content-itc-foods-brands-aashirv | D | first-party data file GET /content/itc-foods-brands/aashirvaad/us/en/jcr:content/root/container/container/container_1966233443/productcategory.productCategoryInfo.json | 1/1 (reach 1/1) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 15 | s-site-search-form-content-itc-foods-brands-aashirvaad-us-en | S | site search form → /content/itc-foods-brands/aashirvaad/us/en.customsearchresults.json/_jcr_content/root/search | 1/1 (reach 0/1) | index-backed | widget | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 16 | t-unknown-third-party-host-s7ap1-scene7-com | T | unknown third-party host s7ap1.scene7.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 17 | t-tag-manager-adobe-launch | T | tag manager: Adobe Launch | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 18 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 19 | t-analytics-adobe-analytics-experience-cloud-id | T | analytics: Adobe Analytics / Experience Cloud ID | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 20 | t-unknown-third-party-host-yt3-ggpht-com | T | unknown third-party host yt3.ggpht.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 21 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 22 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 23 | v-video-youtube | V | video: YouTube | 1/1 | embed-passthrough | content | self | delivered-by-capture | media-as-url | none (player ids are public) | output already carries "www.youtube.com" |
| 24 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 1/1 | embed-passthrough | embed | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 11 row(s) — read-settings, settled-dom-snapshot, sheet-sync, search-index-backed.
- **One owner decision batch:** 12 row(s) — inspect the XHR, add a vendor row · which tier for the target host; consumer on the migrated pages? · which tags run on the new host; property ids · resolve the runtime src from a rendered capture.
- **Already delivered by the capture pipeline:** 1 row(s) — no work.
- **Host-bound on the target:** 4 of 2 probed API paths — the off-origin data work.
- **Martech:** no CMP · 0/4 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **tags** — 7
- **detect** — 6
- **capture** — 4
- **data** — 3
- **off-origin data** — 1
- **search** — 1
- **media** — 1
- **embeds** — 1
