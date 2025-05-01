let categories = [];
let transactions = [];
let currentMonthYear = getCurrentMonthYear();

function getCurrentMonthYear() {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}`; // Format as YYYY-MM
}

function updateMonthYearSelect() {
  const monthYearSelect = document.getElementById("monthYearSelect");
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  monthYearSelect.innerHTML = ''; // Clear previous options

  // Add the current and future months/years to the select dropdown
  for (let year = new Date().getFullYear(); year <= 2050; year++) {
    for (let month of months) {
      const monthYear = `${year}-${month}`;
      const option = document.createElement("option");
      option.value = monthYear;
      option.innerText = `${monthYear} (${month} / ${year})`;
      monthYearSelect.appendChild(option);
    }
  }

  // Set the initial current month/year as the selected option
  monthYearSelect.value = currentMonthYear;
}

function addCategory() {
  const name = document.getElementById("categoryName").value;
  const budget = parseFloat(document.getElementById("categoryBudget").value);

  // Debugging log
  console.log('Adding Category:', name, budget);

  if (name && !isNaN(budget) && budget > 0) {
    const category = {
      name,
      budget,
      transactions: [],
      startMonthYear: currentMonthYear, // Starting month/year
    };
    categories.push(category);
    renderCategories(); // Re-render the categories
  } else {
    // Handle invalid inputs
    console.log("Invalid category data.");
  }
}

function renderCategories() {
  const categoriesList = document.getElementById("categoriesList");
  const categorySelect = document.getElementById("categorySelect");
  const selectedMonthYear = document.getElementById("monthYearSelect").value;

  categoriesList.innerHTML = "";
  categorySelect.innerHTML = `<option value="">Select Category</option>`;

  categories.forEach((category) => {
    if (category.startMonthYear <= selectedMonthYear) { // Only show categories for current or future months
      const categoryDiv = document.createElement("div");
      categoryDiv.classList.add("category");

      const categoryName = document.createElement("h3");
      categoryName.innerText = category.name;

      const progressBarContainer = document.createElement("div");
      progressBarContainer.classList.add("progress-bar-container");

      const progressBar = document.createElement("div");
      progressBar.classList.add("progress-bar");

      const progressFill = document.createElement("div");
      progressFill.classList.add("progress-bar-fill");
      const progress = transactions
        .filter(t => t.category === category.name && t.monthYear === selectedMonthYear)
        .reduce((acc, t) => acc + t.amount, 0);

      const progressPercentage = Math.min((progress / category.budget) * 100, 100);
      progressFill.style.width = `${progressPercentage}%`;
      if (progress > category.budget) {
        progressFill.style.backgroundColor = 'green';
      }

      progressBar.appendChild(progressFill);
      progressBarContainer.appendChild(progressBar);

      const progressLabel = document.createElement("div");
      progressLabel.innerText = `${progress} / ${category.budget}`;
      progressLabel.style.textAlign = 'center';
      progressLabel.style.marginTop = '5px';

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";
      deleteButton.onclick = () => deleteCategory(category.name);

      categoryDiv.appendChild(categoryName);
      categoryDiv.appendChild(progressBarContainer);
      categoryDiv.appendChild(progressLabel);
      categoryDiv.appendChild(deleteButton);

      categoriesList.appendChild(categoryDiv);

      const option = document.createElement("option");
      option.value = category.name;
      option.innerText = category.name;
      categorySelect.appendChild(option);
    }
  });
}

function deleteCategory(name) {
  categories = categories.filter(c => c.name !== name);
  renderCategories();
}

function addTransaction() {
  const categoryName = document.getElementById("categorySelect").value;
  const amount = parseFloat(document.getElementById("transactionAmount").value);
  const transactionDate = document.getElementById("transactionDate").value;

  if (!categoryName || isNaN(amount) || amount <= 0 || !transactionDate) return;

  const transactionDateObj = new Date(transactionDate);
  const monthYear = `${transactionDateObj.getFullYear()}-${transactionDateObj.getMonth() + 1}`;

  const transaction = {
    category: categoryName,
    amount,
    date: transactionDate,
    monthYear
  };

  transactions.push(transaction);
  renderCategories();
}

// Initialize the month/year selector
updateMonthYearSelect();
