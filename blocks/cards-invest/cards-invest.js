import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  // Build card grid
  const grid = document.createElement('div');
  grid.className = 'cards-invest-grid';

  rows.forEach((row) => {
    const item = document.createElement('div');
    item.className = 'cards-invest-item';

    const cells = [...row.children];
    cells.forEach((cell) => {
      if (cell.querySelector('picture')) {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'cards-invest-circle';
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
        caption.className = 'cards-invest-caption';
        caption.append(...cell.childNodes);
        item.append(caption);
      }
    });

    grid.append(item);
  });

  block.append(grid);
}
