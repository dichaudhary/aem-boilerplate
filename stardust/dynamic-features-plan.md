# Dynamic features — plan (aashirvaad.com home)

| phase | deliverable | authoring contract | verification | owner decision | effort |
|---|---|---|---|---|---|
| carousels | carousel behaviour in blocks (hero, recipes, most loved, community; our vision at 360) | slides authored as block rows | motion-observe live vs build; published gate at 1440/360 | — | S |
| data snapshots | offerings, most loved, our vision, recipe tabs authored as rows | one row per item (image, title, text, link) | content-diff 0 structural red | — | S |
| media | YouTube embeds same-src | embed block with the URL | rendered on preview | — | XS |
| search (interim) | overlay posts to the source search | — | flow check on preview | corpus (decision #1) | XS |
| newsletter (scaffolded) | form UI, no submission backend | — | renders, shows not-connected message | backend (decision #2) | XS |
| tags | scripts/martech.js from the contract, all parts off | stardust/martech-contract.json | dynamics-check martech: `/` requests no route host | enable parts (decision #3) | XS |
