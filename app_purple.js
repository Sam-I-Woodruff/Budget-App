// Budget App Logic will go here

const categories = [];
const transactions = [];

const addCategoryBtn = document.getElementById('add-category-btn');
const modalOverlay = document.getElementById('modal-overlay');
const addCategoryModal = document.getElementById('add-category-modal');
const cancelModalBtn = document.getElementById('cancel-modal-btn');
const addCategoryForm = document.getElementById('add-category-form');
const categoriesList = document.getElementById('categories-list');

const addTransactionBtn = document.getElementById('add-transaction-btn');
const transactionModalOverlay = document.getElementById('transaction-modal-overlay');
const addTransactionModal = document.getElementById('add-transaction-modal');
const cancelTransactionModalBtn = document.getElementById('cancel-transaction-modal-btn');
const addTransactionForm = document.getElementById('add-transaction-form');
const transactionCategorySelect = document.getElementById('transaction-category');
const transactionsList = document.getElementById('transactions-list');

const openDeleteModalBtn = document.getElementById('open-delete-modal-btn');
const deleteModalOverlay = document.getElementById('delete-modal-overlay');
const deleteModal = document.getElementById('delete-modal');
const deleteTabCategories = document.getElementById('delete-tab-categories');
const deleteTabTransactions = document.getElementById('delete-tab-transactions');
const deleteCategoriesList = document.getElementById('delete-categories-list');
const deleteTransactionsList = document.getElementById('delete-transactions-list');

let editingCategoryIdx = null;
let editingTransactionIdx = null;
let originalTransaction = null;

function openModal(editIdx = null) {
  modalOverlay.style.display = 'block';
  addCategoryModal.style.display = 'block';
  editingCategoryIdx = editIdx;
  const modalTitle = addCategoryModal.querySelector('h3');
  const submitBtn = addCategoryForm.querySelector('button[type="submit"]');
  if (editIdx !== null) {
    // Edit mode
    const cat = categories[editIdx];
    document.getElementById('category-name').value = cat.name;
    document.getElementById('category-limit').value = cat.limit;
    modalTitle.textContent = 'Edit Category';
    submitBtn.textContent = 'Save Changes';
  } else {
    // Add mode
    addCategoryForm.reset();
    modalTitle.textContent = 'Add Category';
    submitBtn.textContent = 'Save';
  }
}

function closeModal() {
  modalOverlay.style.display = 'none';
  addCategoryModal.style.display = 'none';
  addCategoryForm.reset();
  editingCategoryIdx = null;
  const modalTitle = addCategoryModal.querySelector('h3');
  const submitBtn = addCategoryForm.querySelector('button[type="submit"]');
  modalTitle.textContent = 'Add Category';
  submitBtn.textContent = 'Save';
}

function openTransactionModal(editIdx = null) {
  populateCategoryDropdown();
  transactionModalOverlay.style.display = 'block';
  addTransactionModal.style.display = 'block';
  editingTransactionIdx = editIdx;
  const modalTitle = addTransactionModal.querySelector('h3');
  const submitBtn = addTransactionForm.querySelector('button[type="submit"]');
  if (editIdx !== null) {
    // Edit mode
    const tx = transactions[editIdx];
    document.getElementById('transaction-amount').value = tx.amount;
    document.getElementById('transaction-date').value = tx.date;
    // Find the category index
    const catIdx = categories.findIndex(c => c.name === tx.category);
    transactionCategorySelect.value = catIdx;
    modalTitle.textContent = 'Edit Transaction';
    submitBtn.textContent = 'Save Changes';
    // Store original for spent adjustment
    originalTransaction = { ...tx };
  } else {
    // Add mode
    addTransactionForm.reset();
    modalTitle.textContent = 'Add Transaction';
    submitBtn.textContent = 'Save';
    originalTransaction = null;
  }
}

function closeTransactionModal() {
  transactionModalOverlay.style.display = 'none';
  addTransactionModal.style.display = 'none';
  addTransactionForm.reset();
  editingTransactionIdx = null;
  const modalTitle = addTransactionModal.querySelector('h3');
  const submitBtn = addTransactionForm.querySelector('button[type="submit"]');
  modalTitle.textContent = 'Add Transaction';
  submitBtn.textContent = 'Save';
  originalTransaction = null;
}

function populateCategoryDropdown() {
  transactionCategorySelect.innerHTML = '';
  categories.forEach((cat, idx) => {
    const option = document.createElement('option');
    option.value = idx;
    option.textContent = cat.name;
    transactionCategorySelect.appendChild(option);
  });
}

