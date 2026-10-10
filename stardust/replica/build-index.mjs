// Assembles stardust/prototypes/index-proposed.html from a clean hand-authored template plus the
// two fragments harvested verbatim from the capture (header nav tree, 14 recipe cards). One-off
// assembly step; the HTML file is the deliverable. Text/hrefs/alt come from the capture only.
import fs from 'node:fs';
const nav = fs.readFileSync('stardust/replica/nav-fragment.html', 'utf8').trim();
const recipes = JSON.parse(fs.readFileSync('stardust/replica/recipes.json', 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const S7 = 'https://s7ap1.scene7.com/is/image/itcportalprod/';
const S7C = 'https://s7ap1.scene7.com/is/content/itcportalprod/';

const hero = [
  { logo: `${S7C}Logo`, logoAlt: 'Aashirvaad Atta', title: 'The Aashirvaad Promise', sub: ' Hand-picked ingredients, careful processing and untouched packaging ensuring superior quality.', mobile: `${S7}Trust?fmt=webp-alpha`, img: `${S7}Hero-Banner-1_D_revised?fmt=webp-alpha&wid=1366`, alt: 'Hero Banner 1 D Revised', href: 'https://aashirvaad.com/our-products/atta/shudh-chakki-atta.html' },
  { logo: `${S7C}Logo-2`, logoAlt: 'Logo', title: 'Experience Organic', sub: 'Experience our organic range, exceptional food for high-quality living, for you and your family.', mobile: `${S7}nutritions?fmt=webp-alpha`, img: `${S7}hero-ban-2?fmt=webp-alpha&wid=1366`, alt: 'Hero Ban 2', href: 'https://organic.aashirvaad.com/' },
  { logo: `${S7C}Logo-2`, logoAlt: 'Aashirvaad', title: 'Quality on the Go', sub: 'Indulge in our Instant Meals, combining convenience and quality for a swift, delightful dining experience.', mobile: `${S7}quality?fmt=webp-alpha`, img: `${S7}hero-ban-3?fmt=webp-alpha&wid=1366`, alt: 'Hero Ban 3', href: 'https://aashirvaad.com/our-products/instant-meals.html' },
  { logo: `${S7C}Logo`, logoAlt: 'Logo', title: 'Aashirvaad Pink Salt', sub: 'Himalayan Pink Salt, no added colors or impurities. Enhance salads, chaats, and everyday dishes with rich flavour.', mobile: `${S7}monile pink salt?fmt=webp-alpha`, img: `${S7}HOME-pinksalt?fmt=webp-alpha&wid=1366`, alt: 'Home Pinksalt', href: 'https://aashirvaad.com/our-products/salt/himalayan-pink-salt.html' },
];
const heroSlides = hero.map((h, i) => `
        <div class="hero__slide${i === 0 ? ' is-active' : ''}" role="tabpanel" aria-label="Slide ${i + 1} of 4">
          <div class="banner" style="background-image: url(&quot;${esc(h.img)}&quot;); --banner-mobile: url(&quot;${esc(h.mobile)}&quot;);">
            <div class="banner__logo"><img src="${esc(h.logo)}" alt="${esc(h.logoAlt)}"></div>
            <h2 class="banner__title">${h.title}</h2>
            <h3 class="banner__sub-title">${h.sub}</h3>
            <picture class="banner__picture"><source media="(max-width: 600px)" srcset="${esc(h.mobile)}"><img class="banner__image" src="${esc(h.img)}" alt="${esc(h.alt)}"></picture>
            <div class="button button--primary-anchor"><a class="cmp-button" href="${esc(h.href)}"><span class="cmp-button__text">Click to Explore</span></a></div>
          </div>
        </div>`).join('');
const dots = (n, active, prefix) => `<ul class="dots" role="tablist">${Array.from({ length: n }, (_, i) => `<li${i === active ? ' class="is-active"' : ''} role="presentation"><button role="tab" aria-label="${i + 1} of ${n}" type="button">${i + 1}</button></li>`).join('')}</ul>`;

const tiles = JSON.parse(fs.readFileSync('stardust/current/assets/data/productcategory.json','utf8')).categoryProdItems.map(t => t.productImage);
const offerings = [
  ['https://aashirvaad.com/header-pages/our-products/atta/shudh-chakki-atta.html', 'Atta'],
  ['https://aashirvaad.com/header-pages/our-products/organic/organic-atta.html', 'Organic '],
  ['https://aashirvaad.com/header-pages/our-products/salt/iodized-salt.html', 'Salt'],
  ['https://aashirvaad.com/header-pages/our-products/vermicelli/vermicelli.html', 'Vermicelli'],
  ['https://aashirvaad.com/header-pages/our-products/rava/bansi-rava.html', 'Rava'],
].map(([href, name], i) => `
        <div class="categorylist"><a class="categorylist__item" href="${href}"><span class="categorylist__imagewrapper"><img class="categorylist__image" src="${esc(tiles[i])}" alt="${name.trim()}"></span><span class="categorylist__name">${name}</span></a></div>`).join('');

const recipeCards = recipes.map((r, i) => `
            <div class="recipes__slide${i < 3 ? ' is-active' : ''}"><a class="card card--recipe" href="${esc(r.href)}"><div class="card__content"><div class="card__media"><div class="card__options"><div class="card__three-dots icon-open-card-popup"></div></div><div class="card__image"><div class="lazy-image-container">${r.hasImg ? `<img src="${esc(r.img)}" alt="${esc(r.alt)}">` : ''}</div></div></div><div class="card__info"><div class="card__tag"><div class="card__tag-wrapper"><p>${r.tag}</p></div><div class="card__hearts hidden"><div class="card__icon icon-favorite_FILL1_wght400_GRAD0_opsz20"></div><p></p></div></div><div class="card__title"><h4>${r.title}</h4></div><div class="card__recipe-footer"><div class="card__time"><div class="card__icon icon-Group-21690"></div><p>${r.time}</p></div><div class="card__difficulty icon-chef-cap"><div class="card__icon path1"></div><p>${r.level}</p></div></div></div></div></a></div>`).join('');

const popular = [
  { href: 'https://aashirvaad.com/header-pages/our-products/atta/multigrain-atta.html', img: `${S7}dq?fmt=webp-alpha&wid=496&fit=fit,1`, alt: 'popular-products-1', name: 'Atta with Multigrains', details: 'AASHIRVAAD Atta with Multigrains combines the goodness of six grains in one pack: wheat, soya, channa, oat, maize, and psyllium husk.' },
  { href: 'https://aashirvaad.com/header-pages/our-products/atta/sugar-release-control-atta.html', img: `${S7}sugar-release-control-atta?fmt=webp-alpha`, alt: 'popular-products-1', name: 'Sugar Release Control Atta', details: 'AASHIRVAAD Sugar Release Control Atta brings whole wheat flour with pulse and legume flours together to create a unique "Special Grain Mix."' },
].map((p, i) => `
          <div class="popular__slide${i === 1 ? ' is-active' : ''}" role="tabpanel">
            <div class="popular__wrapper">
              <div class="popular__image" style="background-image: url(&quot;https://aashirvaad.com/etc.clientlibs/itc-foods-brands/clientlibs/clientlib-aashirvaad/resources/images/product-background.svg&quot;);"><a href="${p.href}"><div class="lazy-image-container">${p.img ? `<img class="popular__prod-image" src="${esc(p.img)}" alt="${p.alt}">` : ''}</div></a></div>
              <div class="popular__description">
                <div class="popular__name">${p.name}<span class="popular__mobile-weight"></span></div>
                <div class="popular__quantity"></div>
                <div class="popular__details">${p.details}</div>
                <div class="popular__action"><div class="button button--secondary"><button class="cmp-button" type="button"><span class="cmp-button__text">Buy Now</span></button></div></div>
              </div>
            </div>
          </div>`).join('');

const community = [
  { title: ' Explore Happy Tummy', desc: "Understand your tummy's needs better and take the right steps towards better digestive health", href: 'https://www.facebook.com/groups/502294225172201', cta: 'Join the community', bg: `${S7}Slider-1-Desktop?fmt=webp-alpha` },
  { title: ' Take the fibre test!', desc: 'A fibre-rich diet is essential for maintaining normal digestion and keeping hunger pangs at bay. Take your Fibre Meter Test today!', href: 'https://happytummy.aashirvaad.com/', cta: 'Join Our Community', bg: `${S7}Community-Slider2-Desktop?fmt=webp-alpha` },
  { title: ' Ask our experts', desc: 'Got questions related to your digestive health? Our experts are happy to answer!', href: 'https://happytummy.aashirvaad.com/ask-the-expert', cta: 'Join Our Community', bg: `${S7}Slider3-Desktop-modified?fmt=webp-alpha` },
].map((c, i) => `
          <div class="community__slide${i === 0 ? ' is-active' : ''}" role="tabpanel" aria-label="Slide ${i + 1} of 3">
            <div class="teaser teaser--carousel" style="background-image: url(&quot;${esc(c.bg)}&quot;);">
              <div class="teaser__content">
                <h2 class="teaser__title">${c.title}</h2>
                <div class="teaser__description"><p>${c.desc}</p></div>
                <div class="teaser__action"><div class="button button--primary-anchor"><a class="cmp-button" href="${c.href}"><span class="cmp-button__text">${c.cta}</span></a></div></div>
              </div>
            </div>
          </div>`).join('');

const footerLinks = (links) => `<nav class="footer__nav" role="navigation"><ul class="footer__links">${links.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></nav>`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Aashirvaad - Bringing Nutrition &amp; Taste to Your Home</title>
<meta name="description" content="Explore a Wide Range of Aashirvaad Products">
<link rel="stylesheet" href="canon.css">
<link rel="stylesheet" href="index.css">
</head>
<body class="page-index">
<header id="header" class="site-header">
  <div class="cmp-header">
    <input class="cmp-header__hamburger" type="checkbox" aria-label="Menu">
    <div class="cmp-header__logo"><a class="cmp-header__logo-link" href="/"><img class="cmp-header__logo-img" src="${S7C}Logo_2" alt="headerlogo"></a></div>
    <div class="cmp-header__nav-links">
      <nav class="cmp-navigation" role="navigation">
${nav}
      </nav>
    </div>
    <div class="cmp-header__nav-icons">
      <div class="cmp-header__accessibility cmp-header__hide-icon"><a href="#" class="cmp-header__icon-img"><div class="icon-accessibility"></div></a></div>
      <div class="cmp-header__search"><a href="#" class="cmp-header__icon-img"><div class="icon-search"></div><div class="cmp-header__icon-text">Search</div></a></div>
      <div class="cmp-header__login cmp-header__hide-icon"><a href="#" class="cmp-header__icon-img"><div class="icon-profile"></div></a></div>
    </div>
  </div>
</header>

<div id="container-c7d5ec23b7" class="page-content">

  <section class="section section--hero">
    <div class="hero" id="slickcarousel-45c1cf16aa">
      <div class="carousel">
        <button class="arrow arrow--prev is-disabled" aria-label="Previous" type="button">Previous</button>
        <div class="hero__list"><div class="hero__track">${heroSlides}
        </div></div>
        <button class="arrow arrow--next" aria-label="Next" type="button">Next</button>
        ${dots(4, 0)}
      </div>
    </div>
  </section>

  <section id="container-c51b7397f6" class="section section--offerings bg-background-2">
    <div class="offerings">
      <div class="offerings__header">
        <h1 class="offerings__title">Aashirvaad offerings</h1>
        <div class="offerings__subtitle">Select your preferred option from our wide range of product categories.</div>
      </div>
      <div class="offerings__content">${offerings}
      </div>
    </div>
  </section>

  <section id="container-30be6f0082" class="section section--video bg-gradient-3">
    <div class="video-teaser"><div class="video-container"><div class="youtube-video"><iframe id="player1" src="https://www.youtube.com/embed/sbUQyvhgsGg?si=xeqVJZRVM8KDSc5d?rel=0&amp;enablejsapi=1" title="Aashirvaad video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div></div>
  </section>

  <section id="container-0b9c06bfd8" class="section section--recipes bg-background-3">
    <div class="recipes">
      <div class="recipes__header">
        <h2 class="recipes__title">Cook delicious recipes with us</h2>
        <div class="recipes__subtitle">Explore your favourite recipe curated by experts using Aashirvaad products.</div>
      </div>
      <div class="recipes__tabs">
        <div class="tab-group">
          <div class="tab"><button class="cmp-tab is-selected" type="button"><span class="cmp-tab__text">Breakfast and Savoury</span></button></div>
          <div class="tab"><button class="cmp-tab" type="button"><span class="cmp-tab__text">Breakfast and Nutriotious</span></button></div>
          <div class="tab"><button class="cmp-tab" type="button"><span class="cmp-tab__text">Lunch and Dinner</span></button></div>
        </div>
      </div>
      <div class="recipes__content">
        <div class="carousel recipes__carousel">
          <button class="arrow arrow--prev is-disabled" aria-label="Previous" type="button">Previous</button>
          <div class="recipes__list"><div class="recipes__track">${recipeCards}
          </div></div>
          <button class="arrow arrow--next" aria-label="Next" type="button">Next</button>
        </div>
        <div class="recipes__action"><div class="button button--primary"><button type="button" class="cmp-button"><span class="cmp-button__text">View All</span></button></div></div>
      </div>
    </div>
  </section>

  <section id="container-a553eb88e5" class="section section--teaser-no1 bg-gradient-2">
    <div class="teaser teaser--center" id="teaser-f9d12a04df" style="background-image: url(&quot;${S7}nudge-1?fmt=webp-alpha&quot;);">
      <div class="teaser__content">
        <h2 class="teaser__title"> What makes us No.1?</h2>
        <div class="teaser__description"><p>Our superior-quality, contact-less packaging, &amp; the trust of millions of mothers.</p></div>
        <div class="teaser__action"><div class="button button--primary-anchor"><a class="cmp-button" href="https://aashirvaad.com/our-story.html"><span class="cmp-button__text">Know more</span></a></div></div>
      </div>
    </div>
  </section>

  <section id="container-d1022cb273" class="section section--popular bg-background-2">
    <div class="popular" id="popidd">
      <div class="popular__header">
        <h2 class="popular__title">Most loved</h2>
        <div class="popular__subtitle">Discover the best of AASHIRVAAD</div>
      </div>
      <div class="carousel popular__carousel">
        <button class="arrow arrow--prev" aria-label="Previous" type="button">Previous</button>
        <div class="popular__list"><div class="popular__track">${popular}
        </div></div>
        <button class="arrow arrow--next is-disabled" aria-label="Next" type="button">Next</button>
        ${dots(2, 1)}
      </div>
    </div>
  </section>

  <section id="container-11e98b1011" class="section section--teaser-cta bg-gradient-3">
    <div class="teaser teaser--cta" id="teaser-da4b81de79" style="background-image: url(&quot;${S7}Meri_chikki_bg_desktop?fmt=webp-alpha&quot;);">
      <a class="teaser__link" href="https://aashirvaadchakki.com/">
        <div class="teaser__content"><div class="teaser__action"><div class="button button--primary-anchor"><button class="cmp-button" type="button"><span class="cmp-button__text">Customize your Atta</span></button></div></div></div>
      </a>
    </div>
  </section>

  <section id="container-562a22deb1" class="section section--footprint bg-background-2">
    <div class="footprint">
      <div class="footprint__header"><h2 class="footprint__title">Our vision</h2></div>
      <div class="footprint__content">
        <div class="footprint__grid">
          <div class="footprint__item">
            <div class="card card--footprint card--footprint-highlighted bg-background-2">
              <div class="card__content">
                <div class="card__media"><div class="card__image"><div class="video-card"><iframe class="video-card__iframe" id="widget2" src="https://www.youtube.com/embed/iFqqEJH4Mnw?autoplay=0&amp;controls=1&amp;showinfo=0&amp;modestbranding=1&amp;fs=1&amp;cc_load_policy=0&amp;iv_load_policy=3&amp;autohide=0&amp;rel=0&amp;enablejsapi=1" title="Aashirvaad Quality Certificate | Likh Ke Le Lo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div></div>
                <div class="card__info">
                  <div class="card__title">Trust of over 20 years</div>
                  <div class="card__desc">Since 2002, AASHIRVAAD has pledged to bring excellence in taste and nutrition to your kitchens. Over 20 years, AASHIRVAAD has reached 50,00,000+ households across the country.</div>
                </div>
              </div>
            </div>
          </div>
          <div class="footprint__item">
            <div class="card card--footprint bg-primary-6">
              <div class="card__content"><div class="card__info">
                <div class="card__title">Organic : A sustainable way of life</div>
                <div class="card__desc">In an attempt to work towards betterment of the environment and bring you optimum taste and nutrition, AASHIRVAAD introduced its Organic range. Truly authentic Organic Atta and Dals , straight from the farm to your table.</div>
              </div></div>
            </div>
          </div>
          <div class="footprint__item">
            <div class="card card--footprint bg-background-3">
              <div class="card__content"><div class="card__info">
                <div class="card__title">Make Variety with Aashirvaad</div>
                <div class="card__desc">Whether it's the sweetness of Halwa and Laddoos or the savoury goodness of Parathas and Crispy Samosas – you can do it all with Aashirvaad</div>
              </div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="container-8529b59c4b" class="section section--community bg-background-3">
    <div class="community">
      <div class="cta-text">
        <h2>Our Community</h2>
        <p> Join us on the journey towards better taste and nutrition.</p>
      </div>
      <div class="carousel community__carousel" id="slickcarousel-0f817c55a9">
        <button class="arrow arrow--prev is-disabled" aria-label="Previous" type="button">Previous</button>
        <div class="community__list"><div class="community__track">${community}
        </div></div>
        <button class="arrow arrow--next" aria-label="Next" type="button">Next</button>
        ${dots(3, 0)}
      </div>
    </div>
  </section>

  <section id="container-e5a3fd3b2d" class="section section--follow bg-background-2">
    <div class="follow">
      <div class="follow__text">
        <h2>Follow us @aashirvaad</h2>
        <p>Come, be a part of our journey</p>
        <p>&nbsp;</p>
      </div>
      <div class="button button--primary-anchor follow__button"><a class="cmp-button" href="https://www.instagram.com/aashirvaad/"><span class="cmp-button__text">Visit Now</span></a></div>
    </div>
  </section>

</div>

<footer id="footer" class="site-footer">
  <div class="footer cmp-footer">
    <div class="footer__top">
      <div class="footer__logos">
        <div class="footer__logo"><a href="/"><img src="${S7C}Logo_2" alt="footerlogo"></a></div>
        <div class="footer__logos-bottom">
          <div class="footer__itc-logo"><img src="${S7}itc-logo-white?fmt=webp-alpha" alt="itc-logo"></div>
          <div class="footer__fssai-logo"><img src="${S7}aashirvaad-fssai-logo?fmt=webp-alpha" alt="fssai logo"></div>
        </div>
      </div>
      <div class="footer__subscribe">
        <div class="footer__nav-text"><img src="${S7C}Logo_2" alt="aashirvaad-logo"><h3>in Your Inbox</h3></div>
        <div class="footer__email"><label for="footer-email"></label><input id="footer-email" class="footer__email-input" type="email" placeholder="Enter your Email ID"></div>
        <div class="footer__error"></div>
        <div class="footer__consent"><input class="footer__consent-checkbox" id="i_agree" type="checkbox"><div class="footer__consent-link"><p>By clicking “Register Now”, you agree to the&nbsp;<a href="/conditions-policy/privacy-policy.html">Privacy Policy</a>&nbsp;and to receive marketing emails from the Aashirvaad community</p></div></div>
        <div class="button button--primary-anchor-dark"><button class="cmp-button" type="button"><span class="cmp-button__text">Register Now</span></button></div>
      </div>
      <div class="footer__nav-groups">
        <div class="footer__nav-items footer__nav-items--left">${footerLinks([['/terms-of-use.html', ' Terms of use '], ['/privacy-policy.html', ' Privacy Policy '], ['/sitemap.html', ' Sitemap ']])}</div>
        <div class="footer__nav-items footer__nav-items--right">${footerLinks([['/our-products.html', ' Our Products '], ['/contact-us.html', ' Contact Us '], ['/about-us.html', ' About Us ']])}</div>
      </div>
    </div>
    <div class="footer__bottom">
      <div class="footer__container">
        <div class="footer__titles"><a class="desc-1" href="https://www.itcportal.com/">ITC Portal</a><p class="desc-1"> © 2026 Aashirvaad. All Rights Reserved.</p></div>
        <div class="footer__social"><a class="icon-instagram" href="https://www.instagram.com/aashirvaad/" aria-label="Instagram"></a><a class="icon-facebok" href="https://www.facebook.com/Aashirvaad/" aria-label="Facebook"></a><a class="icon-twitter" href="https://twitter.com/AashirvaadAtta" aria-label="Twitter"></a><a class="icon-youtube" href="https://www.youtube.com/user/AashirvaadAtta" aria-label="YouTube"></a></div>
      </div>
    </div>
  </div>
</footer>
<script>
// Interaction parity (observed, not inferred): the live "Most loved" carousel auto-plays
// (data-auto-play-is-enabled="true", data-auto-play-speed-in-ms="3000"); slide transform transition 500 ms.
// Hero and community carousels have auto-play false on live and stay static here.
(function () {
  var root = document.getElementById('popidd'); if (!root) return;
  var track = root.querySelector('.popular__track'), slides = root.querySelectorAll('.popular__slide');
  var dots = root.querySelectorAll('.dots li'), prev = root.querySelector('.arrow--prev'), next = root.querySelector('.arrow--next');
  var i = 1, n = slides.length;
  function go(k) {
    i = (k + n) % n;
    track.style.transition = 'transform 500ms ease';
    track.style.transform = 'translate3d(-' + (i * 100) + '%, 0, 0)';
    slides.forEach(function (s, j) { s.classList.toggle('is-active', j === i); });
    dots.forEach(function (d, j) { d.classList.toggle('is-active', j === i); });
    prev.classList.toggle('is-disabled', i === 0); next.classList.toggle('is-disabled', i === n - 1);
  }
  var timer = setInterval(function () { go(i + 1); }, 3000);
  prev.addEventListener('click', function () { clearInterval(timer); go(i - 1); });
  next.addEventListener('click', function () { clearInterval(timer); go(i + 1); });
  dots.forEach(function (d, j) { d.addEventListener('click', function () { clearInterval(timer); go(j); }); });
})();
</script>
</body>
</html>
`;
fs.writeFileSync('stardust/prototypes/index-proposed.html', html);
console.log('wrote stardust/prototypes/index-proposed.html', html.length, 'chars');
