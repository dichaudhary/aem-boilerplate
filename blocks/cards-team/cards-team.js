export default function decorate(block) {
  const items = [...block.children];
  items.forEach((item) => {
    item.classList.add('cards-team-item');
    const cols = [...item.children];
    if (cols[0]) cols[0].classList.add('cards-team-image');
    if (cols[1]) cols[1].classList.add('cards-team-content');
  });
}
