import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  const grid = document.createElement('div');
  grid.className = 'columns-links-grid';

  rows.forEach((row) => {
    const item = document.createElement('a');
    item.className = 'columns-links-item';

    const cells = [...row.children];
    cells.forEach((cell) => {
      const picture = cell.querySelector('picture');
      if (picture) {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'columns-links-circle';
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
          imgWrap.append(optimizedPic);
        }
        item.append(imgWrap);
      } else {
        const link = cell.querySelector('a');
        if (link) {
          item.href = link.href;
          const label = document.createElement('span');
          label.className = 'columns-links-label';
          label.textContent = link.textContent;
          item.append(label);
        }
      }
    });

    grid.append(item);
  });

  block.append(grid);
}
