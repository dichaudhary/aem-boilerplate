---
_provenance:
  writtenBy: stardust:replica
  mode: bounded-single
  writtenAt: 2026-10-12T03:31:50Z
  synthesizedFrom:
    - stardust/current/pages/index.json
    - stardust/replica/tokens.json
---

# DESIGN — aashirvaad.com home page (captured current state)

Descriptive, not creative: every value below is lifted from the live page's computed styles
(`stardust/replica/tokens.json`, lifted at 1440 and 360) or its captured content.

## Palette
- Brand red `#da001c` — header bar, primary buttons, carousel arrows/dots, footer.
- Deep red `#8d0e20` — footer bottom strip. Muted red `rgba(218,0,28,.3)` — disabled carousel arrows.
- Cream `#fff6e3` — page background and light text on red/photo. Sand `#e2d7cc` — alternate section bands.
- Butter `#ffe8b4` — highlight card. Text `#343434` (body), `#382312` (headings), accent `#e11936` (recipe category labels).

## Type
- Display: Libre Baskerville 700 — hero 40/56, section titles 32 (24/29 at 360), card titles 24/32 (18 at 360), nav 16.
- Body: Poppins — 400 16/26 (14/24 at 360); 600 for buttons and labels; 10px icon labels.
- Icons: the site's own icomoon icon font. Rendering: browser defaults (auto).

## Layout
- Fixed red header, 76px (68px at 360, hamburger + centred logo + search).
- Modules capped at 1366px (37px side gutters at 1440), inner content column 1140px.
- Section bands alternate cream / sand, several with half-and-half gradient bands under overlapping cards.

## Components
- Primary button: red fill, cream text, radius 16px, 13/32/12 padding, 48px tall.
- Slick-style carousels with circular red arrows (48px) and ring dots.
- Rounded cards (16–24px radius).
