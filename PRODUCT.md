---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-09T15:09:29Z
  mode: bounded-single
  synthesizedFrom:
    - stardust/current/pages/index.json
    - stardust/replica/lift/tokens.json
---

# Aashirvaad — product spec (bounded single page: home)

Descriptive only. Every statement below traces to the captured home page (`stardust/current/pages/index.json`); nothing is invented beyond it.

- **Site:** https://aashirvaad.com/ — ITC Foods brand site for Aashirvaad (atta, salt, spices, instant mixes, dairy). Title: "Aashirvaad - Bringing Nutrition & Taste…". Meta description as captured in the page JSON.
- **Scope of this run:** the home page only (slug `index`, type `landing`). The site root of the migrated site resolves to it.
- **Page structure (captured order):** fixed red header (logo, 6 nav items: Our Products, Our Story, Recipe, Blogs, CSR, FAQs; search) · hero carousel, 4 slides ("The Aashirvaad Promise" …) · "Aashirvaad offerings" category tiles (Atta, Organic, Salt, Vermicelli, Dairy) · video band · "Cook delicious recipes with us" (3 tabs, 3 recipe cards) · teaser "What makes us No.1?" · "Most loved" product carousel · teaser CTA "Customize your Atta" (Aashirvaad Meri Chakki) · "Our vision" footprint tiles (Organic, Trust of over 20 years, Make history) · "Our Community" (YouTube embed) + "Explore Happy Tummy" carousel · "Follow us @aashirvaad" · red footer (nav, social, newsletter "in Your Inbox", legal links).
- **Content rule:** strings, hrefs, alt text and metadata are carried verbatim from the capture (migrate content-preservation rules).
- **Dynamic surface:** see `stardust/dynamic-features.md` — data-fed modules ship as the settled DOM; tag stack carried over disabled (`stardust/martech-contract.json`).
