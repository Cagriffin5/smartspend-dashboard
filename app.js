document.addEventListener('DOMContentLoaded', () => {
  // Application Balance States Registry Data Array
  let transactions = [];

  // DOM Input Component Form Elements
  const transactionForm = document.getElementById('transaction-form');
  const ledgerBody = document.getElementById('ledger-body');

  // Top Level Metric Panel Displays
  const displayIncome = document.getElementById('display-income');
  const displayExpenses = document.getElementById('display-expenses');
  const displayBalance = document.getElementById('display-balance');

  /* -------------------------------------------------------------
     1. Form Interaction Logic Event Listener Entry Hook
  ------------------------------------------------------------- */
  if (transactionForm) {
    transactionForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve and parse user input elements array matrix
      const description = document.getElementById('desc').value.trim();
      const amount = parseFloat(document.getElementById('amount').value);
      const type = document.getElementById('type').value;

      const newTransaction = {
        id: 'TXN-' + Date.now(),
        description,
        amount,
        type
      };

      // Register object ledger balance entry, reset form inputs, and recalculate financials
      transactions.unshift(newTransaction); // Insert latest record entry to header positions
      transactionForm.reset();
      synchronizeFinancialState();
    });
  }

  /* -------------------------------------------------------------
     2. Calculation Pipeline & Aggregation Pipeline Core Routing
  ------------------------------------------------------------- */
  function synchronizeFinancialState() {
    renderHistoryLedger();
    calculateFinancialAggregations();
  }

  function renderHistoryLedger() {
    ledgerBody.innerHTML = '';

    if (transactions.length === 0) {
      ledgerBody.innerHTML = `<tr><td colspan="3" class="text-center" style="color: var(--text-muted); padding: 24px; text-align: center;">No registered activity entries available.</td></tr>`;
      return;
    }

    transactions.forEach(txn => {
      const row = document.createElement('tr');
      
      // Select appropriate visual prefix and modifier variables classes tokens
      const isIncome = txn.type === 'income';
      const typeLabel = isIncome ? 'Income' : 'Expense';
      const typeClass = isIncome ? 'text-income' : 'text-expense';
      const prefix = isIncome ? '+' : '-';

      row.innerHTML = `
        <td><strong>${escapeHTML(txn.description)}</strong></td>
        <td><span class="${typeClass}" style="font-weight: 600; font-size: 0.85rem;">${typeLabel}</span></td>
        <td class="text-right ${typeClass}" style="font-family: monospace; font-weight: bold; font-size: 1rem;">
          ${prefix}$${txn.amount.toFixed(2)}
        </td>
      `;

      ledgerBody.appendChild(row);
    });
  }

  function calculateFinancialAggregations() {
    let incomeTotal = 0;
    let expenseTotal = 0;

    // Direct loop tracking matrix totals avoiding precision clipping variations
    transactions.forEach(txn => {
      if (txn.type === 'income') {
        incomeTotal += txn.amount;
      } else {
        expenseTotal += txn.amount;
      }
    });

    const netBalance = incomeTotal - expenseTotal;

    // Inject metrics formatted clean strings down into the panel display views
    displayIncome.textContent = `$${incomeTotal.toFixed(2)}`;
    displayExpenses.textContent = `$${expenseTotal.toFixed(2)}`;
    displayBalance.textContent = `${netBalance >= 0 ? '' : '-'}$${Math.abs(netBalance).toFixed(2)}`;

    // Toggle balance coloration classes flags conditionally matching state values
    if (netBalance >= 0) {
      displayBalance.className = 'text-income';
    } else {
      displayBalance.className = 'text-expense';
    }
  }

  /* Helper script scrubbing user input values clean of unsafe execution string characters */
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
});
