# Learnings

- 2026-10-22 · rollout E · `verify.mjs` flags a `/widgets/<name>.html?…` widget link (#133) as a broken internal link
  because it only knows coverage paths; the link answers 200. Exempt `/widgets/` in its link check.
- 2026-10-22 · rollout F/G · the source's JSON-LD is site-level (Organization, WebSite) — carrying it in `head.html`
  verbatim clears `ai-search/jsonld` statically (optimize reads raw HTML, so a JS-injected block would not).
- 2026-10-22 · rollout B/H · block coverage rows stayed `pending` through C-deliver; record `--block <id> --status`
  at each unit end, not at the report.
