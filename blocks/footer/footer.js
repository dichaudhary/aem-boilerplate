import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * footer — template-slotted decode of the authored /footer document into the source footer.
 *
 * /footer document (default content, four sections):
 *   1. logos      — three images in order: Aashirvaad logo, ITC logo, FSSAI logo
 *   2. newsletter — the inbox logo image, an <h3> ("in Your Inbox"), a paragraph holding the
 *                   e-mail placeholder text, the consent paragraph (with its policy link) and
 *                   the "Register Now" paragraph (the register control's label)
 *   3. links      — two <ul>s: the left and the right link column
 *   4. bottom     — the ITC Portal link paragraph, the copyright paragraph and a <ul> of
 *                   social links (instagram / facebook / twitter / youtube hosts)
 *
 * Built DOM (classes = the prototype's BEM classes in kebab-case):
 *   div.site-footer > div.site-footer-body
 *     div.site-footer-main > div.site-footer-top
 *       div.site-footer-logos > div.site-footer-logo > a > picture
 *         + div.site-footer-badges > div.site-footer-itc + div.site-footer-fssai
 *       div.site-footer-subscribe > form.site-footer-form
 *         div.site-footer-inbox > picture + h3
 *         div.site-footer-field > label + input.site-footer-input
 *         div.site-footer-error (role=status; the interim message lands here)
 *         div.site-footer-consent > input.site-footer-check + div.site-footer-consent-text > p
 *         div.site-footer-register > div.btn.btn-dark[role=button] > p (label)
 *       div.site-footer-nav > div.site-footer-nav-col(-left|-right) > nav > ul
 *     div.site-footer-bottom > div.site-footer-bar
 *       div.site-footer-titles > p (ITC Portal link) + p (copyright)
 *       ul.site-footer-social > li > a.site-footer-social-link.icon-*
 *
 * Newsletter (dynamic-features row 7, scaffolded-awaiting-owner): the UI is rebuilt and
 * validates like the source (register disabled until a valid e-mail and the consent box);
 * submitting shows an interim "no backend connected" message — no data leaves the page.
 *
 * Every authored node is MOVED (EW1). The register label is a <p> inside a role=button div,
 * never a <button> (EW7).
 * @ew-exempt <p> e-mail placeholder (section 2, the link-free paragraph before the consent
 * text) — text-as-metadata, rendered as the input's placeholder attribute.
 */

const INTERIM_MESSAGE = 'Thank you for your interest. Newsletter sign-up is not connected yet'
  + ' (no backend connected), so your e-mail address was not sent.';
const INVALID_MESSAGE = 'Please enter a valid email ID';

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

const media = (sec) => [...(sec?.querySelectorAll('picture') || [])]
  .concat([...(sec?.querySelectorAll('img') || [])].filter((i) => !i.closest('picture')));

function buildLogos(sec) {
  const logos = el('div', 'site-footer-logos');
  const [main, itc, fssai] = media(sec);
  const logo = el('div', 'site-footer-logo');
  const home = el('a', '', { href: '/', 'aria-label': 'Aashirvaad home' });
  if (main) home.append(main);
  logo.append(home);
  const badges = el('div', 'site-footer-badges');
  const itcBox = el('div', 'site-footer-itc');
  if (itc) itcBox.append(itc);
  const fssaiBox = el('div', 'site-footer-fssai');
  if (fssai) fssaiBox.append(fssai);
  badges.append(itcBox, fssaiBox);
  logos.append(logo, badges);
  return logos;
}

function buildSubscribe(sec) {
  const subscribe = el('div', 'site-footer-subscribe');
  const form = el('form', 'site-footer-form', { novalidate: '' });
  const inbox = el('div', 'site-footer-inbox');
  const [pic] = media(sec);
  if (pic) inbox.append(pic);
  const heading = sec?.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) inbox.append(heading);

  const paras = [...(sec?.querySelectorAll('p') || [])].filter((p) => !p.querySelector('picture, img'));
  const consentP = paras.find((p) => p.querySelector('a'));
  const plain = paras.filter((p) => p !== consentP && p.textContent.trim());
  const placeholderP = plain.length > 1 ? plain[0] : null;
  const registerP = plain[plain.length - 1];

  const field = el('div', 'site-footer-field');
  const label = el('label', 'site-footer-label', { for: 'footer-email' });
  const input = el('input', 'site-footer-input', {
    id: 'footer-email',
    type: 'email',
    name: 'email',
    autocomplete: 'email',
    placeholder: placeholderP ? placeholderP.textContent.trim() : 'Enter your Email ID',
    'aria-label': placeholderP ? placeholderP.textContent.trim() : 'Enter your Email ID',
  });
  placeholderP?.remove();
  field.append(label, input);

  const error = el('div', 'site-footer-error', { role: 'status', 'aria-live': 'polite' });

  const consent = el('div', 'site-footer-consent');
  const check = el('input', 'site-footer-check', {
    type: 'checkbox', id: 'i_agree', name: 'i_agree', value: 'i_agree',
  });
  const consentText = el('div', 'site-footer-consent-text');
  if (consentP) consentText.append(consentP);
  if (consentP) check.setAttribute('aria-label', consentP.textContent.trim().slice(0, 120));
  consent.append(check, consentText);

  const register = el('div', 'site-footer-register');
  const control = el('div', 'btn btn-dark site-footer-submit', {
    role: 'button', tabindex: '0', 'aria-disabled': 'true',
  });
  if (registerP) {
    registerP.classList.add('btn-text');
    control.append(registerP);
  } else {
    control.setAttribute('aria-label', 'Register Now');
  }
  register.append(control);

  form.append(inbox, field, error, consent, register);
  subscribe.append(form);

  const valid = () => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
  const sync = () => control.setAttribute('aria-disabled', String(!(valid() && check.checked)));
  const say = (msg) => {
    error.textContent = msg;
    error.style.display = msg ? 'block' : '';
  };
  input.addEventListener('input', () => {
    sync();
    say('');
  });
  input.addEventListener('blur', () => {
    if (input.value.trim() && !valid()) say(INVALID_MESSAGE);
  });
  check.addEventListener('change', sync);
  const submit = () => {
    if (control.getAttribute('aria-disabled') === 'true') return;
    say(INTERIM_MESSAGE);
  };
  control.addEventListener('click', submit);
  control.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      submit();
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submit();
  });
  return subscribe;
}

