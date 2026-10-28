---
_provenance:
  writtenBy: stardust:replica
  mode: bounded-single
  writtenAt: 2026-10-22T07:03:59Z
  synthesizedFrom:
    - stardust/current/pages/index.json
    - stardust/replica/tokens.json
---

# Design — captured current state (preserve mode)

Every value below is lifted from the live site's CSS or its computed styles (stardust/replica/tokens.json).

## Palette
Brand red `#da001c` (header, footer, buttons, carousel arrows/dots) · deep red `#8d0e20` (footer bar) ·
cream `#fff6e3` (page canvas, light text) · sand `#e2d7cc` (alternate bands, category circles) ·
butter `#ffe8b4` (vision card) · ink `#343434` · brown `#382312` · tag red `#e11936` · pink `#ec808d` (register button).
Bands alternate cream/sand; transition bands use a hard 50/50 linear-gradient so a card straddles two colours.

## Type
Headings and nav: Libre Baskerville 700. Body, buttons, tabs: Poppins 400/500/600.
Desktop ramp: hero 40/56 · offerings h1 36 · section h2 32/40 · card titles 24 · body 16/26.
Mobile (≤1023px): headings 24 · card titles 18 · body 14.

## Layout
Content cap 1366px with 37px side margins at 1440 and a 113px inner inset (1140px measure);
16px inset on mobile. Sections pad 64px (desktop) / 32–40px (mobile). Header fixed, 76px / 68px.

## Components
Buttons: red pill-rectangle, radius 16, 48px tall, Poppins 600. Tabs: radius 24 outline / filled.
Carousels: 48px round red arrows with icon-font arrow, red ring dots (active filled).
Cards: cream, radius 16, image radius 16, Libre Baskerville titles clamped to two lines.
Teasers: full-bleed image backgrounds with radius 20 and cream text.
