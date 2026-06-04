export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  rows.forEach((row, i) => {
    const tr = document.createElement('tr');
    const cols = [...row.children];
    cols.forEach((col) => {
      const cell = document.createElement(i === 0 ? 'th' : 'td');
      cell.innerHTML = col.innerHTML;
      tr.appendChild(cell);
    });
    if (i === 0) {
      thead.appendChild(tr);
    } else {
      tbody.appendChild(tr);
    }
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  block.textContent = '';
  block.appendChild(table);
}
