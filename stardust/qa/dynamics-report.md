# Dynamics parity check — https://main--683f0604--aemcoder.aem.live — 2026-10-22T09:25:37.838Z

Replayed 9 checks over 15 features · pass 9 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| hero banner carousel | CR | done | dom-count | PASS | 4 × main .hero .hero-slide (min 4) | www.youtube.com:200×6 fonts.gstatic.com:200×1 static.doubleclick.net:200×1 googleads.g.doubleclick.net:302×1 googleads.g.doubleclick.net:200×1 www.google.com:200×1 i.ytimg.com:200×1 www.youtube.com:204×1 jnn-pa.googleapis.com:200×1 |
| offerings category grid | D | done | dom-count | PASS | 5 × main .offerings .offerings-item (min 5) | www.youtube.com:200×6 fonts.gstatic.com:200×1 static.doubleclick.net:200×1 googleads.g.doubleclick.net:302×1 i.ytimg.com:200×1 www.google.com:200×1 googleads.g.doubleclick.net:200×1 www.youtube.com:204×1 jnn-pa.googleapis.com:200×1 |
| recipe tabs + card carousel | A | interim | dom-count | PASS | 3 × main .recipes .recipes-tab (min 3) | www.youtube.com:200×6 fonts.gstatic.com:200×1 static.doubleclick.net:200×1 www.google.com:200×1 googleads.g.doubleclick.net:302×1 i.ytimg.com:200×1 googleads.g.doubleclick.net:200×1 www.youtube.com:204×1 jnn-pa.googleapis.com:200×1 |
| Most loved product carousel | D | done | dom-count | PASS | 2 × main .popular .popular-slide (min 2) | www.youtube.com:200×6 fonts.gstatic.com:200×1 static.doubleclick.net:200×1 www.google.com:200×1 googleads.g.doubleclick.net:302×1 i.ytimg.com:200×1 googleads.g.doubleclick.net:200×1 www.youtube.com:204×1 jnn-pa.googleapis.com:200×1 |
| Our vision cards | D | done | dom-count | PASS | 3 × main .vision .vision-card-title (min 3) | www.youtube.com:200×6 fonts.gstatic.com:200×1 static.doubleclick.net:200×1 www.google.com:200×1 googleads.g.doubleclick.net:302×1 i.ytimg.com:200×1 googleads.g.doubleclick.net:200×1 www.youtube.com:204×1 jnn-pa.googleapis.com:200×1 |
| Our Community teaser carousel | CR | done | dom-count | PASS | 3 × main .community .community-card (min 3) | www.youtube.com:200×6 fonts.gstatic.com:200×1 static.doubleclick.net:200×1 www.google.com:200×1 googleads.g.doubleclick.net:302×1 i.ytimg.com:200×1 googleads.g.doubleclick.net:200×1 www.youtube.com:204×1 jnn-pa.googleapis.com:200×1 |
| YouTube players | V | done | video-plays | PASS | iframe/video: true · no <video> · playback requests 9 (ok) | www.youtube.com:200×7 fonts.gstatic.com:200×1 static.doubleclick.net:200×1 www.google.com:200×1 googleads.g.doubleclick.net:302×1 i.ytimg.com:200×1 googleads.g.doubleclick.net:200×1 www.youtube.com:204×1 jnn-pa.googleapis.com:200×1 |
| header mega menu + pinned header | R | done | no-page-errors | PASS | none on 1 page(s) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (3 gated · 1 cross-site host(s) blocked) |  |

## Features without checks

- header search overlay (S) — interim · owner: the source typeahead endpoint is host-bound (CORS); the build suggests from the nav until the search corpus migrates
- footer newsletter sign-up (F) — scaffolded-awaiting-owner · owner: which backend receives sign-ups (CRM / email service / sheet)
- Scene7 renditions rehosted (T) — done
- Launch / Analytics / GTM / pixels (T) — scaffolded-awaiting-owner · owner: enable consent.cmp and each route per stardust/martech-handoff.md
- AEM hydration (settled DOM) (CR) — done
- CQ global (A) — decided-out
