// API Base URL
const API_BASE = window.location.origin;

// Global state
let currentPeriod = 'today';
let revenueChart = null;
let paymentMethodChart = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    loadDashboardData();
    setupEventListeners();
    
    // Auto-refresh every 30 seconds
    setInterval(loadDashboardData, 30000);
});

// Setup event listeners
function setupEventListeners() {
    // Time period buttons
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentPeriod = e.target.dataset.period;
            loadDashboardData();
        });
    });

    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
        loadDashboardData();
    });

    // View all buttons
    document.getElementById('viewAllBranches')?.addEventListener('click', () => {
        alert('Branch details page coming soon!');
    });

    document.getElementById('viewAllTransactions')?.addEventListener('click', () => {
        alert('Transaction history page coming soon!');
    });
}

// Load dashboard data
async function loadDashboardData() {
    showLoading(true);
    
    try {
        const [stats, branches, transactions] = await Promise.all([
            fetchStats(currentPeriod),
            fetchBranches(),
            fetchRecentTransactions()
        ]);

        updateStats(stats);
        updateBranches(branches);
        updateTransactions(transactions);
        updateCharts(stats);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data');
    } finally {
        showLoading(false);
    }
}

// Fetch stats from API
async function fetchStats(period) {
    try {
        const response = await fetch(`${API_BASE}/api/stats?period=${period}`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        return await response.json();
    } catch (error) {
        console.error('Fetch stats error:', error);
        return getMockStats();
    }
}

// Fetch branches from API
async function fetchBranches() {
    try {
        const response = await fetch(`${API_BASE}/api/branches`);
        if (!response.ok) throw new Error('Failed to fetch branches');
        return await response.json();
    } catch (error) {
        console.error('Fetch branches error:', error);
        return getMockBranches();
    }
}

// Fetch recent transactions
async function fetchRecentTransactions() {
    try {
        const response = await fetch(`${API_BASE}/api/transactions/recent?limit=5`);
        if (!response.ok) throw new Error('Failed to fetch transactions');
        return await response.json();
    } catch (error) {
        console.error('Fetch transactions error:', error);
        return getMockTransactions();
    }
}

// Update stats cards
function updateStats(stats) {
    document.getElementById('totalRevenue').textContent = formatCurrency(stats.totalRevenue);
    document.getElementById('revenueChange').textContent = `${stats.revenueChange}%`;
    
    document.getElementById('totalTransactions').textContent = stats.totalTransactions;
    document.getElementById('transactionsChange').textContent = `${stats.transactionsChange}%`;
    
    document.getElementById('khqrPayments').textContent = stats.khqrPayments;
    document.getElementById('khqrPercentage').textContent = `${stats.khqrPercentage}%`;
    
    document.getElementById('cashPayments').textContent = stats.cashPayments;
    document.getElementById('cashPercentage').textContent = `${stats.cashPercentage}%`;
}

// Update branches list
function updateBranches(branches) {
    const container = document.getElementById('branchesList');
    
    if (!branches || branches.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No branches found</p>';
        return;
    }

    container.innerHTML = branches.map(branch => `
        <div class="branch-item">
            <div class="branch-info">
                <div class="branch-icon">
                    <i class="fas fa-store"></i>
                </div>
                <div class="branch-details">
                    <h4>${branch.name}</h4>
                    <p>${branch.location || 'Location not set'}</p>
                </div>
            </div>
            <div class="branch-stats">
                <div class="branch-revenue">${formatCurrency(branch.revenue || 0)}</div>
                <div class="branch-transactions">${branch.transactions || 0} transactions</div>
            </div>
        </div>
    `).join('');
}

// Update transactions list
function updateTransactions(transactions) {
    const container = document.getElementById('transactionsList');
    
    if (!transactions || transactions.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No recent transactions</p>';
        return;
    }

    container.innerHTML = transactions.map(tx => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon ${tx.paymentMethod === 'KHQR' ? 'khqr' : 'cash'}">
                    <i class="fas fa-${tx.paymentMethod === 'KHQR' ? 'qrcode' : 'money-bill-wave'}"></i>
                </div>
                <div class="transaction-details">
                    <h4>${tx.description || 'Payment'}</h4>
                    <p>${tx.branchName || 'Unknown Branch'} • ${tx.paymentMethod}</p>
                </div>
            </div>
            <div class="transaction-amount">
                <div class="amount">${formatCurrency(tx.amount)}</div>
                <div class="transaction-time">${formatTime(tx.timestamp)}</div>
            </div>
        </div>
    `).join('');
}

// Initialize charts
function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Revenue',
                data: [],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    // Payment Method Chart
    const paymentCtx = document.getElementById('paymentMethodChart').getContext('2d');
    paymentMethodChart = new Chart(paymentCtx, {
        type: 'doughnut',
        data: {
            labels: ['KHQR', 'Cash'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#4facfe', '#fa709a'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Update charts
function updateCharts(stats) {
    // Update revenue chart
    if (revenueChart && stats.revenueData) {
        revenueChart.data.labels = stats.revenueData.labels;
        revenueChart.data.datasets[0].data = stats.revenueData.values;
        revenueChart.update();
    }

    // Update payment method chart
    if (paymentMethodChart) {
        paymentMethodChart.data.datasets[0].data = [stats.khqrPayments || 0, stats.cashPayments || 0];
        paymentMethodChart.update();
    }
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

function showError(message) {
    console.error(message);
    // Could implement toast notification here
}

// Mock data functions (fallback when API is not available)
function getMockStats() {
    return {
        totalRevenue: 15847.50,
        revenueChange: 12.5,
        totalTransactions: 234,
        transactionsChange: 8.3,
        khqrPayments: 156,
        khqrPercentage: 66.7,
        cashPayments: 78,
        cashPercentage: 33.3,
        revenueData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            values: [1200, 1900, 1500, 2100, 1800, 2400, 2200]
        }
    };
}

function getMockBranches() {
    return [
        { id: 1, name: 'Downtown Branch', location: 'Phnom Penh', revenue: 5420, transactions: 89 },
        { id: 2, name: 'Mall Branch', location: 'Aeon Mall', revenue: 6230, transactions: 95 },
        { id: 3, name: 'Airport Branch', location: 'PNH Airport', revenue: 4197, transactions: 50 }
    ];
}

function getMockTransactions() {
    return [
        {
            id: 1,
            description: 'Coffee Purchase',
            amount: 3.50,
            paymentMethod: 'KHQR',
            branchName: 'Downtown Branch',
            timestamp: new Date(Date.now() - 300000)
        },
        {
            id: 2,
            description: 'Lunch Order',
            amount: 12.75,
            paymentMethod: 'Cash',
            branchName: 'Mall Branch',
            timestamp: new Date(Date.now() - 900000)
        },
        {
            id: 3,
            description: 'Retail Sale',
            amount: 45.00,
            paymentMethod: 'KHQR',
            branchName: 'Airport Branch',
            timestamp: new Date(Date.now() - 1800000)
        },
        {
            id: 4,
            description: 'Snack Purchase',
            amount: 5.25,
            paymentMethod: 'KHQR',
            branchName: 'Downtown Branch',
            timestamp: new Date(Date.now() - 3600000)
        },
        {
            id: 5,
            description: 'Book Sale',
            amount: 18.50,
            paymentMethod: 'Cash',
            branchName: 'Mall Branch',
            timestamp: new Date(Date.now() - 7200000)
        }
    ];
}
