---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-22T07:03:59Z
  againstInput: https://aashirvaad.com/
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/replica/tokens.json
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://aashirvaad.com/,
synthesized mechanically (no direct invocation, no creative decisions).

Synthesized (bounded-single): current/pages/index.json + Phase-3 CSS lift → PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-10-22T07:03:59Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Link audit (E2-link-audit, 2026-10-22) — named decision: scope extension, repointed to source

Scope is the single page `https://aashirvaad.com/` (fixed by the run's site plan). Every other
internal target on the page, nav and footer — 160 `aashirvaad.com` URLs (product, recipe, CSR,
about, legal pages) — is outside the declared cap: SCOPE EXTENSION, kept as absolute links to the
source site (`localize-links.mjs --check`: 0 localizable). No captured page is repointed (the
roster has one page, delivered at `/`). Every href GET (live page + /nav + /footer, 174 unique):
170 × 200; three dead targets are the source's own and are carried verbatim, never fixed:
`/header-pages/recipe-listing/bbq-soya-sandwich.html` (404 on the source, from its recipe-tab data),
`https://organic.aashirvaad.com/` (host does not resolve), `https://www.itcportal.com/` (406 to
non-browser clients; external). The only root-relative link, `/widgets/video-teaser.html?…`, is the
widget code path and answers 200.
