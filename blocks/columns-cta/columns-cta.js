export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-cta-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      const img = col.querySelector('img');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-cta-img-col');
        }
      } else if (img) {
        // Handle bare img elements (e.g., SVGs not wrapped in picture)
        const imgWrapper = img.closest('div');
        if (imgWrapper && imgWrapper.children.length === 1) {
          imgWrapper.classList.add('columns-cta-img-col');
        }
      }
    });
  });
}
