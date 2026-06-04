import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  // First row is the heading row (h2 + subtitle)
  const headerRow = rows.shift();
  if (headerRow) {
    const header = document.createElement('div');
    header.className = 'cards-lifecycle-header';
    header.append(...headerRow.querySelectorAll('h2, p'));
    block.append(header);
  }

  // Remaining rows are carousel items
  const carousel = document.createElement('div');
  carousel.className = 'cards-lifecycle-carousel';

  rows.forEach((row) => {
    const item = document.createElement('div');
    item.className = 'cards-lifecycle-item';

    const cells = [...row.children];
    cells.forEach((cell) => {
      if (cell.querySelector('picture')) {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'cards-lifecycle-circle';
        const picture = cell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
            imgWrap.append(optimizedPic);
          }
        }
        item.append(imgWrap);
      } else {
        const caption = document.createElement('div');
        caption.className = 'cards-lifecycle-caption';
        caption.append(...cell.childNodes);
        item.append(caption);
      }
    });

    carousel.append(item);
  });

  block.append(carousel);
}
