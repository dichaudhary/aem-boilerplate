---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-09T15:09:29Z
  mode: bounded-single
  synthesizedFrom:
    - stardust/current/pages/index.json
    - stardust/replica/lift/tokens.json
---

# Aashirvaad — design spec (bounded single page: home)

Values lifted from the live site's own CSS and computed styles at 1440 and 360 (`stardust/replica/lift/tokens.json`, `DESIGN.json`). The target is the captured current state; permitted deltas are only those in `stardust/replica/inconsistency-register.md` (empty — pure replica).

## Palette
Brand red `#da001c` (header, footer, dots, buttons) · cream `#fff6e3` / text-on-red `rgb(255,246,227)` · ink `#343434` · cocoa `#382312` (section titles) · butter `#fff2b7`, wheat `#ffe3a5`, sand `#e2d7cc`, pale yellow `#f4eac0` (section backgrounds, "color-background-*" containers) · dark red `#8d0e20`.

## Type
- Headings and nav: Libre Baskerville 700 (Google Fonts, OFL, self-hosted woff2).
- Body, subtitles, buttons: Poppins 400/500/600 (same source).
- Ramp 1440: banner title 40/56 · section h2 32/40 · h1 (offerings) 36 · teaser title 32/48 · card h4 24 · body 16 · subtitle Poppins 500 16/26 · teaser description 16/28.
- Ramp 360: banner title 24/29 centered · section titles 24/29 · teaser title 24/34 · card h4 18 · body 14–16.
- `html { box-sizing: border-box }`; line-height `normal` where the lift says so (no text-wrap: balance).

## Buttons
`.cmp-button`: flex, height 3rem, padding .8125rem 2rem .75rem, radius 1rem, font 1rem 600, label Poppins 600 cream on red (primary) — exact variant colors lifted per section in Phase 3.

## Container and chrome
- Fixed header 76px (1440: padding 16px 113px, gap 40px) / 68px (360: logo centered 101×35, hamburger); body padding-top equals header height.
- Content cap 1366px centered (module cap; x=37 at 1440); inner column 1140px (x=150); 328px with 16px gutters at 360.
- Section band heights as measured (DESIGN.json `container.sectionBands*`); page height 6630 @1440, 7730 @360.
- Source breakpoints kept: 1023px mobile/tablet switch, 767, 1366, 1920.

## Motion
Slick carousels (hero with dots + arrows, most-loved, Happy Tummy) and recipe tabs — observed in Phase 4 interaction parity, never inferred.
