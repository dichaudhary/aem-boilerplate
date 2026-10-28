- archetype-home | shared carousel helper (buildCarousel/initCarousel) duplicated in 5 blocks; a scripts/carousel.js module would dedupe it | blocks/{hero,recipes,popular,vision,community}/*.js | home
- archetype-home | mobile header: burger glyph 2px left / 3px high and logo 16px left of live (header crop 4.44% @360, same on the gated prototype) | crop-compare live vs build y0+68 @360: live burger x34 y29, logo text x81; build x32 y26, x65 | home

## Applied at C-final (2026-10-22)
- mobile header offsets: APPLIED — moved from the hero block's scoped override into blocks/header/header.css.
- shared carousel helper: DECLINED for this run — a refactor across 5 gated blocks with no visual delta;
  kept as a follow-up for the owner's developers (re-gate needed after the change).
