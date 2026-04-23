export default function decorate(block) {
  const firstRow = block.querySelector(':scope > div:first-child');
  const pic = firstRow && (firstRow.querySelector('picture') || firstRow.querySelector('img'));
  if (!pic) {
    block.classList.add('no-image');
  }
}
