# Dynamic features plan — aashirvaad.com (home page only)

## Phase D1 — static snapshot (ships with the recreation)
- Deliverables: offerings tiles, recipe cards, most-loved slides, footprint tiles, settings-free chrome — all authored as content from the settled DOM (`stardust/current/pages/index.html`).
- Authoring contract: verbatim strings and hrefs from the page JSON; carousels keep their slide set and controls (interaction parity, observed via motion-observe).
- Verification: content-diff 0 structural 🔴; content-presence 0 MISSING.
- Owner decision: none. Effort: inside Phase 3.

## Phase D2 — embeds
- Deliverables: YouTube `sbUQyvhgsGg` as an embed block (lazy iframe, same params).
- Verification: iframe src present on the served page.
- Owner decision: none.

## Phase D3 — martech (opt-in, requested by the owner)
- Deliverables: `stardust/martech-contract.json`, `stardust/martech-handoff.md`, `scripts/martech.js` (from `martech-scaffold.mjs`), every route `enabled: false`; CMP none.
- Verification: `dynamics-check.mjs --origin <live host>` `martech` feature — `/` must request no route host while disabled.
- Owner decision: enable routes; rewrite Launch rules that read old selectors.

## Phase D4 — search (interim)
- Deliverables: header search field submits to the source results page as captured.
- Owner decision: results page + index on the new host (site-scope).

> **D2 (2026-10-09T19:05Z):** D1, D2 and D3 verified on the live origin (`stardust/qa/dynamics-report.md`, 10/10 PASS). D4 correction: `search-results.html` does not exist on the source (404); the icon stays as captured, inert, pending the owner's results page + index on the new host.
