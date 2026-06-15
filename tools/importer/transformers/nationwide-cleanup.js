/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Nationwide site-wide cleanup.
 *
 * Removes non-authorable global chrome (header, footer, skip link, hidden state
 * inputs), third-party widgets (cookie consent, tracking iframes, feedback
 * button), and residual scripts/styles/links so the import contains only
 * page-level authorable content.
 *
 * All selectors verified against migration-work/cleaned.html for the
 * Nationwide homepage. Interactive block-level form controls (native <select>,
 * ZIP <input>, submit buttons inside hero-quote, cards-action, etc.) are
 * intentionally preserved so downstream block parsers can capture their
 * authorable data (options, labels, form actions) as text.
 *
 * Extended for the insurance-product and resource-hub templates. Both share the
 * same Nationwide chrome plus two artifacts that live INSIDE the inpage hero
 * block (#main-content > div.nw-banner2.nw-banner-inpage--clip…):
 *   - <bolt-waiting-indicator id="loadingQuoteIndicator">Loading...</bolt-waiting-indicator>
 *     a JS quote-spinner placeholder (no authorable content)
 *   - breadcrumb trails: <nav><ul class="nw-breadcrumb">…</ul></nav> (mobile +
 *     desktop copies) — non-authorable navigation chrome
 * These are removed in beforeTransform so the hero parser does not capture the
 * "Loading..." text or breadcrumb links into the hero block cells. Selectors
 * verified against migration-work/cleaned.html (insurance-product) and
 * migration-work/resource-hub/cleaned.html — identical structure on both.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove overlays / widgets / tracking that could interfere with block parsing.
    // Verified in cleaned.html:
    //   line 1411  <div id="consent_blackbar"> ... TrustArc cookie banner
    //   line 1416  <iframe id="trustarcNoticeFrame" ...> TrustArc consent
    //   line 2     <iframe id="destination_publishing_iframe_nationwidemutualinsurance_0" ...> Adobe ID sync
    //   line 1409  <div id="ZN_5AvhXVJ4YIRTDLw"> Qualtrics embed
    //   line 1422  <div class="QSIFeedbackButton"> Qualtrics feedback button
    //   lines 1418, 1420  <iframe src="https://*.fls.doubleclick.net/..."> DoubleClick pixels
    WebImporter.DOMUtils.remove(element, [
      '#consent_blackbar',
      '#trustarcNoticeFrame',
      '#destination_publishing_iframe_nationwidemutualinsurance_0',
      '#ZN_5AvhXVJ4YIRTDLw',
      '.QSIFeedbackButton',
      '#QSIFeedbackButton-btn',
      'iframe[src*="doubleclick.net"]',
      'iframe[src*="demdex.net"]',
      'iframe.aamIframeLoaded',
    ]);

    // Remove inpage-hero chrome shared by the insurance-product and
    // resource-hub templates. Removed before block parsing so the hero parser
    // never captures the spinner text or breadcrumb links into hero cells.
    // Verified in cleaned.html (both pages, identical structure):
    //   line 916  <bolt-waiting-indicator id="loadingQuoteIndicator">Loading...
    //   line 920/941  <nav><ul class="nw-breadcrumb"> ... </ul></nav>
    WebImporter.DOMUtils.remove(element, [
      'bolt-waiting-indicator',
      '#loadingQuoteIndicator',
      'ul.nw-breadcrumb',
    ]);

    // The breadcrumb <ul> is wrapped in an otherwise-empty <nav>; drop that
    // wrapper too so no stray empty nav survives into the hero block. Only
    // remove <nav> elements that contained a breadcrumb (now empty) — never a
    // blanket <nav> removal, which could catch authorable in-page topic nav.
    element.querySelectorAll('nav').forEach((nav) => {
      if (nav.children.length === 0 && (nav.textContent || '').trim() === '') {
        nav.remove();
      }
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove site chrome (non-authorable shell elements).
    // Verified in cleaned.html:
    //   line 4     <a class="nw-header__skip" href="#main-content"> Skip link
    //   line 9     <input id="isPandP"> hidden app-state input
    //   line 10    <input id="isNvit"> hidden app-state input
    //   line 12    <bolt-header id="header"> global site header (includes
    //              utility nav, search bar #yxt-SearchBar-input--search-bar-1,
    //              mega-menu panels with bolt-button / bolt-icon)
    //   line 1281  <footer id="p37659" class="nw-footer ..."> global footer
    //              (logo, social, TRUSTe seal, legal copy block)
    WebImporter.DOMUtils.remove(element, [
      'bolt-header',
      '#header',
      'header',
      'footer',
      '.nw-footer',
      '.nw-header__skip',
      '#isPandP',
      '#isNvit',
      // Residual tracking / embeds that may survive past beforeTransform.
      'script',
      'style',
      'noscript',
      'link',
      'meta',
      // Safety: strip any hidden iframes not tied to authorable content.
      'iframe.ta-display-none',
    ]);

    // Strip tracking / analytics attributes from remaining elements so the
    // imported markup stays clean. Leave id/class/href intact – parsers rely
    // on those for selector matching.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('onload');
      el.removeAttribute('onerror');
      el.removeAttribute('data-track');
      el.removeAttribute('data-tracking');
      el.removeAttribute('data-analytics');
      el.removeAttribute('data-at-element-click-tracking');
    });
  }
}
