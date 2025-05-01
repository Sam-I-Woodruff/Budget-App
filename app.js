const form = document.getElementById('expense-form');
const list = document.getElementById('expense-list');
const totalDisplay = document.getElementById('total');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function render() {
  list.innerHTML = '';
  let total = 0;
  expenses.forEach((exp, idx) => {
    total += Number(exp.amount);
    const li = document.createElement('li');
    li.textContent = `${exp.desc}: $${exp.amount}`;
    list.appendChild(li);
  });
  totalDisplay.textContent = total.toFixed(2);
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const desc = document.getElementById('desc').value;
  const amount = document.getElementById('amount').value;
  expenses.push({ desc, amount });
  render();
  form.reset();
});

render();
