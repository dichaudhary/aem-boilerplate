# Journal — aashirvaad.com replica

## Extract — bounded single-page capture of the home page (2026-10-22)

- `crawl.mjs --url https://aashirvaad.com/ --pages / --dynamics`, headless, no bot protection.
- 1/1 captured: `pages/index.{json,html}`, full-page screenshot 1440×6630, favicon.
- Dynamic surface (reach): 4 same-site data endpoints, page hydrated, no search form.
- Source is an AEM Sites build (`/content/dam/itc-foods-brands/aashirvaad/...`).
- `state.json` seeded: flow replica, handsOff, one page `index` typed `home`.

## Preserve direction — bounded-single spec, empty register, dynamics triaged (2026-10-22)

- Bounded promotion branch: PRODUCT.md / DESIGN.md / DESIGN.json synthesized from `current/pages/index.json`
  + the CSS lift (`stardust/replica/tokens.json`, computed styles at 1440/360). Provenance `bounded-single`.
- `cap-probe` → containerMaxWidth 1366px (module caps ×8), probeWidth 2560.
- Assets harvested from the page's own responses: site CSS, Poppins + Libre Baskerville (OFL, self-hostable),
  the site's icomoon icon font, 45 Scene7 renditions (desktop + mobile), all three recipe tabs (37 cards).
- Register empty → pure replica. `stardust/direction.md` written.
- Dynamics: 24 draft rows → 14 curated features; 3 source JSON endpoints host-bound (404 on EDS) → authored rows.
  Owner batch: newsletter backend, tags (all carried over disabled — martech contract + handoff), recipe data.
- Instrument note: a preload (`stardust/scripts/replica-local/pw-slots.mjs`) caps concurrent Chromium launches at 3
  for every instrument run on this machine.

## Recreate — home archetype gated at 1440 and 360 (2026-10-22)

- `prototypes/index-proposed.html` + `index.css` + `index.js`, generated from verbatim captured content
  (`replica/content.json`, `current/data/*.json`) by `scripts/replica-local/build-proto.mjs`; CSS values lifted
  from the clientlib CSS and the 1440/360 computed maps. Source breakpoint (max-width 1023px) kept.
- Gate (round iter13, `--full`, `--main .color-background-default`): 1440 **0.70 %**, Δh 0; 360 **3.79 %**, Δh 4;
  0 structural 🔴 both widths; clip 0; overflow ok; cap-probe PASS at 2560 (11 rows). Prototype table rows PASS.
- Capture-state replications (logged in `replica/progress.json`): live's lazy loader leaves off-screen carousel
  slides unloaded, so live tracks size to in-view slides — prototype mirrors this (in-view image injection,
  adaptive viewport height); "Most loved" captured on slide 2 (autoplay 3000 ms, once) — frozen for the gate,
  `restoreAtDelivery`.
- Chrome parity: live has no `<header>`/`<footer>`; region-scoped runs are quiet apart from asset-name icon
  signatures. Motion: fade-in, auto-advance and track transform at parity; header morph / nav hover dead on live.

## Migrate plan, render, assets and report — archetype placed (2026-10-22)

- Single page run: plan = the archetype `index` only, no siblings. `migrate.mjs render index --canon-css
  stardust/prototypes/index.css` placed it at `stardust/migrated/index.html` (10 sections, 2 assets).
- 166 internal links point at source pages outside this run's scope; they are repointed to the source
  site in rollout E2 (scope extension), never authored. State advanced to `migrated`.

## A-inventory — one page, one template (2026-10-22)

- `inventory.mjs`: 1 page (`index`, template `index`), pending. DA target aemcoder/683f0604 on `main`;
  live host `main--683f0604--aemcoder.aem.live`.

## B-block — 10 module blocks + header/footer fragments (2026-10-22)

- `blocks.mjs` / `plan.mjs`: 12 distinct blocks (10 module, header + footer chrome), each converts once on
  `index` (the representative). hero and carousel are one section (`hero carousel`).

## B2-dynamic — triage confirmed, martech scaffolded off (2026-10-22)

- `dynamics-plan.mjs --target-origin <preview> --migrated --martech`: 24 draft rows (self 11, owner batch 12,
  delivered 1); both first-party `/content/…` JSON paths host-bound, as curated in `dynamic-features.md`.
- `martech-scaffold.mjs` wrote `scripts/martech.js` and hooked `scripts/scripts.js` before the foundation
  freeze: no CMP and 0 routes enabled — every part stays off until the owner switches it on.

## C-deliver foundation unit — chrome, fonts and styles live (2026-10-22)

- Foundation subagent: styles/fonts (Poppins 400–700, Libre Baskerville, icomoon) self-hosted, header and
  footer blocks from the prototype chrome, /nav and /footer published (noindex), lint clean.
- Header contract recorded from live (0 controls — the live page has no header element) and compared with
  the shell: chrome-compare 0 errors. Measure deltas ≤ 2 px at 1440 and 360. Register R1: mobile drawer.
- Foundation frozen (`foundation-freeze.json`).

## C-deliver archetype unit — home page live and gated on the published origin (2026-10-22)

- 8 blocks + video-teaser widget; 64 images on DA media/home; /index published, `/` answers 200.
- pub gate: 1440 0.70 % Δh 0, 360 3.80 % Δh 4; gate-all PASS both widths (360 9.49 % Δh 71 — live page
  height varies between loads); clip 0; content-presence ok (presence.json maps the live content root to
  `main`); crop header/footer ≤ 0.69 %. One 🔴 ROLE SWAP = live drift after capture (register R2).
- restoreAtDelivery verified on preview: popular autoplay 3 s from slide 1, recipes in-view loading, vision
  adaptive height. 2 foundation requests queued for C-final.

