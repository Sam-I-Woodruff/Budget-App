// Budget App Logic will go here

// Supabase initialization
// const SUPABASE_URL = (typeof API_KEY !== 'undefined') ? API_KEY : '';
// const SUPABASE_ANON_KEY = (typeof ANON_PUBLIC_KEY !== 'undefined') ? ANON_PUBLIC_KEY : '';
// const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const SUPABASE_URL = 'https://tlgqcodxmbmzxyuhgfug.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZ3Fjb2R4bWJtenh5dWhnZnVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTY0NzYsImV4cCI6MjA2ODE3MjQ3Nn0.uPDg84LT6bLOrqEKE7to7wY1tURaIUjLl3aCo6bgUjU';

// Auth UI elements
const authSection = document.getElementById('auth-section');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const logoutBtn = document.getElementById('logout-btn');
const authForms = document.getElementById('auth-forms');
const authLoggedIn = document.getElementById('auth-logged-in');
const userEmailSpan = document.getElementById('user-email');

// Main app UI
const main = document.querySelector('main');

// Helper: Show/hide UI based on auth
function updateAuthUI(user) {
  if (user) {
    authForms.style.display = 'none';
    authLoggedIn.style.display = 'block';
    userEmailSpan.textContent = user.email;
    main.style.display = '';
  } else {
    authForms.style.display = 'block';
    authLoggedIn.style.display = 'none';
    userEmailSpan.textContent = '';
    main.style.display = 'none';
  }
}

// Listen for auth state changes
supabase.auth.onAuthStateChange((_event, session) => {
  updateAuthUI(session?.user);
  if (session?.user) {
    loadCategories();
    loadTransactions();
  }
});

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
});

// Signup
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert('Check your email for confirmation!');
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
});

// CRUD for categories
async function loadCategories() {
  const user = supabase.auth.user();
  if (!user) return;
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id);
  if (error) {
    alert(error.message);
    return;
  }
  // Render categories (implement renderCategoriesSupabase)
  renderCategoriesSupabase(data);
}

async function addCategorySupabase(name, limits) {
  const user = supabase.auth.user();
  if (!user) return;
  const { error } = await supabase
    .from('categories')
    .insert([{ name, limits, spent: 0, user_id: user.id }]);
  if (error) alert(error.message);
  else loadCategories();
}

async function updateCategorySupabase(id, name, limits) {
  const { error } = await supabase
    .from('categories')
    .update({ name, limits })
    .eq('id', id);
  if (error) alert(error.message);
  else loadCategories();
}

async function deleteCategorySupabase(id) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  if (error) alert(error.message);
  else loadCategories();
}

// CRUD for transactions
async function loadTransactions() {
  const user = supabase.auth.user();
  if (!user) return;
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id);
  if (error) {
    alert(error.message);
    return;
  }
  // Render transactions (implement renderTransactionsSupabase)
  renderTransactionsSupabase(data);
}

async function addTransactionSupabase(amount, date, category_id) {
  const user = supabase.auth.user();
  if (!user) return;
  const { error } = await supabase
    .from('transactions')
    .insert([{ amount, date, category_id, user_id: user.id }]);
  if (error) alert(error.message);
  else loadTransactions();
}

async function updateTransactionSupabase(id, amount, date, category_id) {
  const { error } = await supabase
    .from('transactions')
    .update({ amount, date, category_id })
    .eq('id', id);
  if (error) alert(error.message);
  else loadTransactions();
}

async function deleteTransactionSupabase(id) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);
  if (error) alert(error.message);
  else loadTransactions();
}

// TODO: Replace all local array logic with calls to the above functions
// and update renderCategoriesSupabase and renderTransactionsSupabase to match your UI.

const categoriesList = document.getElementById('categories-list');
const addCategoryBtn = document.getElementById('add-category-btn');
const modalOverlay = document.getElementById('modal-overlay');
const addCategoryModal = document.getElementById('add-category-modal');
const cancelModalBtn = document.getElementById('cancel-modal-btn');
const addCategoryForm = document.getElementById('add-category-form');

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

// Remove local arrays
// const categories = [];
// const transactions = [];

