/**
 * loads and decorates the hero block
 * @param {Element} block The hero block element
 */
export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Check for background images in first row (3 responsive variants)
  const firstRow = rows[0];
  const pictures = firstRow.querySelectorAll('picture');

  if (pictures.length >= 1) {
    // Create background container with responsive images
    const bgContainer = document.createElement('div');
    bgContainer.classList.add('hero-bg');

    pictures.forEach((pic, i) => {
      const clone = pic.cloneNode(true);
      if (i === 0) clone.classList.add('hero-bg-mobile');
      else if (i === 1) clone.classList.add('hero-bg-tablet');
      else if (i === 2) clone.classList.add('hero-bg-desktop');
      bgContainer.append(clone);
    });

    block.prepend(bgContainer);
    // Remove the original image row
    firstRow.remove();

    // Create foreground content container
    const fgContainer = document.createElement('div');
    fgContainer.classList.add('hero-fg');

    // Move remaining rows into foreground
    [...block.querySelectorAll(':scope > div:not(.hero-bg)')].forEach((row) => {
      // Flatten single-cell rows
      const cells = [...row.children];
      if (cells.length === 1) {
        fgContainer.append(cells[0]);
      } else if (cells.length > 1) {
        // For the heading row, just take cells with content
        cells.forEach((cell) => {
          if (cell.textContent.trim() || cell.querySelector('picture, img')) {
            fgContainer.append(cell);
          }
        });
      }
      row.remove();
    });

    block.append(fgContainer);

    // Clean up button text — strip pipe-separated alt text (e.g. "Free trial | alt text")
    fgContainer.querySelectorAll('a').forEach((a) => {
      const text = a.textContent.trim();
      if (text.includes('|')) {
        a.textContent = text.split('|')[0].trim();
      }
    });

    // Handle tooltip pattern: em with icon-tooltip span followed by em with hover text
    // Hide the second em that contains the tooltip text (pipe-delimited content)
    fgContainer.querySelectorAll('em').forEach((em) => {
      const text = em.textContent.trim();
      if (text.startsWith('|') && text.includes('|')) {
        em.classList.add('hero-tooltip-text');
      }
    });
  } else {
    block.classList.add('no-image');
  }
}