function buildNav(sec) {
  const navBox = el('div', 'site-footer-nav');
  const lists = [...(sec?.querySelectorAll('ul') || [])];
  lists.forEach((ul, i) => {
    const side = i === 0 ? 'left' : 'right';
    const col = el('div', `site-footer-nav-col site-footer-nav-col-${side}`);
    const nav = el('nav', '', { 'aria-label': `Footer links ${i + 1}` });
    ul.querySelectorAll('a').forEach((a) => a.classList.add('site-footer-nav-link'));
    nav.append(ul);
    col.append(nav);
    navBox.append(col);
  });
  return navBox;
}

function buildBottom(sec) {
  const bottom = el('div', 'site-footer-bottom');
  const bar = el('div', 'site-footer-bar');
  const titles = el('div', 'site-footer-titles');
  const social = sec?.querySelector('ul');
  [...(sec?.querySelectorAll('p') || [])]
    .filter((p) => !social || !social.contains(p))
    .forEach((p) => {
      p.querySelectorAll('a').forEach((a) => a.classList.add('site-footer-titles-link'));
      titles.append(p);
    });
  bar.append(titles);
  if (social) {
    social.classList.add('site-footer-social');
    social.querySelectorAll('a').forEach((a) => {
      a.classList.add('site-footer-social-link', socialClass(a));
      a.target = '_blank';
      a.rel = 'noopener';
    });
    bar.append(social);
  }
  bottom.append(bar);
  return bottom;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  const [logosSec, newsSec, linksSec, bottomSec] = [...fragment.querySelectorAll(':scope > .section')];

  const footer = el('div', 'site-footer');
  const body = el('div', 'site-footer-body');
  const main = el('div', 'site-footer-main');
  const top = el('div', 'site-footer-top');
  top.append(buildLogos(logosSec), buildSubscribe(newsSec), buildNav(linksSec));
  main.append(top);
  body.append(main, buildBottom(bottomSec));
  footer.append(body);
  block.replaceChildren(footer);
}
