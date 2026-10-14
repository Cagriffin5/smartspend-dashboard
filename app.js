/**
 * SmartSpend App Engine 
 * Handles state management, UI rendering, math reduction, and localized persistence storage.
 */

// 1. Establish App State Architecture
let transactions = JSON.parse(localStorage.getItem('smartspend_data')) || [];

// 2. Fetch DOM Interface Node Handles
const form = document.getElementById('transaction-form');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const ledgerBody = document.getElementById('ledger-body');

const displayIncome = document.getElementById('display-income');
const displayExpenses = document.getElementById('display-expenses');
const displayBalance = document.getElementById('display-balance');

// 3. Mathematical Recalculation Engine
function calculateFinancials() {
    // Isolate & total up income items
    const incomeTotal = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    // Isolate & total up expense items
    const expenseTotal = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    // Calculate aggregate net balance
    const netBalance = incomeTotal - expenseTotal;

    // Render formatted currency outputs onto display elements
    displayIncome.textContent = `$${incomeTotal.toFixed(2)}`;
    displayExpenses.textContent = `$${expenseTotal.toFixed(2)}`;
    displayBalance.textContent = `$${netBalance.toFixed(2)}`;

    // Graphic Design Rule: Apply visual warnings if balance dips into negative thresholds
    if (netBalance < 0) {
        displayBalance.style.color = '#d53d4c'; // Warning red
    } else {
        displayBalance.style.color = '#1d252c'; // Standard primary dark text
    }
}

// 4. Dynamic Data Ledger Rendering
function renderLedger() {
    // Purge existing elements to mitigate interface rendering duplications
    ledgerBody.innerHTML = '';

    // Loop array to generate data table matrix rows
    transactions.forEach(t => {
        const row = document.createElement('tr');

        // Formulate dynamic context badge values and styles based on element item types
        const typeBadge = t.type === 'income' 
            ? `<span class="badge-income">INFLOW</span>` 
            : `<span class="badge-expense">OUTFLOW</span>`;

        const amountCell = t.type === 'income'
            ? `+ $${t.amount.toFixed(2)}`
            : `- $${t.amount.toFixed(2)}`;

        // Populate table element row body block string templates
        row.innerHTML = `
            <td>${t.description}</td>
            <td>${typeBadge}</td>
            <td class="text-right ${t.type === 'income' ? 'badge-income' : 'badge-expense'}">${amountCell}</td>
        `;

        // Inject row directly into live document view block
        ledgerBody.appendChild(row);
    });
}

// 5. Global State Storage Updates
function updateStorage() {
    localStorage.setItem('smartspend_data', JSON.stringify(transactions));
    calculateFinancials();
    renderLedger();
}

// 6. User Transaction Intercept Handle Event Listener
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Inhibit page payload reload behaviors

    // Sanitize and structure user values into typed object schemas
    const newTransaction = {
        id: Date.now(), // Generate a unique identifier tracking key
        description: descInput.value.trim(),
        amount: parseFloat(amountInput.value),
        type: typeInput.value
    };

    // Append payload item block directly onto operational state array tracking vectors
    transactions.push(newTransaction);

    // Sync app arrays, recompute visuals, save to storage, and reset form
    updateStorage();
    form.reset();
    descInput.focus();
});

// 7. Initial Initialization Lifecycle Run Trigger
calculateFinancials();
renderLedger();