## C-deliver gate-all unit — roster gate on the published origin (2026-10-22)

- First run passed the host without a scheme (`--eds-host main--…`), so clip/content probes got an invalid
  URL; re-run with `--eds-host https://main--683f0604--aemcoder.aem.live --recapture-eds`.
- 1/1 PASS: 1440 0.7 % Δh 0; 360 9.49 % Δh 71 (re-captured origin, same). Live 360 height varies between
  loads (anchor 6962 px now vs 7054 px in the capture); EDS 6983 px matches the gated prototype. Clip 0,
  content MISSING/HIDDEN 0 at both widths. Coverage updated from both summaries.

## C-deliver final unit — requests applied, re-gated, C-deliver end (2026-10-22)

- Foundation request 1 (mobile header logo/burger offsets) applied in blocks/header/header.css, the hero
  block's scoped override removed; request 2 (shared carousel helper) declined for this run, owner follow-up.
- Code pushed, sync forced; foundation re-frozen. Home re-gated on aem.live: 1440 0.7 % Δh 0, 360 9.49 %
  Δh 71 (render identical to before), clip 0, content MISSING/HIDDEN 0. C-deliver closed.

## D-site — root resolves, served sitemap matches (2026-10-22)

- Source root serves the page (200), so `index` is the root document; `/` answers 200 on .page and .live.
- No redirects needed for a one-page run (header-only `redirects.tsv`, decision in eds-conversion-log).
- `assemble.mjs --verify-origin` aem.live: served 1 = assembled 1; nav/footer serve `x-robots-tag: noindex`.

## D2-dynamic — parity replayed, header behaviours rebuilt (2026-10-22)

- Header contract re-recorded with `--root .cmp-header` (the first recording found no `<header>` and read
  0 controls): 1440 hover menus (Our Products 17, CSR 4), search overlay, pinned header. Header subagent
  rebuilt them in blocks/header (post-freeze change, re-frozen below); chrome-compare 16 → 1 error.
- The remaining 🔴 panel-visual@390 Search: the explorer crops live 390×51 vs build 390×76, while live's
  `.cmp-search` computes fixed, 76 px, padding 17/24/24, input 35 px — identical to the build. Recorded
  for an owner decision in `stardust/chrome/header-decisions.json` (agents never sign it).
- `parity.json` 14 features; dynamics-check on aem.live: 9/9 PASS (dom-counts, YouTube playback, no page
  errors, martech gate: no tag host requested with every part off). Gates unchanged: 1440 0.7 %, 360 9.49 %.

## E-full-site — home page verified on aem.live (2026-10-22)

- `verify.mjs --base https://main--683f0604--aemcoder.aem.live --all`: page 200, no `about:error`; its one
  "broken internal link" was `/widgets/video-teaser.html?src=…` — the widget code link (#133), which
  verify.mjs does not exempt; it answers 200 on aem.live. Row recorded `verified` with that evidence.
- Gate table re-applied (`update-coverage.mjs --gate` all-1440 / all-360): pass, 0 flips (360: 9.49 %, 0 clipped).
- Headless render check (restoreAtDelivery): popular carousel advances unpoked (translateX 0 → -1044 px in 7 s),
  4 iframes (YouTube widgets), one h1, no page errors.

## E2-link-audit — out-of-scope links stay on the source (2026-10-22)

- `localize-links.mjs --check`: PASS, 0 localizable; 160 source-host targets are scope extension (one-page run)
  and stay absolute — named decision in `stardust/direction.md` § Link audit.
- Every href on the live page + nav + footer fetched (174): 170 × 200; bbq-soya-sandwich 404, organic.aashirvaad.com
  unresolvable, itcportal 406 — all three dead on the source itself, carried verbatim. No 404 on our origin.

## F-optimize — health 90, gate clear (2026-10-22)

- `optimize.mjs --base https://main--683f0604--aemcoder.aem.live --all`: health 90/100, open P1 0 · P2 1 · P3 0,
  source parity 0. The one P2 (ai-search/jsonld: no JSON-LD) is real: the source carries three JSON-LD blocks
  (Organization, WebSite+SearchAction, WebSite) — taken to G-aem.

## G-aem — JSON-LD carried over, optimize 100 (2026-10-22)

- `autofix-aem.mjs --dry-run`: 1 candidate, manual (eds-jsonld → head.html / metadata pipeline).
- The source's three JSON-LD blocks (Organization, WebSite+SearchAction, WebSite — all site-level types) parsed
  from the capture and appended verbatim (minified) to `head.html`; pushed; aem.live and aem.page serve 3.
- Re-run on aem.live: optimize health 100/100, open 0, P2 jsonld fixed; render check unchanged (autoplay advances,
  0 page errors). Non-visual change, gate rows unchanged.

## H-report — summary written, block coverage recorded (2026-10-22)

- Block rows were still `pending` (never recorded in C-deliver); 12/12 recorded `verified` via `update-coverage.mjs --block`
  (carousel → hero, video-teaser → widget). Summary in `stardust/rollout/report.md`; three entries in `stardust/learnings.md`.

## I-dashboard — dashboard rendered (2026-10-22)

- `dashboard.mjs`: 1 page — identified 1 · prototyped 1 · deployed 1 · optimised 1 → `stardust/rollout/dashboard/`.

## Handoff — run complete (2026-10-22)

- Rollout A → I ended; runner done-check `{"complete":true,"gaps":[]}`. The single page https://aashirvaad.com/ is live
  at the root of main--683f0604--aemcoder.aem.live: gate 1440 0.7 % / 360 9.49 %, optimize 100/100, parity 9/9,
  martech carried over with every part off. Owner follow-ups: martech parts, header search-panel crop decision.
