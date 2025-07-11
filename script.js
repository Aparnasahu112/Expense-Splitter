document.addEventListener('DOMContentLoaded', () => {
  const expenseForm = document.getElementById('expenseForm');
  const expensesTableBody = document.querySelector('#expensesTable tbody');

  // Load saved expenses
  loadExpenses();

  expenseForm.addEventListener('submit', e => {
    e.preventDefault();

    const payerName = document.getElementById('payerName').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value;
    const members = document.getElementById('members').value;

    const expense = {
      payerName,
      amount,
      description,
      members,
      date: new Date().toLocaleString()
    };

    saveExpense(expense);
    addExpenseToTable(expense);
    expenseForm.reset();
  });

  function saveExpense(expense) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }

  function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.forEach(expense => addExpenseToTable(expense));
  }

  function addExpenseToTable(expense) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${expense.payerName}</td>
      <td>${expense.amount.toFixed(2)}</td>
      <td>${expense.description}</td>
      <td>${expense.members}</td>
      <td>${expense.date}</td>
    `;
    expensesTableBody.appendChild(row);
  }
  // Function to convert expenses to CSV & trigger download
function downloadCSV() {
  // Get expenses from LocalStorage
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

  if (expenses.length === 0) {
    alert("No expenses to export!");
    return;
  }

  // Build the CSV content as a string
  let csvContent = 'Payer,Amount,Description,Members,Date\n';

  expenses.forEach(expense => {
    csvContent +=` ${expense.payerName},${expense.amount},${expense.description},${expense.members},${expense.date}\n`;
  });

  // Create a blob file from CSV string
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  // Create a hidden link, click it to download
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'expenses.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Add event listener to button
document.getElementById('downloadBtn').addEventListener('click', downloadCSV);
});