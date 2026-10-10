---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-09T15:09:29Z
  againstInput: https://aashirvaad.com/
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/current/DESIGN.json
    - stardust/replica/lift/tokens.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://aashirvaad.com/,
promoted mechanically (no direct invocation, no creative decisions).

Synthesized (bounded-single): current/pages/index.json + Phase-3 CSS lift
→ PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-10-09T15:09:29Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Dynamic surface: stardust/dynamic-features.md (12 rows, every row dispositioned) · martech carried over disabled (stardust/martech-contract.json).

## Link targets outside the single-page scope (E2 decision, 2026-10-09)

- **Scope extension → repoint.** This run migrates `/` only. Every internal target the home page, `/nav` and `/footer` carry outside `/` (137 distinct paths: products, recipes, about, contact, blog, careers, locale pages) is a scope extension by the run's declared scope, not a capture gap, and is repointed to the working source URL `https://aashirvaad.com/<path>.html` — a bounce beats a 404. Applied in the migrated page at Phase 5 (`link-repoint`, `stardust/eds-conversion-log.md`), confirmed by `localize-links.mjs --check` (0 localizable). The full list with the GET status of each target: `stardust/rollout/link-audit.md` — all 137 answer 200 on the source.
- **External targets stay verbatim** (13: ITC, social, YouTube embeds, the organic / happytummy / chakki brand sites). The two Facebook URLs answer a login redirect to a non-logged-in bot — vendor behaviour, same on the source site.
- **No capture gap.** No target lies inside the declared caps (the scope is `/` alone), so nothing is crawled in E2.
- **Owner note:** `https://organic.aashirvaad.com/` (an offerings tile target) does not resolve — the name is a CNAME to a CloudFront distribution with no address record. The link is dead on the source site too; kept verbatim, listed for the owner in `stardust/rollout/link-audit.md`.
