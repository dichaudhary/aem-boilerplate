export default function decorate(block) {
  const items = [...block.children];
  items.forEach((item) => {
    const cols = [...item.children];

    // Detect heading-only row (single cell with h2, no second cell)
    const h2 = item.querySelector('h2');
    if (h2 && cols.length === 1) {
      item.classList.add('cards-service-heading');
      return;
    }

    item.classList.add('cards-service-item');
    if (cols[0]) cols[0].classList.add('cards-service-icon');
    if (cols[1]) cols[1].classList.add('cards-service-content');
  });
}
