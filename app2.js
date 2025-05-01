let categories = [];

function addCategory() {
  const name = document.getElementById("categoryName").value;
  const budget = parseFloat(document.getElementById("categoryBudget").value);

  if (name && !isNaN(budget) && budget > 0) {
    const category = {
      name,
      budget,
      transactions: [],
    };
    categories.push(category);
    renderCategories();
  }
}

function renderCategories() {
  const categoriesList = document.getElementById("categoriesList");
  const categorySelect = document.getElementById("categorySelect");

  categoriesList.innerHTML = "";
  categorySelect.innerHTML = `<option value="">Select Category</option>`;

  categories.forEach((category, index) => {
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
    
    const progress = category.transactions.reduce((acc, t) => acc + t, 0);
    const progressPercentage = Math.min((progress / category.budget) * 100, 100);
    
    progressFill.style.width = `${progressPercentage}%`;
    if (progress > category.budget) {
      progressFill.style.backgroundColor = 'red';
    }

    progressBar.appendChild(progressFill);
    progressBarContainer.appendChild(progressBar);

    // Add amount label to the progress bar
    const progressLabel = document.createElement("div");
    progressLabel.innerText = `${progress} / ${category.budget}`;
    progressLabel.style.textAlign = 'center';
    progressLabel.style.marginTop = '5px';
    
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = () => deleteCategory(index);

    categoryDiv.appendChild(categoryName);
    categoryDiv.appendChild(progressBarContainer);
    categoryDiv.appendChild(progressLabel);
    categoryDiv.appendChild(deleteButton);

    categoriesList.appendChild(categoryDiv);

    const option = document.createElement("option");
    option.value = index;
    option.innerText = category.name;
    categorySelect.appendChild(option);
  });
}

function deleteCategory(index) {
  categories.splice(index, 1);
  renderCategories();
}

function addTransaction() {
  const categoryIndex = parseInt(document.getElementById("categorySelect").value);
  const amount = parseFloat(document.getElementById("transactionAmount").value);

  if (!isNaN(amount) && amount > 0 && categoryIndex !== "") {
    categories[categoryIndex].transactions.push(amount);
    renderCategories();
  }
}