// Render categories from Supabase data
function renderCategoriesSupabase(categories) {
  categoriesList.innerHTML = '';
  categories.forEach((cat) => {
    const div = document.createElement('div');
    div.className = 'category-item';
    const left = cat.limits - cat.spent;
    const isOver = left < 0;
    const label = isOver ? 'over' : 'left';
    const displayAmount = Math.abs(left).toFixed(2);
    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
        <span><strong>${cat.name}</strong> - $${cat.spent.toFixed(2)} / $${cat.limits.toFixed(2)}</span>
        <span style="color: ${isOver ? '#ff7a2f' : '#4be18a'}; font-weight: bold;">$${displayAmount} ${label}</span>
        <button class="edit-category-btn" data-id="${cat.id}" style="background: #e0d7ff; color: #7c5fff; border-radius: 1rem; font-size: 0.9rem; padding: 0.3rem 0.9rem; margin-left: 0.5rem;">Edit</button>
        <button class="delete-category-btn" data-id="${cat.id}" style="background: #ffe0c2; color: #ff7a2f; border-radius: 1rem; font-size: 0.9rem; padding: 0.3rem 0.9rem; margin-left: 0.5rem;">Delete</button>
      </div>
    `;
    // Progress bar
    const percent = Math.min((cat.spent / cat.limits) * 100, 100);
    const over = cat.spent > cat.limits;
    const progressBar = document.createElement('div');
    progressBar.className = 'category-progress' + (over ? ' over' : '');
    const progressInner = document.createElement('div');
    progressInner.className = 'category-progress-inner' + (over ? ' over' : '');
    progressInner.style.width = (cat.limits === 0 ? '0%' : percent + '%');
    progressBar.appendChild(progressInner);
    div.appendChild(progressBar);
    categoriesList.appendChild(div);
  });
  // Add event listeners for edit/delete buttons
  document.querySelectorAll('.edit-category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      openModalSupabase(id);
    });
  });
  document.querySelectorAll('.delete-category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      if (confirm('Delete this category?')) deleteCategorySupabase(id);
    });
  });
}

// Render transactions from Supabase data
function renderTransactionsSupabase(transactions) {
  transactionsList.innerHTML = '';
  // Sort by date descending
  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  sorted.forEach((tx) => {
    const div = document.createElement('div');
    div.className = 'transaction-item';
    div.innerHTML = `<span>${tx.date}</span> - <strong>${tx.category_id}</strong>: $${tx.amount.toFixed(2)} <button class="edit-transaction-btn" data-id="${tx.id}" title="Edit"><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#a18aff' viewBox='0 0 16 16'><path d='M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-9.193 9.193a.5.5 0 0 1-.168.11l-4 1.5a.5.5 0 0 1-.65-.65l1.5-4a.5.5 0 0 1 .11-.168l9.193-9.193zm.708-.708A1.5 1.5 0 0 0 12.146.146l-9.193 9.193a1.5 1.5 0 0 0-.329.494l-1.5 4a1.5 1.5 0 0 0 1.95 1.95l4-1.5a1.5 1.5 0 0 0 .494-.329l9.193-9.193a1.5 1.5 0 0 0 0-2.121l-2.292-2.292z'/></svg></button> <button class="delete-transaction-btn" data-id="${tx.id}" title="Delete">Delete</button>`;
    transactionsList.appendChild(div);
  });
  // Add event listeners for edit/delete buttons
  document.querySelectorAll('.edit-transaction-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      openTransactionModalSupabase(id);
    });
  });
  document.querySelectorAll('.delete-transaction-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      if (confirm('Delete this transaction?')) deleteTransactionSupabase(id);
    });
  });
}

// Modal logic for Supabase CRUD
function openModalSupabase(editId = null) {
  // Fetch category if editing
  if (editId) {
    supabase.from('categories').select('*').eq('id', editId).single().then(({ data, error }) => {
      if (error) return alert(error.message);
      document.getElementById('category-name').value = data.name;
      document.getElementById('category-limit').value = data.limits;
      addCategoryModal.querySelector('h3').textContent = 'Edit Category';
      addCategoryForm.querySelector('button[type="submit"]').textContent = 'Save Changes';
      addCategoryModal.setAttribute('data-edit-id', editId);
      modalOverlay.style.display = 'block';
      addCategoryModal.style.display = 'block';
    });
  } else {
    addCategoryForm.reset();
    addCategoryModal.querySelector('h3').textContent = 'Add Category';
    addCategoryForm.querySelector('button[type="submit"]').textContent = 'Save';
    addCategoryModal.removeAttribute('data-edit-id');
    modalOverlay.style.display = 'block';
    addCategoryModal.style.display = 'block';
  }
}

