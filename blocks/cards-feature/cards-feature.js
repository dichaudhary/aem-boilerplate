export default function decorate(block) {
  const items = [...block.children];
  items.forEach((item) => {
    item.classList.add('cards-feature-item');
    const cols = [...item.children];
    if (cols[0]) cols[0].classList.add('cards-feature-image');
    if (cols[1]) cols[1].classList.add('cards-feature-content');
  });
}
