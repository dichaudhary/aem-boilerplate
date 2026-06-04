export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length === 2) {
      cols[0].classList.add('cards-benefit-icon');
      cols[1].classList.add('cards-benefit-content');
    }
  });
}
