export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // Row 1: background color configuration
  const configRow = rows[0];
  const colorText = configRow.textContent.trim();
  if (colorText.startsWith('#') || colorText.startsWith('rgb')) {
    block.style.backgroundColor = colorText;
  }
  configRow.remove();

  // Row 2 (now row 1 after removal): content row
  const contentRow = block.children[0];
  if (!contentRow) return;
  const contentCell = contentRow.querySelector(':scope > div');
  if (!contentCell) return;

  // Convert icon URL link to an img element
  const firstLink = contentCell.querySelector('p:first-child a');
  if (firstLink) {
    const href = firstLink.getAttribute('href') || '';
    if (href.endsWith('.svg') || href.endsWith('.png') || href.endsWith('.jpg')) {
      const img = document.createElement('img');
      img.src = href;
      img.alt = '';
      img.loading = 'lazy';
      img.classList.add('banner-icon');
      const p = firstLink.closest('p');
      p.replaceWith(img);
    }
  }
}
