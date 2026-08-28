/**
 * hero-quote block — Nationwide-style combined hero with quote banner.
 *
 * Authored structure (two rows):
 *   Row 1: picture + emphasized caption (goes into the visual banner on the right)
 *   Row 2: h1 + h2 + insurance-type list + zip code + CTA link + secondary links
 *
 * Autoblocking can hoist a leading <h1>+<picture> pair into a separate sibling
 * `.hero` section. If we detect that, we pull that content back into this
 * block so the final layout matches the source design.
 *
 * Decorated output:
 *   <div class="hero-quote block">
 *     <div class="hero-quote-content">  (left column — headings, form, links)
 *     <div class="hero-quote-media">    (right column — image + caption)
 *   </div>
 */
export default function decorate(block) {
  const section = block.closest('.section');

  // Try to absorb an autoblocked sibling hero (<h1>+<picture>) that sits
  // immediately before this section so the heading joins our content.
  let donorH1 = null;
  let donorPicture = null;
  if (section) {
    const prev = section.previousElementSibling;
    const donor = prev && prev.querySelector('.hero.block');
    if (donor) {
      donorH1 = donor.querySelector('h1');
      donorPicture = donor.querySelector('picture');
      if (prev && prev.classList.contains('section')) {
        prev.remove();
      }
    }
  }

  // Gather rows from authored structure.
  const rows = [...block.children];
  const row1 = rows[0];
  const row2 = rows[1];

  // Row 1: media cell (picture + caption)
  const mediaCell = row1 ? row1.firstElementChild : null;
  let picture = mediaCell ? mediaCell.querySelector('picture') : null;
  let captionText = '';
  if (mediaCell) {
    // caption is the last <p><em>...</em></p>
    const em = mediaCell.querySelector('em');
    if (em) captionText = em.textContent.trim();
  }
  if (!picture && donorPicture) picture = donorPicture;

  // Row 2: content cell
  const contentCell = row2 ? row2.firstElementChild : null;

  // Build the two-column layout.
  const mediaCol = document.createElement('div');
  mediaCol.className = 'hero-quote-media';
  if (picture) {
    const figure = document.createElement('div');
    figure.className = 'hero-quote-media-image';
    figure.appendChild(picture);
    mediaCol.appendChild(figure);
  }
  if (captionText) {
    const caption = document.createElement('div');
    caption.className = 'hero-quote-media-caption';
    caption.textContent = captionText;
    mediaCol.appendChild(caption);
  }

  const contentCol = document.createElement('div');
  contentCol.className = 'hero-quote-content';

  if (donorH1) contentCol.appendChild(donorH1);
  if (contentCell) {
    // Move children out of the nested cell div, in order.
    [...contentCell.children].forEach((node) => {
      contentCol.appendChild(node);
    });
  }

  // Transform the "Insurance type" label + following <ul> into a styled
  // select-like control group.
  const insLabel = [...contentCol.querySelectorAll('p')].find((p) => {
    const s = p.querySelector('strong');
    return s && /insurance type/i.test(s.textContent);
  });
  if (insLabel) {
    const ul = insLabel.nextElementSibling;
    if (ul && ul.tagName === 'UL') {
      const wrap = document.createElement('div');
      wrap.className = 'hero-quote-select';
      const select = document.createElement('select');
      select.setAttribute('aria-label', 'Insurance type');
      [...ul.children].forEach((li) => {
        const opt = document.createElement('option');
        opt.textContent = li.textContent.trim();
        select.appendChild(opt);
      });
      wrap.appendChild(select);
      ul.replaceWith(wrap);
      insLabel.remove();
    }
  }

  // Transform the "ZIP Code:" paragraph into a labelled input + Start-quote
  // button, joining with the "Start your quote" link that follows.
  const zipPara = [...contentCol.querySelectorAll('p')].find((p) => {
    const s = p.querySelector('strong');
    return s && /zip code/i.test(s.textContent);
  });
  if (zipPara) {
    const startPara = zipPara.nextElementSibling;
    const startLink = startPara && startPara.querySelector('a');
    const row = document.createElement('div');
    row.className = 'hero-quote-zip-row';
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'ZIP Code';
    input.setAttribute('aria-label', 'ZIP Code');
    input.inputMode = 'numeric';
    input.maxLength = 10;
    row.appendChild(input);
    if (startLink) {
      const btn = document.createElement('a');
      btn.className = 'hero-quote-submit';
      btn.href = startLink.getAttribute('href') || '#';
      btn.textContent = startLink.textContent.trim() || 'Start your quote';
      row.appendChild(btn);
      if (startPara && startPara.parentElement) startPara.remove();
    }
    zipPara.replaceWith(row);
  }

  // Mark remaining inline links (Find an agent, Explore financial products)
  // as secondary links so CSS can style them uniformly.
  [...contentCol.querySelectorAll('p > a')].forEach((a) => {
    const p = a.parentElement;
    if (p && p.children.length === 1 && p.firstChild === a) {
      p.classList.add('hero-quote-inline-link');
    }
  });

  // Replace the original rows with our two-column structure.
  block.textContent = '';
  block.appendChild(contentCol);
  block.appendChild(mediaCol);

  // Drop no-image class if we recovered the picture so CSS can show media.
  if (picture) block.classList.remove('no-image');
  else block.classList.add('no-image');
}
