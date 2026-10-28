# Dynamic features — plan (aashirvaad.com home)

| phase | rows | deliverable | authoring contract | verification | owner decision | effort |
|---|---|---|---|---|---|---|
| static (replica Phase 3–5) | 1–7, 11, 13, 14 | page delivered with carousels, tabs, players and rehosted media; band data authored as rows | carousel/tab blocks read authored rows; no runtime fetch to the source origin | pixel/content gates + motion parity at 1440/360 | — | in the archetype |
| chrome | 8 | header nav (mega menu, CSR submenu, hamburger drawer) from the nav document | nav document carries the full product tree | chrome-compare / header contract | — | C0 foundation |
| search | 9 | search overlay widget over `/query-index.json` (helix-query.yaml in the code branch) | widget, no authored rows | dynamics-check search-query (1-page corpus — parity note) | — | rollout D2 |
| form | 10 | newsletter UI with interim "no backend connected" submission | block rows carry labels/consent copy verbatim | dynamics-check form presence | backend (batch item 1) | rollout D2 |
| tags | 12 | `scripts/martech.js` scaffolded from the contract, every part disabled | `stardust/martech-contract.json` | dynamics-check `martech` (no route host requested on `/`) | enable per part (batch item 2) | before deploy |
