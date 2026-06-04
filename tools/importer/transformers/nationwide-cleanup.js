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
      '.owl-nav',
      '.owl-dots',
      '.owl-prev',
      '.owl-next',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove site chrome (non-authorable shell elements).
    WebImporter.DOMUtils.remove(element, [
      'bolt-header',
      '#header',
      'header',
      'footer',
      '.nw-footer',
      '.nw-header__skip',
      '#isPandP',
      '#isNvit',
      'script',
      'style',
      'noscript',
      'link',
      'meta',
      'iframe.ta-display-none',
      // Sub-navigation overlays (product page dropdowns)
      '.nw-subnav',
      '.nw-sub-nav',
      '.nw-banner2__subnav',
    ]);

    // Remove junk text: loading indicators, close buttons, NFW disclaimer codes
    // Note: some junk only becomes <p> after markdown conversion, so the import
    // script also runs a final cleanup pass after WebImporter rules.
    const junkPs = element.querySelectorAll('p');
    for (let i = junkPs.length - 1; i >= 0; i -= 1) {
      const p = junkPs[i];
      const text = p.textContent.trim();
      if (text === 'Loading...' || text === '×' || /^NFW-[\w.]+/.test(text)) {
        if (p.parentNode) p.parentNode.removeChild(p);
      }
    }

    // Strip tracking / analytics attributes from remaining elements.
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
