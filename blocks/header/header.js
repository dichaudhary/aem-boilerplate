import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Header — template-slotted chrome (replica of the source's fixed red bar).
 * The /nav document has three sections, matched by role, never by row index:
 *   brand: the logo image          -> a.header-logo
 *   nav:   the (nested) link list  -> nav.header-nav (hover mega menus from the nested lists)
 *   tools: the "Search" link       -> .header-search (toggles the search overlay)
 * Authored nodes are MOVED into the layout (EW1); the layout wrappers carry the classes (EW2).
 * @param {Element} block The header block element
 */

const MOBILE = window.matchMedia('(width <= 1023px)');
const MAX_SUGGESTIONS = 8;

function el(tag, attrs = {}) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function setOpen(header, open) {
  header.classList.toggle('is-open', open);
  header.querySelector('.header-burger').setAttribute('aria-expanded', String(open));
}

/** collect the authored children of every fragment section, in document order */
function authoredNodes(fragment) {
  const nodes = [];
  fragment.querySelectorAll('.section').forEach((section) => {
    section.querySelectorAll('.default-content-wrapper').forEach((wrapper) => {
      nodes.push(...wrapper.children);
    });
  });
  return nodes;
}

/** the item's own link: `li > a` or `li > p > a` */
function ownLink(li) {
  return li.querySelector(':scope > a, :scope > p > a');
}

/** body scroll lock while a category flyout is shown (the source pins the body) */
function lockScroll(lock) {
  document.body.classList.toggle('header-scroll-lock', lock);
}

function closeMenu(item) {
  if (!item.classList.contains('is-menu-open')) return;
  item.classList.remove('is-menu-open');
  ownLink(item).setAttribute('aria-expanded', 'false');
  lockScroll(false);
}

/**
 * Wrap a nested authored list into a menu panel: li > [a] + div.<cls> > ul.header-menu-list
 * (the list itself is moved, not rebuilt).
 */
function wrapList(list, cls) {
  const panel = el('div', { class: cls });
  list.classList.add('header-menu-list');
  list.before(panel);
  panel.append(list);
  return panel;
}

/** top-level items with a nested list become hover mega menus (keyboard: Enter/Space, Escape) */
function decorateMenus(nav) {
  const top = nav.querySelector(':scope > ul');
  if (!top) return;
  [...top.children].forEach((item, i) => {
    const list = item.querySelector(':scope > ul');
    const trigger = ownLink(item);
    if (!list || !trigger) return;
    const panel = wrapList(list, 'header-menu');
    panel.id = `header-menu-${i + 1}`;
    item.classList.add('has-menu');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', panel.id);

    let flyouts = 0;
    [...list.children].forEach((sub) => {
      const subList = sub.querySelector(':scope > ul');
      if (!subList) return;
      flyouts += 1;
      wrapList(subList, 'header-submenu');
      sub.classList.add('has-submenu');
      sub.addEventListener('mouseenter', () => { if (!MOBILE.matches) lockScroll(true); });
    });
    if (flyouts) list.classList.add('has-flyouts');

    trigger.addEventListener('keydown', (e) => {
      if (MOBILE.matches || (e.key !== 'Enter' && e.key !== ' ')) return;
      e.preventDefault();
      const open = !item.classList.contains('is-menu-open');
      top.querySelectorAll(':scope > .is-menu-open').forEach(closeMenu);
      item.classList.toggle('is-menu-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    });
    item.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !item.classList.contains('is-menu-open')) return;
      closeMenu(item);
      trigger.focus();
    });
    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) closeMenu(item);
    });
    item.addEventListener('mouseleave', () => {
      closeMenu(item);
      lockScroll(false);
    });
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) top.querySelectorAll(':scope > .is-menu-open').forEach(closeMenu);
  });
}

/** suggestions: the authored nav links whose label or path holds every query word */
function suggest(nav, results, query) {
  results.replaceChildren();
  const words = query.toLowerCase().replace(/\*/g, ' ').split(/\s+/).filter(Boolean);
  if (!words.length) return;
  const seen = new Set();
  [...nav.querySelectorAll('a[href]')].some((a) => {
    const hay = `${a.textContent} ${new URL(a.href, window.location).pathname}`.toLowerCase();
    if (seen.has(a.href) || !words.every((w) => hay.includes(w))) return false;
    seen.add(a.href);
    const item = a.cloneNode(true);
    item.removeAttribute('aria-expanded');
    item.removeAttribute('aria-controls');
    item.className = 'header-search-item';
    item.setAttribute('role', 'option');
    item.setAttribute('tabindex', '-1');
    const title = el('span', { class: 'header-search-item-title' });
    title.append(...item.childNodes);
    item.append(title);
    results.append(item);
    return results.children.length >= MAX_SUGGESTIONS;
  });
}

