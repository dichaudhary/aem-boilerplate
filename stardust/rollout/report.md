# rollout — https://aashirvaad.com/ → aem-eds (main--5ca9e426--aemcoder)

Written at H-report, 2026-10-09T19:30Z, from `rollout.json.lastRun`, `optimize/scorecard.json` (run-2), the gate tables and `stardust/qa/dynamics-report.md`.

```
rollout — aashirvaad.com → aem-eds
==================================================
Pages       1 total · 1 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale · 0 failed
Templates   1 (index: 1/1 delivered — the home page, type "landing")
Blocks      9 total · 9 converted · 0 pending (8 blocks + `follow` as default content)
Quality     health 100/100 · open P1 0 / P2 0 / P3 0 (fixed: jsonld P2; accepted 5: 4 qa source-parity/platform rows + transfer P3)
Pixel table prototypes 1/1 PASS · deployed 1/1 PASS (pixel-only 1/1) — gates/{prototypes,all}-1440/summary.md
            published origin 1440 2.09 % / Δh 0 · 360 3.36 % / Δh 0 · clipped 0 · content missing 0 (re-run after G, unchanged)
To deliver  none
Content     0 pages awaiting content track
```

## Delivery ledger

| path | source | template | status | live | gate 1440 | gate 360 |
|---|---|---|---|---|---|---|
| `/` (`/index`) | https://aashirvaad.com/ | index (landing) | verified | https://main--5ca9e426--aemcoder.aem.live/ | 2.09 % / Δh 0 PASS | 3.36 % / Δh 0 PASS |

Chrome documents `/nav` and `/footer` published (noindex). Redirects: none to wire (the source root serves a page; `/` resolves to `/index`). Served sitemap 1 = assembled 1. Links: 152 targets GET-audited, 0 internal 404; 137 out-of-scope targets repointed to the source site (decision in `stardust/direction.md`); `organic.aashirvaad.com` is unresolvable on the source too (owner note in `stardust/rollout/link-audit.md`).

## Quality (optimize run-2, live origin)

- Health 100/100 (a11y 100 · seo 100 · ai-search 100); `✓ GATE: no open P1`.
- Fixed in G: `jsonld` — the source's three JSON-LD blocks (Organization, WebSite + SearchAction, WebSite + description) carried over verbatim as a `json-ld` metadata row.
- Accepted (documented, not defects of the migration): axe colour-contrast on 3 recipe-card nodes (source parity, lifted colours); `x-robots-tag: noindex` (platform default on `*.aem.live`, cleared by the production host); duplicate-text (two footprint embed URLs as link text, replaced by iframes at decoration); missing `og:type` (source has none); transfer 2573 KB / JS 1415 KB over the 800 / 250 KB budgets after lazy-loading the YouTube iframes (was 3245 / 1962) — the residual is the three YouTube players the source carries; dropping one is an owner decision.
- ai-readability strict 100 %; LCP 180 ms, CLS 0.005.

## Dynamic parity (`stardust/qa/dynamics-report.md`, re-run after G: 10/10 PASS)

Dispositions per feature (class, reach, owner decision) are in `stardust/dynamic-features.md` and `stardust/dynamic-features-plan.md`; the replay rows:

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

Owner decisions carried in the inventory: header search kept as captured (icon → in-page overlay; results are source-bound, `customsearchresults.json` is host-bound on the target); four first-party data APIs are `hostBound` on the target and shipped as static snapshots of the settled DOM (`static-snapshot` rows); martech carried over with every contract part disabled (`stardust/martech-contract.json`, `stardust/martech-handoff.md`) — turning a part on stays with the owner.

## To deliver / what's missing

Nothing pending, stale or failed. Open owner items (not blockers): enable martech parts; decide on the dead `organic.aashirvaad.com` link (dead on the source too); optional: drop or facade one YouTube embed to meet the transfer budget.
