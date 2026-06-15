/**
 * loads and decorates the columns-checklist block
 *
 * Expected authored structure:
 *   row 1: single cell with the section heading (h2)
 *   row 2+: cells each containing a <ul> of checklist statements
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row, index) => {
    const cells = [...row.children];
    // The heading row contains a single cell with a heading element.
    const isHeadingRow = index === 0
      && cells.length === 1
      && cells[0].querySelector('h1, h2, h3, h4, h5, h6');

    if (isHeadingRow) {
      row.classList.add('columns-checklist-heading');
    } else {
      row.classList.add('columns-checklist-columns');
      block.classList.add(`columns-checklist-${cells.length}-cols`);
    }
  });

  // Render a white checkmark before each checklist statement.
  block.querySelectorAll('.columns-checklist-columns li').forEach((li) => {
    if (li.querySelector('.checkmark')) return;
    const mark = document.createElement('span');
    mark.className = 'checkmark';
    mark.setAttribute('aria-hidden', 'true');
    li.prepend(mark);
  });
}
