# EDS conversion log — aashirvaad.com (replica)

## Publish decision (2026-10-22)

Decision recorded once, made by the run owner up front: **publish**. Every delivered page, the redirects
sheet and the chrome documents (nav, footer) go live on the aem.live origin (`deploy-batch.mjs` without
`--no-publish`, or `POST https://admin.hlx.page/live/…`).

## Martech

Source tags, analytics and consent carried over in `stardust/martech-contract.json` with every part
disabled; `scripts/martech.js` scaffolded. Switching a part on stays with the owner
(`stardust/martech-handoff.md`).

## archetype-home — template `home`, page `index` (2026-10-22)

Schema: `stardust/eds-schema/index.json` (10 prototype sections). Content: `content/index.html`
(DA document, served at `/`). Editorial images: 64 files rehosted to `media/home/` (ledger
`stardust/deploy/media-ledger.json`); decorative `product-background.svg` is a CSS background
committed at `blocks/popular/`.

| Prototype section | EDS unit | Decode tier | Notes |
|---|---|---|---|
| hero (carousel) | `hero` block (boilerplate hero replaced) | reconstructive per slide, template-slotted inside | row = desktop + mobile art / logo, h2, h3, CTA; arrows + dots |
| offerings | `offerings` block + default-content head | reconstructive | head (h1 + lede) reabsorbed (EW8); tile = card-as-link (EW6) |
| video-teaser | `video-teaser` widget (`/widgets/video-teaser.*`) | code-driven widget | embed URL in a widget link query (D1: no video URL in a block table) |
| recipes | `recipes` block + default-content head | reconstructive | tab-label rows → tabs; card rows → per-tab carousel; only in-view cards load images; adaptive viewport; "View All" rendered as the source's navigating button (link role) |
| split--no1 / split--chakki | `split` block, variants `no1` / `chakki` | template-slotted | chakki: band is the link, CTA label as button (EW6) |
| popular | `popular` block + default-content head | reconstructive | autoplay 3000 ms from slide 1, non-looping |
| vision | `vision` block + default-content head | reconstructive | video link per card → iframe (`@ew-exempt`); desktop grid, mobile-only adaptive carousel |
| community | `community` block + default-content head | reconstructive | CTAs open in a new tab like the source |
| follow | `follow` block | template-slotted | the source's `&nbsp;` spacer paragraph modelled as CSS (1lh) |

Removed unused boilerplate blocks `cards`, `columns` (no content or code referenced them).
The carousel helper is duplicated per block (no shared module outside frozen `scripts/`).
Card titles canonicalised h4 → h3 (heading outline); text, hrefs and alt verbatim from the prototype.
Round-trip: `block-roundtrip --ew` 0 structural 🔴, editable 204/207, 0 dead/duplicated, 3 exempt.

## Redirects (D-site, 2026-10-22)

The source root `https://aashirvaad.com/` answers 200 with the home page itself, so the home page is
delivered as the root `index` document and `/` resolves to it (no `/` row). This run delivers exactly one
page and retires no URL, so the redirects sheet has no rows (`stardust/redirects.tsv`, header only) and
no sheet is published; out-of-scope internal links are repointed to the source site instead (E2).
