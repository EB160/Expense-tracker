const balanceEl = document.getElementById("money-amount");

const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");

const selectEl = document.getElementById("entry-type");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

const transactionListEl = document.getElementById("transaction-list");
const transactionForm = document.getElementById("transaction-form");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionForm.addEventListener("submit", addTransaction);

function addTransaction(e) {
  e.preventDefault();

  const entryType = selectEl.value;
  const description = descriptionEl.value.trim();
  const amount = parseFloat(amountEl.value);

  transactions.push({
    id: Date.now(),
    type: entryType,
    description,
    amount: entryType === "income" ? amount : -amount,
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateExpenses();
  updateSummary();
  transactionForm.reset();
}

function updateExpenses() {
  transactionListEl.innerHTML = "";

  const sortedTrasactions = [...transactions].reverse();

  sortedTrasactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction);
    transactionListEl.appendChild(transactionEl);
  });
}

function createTransactionElement(transaction) {
  const li = document.createElement("li");
  li.classList.add("transaction");
  li.classList.add(transaction.type == "income" ? "income" : "expense");

  li.innerHTML = `
    <span>${transaction.description}</span>
    <span>
      ${transaction.amount < 0 ? `-$${Math.abs(transaction.amount)}` : `+$${transaction.amount}`}
      <button class="delete-btn" onclick="removeItem(${transaction.id})">x</button>
    </span>
  `;
  return li;
}

function updateSummary() {
  const balance = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0,
  );

  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const expense = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  balanceEl.textContent =
    balance < 0 ? `-$${Math.abs(balance)}` : `$${balance}`;
  incomeAmountEl.textContent = income;
  expenseAmountEl.textContent = expense;
}

function removeItem(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateExpenses();
  updateSummary();
}

updateExpenses();
updateSummary();
