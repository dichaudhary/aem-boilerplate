export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-banner-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      const img = col.querySelector('img');
      if (pic || img) {
        const picWrapper = (pic || img).closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture/img is only content in column
          picWrapper.classList.add('columns-banner-img-col');
        }
      }
    });
  });

  // Detect single-CTA vs multi-link pattern
  // If the text cell has only one link total, style it as a CTA button
  const textCells = [...block.querySelectorAll(':scope > div > div')].filter(
    (cell) => !cell.classList.contains('columns-banner-img-col')
      && cell.textContent.trim().length > 0,
  );

  textCells.forEach((cell) => {
    const links = cell.querySelectorAll('a');
    if (links.length === 1) {
      // Single link - mark as CTA style
      cell.classList.add('columns-banner-cta');
    }
  });
}
