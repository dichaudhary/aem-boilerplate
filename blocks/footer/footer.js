import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Creates a template wrapper element.
 * @param {string} className
 * @param {...Element} children
 * @returns {Element}
 */
function el(className, ...children) {
  const div = document.createElement('div');
  div.className = className;
  div.append(...children);
  return div;
}

/**
 * Returns the authored elements of a fragment section in document order (default content only).
 * @param {Element} section
 * @returns {Element[]}
 */
function authored(section) {
  if (!section) return [];
  return [...section.querySelectorAll(':scope > div > *')];
}

/**
 * Moves the authored paragraph that carries an element (its <p>, else the element itself).
 * @param {Element} node
 * @returns {Element}
 */
function carrier(node) {
  return node.closest('p') || node;
}

/**
 * loads and decorates the footer — template-slotted replica of the prototype's `.footer`
 * Sections of /footer: 1 logos (site logo link, ITC logo, FSSAI logo) · 2 newsletter
 * (logo, heading, consent text, register label) · 3 links left · 4 links right ·
 * 5 bottom band (ITC Portal link, copyright, social list).
 * The email input and consent checkbox are form controls the block renders (no backend;
 * the prototype's form posts nowhere either).
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  const sections = [...fragment.querySelectorAll(':scope > .section')]
    .filter((s) => s.textContent.trim() || s.querySelector('picture, img'));
  const [logosSection, subscribeSection, leftSection, rightSection, bottomSection] = sections;

  // 1 — logos
  // the pipeline wraps <img> in <picture>: match both, dedupe by the carrying paragraph
  const logoPics = [...new Set([...(logosSection?.querySelectorAll('picture, img') || [])]
    .map((pic) => carrier(pic.closest('a') || pic)))];
  const logo = el('footer-logo');
  const itc = el('footer-itc-logo');
  const fssai = el('footer-fssai-logo');
  if (logoPics[0]) logo.append(logoPics[0]);
  if (logoPics[1]) itc.append(logoPics[1]);
  if (logoPics[2]) fssai.append(logoPics[2]);
  const logos = el('footer-logos', logo, el('footer-logos-bottom', itc, fssai));
  // anything else authored in the logos section stays visible (leftovers pass)
  authored(logosSection).forEach((node) => logos.append(node));

  // 2 — newsletter
  const subscribe = el('footer-subscribe');
  const navText = el('footer-nav-text');
  const subNodes = authored(subscribeSection);
  const subPic = subscribeSection?.querySelector('picture, img');
  if (subPic) navText.append(carrier(subPic));
  const heading = subNodes.find((n) => /^H[1-6]$/.test(n.tagName));
  if (heading) navText.append(heading);
  subscribe.append(navText);

  const email = el('footer-email');
  const label = document.createElement('label');
  label.htmlFor = 'footer-email';
  label.className = 'footer-email-label';
  label.textContent = 'Email';
  const input = document.createElement('input');
  input.type = 'email';
  input.id = 'footer-email';
  input.name = 'email';
  input.autocomplete = 'email';
  email.append(label, input);
  subscribe.append(email, el('footer-error'));

  const consent = el('footer-consent');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'footer-consent';
  checkbox.name = 'consent';
  checkbox.setAttribute('aria-label', 'I agree');
  const consentLink = el('footer-consent-link');
  const consentText = subNodes.find((n) => n.tagName === 'P' && n.querySelector('a'));
  if (consentText) consentLink.append(consentText);
  consent.append(checkbox, consentLink);
  subscribe.append(consent);

  const register = el('footer-register');
  const registerLabel = subNodes.find((n) => n.tagName === 'P' && !n.querySelector('a, picture, img') && n.textContent.trim());
  if (registerLabel) {
    register.append(registerLabel);
    register.setAttribute('role', 'button');
    register.tabIndex = 0;
    const submit = () => {
      const error = subscribe.querySelector('.footer-error');
      error.textContent = '';
      if (!input.checkValidity() || !input.value) {
        error.textContent = 'Please enter a valid email address.';
        input.focus();
        return;
      }
      if (!checkbox.checked) {
        error.textContent = 'Please accept the Privacy Policy to register.';
        checkbox.focus();
        return;
      }
      error.textContent = 'Thank you for registering.';
      input.value = '';
      checkbox.checked = false;
    };
    register.addEventListener('click', submit);
    register.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        submit();
      }
    });
  }
  subscribe.append(register);
  // leftovers
  authored(subscribeSection).forEach((node) => subscribe.append(node));

  // 3 + 4 — link columns
  const navGroups = el('footer-nav-groups');
  [[leftSection, 'footer-nav-left'], [rightSection, 'footer-nav-right']].forEach(([section, cls]) => {
    const items = el(`footer-nav-items ${cls}`);
    const nav = document.createElement('nav');
    nav.className = 'footer-nav';
    nav.setAttribute('aria-label', cls === 'footer-nav-left' ? 'Legal' : 'Company');
    authored(section).forEach((node) => nav.append(node));
    items.append(nav);
    navGroups.append(items);
  });

  const top = el('footer-top', logos, subscribe, navGroups);

  // 5 — bottom band
  const titles = el('footer-titles');
  const social = el('footer-social');
  authored(bottomSection).forEach((node) => {
    if (node.tagName === 'UL') social.append(node);
    else titles.append(node);
  });
  const bottom = el('footer-bottom', el('footer-container', titles, social));

  block.replaceChildren(el('footer-inner', top, bottom));
}