addCategoryBtn.addEventListener('click', () => openModalSupabase());
cancelModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

addCategoryForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('category-name').value.trim();
  const limits = parseFloat(document.getElementById('category-limit').value);
  const editId = addCategoryModal.getAttribute('data-edit-id');
  if (name && !isNaN(limits)) {
    if (editId) {
      updateCategorySupabase(editId, name, limits);
    } else {
      addCategorySupabase(name, limits);
    }
    closeModal();
  }
});

function closeModal() {
  modalOverlay.style.display = 'none';
  addCategoryModal.style.display = 'none';
  addCategoryForm.reset();
  addCategoryModal.removeAttribute('data-edit-id');
  addCategoryModal.querySelector('h3').textContent = 'Add Category';
  addCategoryForm.querySelector('button[type="submit"]').textContent = 'Save';
}

// Transaction modal logic for Supabase CRUD
function openTransactionModalSupabase(editId = null) {
  populateCategoryDropdownSupabase().then(() => {
    if (editId) {
      supabase.from('transactions').select('*').eq('id', editId).single().then(({ data, error }) => {
        if (error) return alert(error.message);
        document.getElementById('transaction-amount').value = data.amount;
        document.getElementById('transaction-date').value = data.date;
        document.getElementById('transaction-category').value = data.category_id;
        addTransactionModal.querySelector('h3').textContent = 'Edit Transaction';
        addTransactionForm.querySelector('button[type="submit"]').textContent = 'Save Changes';
        addTransactionModal.setAttribute('data-edit-id', editId);
        transactionModalOverlay.style.display = 'block';
        addTransactionModal.style.display = 'block';
      });
    } else {
      addTransactionForm.reset();
      addTransactionModal.querySelector('h3').textContent = 'Add Transaction';
      addTransactionForm.querySelector('button[type="submit"]').textContent = 'Save';
      addTransactionModal.removeAttribute('data-edit-id');
      transactionModalOverlay.style.display = 'block';
      addTransactionModal.style.display = 'block';
    }
  });
}

addTransactionBtn.addEventListener('click', () => openTransactionModalSupabase());
cancelTransactionModalBtn.addEventListener('click', closeTransactionModal);
transactionModalOverlay.addEventListener('click', closeTransactionModal);

addTransactionForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('transaction-amount').value);
  const date = document.getElementById('transaction-date').value;
  const category_id = document.getElementById('transaction-category').value;
  const editId = addTransactionModal.getAttribute('data-edit-id');
  if (!isNaN(amount) && date && category_id) {
    if (editId) {
      updateTransactionSupabase(editId, amount, date, category_id);
    } else {
      addTransactionSupabase(amount, date, category_id);
    }
    closeTransactionModal();
  }
});

function closeTransactionModal() {
  transactionModalOverlay.style.display = 'none';
  addTransactionModal.style.display = 'none';
  addTransactionForm.reset();
  addTransactionModal.removeAttribute('data-edit-id');
  addTransactionModal.querySelector('h3').textContent = 'Add Transaction';
  addTransactionForm.querySelector('button[type="submit"]').textContent = 'Save';
}

// Populate category dropdown from Supabase
async function populateCategoryDropdownSupabase() {
  const user = supabase.auth.user();
  if (!user) return;
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .eq('user_id', user.id);
  transactionCategorySelect.innerHTML = '';
  if (error) return;
  data.forEach((cat) => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    transactionCategorySelect.appendChild(option);
  });
}

// Initial UI state
main.style.display = 'none';

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

// Confirmation modal logic
let pendingDelete = null;

