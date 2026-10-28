import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Footer — template-slotted chrome (replica of the source's red footer).
 * The /footer document sections are classified by content, never by index:
 *   logos:     images only                 -> home logo + ITC / FSSAI marks
 *   subscribe: has a heading               -> inbox logo + heading, email field, consent, CTA
 *   links:     lists only                  -> two link columns
 *   bottom:    paragraphs + a list         -> ITC Portal link, copyright, social links
 * Authored nodes are MOVED (EW1); wrappers carry the layout classes (EW2).
 * @ew-exempt the email field placeholder mirrors the authored "Enter your Email ID"
 *   paragraph (an attribute cannot host a node); the paragraph itself stays in the DOM
 *   as the field's visually hidden label, so it remains editable.
 * @param {Element} block The footer block element
 */

function el(tag, attrs = {}) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function mediaOf(node) {
  return node.matches('picture, img') ? node : node.querySelector('picture, img');
}

function sectionRole(children) {
  if (children.some((c) => c.matches('h1, h2, h3, h4, h5, h6'))) return 'subscribe';
  const lists = children.filter((c) => c.matches('ul, ol'));
  if (lists.length && lists.length === children.length) return 'links';
  if (lists.length) return 'bottom';
  if (children.length && children.every((c) => mediaOf(c))) return 'logos';
  return 'bottom';
}

function buildLogos(children, logos) {
  const home = el('a', { class: 'footer-logo', href: '/' });
  const marks = el('div', { class: 'footer-marks' });
  const slots = [el('div', { class: 'footer-itc' }), el('span', { class: 'footer-fssai' })];
  children.forEach((c) => {
    const media = mediaOf(c);
    if (!home.children.length) {
      home.append(media);
    } else {
      const slot = slots.find((s) => !s.children.length) || marks;
      slot.append(media);
    }
  });
  marks.prepend(...slots);
  logos.append(home, marks);
}

function buildSubscribe(children, form) {
  const inbox = el('div', { class: 'footer-inbox' });
  const label = el('label', { class: 'footer-email-label', for: 'footer-email' });
  const email = el('input', {
    class: 'footer-email',
    id: 'footer-email',
    type: 'email',
    name: 'email',
  });
  const consent = el('div', { class: 'footer-consent' });
  const agree = el('input', { type: 'checkbox', id: 'footer-agree', 'aria-label': 'I agree' });
  consent.append(agree);
  const cta = el('div', { class: 'footer-cta' });
  children.forEach((c) => {
    const links = c.querySelectorAll('a');
    if (mediaOf(c)) {
      inbox.prepend(mediaOf(c));
    } else if (c.matches('h1, h2, h3, h4, h5, h6')) {
      inbox.append(c);
    } else if (links.length && c.textContent.trim() === links[0].textContent.trim()) {
      cta.append(c);
    } else if (links.length) {
      consent.append(c);
    } else if (!label.children.length) {
      label.append(c);
      email.setAttribute('placeholder', c.textContent.trim());
    }
  });
  form.append(inbox, label, email, consent, cta);
  form.addEventListener('submit', (e) => e.preventDefault());
}

function buildLinks(children, nav) {
  children.forEach((list, i) => {
    const col = el('div', { class: `footer-col footer-col-${i + 1}` });
    col.append(list);
    nav.append(col);
  });
}

function buildBottom(children, titles, social) {
  children.forEach((c) => {
    if (c.matches('ul, ol')) {
      social.append(c);
    } else if (c.querySelector('a')) {
      const portal = el('div', { class: 'footer-portal' });
      portal.append(c);
      titles.append(portal);
    } else {
      titles.append(c);
    }
  });
}

export default async function decorate(block) {
  if (block.querySelector('.site-footer')) return; // EW9: re-entrant

  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  const footer = el('div', { class: 'site-footer' });
  const main = el('div', { class: 'footer-main' });
  const logos = el('div', { class: 'footer-logos' });
  const form = el('form', { class: 'footer-subscribe', action: '#' });
  const nav = el('nav', { class: 'footer-nav', 'aria-label': 'Footer' });
  const bottom = el('div', { class: 'footer-bottom' });
  const inner = el('div', { class: 'footer-bottom-inner' });
  const titles = el('div', { class: 'footer-titles' });
  const social = el('div', { class: 'footer-social' });
  inner.append(titles, social);
  bottom.append(inner);
  main.append(logos, form, nav);
  footer.append(main, bottom);

  if (fragment) {
    fragment.querySelectorAll('.section').forEach((section) => {
      const children = [];
      section.querySelectorAll('.default-content-wrapper').forEach((w) => {
        children.push(...w.children);
      });
      const role = sectionRole(children);
      if (role === 'logos') buildLogos(children, logos);
      else if (role === 'subscribe') buildSubscribe(children, form);
      else if (role === 'links') buildLinks(children, nav);
      else buildBottom(children, titles, social);
    });
  }

  block.textContent = '';
  block.append(footer);
}
