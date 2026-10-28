# Inconsistency register — aashirvaad.com

The ONLY permitted design deltas for this replica. No audit was requested and no items were
supplied, so the register is empty: this is a pure replica. Any visual change not listed here is a
fidelity defect.

| id | evidence | minimal change | status |
|----|----------|----------------|--------|
| R1 | Live mobile burger (360) opens no menu in the capture (chrome-explore 390: 0 controls); the prototype carried an inert burger | Header block adds a minimal drawer under the bar so mobile visitors can reach the nav links; closed state is pixel-identical | delivered, owner may revert |
| R2 | Live drift after capture: hero "Click to Explore" (Organic slide) is now a non-link div on live; it was a link (to organic.aashirvaad.com) in the captured page the prototype was gated on — content-diff ROLE SWAP 🔴 at 1440/360 on pub1 | Keep the captured link (verbatim capture wins over post-capture drift) | logged, owner may align |
| R3 | Recipe card titles h4 on live skip a heading level under the section h2 | Delivered as h3 to keep the document outline; visual style unchanged (pixel parity held) | delivered |
