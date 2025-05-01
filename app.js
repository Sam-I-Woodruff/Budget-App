function render() {
  catSelect.innerHTML = '';
  catContainer.innerHTML = '';

  data.categories.forEach((cat, idx) => {
    // Update dropdown
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = cat.name;
    catSelect.appendChild(opt);

    // Total spent
    const spent = cat.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const remaining = cat.budget - spent;
    const percent = Math.min((spent / cat.budget) * 100, 100);

    // Create category block
    const div = document.createElement('div');
    div.className = 'category';
    div.innerHTML = `
      <strong>${cat.name}</strong> – Spent: $${spent} / $${cat.budget} (Left: $${remaining})
      <button data-cat="${idx}" class="delete-cat">❌ Delete Category</button>
      <div class="bar-container"><div class="bar" style="width:${percent}%;"></div></div>
      <ul>
        ${cat.expenses.map((e, eIdx) => `
          <li>${e.desc}: $${e.amount} 
            <button data-cat="${idx}" data-exp="${eIdx}" class="delete-exp">🗑</button>
          </li>`).join('')}
      </ul>
    `;
    catContainer.appendChild(div);
  });

  save();

  // Add delete event listeners
  document.querySelectorAll('.delete-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.cat;
      data.categories.splice(idx, 1);
      render();
    });
  });

  document.querySelectorAll('.delete-exp').forEach(btn => {
    btn.addEventListener('click', () => {
      const catIdx = btn.dataset.cat;
      const expIdx = btn.dataset.exp;
      data.categories[catIdx].expenses.splice(expIdx, 1);
      render();
    });
  });
}
