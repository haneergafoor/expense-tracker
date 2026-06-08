// Expense Tracker App
// ==================

class ExpenseTracker {
    constructor() {
        this.expenses = [];
        this.categories = [
            { id: 1, name: 'Food', color: '#FF6B6B' },
            { id: 2, name: 'Fuel', color: '#4ECDC4' },
            { id: 3, name: 'Hospital', color: '#95E1D3' },
            { id: 4, name: 'Bills', color: '#F38181' },
            { id: 5, name: 'Home Maintenance', color: '#AA96DA' },
            { id: 6, name: 'Others', color: '#FCBAD3' }
        ];
        this.budget = 20000;
        this.currentMonth = new Date();
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.populateCategories();
        this.setCurrentDate();
        this.renderDashboard();
        this.setupPageNavigation();
    }

    // Data Management
    loadData() {
        const stored = localStorage.getItem('expenses');
        const budgetStored = localStorage.getItem('budget');
        
        if (stored) {
            this.expenses = JSON.parse(stored);
        }
        
        if (budgetStored) {
            this.budget = parseFloat(budgetStored);
        }
    }

    saveData() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
        localStorage.setItem('budget', this.budget.toString());
    }

    addExpense(expense) {
        const newExpense = {
            id: Date.now().toString(),
            ...expense,
            createdAt: new Date().toISOString()
        };
        this.expenses.push(newExpense);
        this.saveData();
        return newExpense;
    }

    editExpense(id, updates) {
        const index = this.expenses.findIndex(e => e.id === id);
        if (index !== -1) {
            this.expenses[index] = { ...this.expenses[index], ...updates };
            this.saveData();
            return this.expenses[index];
        }
        return null;
    }

    deleteExpense(id) {
        this.expenses = this.expenses.filter(e => e.id !== id);
        this.saveData();
    }

    // Setup Functions
    setupEventListeners() {
        // Add Expense Form
        document.getElementById('add-expense-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddExpense();
        });

        // Settings
        document.getElementById('budget-setting').value = this.budget;
    }

    setupPageNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.switchPage(e.target.dataset.page);
            });
        });
    }

    switchPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const page = document.getElementById(pageId);
        if (page) {
            page.classList.add('active');
        }

        // Update nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

        // Render page-specific content
        if (pageId === 'dashboard') {
            this.renderDashboard();
        } else if (pageId === 'analytics') {
            this.renderAnalytics();
        } else if (pageId === 'reports') {
            this.renderReports();
        } else if (pageId === 'history') {
            this.renderHistory();
        }
    }

    populateCategories() {
        const select = document.getElementById('expense-category');
        select.innerHTML = '';
        this.categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    }

    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expense-date').value = today;
    }

    // Form Handlers
    handleAddExpense() {
        const expense = {
            title: document.getElementById('expense-title').value,
            categoryId: parseInt(document.getElementById('expense-category').value),
            amount: parseFloat(document.getElementById('expense-amount').value),
            date: document.getElementById('expense-date').value,
            notes: document.getElementById('expense-notes').value
        };

        this.addExpense(expense);
        document.getElementById('add-expense-form').reset();
        this.setCurrentDate();
        this.renderDashboard();
        
        alert('✓ Expense added successfully!');
    }

    // Analytics Functions
    getCurrentMonthExpenses() {
        const now = new Date();
        return this.expenses.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() === now.getMonth() && 
                   expDate.getFullYear() === now.getFullYear();
        });
    }

    getTotalSpending() {
        return this.getCurrentMonthExpenses().reduce((sum, exp) => sum + exp.amount, 0);
    }

    getExpensesByCategory() {
        const current = this.getCurrentMonthExpenses();
        const byCategory = {};
        
        this.categories.forEach(cat => {
            byCategory[cat.id] = {
                name: cat.name,
                total: 0,
                count: 0,
                color: cat.color
            };
        });

        current.forEach(exp => {
            if (byCategory[exp.categoryId]) {
                byCategory[exp.categoryId].total += exp.amount;
                byCategory[exp.categoryId].count += 1;
            }
        });

        return byCategory;
    }

    getCategoryName(categoryId) {
        const cat = this.categories.find(c => c.id === categoryId);
        return cat ? cat.name : 'Unknown';
    }

    // Render Functions
    renderDashboard() {
        const currentExpenses = this.getCurrentMonthExpenses();
        const totalSpending = this.getTotalSpending();
        const byCategory = this.getExpensesByCategory();
        const today = new Date();

        // Update header
        document.getElementById('month-display').textContent = 
            today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

        // Current spending
        document.getElementById('current-spending').textContent = 
            totalSpending.toFixed(2);

        // Budget status
        const remaining = Math.max(0, this.budget - totalSpending);
        document.getElementById('budget-total').textContent = this.budget.toFixed(2);
        document.getElementById('budget-spent').textContent = totalSpending.toFixed(2);
        document.getElementById('budget-remaining').textContent = remaining.toFixed(2);

        // Quick stats
        document.getElementById('total-transactions').textContent = currentExpenses.length;
        
        const daysInMonth = today.getDate();
        const avgDaily = (totalSpending / daysInMonth).toFixed(2);
        document.getElementById('daily-average').textContent = avgDaily;

        const highest = currentExpenses.length > 0 
            ? Math.max(...currentExpenses.map(e => e.amount)).toFixed(2)
            : '0.00';
        document.getElementById('highest-transaction').textContent = highest;

        // Category breakdown
        const breakdown = document.getElementById('category-breakdown');
        breakdown.innerHTML = '';
        
        Object.values(byCategory).forEach(cat => {
            if (cat.total > 0) {
                const percentage = ((cat.total / totalSpending) * 100).toFixed(1);
                const item = document.createElement('div');
                item.className = 'breakdown-item';
                item.innerHTML = `
                    <span class="breakdown-label">${cat.name}</span>
                    <span class="breakdown-value">₹${cat.total.toFixed(2)} (${percentage}%)</span>
                `;
                breakdown.appendChild(item);
            }
        });

        // Recent transactions
        this.renderRecentTransactions(currentExpenses.slice(-10).reverse());
    }

    renderRecentTransactions(transactions) {
        const tbody = document.getElementById('recent-transactions');
        tbody.innerHTML = '';

        if (transactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No transactions yet</td></tr>';
            return;
        }

        transactions.forEach(exp => {
            const row = document.createElement('tr');
            const expDate = new Date(exp.date);
            const catName = this.getCategoryName(exp.categoryId);
            
            row.innerHTML = `
                <td>${expDate.toLocaleDateString()}</td>
                <td>${exp.title}</td>
                <td><span class="tag">${catName}</span></td>
                <td>₹${exp.amount.toFixed(2)}</td>
                <td>
                    <button class="btn btn-small btn-secondary" onclick="app.editExpenseModal('${exp.id}')">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="app.deleteExpenseHandler('${exp.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderAnalytics() {
        const currentExpenses = this.getCurrentMonthExpenses();
        const totalSpending = this.getTotalSpending();
        const byCategory = this.getExpensesByCategory();

        if (currentExpenses.length === 0) {
            document.getElementById('category-analysis').innerHTML = 
                '<p class="no-data">No expenses this month</p>';
            return;
        }

        // Total spending
        document.getElementById('analytics-total').textContent = totalSpending.toFixed(2);

        // Avg/day
        const today = new Date();
        const avgDaily = (totalSpending / today.getDate()).toFixed(2);
        document.getElementById('analytics-avg-day').textContent = avgDaily;

        // Highest/Lowest
        const highest = Math.max(...currentExpenses.map(e => e.amount)).toFixed(2);
        const lowest = Math.min(...currentExpenses.map(e => e.amount)).toFixed(2);
        document.getElementById('analytics-highest').textContent = highest;
        document.getElementById('analytics-lowest').textContent = lowest;

        // Category analysis
        const catAnalysis = document.getElementById('category-analysis');
        catAnalysis.innerHTML = '';
        
        Object.values(byCategory).forEach(cat => {
            if (cat.total > 0) {
                const percentage = ((cat.total / totalSpending) * 100).toFixed(1);
                const avg = (cat.total / cat.count).toFixed(2);
                const item = document.createElement('div');
                item.className = 'breakdown-item';
                item.innerHTML = `
                    <span>${cat.name}</span>
                    <span class="breakdown-value">${cat.count}x ₹${cat.total.toFixed(2)}</span>
                `;
                catAnalysis.appendChild(item);
            }
        });

        // Draw charts
        this.drawCharts(byCategory);
    }

    drawCharts(byCategory) {
        // Simple chart rendering using canvas
        const categories = [];
        const amounts = [];
        const colors = [];

        Object.values(byCategory).forEach(cat => {
            if (cat.total > 0) {
                categories.push(cat.name);
                amounts.push(cat.total);
                colors.push(cat.color);
            }
        });

        // Pie Chart
        const pieCanvas = document.getElementById('pie-chart');
        if (pieCanvas) {
            this.drawPieChart(pieCanvas, categories, amounts, colors);
        }

        // Line Chart (monthly trend)
        const lineCanvas = document.getElementById('line-chart');
        if (lineCanvas) {
            this.drawLineChart(lineCanvas);
        }
    }

    drawPieChart(canvas, labels, data, colors) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;
        const radius = Math.min(width, height) / 2 - 20;
        const cx = width / 2;
        const cy = height / 2;

        const total = data.reduce((a, b) => a + b, 0);
        let currentAngle = -Math.PI / 2;

        data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            // Draw slice
            ctx.fillStyle = colors[index];
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();

            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelRadius = radius * 0.65;
            const labelX = cx + Math.cos(labelAngle) * labelRadius;
            const labelY = cy + Math.sin(labelAngle) * labelRadius;

            const percentage = ((value / total) * 100).toFixed(0);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(percentage + '%', labelX, labelY);

            currentAngle += sliceAngle;
        });

        // Legend
        ctx.font = '12px Arial';
        ctx.fillStyle = '#333';
        let legendY = 10;
        labels.forEach((label, index) => {
            ctx.fillStyle = colors[index];
            ctx.fillRect(width - 120, legendY, 12, 12);
            ctx.fillStyle = '#333';
            ctx.textAlign = 'left';
            ctx.fillText(label, width - 105, legendY + 10);
            legendY += 20;
        });
    }

    drawLineChart(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;

        // Get last 6 months data
        const months = [];
        const totals = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            
            const monthKey = date.toLocaleDateString('en-IN', { month: 'short' });
            months.push(monthKey);

            const monthExpenses = this.expenses.filter(exp => {
                const expDate = new Date(exp.date);
                return expDate.getMonth() === date.getMonth() && 
                       expDate.getFullYear() === date.getFullYear();
            });

            const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            totals.push(total);
        }

        const maxTotal = Math.max(...totals, 1);
        const padding = 40;
        const graphWidth = width - 2 * padding;
        const graphHeight = height - 2 * padding;

        // Draw background
        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(padding, padding, graphWidth, graphHeight);
        ctx.strokeStyle = '#ddd';
        ctx.strokeRect(padding, padding, graphWidth, graphHeight);

        // Draw grid lines
        ctx.strokeStyle = '#eee';
        ctx.font = '12px Arial';
        ctx.fillStyle = '#999';
        ctx.textAlign = 'right';

        for (let i = 0; i <= 5; i++) {
            const y = padding + (graphHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + graphWidth, y);
            ctx.stroke();

            const value = Math.round((maxTotal / 5) * (5 - i));
            ctx.fillText('₹' + value, padding - 10, y + 4);
        }

        // Draw line chart
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();

        totals.forEach((total, index) => {
            const x = padding + (graphWidth / (totals.length - 1)) * index;
            const y = padding + graphHeight - (total / maxTotal) * graphHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw points
        ctx.fillStyle = '#000';
        totals.forEach((total, index) => {
            const x = padding + (graphWidth / (totals.length - 1)) * index;
            const y = padding + graphHeight - (total / maxTotal) * graphHeight;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Draw x-axis labels
        ctx.fillStyle = '#999';
        ctx.textAlign = 'center';
        ctx.font = '12px Arial';
        months.forEach((month, index) => {
            const x = padding + (graphWidth / (months.length - 1)) * index;
            ctx.fillText(month, x, height - 15);
        });
    }

    renderReports() {
        const currentExpenses = this.getCurrentMonthExpenses();
        const totalSpending = this.getTotalSpending();
        const byCategory = this.getExpensesByCategory();

        if (currentExpenses.length === 0) {
            document.getElementById('report-content').innerHTML = 
                '<p class="no-data">No expenses this month</p>';
            return;
        }

        let html = '<div class="breakdown-item"><strong>Month:</strong> ';
        const today = new Date();
        html += today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) + '</div>';

        html += '<div class="breakdown-item"><strong>Total Spending:</strong> ₹' + totalSpending.toFixed(2) + '</div>';
        html += '<div class="breakdown-item"><strong>Transactions:</strong> ' + currentExpenses.length + '</div>';

        html += '<hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">';
        html += '<div style="margin-bottom: 10px;"><strong>Category Summary:</strong></div>';

        Object.values(byCategory).forEach(cat => {
            if (cat.total > 0) {
                const percentage = ((cat.total / totalSpending) * 100).toFixed(1);
                html += `<div class="breakdown-item">
                    <span>${cat.name}</span>
                    <span>₹${cat.total.toFixed(2)} (${percentage}%)</span>
                </div>`;
            }
        });

        // Insights
        html += '<hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">';
        html += '<div style="margin-bottom: 10px;"><strong>Insights:</strong></div>';

        const topCategory = Object.values(byCategory).reduce((max, cat) => 
            cat.total > max.total ? cat : max, { total: 0 });

        if (topCategory.total > 0) {
            const percentage = ((topCategory.total / totalSpending) * 100).toFixed(0);
            html += `<div class="breakdown-item">• ${topCategory.name} accounts for ${percentage}% of spending</div>`;
        }

        const avgDaily = (totalSpending / today.getDate()).toFixed(2);
        html += `<div class="breakdown-item">• Daily average spending: ₹${avgDaily}</div>`;
        html += `<div class="breakdown-item">• Budget utilization: ${((totalSpending / this.budget) * 100).toFixed(1)}%</div>`;

        document.getElementById('report-content').innerHTML = html;
    }

    renderHistory() {
        const tbody = document.getElementById('history-expenses');
        tbody.innerHTML = '';

        if (this.expenses.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No expenses recorded</td></tr>';
            return;
        }

        const sorted = [...this.expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

        sorted.forEach(exp => {
            const expDate = new Date(exp.date);
            const catName = this.getCategoryName(exp.categoryId);
            const month = expDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expDate.toLocaleDateString()}</td>
                <td>${exp.title}</td>
                <td><span class="tag">${catName}</span></td>
                <td>₹${exp.amount.toFixed(2)}</td>
                <td>${month}</td>
                <td>
                    <button class="btn btn-small btn-secondary" onclick="app.editExpenseModal('${exp.id}')">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="app.deleteExpenseHandler('${exp.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Action handlers
    deleteExpenseHandler(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.deleteExpense(id);
            this.renderDashboard();
            this.renderHistory();
        }
    }

    editExpenseModal(id) {
        alert('Edit feature coming soon. You can delete and re-add for now.');
    }
}

// Initialize app
const app = new ExpenseTracker();

// Global functions for button clicks
function saveBudget() {
    const budget = parseFloat(document.getElementById('budget-setting').value);
    if (budget > 0) {
        app.budget = budget;
        app.saveData();
        alert('✓ Budget updated to ₹' + budget.toFixed(2));
        app.renderDashboard();
    } else {
        alert('Please enter a valid budget amount');
    }
}

function exportData() {
    const data = {
        expenses: app.expenses,
        categories: app.categories,
        budget: app.budget,
        exportedAt: new Date().toISOString()
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    downloadFile(blob, 'expenses-backup.json');
}

function exportPDF() {
    alert('PDF export feature requires additional library. You can copy the report content above.');
}

function clearAllData() {
    if (confirm('WARNING: This will delete ALL expenses. Are you sure?')) {
        if (confirm('This action cannot be undone. Click OK to confirm.')) {
            app.expenses = [];
            app.saveData();
            location.reload();
        }
    }
}

function generateReport() {
    app.renderReports();
}

function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Add CSS for active page
const style = document.createElement('style');
style.textContent = `
    .page {
        display: none;
    }
    .page.active {
        display: block;
    }
`;
document.head.appendChild(style);
