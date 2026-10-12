import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * header — template-slotted decode of the authored /nav document into the source header.
 *
 * /nav document (default content, three sections):
 *   1. brand  — the logo image (optionally linked; the link's href wins, else "/")
 *   2. nav    — one nested <ul>: top-level items, product categories, products
 *   3. tools  — <p>Search</p> (the search icon label), a <ul> of policy links (mobile menu),
 *               a <ul> of social links (instagram / facebook / twitter / youtube hosts)
 *
 * Built DOM (classes = the prototype's BEM classes in kebab-case):
 *   div.site-header
 *     input.site-header-toggle#nav-toggle (hamburger, below 1024px)
 *     a.site-header-logo > picture
 *     div.site-header-nav > nav.nav#nav
 *       ul.nav-list > li.nav-item.nav-item-l0(.nav-item-has-menu|.nav-item-plain) > a.nav-link
 *         > ul.nav-menu > li.nav-item.nav-item-l1 > a.nav-link > ul.nav-submenu > li…-l2
 *       div.nav-mobile-list > ul.nav-policy + ul.nav-social > li > a.nav-social-link.icon-*
 *     div.site-header-icons > a.site-header-icon > div.icon.icon-search
 *                                                 + div.site-header-icon-text > p
 *     div.site-search#site-search (overlay form → the source site's search, interim)
 *
 * Every authored node is MOVED (EW1); the block only adds wrappers and classes.
 * @ew-exempt none — chrome; generated strings are the search form's own UI (placeholder,
 * button label, aria labels), not authored text.
 */

const MOBILE = window.matchMedia('(max-width: 1023px)');

// interim search target (dynamic-features row 6): the source site's own search endpoint
const SOURCE_SEARCH = 'https://aashirvaad.com/content/itc-foods-brands/aashirvaad/us/en'
  + '.customsearchresults.json/_jcr_content/root/search';
const SOURCE_SEARCH_ROOT = '/content/itc-foods-brands/aashirvaad/us/en';

const SOCIAL = [
  ['instagram', 'icon-instagram'],
  ['facebook', 'icon-facebok'],
  ['twitter', 'icon-twitter'],
  ['x.com', 'icon-twitter'],
  ['youtube', 'icon-youtube'],
];

function el(tag, className, attrs = {}) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  return e;
}

function socialClass(a) {
  const href = a.getAttribute('href') || '';
  const hit = SOCIAL.find(([host]) => href.includes(host));
  return hit ? hit[1] : '';
}

/** the trigger link of a list item: `li > a` (authored) or `li > p > a` (delivered, #98) */
function itemLink(li) {
  const wrapped = li.querySelector(':scope > p > a');
  if (wrapped) {
    const p = wrapped.parentElement;
    p.replaceWith(...p.childNodes);
  }
  return li.querySelector(':scope > a');
}

function decorateNavList(ul, level) {
  [...ul.children].forEach((li) => {
    li.classList.add('nav-item', `nav-item-l${level}`);
    const link = itemLink(li);
    if (link) link.classList.add('nav-link');
    const sub = li.querySelector(':scope > ul');
    if (level === 0) li.classList.add(sub ? 'nav-item-has-menu' : 'nav-item-plain');
    if (!sub) return;
    sub.classList.add(level === 0 ? 'nav-menu' : 'nav-submenu');
    decorateNavList(sub, level + 1);
    // below 1024px the categories open as an accordion (desktop opens on hover / focus)
    link?.addEventListener('click', (e) => {
      if (!MOBILE.matches) return;
      e.preventDefault();
      li.classList.toggle('is-open');
    });
  });
}

