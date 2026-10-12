# EDS conversion log — aashirvaad.com

## Publish decision (2026-10-12)

Decision made by the run owner before the run: **publish**. Every delivered page, the redirects
sheet and the chrome documents (nav, footer and any locale variants) go live on the aem.live
origin (deploy-batch.mjs without --no-publish, or POST admin.hlx.page/live/…).

## C0 foundation (rollout C-deliver, 2026-10-12)

Runtime contract: `stardust/runtime-contract.json` (boilerplate 1.3.0 vintage: `a.button.primary|secondary|accent`
in `p.button-wrapper`, formatted-only buttonization, no `scripts/delayed.js`, CSP nonce + strict-dynamic).

Files (frozen at the end of C0 by `foundation-freeze.mjs`):
- `styles/styles.css` — tokens lifted from canon.css (names kept: `--red --red-dark --red-30 --pink --cream
  --cream-nav --cream-hover --sand --yellow --gold --brown --ink --tag --rule --social --serif --sans --icon-font
  --shell (85.375rem) --gutter (7.0625rem) --header-h --nav-height`, plus `--background-color` alias for stock blocks);
  global border-box reset (the SOURCE does `html{box-sizing:border-box} *{box-sizing:inherit}` — stated in the
  header), `* { margin: 0 }` as on the source, body line-height normal; metric-matched fallbacks
  `poppins-fallback` (Arial: 112.13 / 93.64 / 31.21 / 8.92 %) and `libre-baskerville-fallback` (Times: 127.56 /
  76.04 / 21.17 / 0 %), computed with fontTools against Liberation metrics; button system (authored strong/em
  links + the source `.btn`, `.btn-secondary`, `.btn-dark`, `.btn-text`); carousel chrome; section scaffold
  (sections carry no margin/padding, blocks own their 1366px module caps; default content capped at --shell
  with the 113px / 16px gutter); section styles `cream`, `sand`, `split-down`, `split-up`; EW edit-mode repaint.
  Single breakpoint: the source's max-width:1023px (written `(width <= 1023px)` / `(width >= 1024px)`).
- `styles/fonts.css` + `fonts/` — Poppins 400/500/600/700, Libre Baskerville (one variable file for 400 + 700,
  as Google serves it), icomoon.ttf (source icon font, rehosted; `font-display: block`). Roboto removed. OFL
  faces; icomoon is the site's own asset.
- `favicon.ico` — the source favicon (stardust/current/assets/favicon.ico); head.html unchanged.
- `scripts/carousel.js` — shared ES module `createCarousel(root, { onVisible })`, the prototype's carousel
  (data-start / data-scroll / data-autoplay / data-adaptive / data-mobile-only / data-arrows-desktop).
- `scripts/martech.js` + hooks in `scripts/scripts.js` (loadEager → loadConsent, loadDelayed → loadTags) —
  `martech-scaffold.mjs`: no CMP, 0 routes enabled (contract all disabled).
