# Learnings — aashirvaad.com replica run (2026-10-09)

Per `skills/stardust/reference/learnings.md`: one entry per failure class, evidence a maintainer can re-check, `status: pending` until folded.

### gate-all selects `status: deployed` pages that the state machine has already advanced past
- failure class: ungated-page (the roster gate finds nothing to gate)
- evidence: `gate-all.mjs --width 1440 --skip-existing` at G-aem (2026-10-09T19:25Z) exited 1 with `gate-all: no deployed pages selected` — `stardust/state.json` carries `index` as `migrated` (the lifecycle's terminal state after deploy), while `gate-all.mjs` filters `p.status === 'deployed' && p.liveUrl`; C-final had worked around it with a derived view `stardust/rollout/gate-state.json` (`--state`), recorded in `progress.json.units.gate-all.gates.stateView`
- proposed change: `skills/replica/scripts/gate-all.mjs` (published stage selection) — select on `liveUrl && url` for any status at or past `migrated`, and `skills/replica/reference/source-fidelity-gate.md § The all-pages published-origin gate` — name the selection rule
- status: pending

### qa `ai-readability` check imports the plugin path, not the project copy
- failure class: path-mismatch (shipped check cannot run from the project)
- evidence: `qa.mjs --checks ai-readability` → `ERR_MODULE_NOT_FOUND: /workspace/5ca9e426/stardust/deploy/scripts/ai-readability.mjs imported from stardust/scripts/qa/checks/ai-readability.mjs`; the project copy lives at `stardust/scripts/deploy/ai-readability.mjs` (replica Setup step 4 copies skills into `stardust/scripts/<skill>/`); F-optimize ran the gate directly (strict 100 %)
- proposed change: `skills/qa/scripts/checks/ai-readability.mjs` — resolve the deploy script relative to the check's own location (`../../deploy/ai-readability.mjs`) with the plugin path as fallback
- status: pending

### autofix-aem marks `eds-jsonld` manual although the pipeline renders a `json-ld` metadata row
- failure class: manual-fixer (a fixable finding routed to a hand step)
- evidence: `autofix-aem.mjs --dry-run` at G-aem: `✋ eds-jsonld [index] JSON-LD must be placed via head.html / metadata pipeline`; adding `<div><div>json-ld</div><div>[…]</div></div>` to the page's metadata block and re-PUT/publish produced one `<script type="application/ld+json">` on `https://main--5ca9e426--aemcoder.aem.live/`, and optimize run-2 flipped the finding to `fixed`; the source payload was already captured (`stardust/.work/rollout/probes/source-jsonld.json`, from the rendered-DOM sidecar `current/pages/index.html`)
- proposed change: `skills/rollout/scripts/autofix-aem.mjs` — `eds-jsonld` fixer: when `current/pages/<slug>.html` carries `application/ld+json` blocks, write them (array, HTML-escaped) as a `json-ld` metadata row into `content/<path>.html` and stage the finding `in-progress`; `skills/rollout/SKILL.md § Phase G` — name the metadata-row mechanism
- status: pending

### content-diff with a two-selector `--main` list measured each root as empty on one side
- failure class: false-red (instrument reads a root mismatch as content loss)
- evidence: published-origin gate on `/index` (C-deliver, 2026-10-09): `--main "#container-c7d5ec23b7, main"` produced 251 structural 🔴 because each side matched a different selector of the list and the other measured empty; a single selector with the primary-root fallback (`<main>` on the EDS side) gave content 0 🔴 (recorded in `stardust/eds-conversion-log.md`, "Published gate")
- proposed change: `skills/replica/reference/source-fidelity-gate.md § Hardening — symmetric --main scoping` — forbid selector lists in `--main`; `skills/diff/scripts/content-diff.mjs` — refuse a comma list or resolve it to the first selector that is non-empty on BOTH sides
- status: pending

### migrate render refuses a prototype whose content root is not `<main>`
- failure class: strict-refusal (a gated prototype rejected one phase later)
- evidence: `migrate.mjs render index` → strict 2 "no `<main>`" on `stardust/prototypes/index-proposed.html`; the content root `div#container-c7d5ec23b7.page-content` was retagged `<main>` after the gate (render-neutral, gate selectors unchanged) — `stardust/journal.md` § Migrate render
- proposed change: `skills/replica/reference/recreation-procedure.md § Structure` — author the prototype's content root as `<main>` from the first line (and `breakpoint-lint`/`gate.sh --full` warn when the served prototype has none), so the migrate contract holds without a post-gate edit
- status: pending

### Code-sync verification read a compressed body as a stale file
- failure class: false-negative-verify (served code looked unsynced; the admin fallback answered 401)
- evidence: G-aem (2026-10-09T19:19Z): `curl -s …/blocks/footprint/footprint.js | md5sum` ≠ local and `grep -c lazy` = 0 although `last-modified` equalled the commit time — the edge served a compressed body to a plain `curl`; `curl --compressed` matched the local md5. The brief's fallback `POST https://admin.hlx.page/code/aemcoder/5ca9e426/main/*` with the IMS token answered 401 and was not needed (the GitHub app had synced within a minute)
- proposed change: `skills/replica/reference/handoff-contract.md § 3` (code ships via push) and the foundation/archetype brief templates — verify code sync with `curl -s --compressed <file> | md5sum` against the local file (or compare `last-modified` with the commit time) and drop the admin `POST /code/…/*` fallback, which the migration token is not entitled to
- status: pending

### Transfer budget flags source-carried third-party players as a delivery finding
- failure class: parity-untagged (qa perf has no source-parity route like optimize's)
- evidence: `transfer-over-budget` P3 on `/index` — 3245 KB / JS 1962 KB; after `loading="lazy"` on the three YouTube iframes 2573 / 1415 KB (LCP 180 ms, CLS 0.005), still over the 800 / 250 KB budgets because the weight IS the three players the source page embeds; resolved `accepted` by hand
- proposed change: `skills/qa/scripts/checks/perf.mjs` — when the capture (`current/pages/<slug>.json`) lists the same third-party embeds, tag the finding `source parity:` (optimize.mjs's convention) so it is informational, not a re-deploy item
- status: pending