function buildSearch(icon) {
  const panel = el('div', 'site-search', { id: 'site-search', role: 'search' });
  panel.hidden = true;
  const form = el('form', 'site-search-form', {
    action: SOURCE_SEARCH, method: 'get', target: '_blank', rel: 'noopener',
  });
  const root = el('input', '', { type: 'hidden', name: 'searchroot', value: SOURCE_SEARCH_ROOT });
  const input = el('input', 'site-search-input', {
    type: 'search', name: 'fulltext', placeholder: 'Search', 'aria-label': 'Search', minlength: '3',
  });
  const submit = el('button', 'btn site-search-submit', { type: 'submit' });
  const label = el('span', 'btn-text');
  label.textContent = 'Search';
  submit.append(label);
  const close = el('button', 'site-search-close', { type: 'button', 'aria-label': 'Close search' });
  close.textContent = '×';
  form.append(root, input, submit, close);
  panel.append(form);

  const toggle = (open) => {
    panel.hidden = !open;
    icon.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
  };
  icon.addEventListener('click', (e) => {
    e.preventDefault();
    toggle(panel.hidden);
  });
  close.addEventListener('click', () => toggle(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      toggle(false);
      icon.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!panel.hidden && !panel.contains(e.target) && !icon.contains(e.target)) toggle(false);
  });
  return panel;
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;

  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const [brandSec, navSec, toolsSec] = sections;

  const header = el('div', 'site-header');

  // hamburger (the source uses a checkbox toggle below 1024px)
  const toggle = el('input', 'site-header-toggle', {
    type: 'checkbox', id: 'nav-toggle', 'aria-label': 'Open navigation', 'aria-controls': 'nav',
  });

  // brand
  const brandLink = brandSec?.querySelector('a[href]');
  const logo = el('a', 'site-header-logo', {
    href: brandLink?.getAttribute('href') || '/', 'aria-label': 'Aashirvaad home',
  });
  const brandPic = brandSec?.querySelector('picture') || brandSec?.querySelector('img');
  if (brandPic) logo.append(brandPic);

  // nav
  const navWrap = el('div', 'site-header-nav');
  const nav = el('nav', 'nav', { id: 'nav', 'aria-label': 'Main' });
  const list = navSec?.querySelector('ul');
  if (list) {
    list.classList.add('nav-list');
    decorateNavList(list, 0);
    nav.append(list);
  }

  // tools: search label, policy links, social links
  const mobileList = el('div', 'nav-mobile-list');
  const icons = el('div', 'site-header-icons');
  const searchIcon = el('a', 'site-header-icon', {
    href: '#site-search', 'aria-controls': 'site-search', 'aria-expanded': 'false',
  });
  const glyph = el('div', 'icon icon-search', { 'aria-hidden': 'true' });
  const iconText = el('div', 'site-header-icon-text');
  searchIcon.append(glyph, iconText);
  icons.append(searchIcon);

  if (toolsSec) {
    const label = [...toolsSec.querySelectorAll('p')].find((p) => !p.querySelector('a, picture'));
    if (label) iconText.append(label);
    toolsSec.querySelectorAll('ul').forEach((ul) => {
      const links = [...ul.querySelectorAll('a')];
      const isSocial = links.length && links.every((a) => socialClass(a));
      if (isSocial) {
        ul.classList.add('nav-social');
        links.forEach((a) => {
          a.classList.add('nav-social-link', socialClass(a));
          a.target = '_blank';
          a.rel = 'noopener';
        });
      } else {
        ul.classList.add('nav-policy');
        links.forEach((a) => {
          a.target = '_blank';
        });
      }
      mobileList.append(ul);
    });
  }
  if (!searchIcon.getAttribute('aria-label') && !iconText.textContent) {
    searchIcon.setAttribute('aria-label', 'Search');
  }
  nav.append(mobileList);
  navWrap.append(nav);

  const search = buildSearch(searchIcon);
  header.append(toggle, logo, navWrap, icons, search);

  // close the mobile menu on Escape and when the layout switches to desktop
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.checked) {
      toggle.checked = false;
      toggle.focus();
    }
  });
  MOBILE.addEventListener('change', () => {
    toggle.checked = false;
    nav.querySelectorAll('.is-open').forEach((li) => li.classList.remove('is-open'));
  });
  toggle.addEventListener('change', () => {
    toggle.setAttribute('aria-label', toggle.checked ? 'Close navigation' : 'Open navigation');
  });

  block.replaceChildren(header);
}
