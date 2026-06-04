export default function decorate(block) {
  const rows = [...block.children];
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  rows.forEach((row) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell, i) => {
      const td = document.createElement('td');
      td.innerHTML = cell.innerHTML.trim();
      if (i === 0) td.classList.add('benefit-feature');
      else td.classList.add('benefit-check');
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  block.textContent = '';
  block.appendChild(table);
}
