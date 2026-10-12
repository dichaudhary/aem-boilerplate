# Replica residuals

## index (home) — prototype gate 2026-10-12

| breakpoint | band | pct | cause | inherits |
|---|---|---|---|---|
| 1440 | y 2500–3500 | 0.6% | sub-pixel anti-aliasing on the nudge / Most-loved photo backgrounds (no geometry delta) | user |
| 360 | y 3000–3500, 4000–4500 | 0.5% | sub-pixel anti-aliasing on the nudge / Meri Chakki background photos (no geometry delta) | user |
| 1440 | full page (iter1–2) | — | iter1 live capture internally inconsistent (Most loved 3 s autoplay ping-pong + lazy re-init: height read at slide 2, chunks painted slide 1, footer truncated at 6528); re-taken at iter3, kept as gates/index-1440/live-iter1-truncated.png | user |

Capture state (restoreAtDelivery):
- Most loved: start slide 1, autoplay 3000 ms, infinite:false ping-pong, adaptiveHeight (prototype shows slide 2, as every live capture does).
- Recipe cards: lazy-load images on reveal (prototype does it from rehosted renditions).
- Our vision card 3 (mobile): live shows "Video will load soon..."; video id unknown — confirm at delivery.
- YouTube iframes: same-src live embeds (no freeze).

Justified (non-structural): header/footer landmark EXTRA (live chrome is not landmarked); 1440 EXTRA mobile-only Our-vision DOM; icon file-name signatures (rehosted hashed names).
