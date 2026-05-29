export default function decorate(block) {
  const firstRow = block.querySelector(':scope > div:first-child');
  const hasImage = firstRow && (firstRow.querySelector('picture') || firstRow.querySelector('img'));
  if (!hasImage) {
    block.classList.add('no-image');
  }
}