// Add confirmation modal to DOM if not present
if (!document.getElementById('confirm-delete-modal')) {
  const confirmModal = document.createElement('div');
  confirmModal.id = 'confirm-delete-modal';
  confirmModal.className = 'modal';
  confirmModal.style.display = 'none';
  confirmModal.innerHTML = `
    <div class="modal-content" style="min-width: 260px; max-width: 96vw; text-align: center;">
      <h3 style="color: #ff7a2f;">Are you sure you want to delete?</h3>
      <div style="margin-top: 2rem; display: flex; justify-content: center; gap: 1.5rem;">
        <button id="cancel-delete-btn" style="background: #e0d7ff; color: #7c5fff;">Cancel</button>
        <button id="final-delete-btn" style="background: #ff7a2f; color: #fff;">Final Delete</button>
      </div>
    </div>
  `;
  document.body.appendChild(confirmModal);
}
const confirmDeleteModal = document.getElementById('confirm-delete-modal');
const cancelDeleteBtn = confirmDeleteModal.querySelector('#cancel-delete-btn');
const finalDeleteBtn = confirmDeleteModal.querySelector('#final-delete-btn');

function openConfirmDeleteModal(type, idx) {
  confirmDeleteModal.style.display = 'block';
  pendingDelete = { type, idx };
}
function closeConfirmDeleteModal() {
  confirmDeleteModal.style.display = 'none';
  pendingDelete = null;
}
cancelDeleteBtn.addEventListener('click', closeConfirmDeleteModal);
confirmDeleteModal.addEventListener('click', (e) => {
  if (e.target === confirmDeleteModal) closeConfirmDeleteModal();
});
finalDeleteBtn.addEventListener('click', () => {
  if (!pendingDelete) return;
  if (pendingDelete.type === 'category') {
    // Remove all transactions in this category
    const cat = categoriesList.querySelector(`.category-item:nth-child(${pendingDelete.idx + 1})`).querySelector('span').textContent;
    for (let i = transactionsList.children.length - 1; i >= 0; i--) {
      const tx = transactionsList.children[i];
      if (tx.querySelector('strong').textContent.includes(cat)) {
        deleteTransactionSupabase(tx.querySelector('.edit-transaction-btn').getAttribute('data-id'));
      }
    }
    deleteCategorySupabase(categoriesList.children[pendingDelete.idx].querySelector('.edit-category-btn').getAttribute('data-id'));
  } else if (pendingDelete.type === 'transaction') {
    const tx = transactionsList.children[pendingDelete.idx];
    const cat = tx.querySelector('strong').textContent.split(' - ')[0];
    deleteTransactionSupabase(tx.querySelector('.edit-transaction-btn').getAttribute('data-id'));
    // Re-calculate spent for the category
    supabase.from('categories').select('*').eq('name', cat).single().then(({ data }) => {
      if (data) {
        supabase.from('categories').update({ spent: data.spent - tx.querySelector('span').textContent.split(' - ')[1].split(':')[0].split('$')[1] }).eq('name', cat);
      }
    });
  }
  closeConfirmDeleteModal();
});

function renderDeleteCategories() {
  deleteCategoriesList.innerHTML = '';
  categoriesList.querySelectorAll('.category-item').forEach((cat, idx) => {
    const row = document.createElement('div');
    row.className = 'delete-modal-list-row';
    row.innerHTML = `
      <span>${cat.querySelector('span strong').textContent.split(' - ')[0]}</span>
      <button class="delete-item-btn" title="Delete Category" data-idx="${idx}">Delete</button>
    `;
    row.querySelector('.delete-item-btn').addEventListener('click', () => {
      openConfirmDeleteModal('category', idx);
    });
    deleteCategoriesList.appendChild(row);
  });
}

function renderDeleteTransactions() {
  deleteTransactionsList.innerHTML = '';
  transactionsList.querySelectorAll('.transaction-item').forEach((tx, idx) => {
    const row = document.createElement('div');
    row.className = 'delete-modal-list-row';
    row.innerHTML = `
      <span>${tx.querySelector('span').textContent} - ${tx.querySelector('strong').textContent.split(' - ')[1]}: $${tx.querySelector('span').textContent.split(' - ')[2].split('$')[1]}</span>
      <button class="delete-item-btn" title="Delete Transaction" data-idx="${idx}">Delete</button>
    `;
    row.querySelector('.delete-item-btn').addEventListener('click', () => {
      openConfirmDeleteModal('transaction', idx);
    });
    deleteTransactionsList.appendChild(row);
  });
} 