addCategoryBtn.addEventListener('click', () => openModal());
cancelModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

addTransactionBtn.addEventListener('click', () => openTransactionModal());
cancelTransactionModalBtn.addEventListener('click', closeTransactionModal);
transactionModalOverlay.addEventListener('click', closeTransactionModal);

addCategoryForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('category-name').value.trim();
  const limit = parseFloat(document.getElementById('category-limit').value);
  if (name && !isNaN(limit)) {
    if (editingCategoryIdx !== null) {
      // Edit mode
      categories[editingCategoryIdx].name = name;
      categories[editingCategoryIdx].limit = limit;
    } else {
      // Add mode
      categories.push({ name, limit, spent: 0 });
    }
    renderCategories();
    closeModal();
  }
});

addTransactionForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('transaction-amount').value);
  const date = document.getElementById('transaction-date').value;
  const categoryIdx = parseInt(transactionCategorySelect.value);
  if (!isNaN(amount) && date && !isNaN(categoryIdx)) {
    const category = categories[categoryIdx];
    if (category) {
      if (editingTransactionIdx !== null) {
        // Edit mode: adjust spent for old and new category/amount
        const tx = transactions[editingTransactionIdx];
        // Remove old spent
        const oldCatIdx = categories.findIndex(c => c.name === originalTransaction.category);
        if (oldCatIdx !== -1) {
          categories[oldCatIdx].spent -= originalTransaction.amount;
        }
        // Add new spent
        categories[categoryIdx].spent += amount;
        // Update transaction
        tx.amount = amount;
        tx.date = date;
        tx.category = category.name;
      } else {
        // Add mode
        transactions.push({ amount, date, category: category.name });
        category.spent += amount;
      }
      renderCategories();
      renderTransactions();
      closeTransactionModal();
    }
  }
});

function renderCategories() {
  categoriesList.innerHTML = '';
  categories.forEach((cat, idx) => {
    const div = document.createElement('div');
    div.className = 'category-item';
    const left = cat.limit - cat.spent;
    const isOver = left < 0;
    const label = isOver ? 'over' : 'left';
    const displayAmount = Math.abs(left).toFixed(2);
    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
        <span><strong>${cat.name}</strong> - $${cat.spent.toFixed(2)} / $${cat.limit.toFixed(2)}</span>
        <span style="color: ${isOver ? '#ff7a2f' : '#4be18a'}; font-weight: bold;">$${displayAmount} ${label}</span>
        <button class="edit-category-btn" data-idx="${idx}" style="background: #e0d7ff; color: #7c5fff; border-radius: 1rem; font-size: 0.9rem; padding: 0.3rem 0.9rem; margin-left: 0.5rem;">Edit</button>
      </div>
    `;
    // Progress bar
    const percent = Math.min((cat.spent / cat.limit) * 100, 100);
    const over = cat.spent > cat.limit;
    const progressBar = document.createElement('div');
    progressBar.className = 'category-progress' + (over ? ' over' : '');
    const progressInner = document.createElement('div');
    progressInner.className = 'category-progress-inner' + (over ? ' over' : '');
    progressInner.style.width = (cat.limit === 0 ? '0%' : percent + '%');
    progressBar.appendChild(progressInner);
    div.appendChild(progressBar);
    categoriesList.appendChild(div);
  });
  // Add event listeners for edit buttons
  document.querySelectorAll('.edit-category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      openModal(idx);
    });
  });
}

function renderTransactions() {
  transactionsList.innerHTML = '';
  // Sort by date descending
  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  sorted.forEach((tx, idx) => {
    const div = document.createElement('div');
    div.className = 'transaction-item';
    div.innerHTML = `<span>${tx.date}</span> - <strong>${tx.category}</strong>: $${tx.amount.toFixed(2)} <button class="edit-transaction-btn" data-idx="${transactions.indexOf(tx)}" title="Edit"><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#a18aff' viewBox='0 0 16 16'><path d='M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-9.193 9.193a.5.5 0 0 1-.168.11l-4 1.5a.5.5 0 0 1-.65-.65l1.5-4a.5.5 0 0 1 .11-.168l9.193-9.193zm.708-.708A1.5 1.5 0 0 0 12.146.146l-9.193 9.193a1.5 1.5 0 0 0-.329.494l-1.5 4a1.5 1.5 0 0 0 1.95 1.95l4-1.5a1.5 1.5 0 0 0 .494-.329l9.193-9.193a1.5 1.5 0 0 0 0-2.121l-2.292-2.292z'/></svg></button>`;
    transactionsList.appendChild(div);
  });
  // Add event listeners for edit buttons
  document.querySelectorAll('.edit-transaction-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      openTransactionModal(idx);
    });
  });
}