- `blocks/header/` — template-slotted: /nav section 1 logo, section 2 nested `<ul>`, section 3 `<p>Search</p>`
  + policy `<ul>` + social `<ul>`. Fixed red header 76px / 68px (checkbox hamburger below 1024px, accordion
  categories, hover + focus-within mega menu at desktop). Search icon opens an overlay whose form GETs the
  source search endpoint (`…/en.customsearchresults.json/_jcr_content/root/search?fulltext=…`, new tab) —
  interim per dynamic-features #6; the endpoint answers JSON and sends no CORS header for other origins, so no
  typeahead is possible from the EDS host (owner decision #1).
- `blocks/footer/` — template-slotted: /footer section 1 three logos, 2 newsletter (inbox logo, h3, placeholder
  paragraph [@ew-exempt], consent paragraph, "Register Now" paragraph inside a role=button div — EW7),
  3 two link columns, 4 ITC Portal + copyright + social `<ul>`. Register is disabled until a valid e-mail and
  the consent box (source behaviour); activating it shows the interim "no backend connected" message in the
  status line — nothing is sent (dynamic-features #7).

Decode tier: chrome = template-slotted (authored nodes moved, classes added; social labels stay as text,
hidden with font-size 0, glyph painted by `::before`).

Chrome documents: `content/nav.html`, `content/footer.html` (generated from the prototype chrome by
`stardust/.work/deploy/probes/chrome-docs.py`; source hrefs absolute to aashirvaad.com — pages not migrated;
`Robots | noindex` metadata row in each). Images via DA media scope `chrome` (aashirvaad-logo.svg 14 KB pure
vector, itc-logo-white.webp, fssai-logo.webp). `content/` added to `.hlxignore`.
Deployed with deploy-batch (publish): /nav and /footer 200 on aem.page and aem.live, 0 about:error, 1 / 4 images,
served `<meta name="robots" content="noindex">`.

Lint: `npm ci` (project root) → `npm run lint:fix` → `npm run lint` clean (ESLint airbnb-base + Stylelint
standard). `stardust/` added to `.eslintignore` — it is pipeline tooling and captured/prototype assets, not EDS
runtime (the first lint:fix pass rewrote stardust/martech/launch.js and stardust/prototypes/js/page.js; both
reverted from git, migrated copy restored). No `extensions.breakpoints.target` in DESIGN.json → no
lint:breakpoints. Token-completeness gate: empty.

Shell sanity (not a gate — the coordinator's foundation gate runs on the archetype): on the preview origin
(/footer page) header box 1440×76 / 360×68 and footer box 1440×457.625 / 360×847.67 — identical to the
prototype; hover menu, search overlay, Escape close, newsletter interim, hamburger + accordion all work, 0
page errors.

## C-archetype home — /index (rollout C-deliver, 2026-10-12)

Schema: `stardust/eds-schema/index.json` (section-schema over the gated prototype on :8791). Content:
`content/index.html` (generated by `stardust/.work/rollout/probes/build-index-content.mjs` from the prototype copy +
the recipe-tab JSON; metadata block first: Title, Description verbatim from the capture, Image = hero banner 1 —
the source has no og:image). Images: 59 rehosted to DA `media/home/` (da-media-upload, one crop per fact: desktop
recipe renditions only; hero + community keep their art-directed desktop AND mobile crops; the identical
Logo/Logo-2 SVG uploaded once, 14.7 KB pure vector). Decorative grounds code-served from the block folders: nudge
(desktop/mobile roti), chakki (desktop/mobile), loved (product-background.svg).

Blocks (decode tier): hero (template-slotted per slide, 4-slide carousel; backgrounds = authored desktop + mobile
pictures as an object-fit cover layer), offerings (reconstructive, card-as-link EW6), video-band (template-slotted;
iframe title + embed link, both @ew-exempt), recipes (reconstructive: head row, text-only tab rows, card rows
picture | tag, h4 link, time, level; text row after the last card = "View All"; one carousel per tab, tabs are
div[role=tab] — EW7), nudge / chakki / follow (template-slotted; chakki's authored CTA link is stretched over the
card, target _blank), loved (reconstructive; product link URL paragraph @ew-exempt), vision (reconstructive;
YouTube link + title + description in one cell, placeholder card as placeholder | copy; grounds cream / yellow /
sand by position; carousel below 1024 only), community (reconstructive; desktop + mobile pictures | h2, p, CTA).
Carousels load scripts/carousel.js through a dynamic import inside decorate (the round-trip harness cannot resolve
module-scope imports) and initialise only once the section is laid out (sections are display:none while blocks
decorate — measuring then gives step 0).

Heading levels mirror the source: hero titles h2 + subs h3, the page's single h1 is "Aashirvaad offerings",
recipe titles h4, other section titles h2. Model decisions: "Buy Now" (hidden on the source, no target) not
authored; recipe tab label "Breakfast and Nutriotious" kept verbatim; loved image alts "popular-products-1" on both
slides as on live (the prototype had -2); `.recipe-card` stays inline as on the source (a block-level card painted a
cream panel the source does not show). davids-model-lint: 0 red, 10 yellow (D1 single-row bespoke widgets nudge /
chakki / follow / video-band — fixed compositions with block-owned grounds; D3 head row + card rows; D4 SVG pure
vector checked). The D1 red for a bare embed-link cell was resolved by authoring the embed with its copy (vision) and
with its iframe title (video-band) — auto-blocking needs scripts.js (frozen).

restoreAtDelivery: Most loved starts on slide 1, autoplays 3000 ms ping-pong with adaptive height (probe: index
0→1, viewport 544→442 px); recipe images held off the DOM until their slide is revealed, fade in on load (3 in DOM
at load, +3 per tab / arrow step); YouTube embeds same-src iframes (3); vision card 3 at 360 shows "Video will load
soon..." (328×201). 0 page errors.

Deploy: deploy-batch (publish) → /index live; `/` 200 on aem.page and aem.live; .plain.html 200, one h1, 0
about:error, 62 img; ai-readability strict 100 / code 100.
Published gate (gate.sh pub2): 1440 0.23% Δh 1px, 0 clipped, no overflow; 360 3.35% Δh 1px, 0 clipped, no
overflow; crop header 0.00% / 0.00%, footer 0.00% / 0.28%. gate-all --only index: 1440 pixel 1.16% Δh 1, 360 4.66%
Δh 1, clip 0 — FAIL (elements) on content MISSING 18 / 10, every one a header/footer link to an out-of-scope page
(absolute to aashirvaad.com by the scope rule) or the footer h3 → foundation-requests line. Residual: the Most
loved slide at capture time depends on instrument timing (autoplay is live behaviour); a capture landing on the
other slide shifts y 3500–4000 (360) or the page height by ~100 px (1440).

## D-site — site assembly (2026-10-12)

Root: the source root `https://aashirvaad.com/` serves the page itself (200, no Location chain), so the
page is delivered as the root `index` document and `/` ends in 200 on aem.page and aem.live. Redirects:
0 rows. The only source page maps to `/` unchanged, so stardust/redirects.tsv is header-only and no
`/redirects.json` sheet is published (an empty sheet would carry nothing, and a `/` row would shadow the
root). Sitemap: the served /sitemap.xml lists 1 url, the same as the assembled set. /nav and /footer are published.

## H-report — rollout summary (2026-10-12)

| | |
|---|---|
| Pages | 1 total · 1 verified · 0 failed · 0 pending (/ = home, live on aem.live) |
| Templates | 1 (home), archetype gated |
| Blocks | 10 converted / 10 (hero, offerings, video-band, recipes, nudge, loved, chakki, vision, community, follow) + header, footer |
| Quality | published-origin gate PASS: 1440 1.16% Δh 1, 360 4.66% Δh 1, clip 0, content MISSING 0. Optimize health 100/100, open 0. martech dynamics-check PASS (all parts off) |
| To deliver | nothing. Owner items: turn on the martech contract parts (stardust/martech-handoff.md), and supply the vision card-3 video id, which the source never loaded |
