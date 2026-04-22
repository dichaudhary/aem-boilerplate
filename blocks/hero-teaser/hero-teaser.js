export default function decorate(block) {
  const firstRow = block.querySelector(':scope > div:first-child');
  if (!firstRow || (!firstRow.querySelector('picture') && !firstRow.querySelector('img'))) {
    block.classList.add('no-image');
  }
}