function openDeleteModal() {
  deleteModalOverlay.style.display = 'block';
  deleteModal.style.display = 'block';
  showDeleteTab('categories');
}
function closeDeleteModal() {
  deleteModalOverlay.style.display = 'none';
  deleteModal.style.display = 'none';
}
openDeleteModalBtn.addEventListener('click', openDeleteModal);
deleteModalOverlay.addEventListener('click', closeDeleteModal);

deleteTabCategories.addEventListener('click', () => showDeleteTab('categories'));
deleteTabTransactions.addEventListener('click', () => showDeleteTab('transactions'));

function showDeleteTab(tab) {
  if (tab === 'categories') {
    deleteTabCategories.classList.add('active');
    deleteTabTransactions.classList.remove('active');
    deleteCategoriesList.style.display = 'block';
    deleteTransactionsList.style.display = 'none';
    renderDeleteCategories();
  } else {
    deleteTabCategories.classList.remove('active');
    deleteTabTransactions.classList.add('active');
    deleteCategoriesList.style.display = 'none';
    deleteTransactionsList.style.display = 'block';
    renderDeleteTransactions();
  }
}

function renderDeleteCategories() {
  deleteCategoriesList.innerHTML = '';
  categories.forEach((cat, idx) => {
    const row = document.createElement('div');
    row.className = 'delete-modal-list-row';
    row.innerHTML = `
      <span>${cat.name}</span>
      <button class="delete-item-btn" title="Delete Category" data-idx="${idx}">
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6zm3 .5a.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6zm-7-2A1.5 1.5 0 0 1 5.5 3h5A1.5 1.5 0 0 1 12 4.5V5h3.5a.5.5 0 0 1 0 1h-1.027l-.427 9.447A2 2 0 0 1 12.05 17H3.95a2 2 0 0 1-1.996-1.553L1.527 6H.5a.5.5 0 0 1 0-1H4v-.5zM5.5 4a.5.5 0 0 0-.5.5V5h6v-.5a.5.5 0 0 0-.5-.5h-5zM2.522 6l.427 9.447A1 1 0 0 0 3.95 16h8.1a1 1 0 0 0 .999-.553L13.478 6H2.522z'/></svg>
      </button>
    `;
    row.querySelector('.delete-item-btn').addEventListener('click', () => {
      // Remove all transactions in this category
      for (let i = transactions.length - 1; i >= 0; i--) {
        if (transactions[i].category === cat.name) {
          transactions.splice(i, 1);
        }
      }
      categories.splice(idx, 1);
      renderCategories();
      renderTransactions();
      renderDeleteCategories();
    });
    deleteCategoriesList.appendChild(row);
  });
}

function renderDeleteTransactions() {
  deleteTransactionsList.innerHTML = '';
  transactions.forEach((tx, idx) => {
    const row = document.createElement('div');
    row.className = 'delete-modal-list-row';
    row.innerHTML = `
      <span>${tx.date} - ${tx.category}: $${tx.amount.toFixed(2)}</span>
      <button class="delete-item-btn" title="Delete Transaction" data-idx="${idx}">
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6zm3 .5a.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6zm-7-2A1.5 1.5 0 0 1 5.5 3h5A1.5 1.5 0 0 1 12 4.5V5h3.5a.5.5 0 0 1 0 1h-1.027l-.427 9.447A2 2 0 0 1 12.05 17H3.95a2 2 0 0 1-1.996-1.553L1.527 6H.5a.5.5 0 0 1 0-1H4v-.5zM5.5 4a.5.5 0 0 0-.5.5V5h6v-.5a.5.5 0 0 0-.5-.5h-5zM2.522 6l.427 9.447A1 1 0 0 0 3.95 16h8.1a1 1 0 0 0 .999-.553L13.478 6H2.522z'/></svg>
      </button>
    `;
    row.querySelector('.delete-item-btn').addEventListener('click', () => {
      // Update spent for the category
      const cat = categories.find(c => c.name === tx.category);
      if (cat) cat.spent -= tx.amount;
      transactions.splice(idx, 1);
      renderCategories();
      renderTransactions();
      renderDeleteTransactions();
    });
    deleteTransactionsList.appendChild(row);
  });
} 