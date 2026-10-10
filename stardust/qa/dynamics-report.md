# Dynamics parity check — https://main--5ca9e426--aemcoder.aem.live — 2026-10-09T19:24:54.316Z

Replayed 10 checks over 13 features · pass 10 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| recipe cards (first-party cardsinfo API → settled DOM) | A | done | dom-count | PASS | 14 × .recipe-cards .card-recipe (min 14) | www.youtube.com:200×14 fonts.gstatic.com:200×2 www.google.com:200×2 static.doubleclick.net:200×2 googleads.g.doubleclick.net:302×2 googleads.g.doubleclick.net:200×2 i.ytimg.com:200×2 www.youtube.com:204×2 jnn-pa.googleapis.com:200×2 |
| offerings tiles (productCategoryInfo.json → settled DOM) | D | done | dom-count | PASS | 5 × .offerings .categorylist-item (min 5) | www.youtube.com:200×14 fonts.gstatic.com:200×2 static.doubleclick.net:200×2 googleads.g.doubleclick.net:302×2 www.google.com:200×2 googleads.g.doubleclick.net:200×2 i.ytimg.com:200×2 www.youtube.com:204×2 jnn-pa.googleapis.com:200×2 |
| most-loved carousel (popularProductsInfo.json → settled DOM) | D | done | dom-count | PASS | 2 × .most-loved .popular-slide (min 2) | www.youtube.com:200×14 fonts.gstatic.com:200×2 static.doubleclick.net:200×2 googleads.g.doubleclick.net:302×2 www.google.com:200×2 googleads.g.doubleclick.net:200×2 i.ytimg.com:200×2 www.youtube.com:204×2 jnn-pa.googleapis.com:200×2 |
| footprint tiles (footprintsInfo.json → settled DOM) | D | done | dom-count | PASS | 3 × .footprint .footprint-item (min 3) | www.youtube.com:200×14 fonts.gstatic.com:200×2 static.doubleclick.net:200×2 googleads.g.doubleclick.net:302×2 www.google.com:200×2 googleads.g.doubleclick.net:200×2 i.ytimg.com:200×2 www.youtube.com:204×2 jnn-pa.googleapis.com:200×2 |
| footprint tiles (footprintsInfo.json → settled DOM) | D | done | dom-count | PASS | 2 × .footprint .video-card-iframe (min 2) | www.youtube.com:200×14 fonts.gstatic.com:200×2 static.doubleclick.net:200×2 googleads.g.doubleclick.net:302×2 www.google.com:200×2 googleads.g.doubleclick.net:200×2 i.ytimg.com:200×2 www.youtube.com:204×2 jnn-pa.googleapis.com:200×2 |
| client-rendered slots (cmp-carousel hero, banners) | CR | done | dom-count | PASS | 4 × .hero-carousel .hero-slide (min 4) | www.youtube.com:200×14 fonts.gstatic.com:200×2 static.doubleclick.net:200×2 googleads.g.doubleclick.net:302×2 www.google.com:200×2 googleads.g.doubleclick.net:200×2 i.ytimg.com:200×2 www.youtube.com:204×2 jnn-pa.googleapis.com:200×2 |
| client-rendered slots (cmp-carousel hero, banners) | CR | done | no-page-errors | PASS | none on 1 page(s) |  |
| header search (icon → in-page overlay → source-bound customsearchresults.json) | S | scaffolded-awaiting-owner | dom-count | PASS | 1 × header .nav-search a (min 1) | www.youtube.com:200×14 fonts.gstatic.com:200×2 static.doubleclick.net:200×2 googleads.g.doubleclick.net:302×2 www.google.com:200×2 googleads.g.doubleclick.net:200×2 i.ytimg.com:200×2 www.youtube.com:204×2 jnn-pa.googleapis.com:200×2 |
| YouTube embed sbUQyvhgsGg (Our Community) | V | done | video-plays | PASS | iframe/video: true · no <video> · playback requests 37 (ok) | www.youtube.com:200×29 fonts.gstatic.com:200×5 static.doubleclick.net:200×2 googleads.g.doubleclick.net:302×2 www.google.com:200×2 googleads.g.doubleclick.net:200×2 i.ytimg.com:200×5 www.youtube.com:204×5 jnn-pa.googleapis.com:200×2 yt3.ggpht.com:200×2 www.gstatic.com:200×1 rr3---sn-ajun55-5p.googlevideo.com:200×1 |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (2 gated · 1 cross-site host(s) blocked) |  |

## Features without checks

- AEM runtime settings objects (dataLayer, adobeDataLayer, CQ) (A) — done
- runtime-injected 0×0 iframe (tag-manager / doubleclick frame) (V) — done
- Adobe Launch + GTM ×3 + Adobe Analytics / ECID + GA / Ads pixels (T) — scaffolded-awaiting-owner · owner: set enabled:true per route in stardust/martech-contract.json (Adobe Launch launch-0a4e2b76f43e, GTM G-YNVEK2WX21, DC-8835225, DC-10001500) and rewrite the Launch rules that read old selectors (stardust/martech-handoff.md)
- s7ap1.scene7.com imagery, ytimg/ggpht thumbnails (T) — done
- www.google.com, www.gstatic.com, jnn-pa.googleapis.com (A) — done
