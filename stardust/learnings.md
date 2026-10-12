# Learnings — aashirvaad.com replica (2026-10-12)

- **content-presence scope on a page without `<main>`.** The source (AEM Sites) has no `<main>`, so content-presence compared the whole source page, including its untagged header and footer, against EDS `<main>`. Result: 18 (1440) and 10 (360) false MISSING chrome links and headings. Fix: `presence.json` per page with `main: "<archetype contentRoot>=main"`, the same root the archetype gate used. Chrome stays covered by crop-compare and chrome-compare.
- **gate-all needs `deployed` rows.** The core state machine ends at `migrated`, so gate-all reads a gate state file (`--state stardust/.work/rollout/state-gate.json`) whose rows carry `status: deployed`, `liveUrl` and `deployedPath`.
- **JSON-LD on EDS needs no code.** A `JSON-LD` row in the page metadata block is rendered natively in the head as `<script type="application/ld+json">`; an array value keeps several source objects in one row. Carry the source's structured data verbatim this way.
- **Single-page run.** cluster-home is an empty unit (no siblings). Redirects: 0 rows, because the source root serves the page itself, so no `/` row.