/** the search overlay: input + clear + icon, typeahead from the nav links */
function decorateSearch(header, tools, nav) {
  const trigger = tools.querySelector('a');
  if (!trigger) return;
  const panel = el('div', { class: 'header-search-panel', id: 'header-search-panel' });
  const section = el('div', { class: 'header-search-box' });
  const form = el('form', { class: 'header-search-form', role: 'search', autocomplete: 'off' });
  const field = el('div', { class: 'header-search-field' });
  const icon = el('span', { class: 'header-search-icon', 'aria-hidden': 'true' });
  const input = el('input', {
    class: 'header-search-input',
    type: 'text',
    name: 'fulltext',
    placeholder: 'Start Typing...',
    role: 'combobox',
    'aria-label': 'Search',
    'aria-autocomplete': 'list',
    'aria-expanded': 'false',
    'aria-controls': 'header-search-results',
  });
  const clear = el('button', { class: 'header-search-clear', type: 'button', 'aria-label': 'Clear' });
  clear.append(el('span', { class: 'header-search-clear-icon', 'aria-hidden': 'true' }));
  const results = el('div', {
    class: 'header-search-results',
    id: 'header-search-results',
    role: 'listbox',
  });
  field.append(icon, input, clear);
  form.append(field);
  section.append(form, results);
  panel.append(section);
  header.append(panel);

  trigger.setAttribute('role', 'button');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', panel.id);

  const showResults = () => {
    const has = results.children.length > 0;
    results.classList.toggle('is-visible', has);
    input.setAttribute('aria-expanded', String(has));
  };
  const toggle = (open) => {
    header.classList.toggle('search-open', open);
    trigger.setAttribute('aria-expanded', String(open));
    if (!open) {
      input.value = '';
      results.replaceChildren();
      showResults();
    }
  };

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    toggle(!header.classList.contains('search-open'));
  });
  trigger.addEventListener('keydown', (e) => {
    if (e.key !== ' ') return;
    e.preventDefault();
    toggle(!header.classList.contains('search-open'));
  });
  clear.addEventListener('click', () => {
    toggle(false);
    trigger.focus();
  });
  input.addEventListener('input', () => {
    suggest(nav, results, input.value);
    showResults();
  });
  // the source's search does not navigate on Enter; arrows walk the suggestions
  form.addEventListener('submit', (e) => e.preventDefault());
  panel.addEventListener('keydown', (e) => {
    const items = [...results.children];
    const at = items.indexOf(document.activeElement);
    if (e.key === 'Escape') {
      toggle(false);
      trigger.focus();
    } else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && items.length) {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      const next = at + step;
      if (next < 0) input.focus();
      else items[Math.min(next, items.length - 1)].focus();
    }
  });
}

export default async function decorate(block) {
  if (block.querySelector('.site-header')) return; // EW9: re-entrant

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const header = el('div', { class: 'site-header' });
  const bar = el('div', { class: 'header-bar' });
  const burger = el('button', {
    class: 'header-burger',
    type: 'button',
    'aria-label': 'Menu',
    'aria-expanded': 'false',
    'aria-controls': 'nav',
  });
  const logo = el('a', { class: 'header-logo', href: '/' });
  const nav = el('nav', { class: 'header-nav', id: 'nav', 'aria-label': 'Main' });
  const search = el('div', { class: 'header-search' });
  bar.append(burger, logo, nav, search);
  header.append(bar);

  if (fragment) {
    authoredNodes(fragment).forEach((node) => {
      const media = node.matches('picture, img') ? node : node.querySelector('picture, img');
      if (media && !logo.children.length) {
        logo.append(media);
      } else if (node.matches('ul, ol')) {
        nav.append(node);
      } else if (node.querySelector('a')) {
        search.append(node);
      }
    });
  }

  decorateMenus(nav);
  decorateSearch(header, search, nav);

  burger.addEventListener('click', () => {
    setOpen(header, !header.classList.contains('is-open'));
  });
  header.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && header.classList.contains('is-open')) {
      setOpen(header, false);
      burger.focus();
    }
  });
  MOBILE.addEventListener('change', () => {
    setOpen(header, false);
    lockScroll(false);
  });

  block.textContent = '';
  block.append(header);
}
