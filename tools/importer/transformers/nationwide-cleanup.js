/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Nationwide cleanup.
 * Selectors from captured DOM of https://www.nationwide.com/
 * Removes non-authorable content: header, footer, cookie consent, tracking iframes, etc.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent dialog (TrustArc consent bar)
    // Found in captured HTML: <div id="consent_blackbar"> containing truste-consent-track
    WebImporter.DOMUtils.remove(element, [
      '#consent_blackbar',
      '#truste-consent-track',
      '#trustarcNoticeFrame',
    ]);

    // Remove skip-to-main-content link
    // Found in captured HTML: <a class="nw-header__skip" href="#main-content">
    WebImporter.DOMUtils.remove(element, ['.nw-header__skip']);

    // Remove hidden inputs at top of body
    // Found in captured HTML: <input id="isPandP"> <input id="isNvit">
    WebImporter.DOMUtils.remove(element, ['#isPandP', '#isNvit']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove header (Nationwide bolt-header component)
    // Found in captured HTML: <bolt-header id="header">
    WebImporter.DOMUtils.remove(element, ['bolt-header#header', 'bolt-header']);

    // Remove footer
    // Found in captured HTML: <footer id="p37659" class="nw-footer nw-text-sm">
    WebImporter.DOMUtils.remove(element, ['footer.nw-footer', 'footer#p37659']);

    // Remove tracking iframes (DoubleClick, Demdex, etc.)
    // Found in captured HTML: multiple iframes for tracking pixels
    WebImporter.DOMUtils.remove(element, ['iframe']);

    // Remove Qualtrics survey widget
    // Found in captured HTML: <div id="ZN_5AvhXVJ4YIRTDLw">
    WebImporter.DOMUtils.remove(element, ['[id^="ZN_"]']);

    // Remove Qualtrics feedback button
    // Found in captured HTML: <div class="QSIFeedbackButton">
    WebImporter.DOMUtils.remove(element, ['.QSIFeedbackButton']);

    // Remove noscript and link elements
    WebImporter.DOMUtils.remove(element, ['noscript', 'link']);
  }
}
