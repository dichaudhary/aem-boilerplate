import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// prototype breakpoint: mobile/tablet tier is max-width 1023px
const isDesktop = window.matchMedia('(min-width: 1024px)');

/**
 * Toggles the mobile menu state (hamburger glyph e930 ↔ e914 via CSS on aria-expanded).
 * The prototype shows no mobile panel — the nav list stays hidden below 1024px — so this
 * only drives the ARIA state and the glyph; no scroll lock is applied.
 * @param {Element} nav The nav container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger');
  // the desktop nav is always expanded, so aria-expanded only applies to the mobile menu
  if (isDesktop.matches) nav.removeAttribute('aria-expanded');
  else nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) {
    button.setAttribute('aria-expanded', expanded || isDesktop.matches ? 'false' : 'true');
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }
}

/**
 * Closes the mobile menu on Escape
 * @param {KeyboardEvent} e keydown event
 */
function closeOnEscape(e) {
  if (e.code === 'Escape' && !isDesktop.matches) {
    const nav = document.getElementById('nav');
    if (nav && nav.getAttribute('aria-expanded') === 'true') {
      toggleMenu(nav, false);
      nav.querySelector('.nav-hamburger')?.focus();
    }
  }
}

/**
 * Closes the mobile menu when focus leaves the nav
 * @param {FocusEvent} e focusout event
 */
function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget) && !isDesktop.matches) {
    toggleMenu(nav, false);
  }
}

/**
 * The pipeline wraps a list item's trigger link in a <p> on live (`<li><p><a></p><ul>`);
 * the authored/harness shape is `<li><a>…<ul>`. Normalize to the authored shape so the
 * lifted CSS matches both — the <p> is pipeline-generated, the list is the editable unit.
 * @param {Element} list The top-level authored <ul>
 */
function unwrapListParagraphs(list) {
  list.querySelectorAll('li > p').forEach((p) => {
    if (p.children.length === 1 && p.firstElementChild.tagName === 'A'
      && p.textContent.trim() === p.firstElementChild.textContent.trim()) {
      p.replaceWith(...p.childNodes);
    }
  });
}

/**
 * Moves every authored child of a fragment section's wrappers into a slot (EW1: move, never
 * rebuild). The section's own (now empty) wrappers are left behind in the fragment.
 * @param {Element} section A `.section` of the loaded fragment
 * @param {Element} slot The template slot receiving the authored nodes
 */
function slot(section, slotEl) {
  if (!section) return;
  section.querySelectorAll(':scope > div').forEach((wrapper) => {
    while (wrapper.firstChild) slotEl.append(wrapper.firstChild);
  });
}

/**
 * loads and decorates the header — template-slotted replica of the prototype's `.cmp-header`
 * (section 1 = brand logo link, section 2 = nav list, section 3 = tools / search)
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;

  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => s.textContent.trim() || s.querySelector('picture, img'));
  const brandSection = sections.find((s) => s.querySelector('picture, img'));
  const listSection = sections.find((s) => s.querySelector(':scope > div > ul'));
  const toolsSection = sections.find((s) => s !== brandSection && s !== listSection);

  // template: the prototype's fixed flex row (hamburger, logo, nav links, icons)
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.className = 'nav-bar';
  nav.setAttribute('aria-label', 'Main');

  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-controls', 'nav');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.addEventListener('click', () => toggleMenu(nav));
  nav.append(hamburger);

  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  slot(brandSection, brand);
  nav.append(brand);

  const links = document.createElement('div');
  links.className = 'nav-sections';
  slot(listSection, links);
  links.querySelectorAll(':scope > ul').forEach((list) => unwrapListParagraphs(list));
  nav.append(links);

  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  const search = document.createElement('div');
  search.className = 'nav-search';
  slot(toolsSection, search);
  tools.append(search);
  nav.append(tools);

  // mobile state machinery (ARIA + glyph); re-entrant: listeners are bound to this nav only
  toggleMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));
  window.addEventListener('keydown', closeOnEscape);
  nav.addEventListener('focusout', closeOnFocusLost);

  block.replaceChildren(nav);
}
