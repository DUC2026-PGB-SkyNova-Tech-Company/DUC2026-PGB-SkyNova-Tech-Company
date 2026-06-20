const express = require('express');
const router = express.Router();
const { User, Transaction, Branch } = require('../models');
const moment = require('moment-timezone');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const { period = 'today' } = req.query;
    
    // Calculate date range
    const now = moment().tz('Asia/Phnom_Penh');
    let startDate;
    
    switch (period) {
      case 'today':
        startDate = now.startOf('day');
        break;
      case 'week':
        startDate = now.startOf('week');
        break;
      case 'month':
        startDate = now.startOf('month');
        break;
      default:
        startDate = now.startOf('day');
    }

    // Get all transactions in period
    const transactions = await Transaction.getAll();
    const periodTransactions = transactions.filter(tx => 
      moment(tx.timestamp).isAfter(startDate)
    );

    // Calculate statistics
    const totalRevenue = periodTransactions.reduce((sum, tx) => sum + (tx.amountUSD || 0), 0);
    const totalTransactions = periodTransactions.length;
    const khqrPayments = periodTransactions.filter(tx => tx.paymentMethod === 'KHQR').length;
    const cashPayments = periodTransactions.filter(tx => tx.paymentMethod === 'Cash').length;

    // Calculate previous period for comparison
    const previousStartDate = startDate.clone().subtract(1, period === 'today' ? 'day' : period === 'week' ? 'week' : 'month');
    const previousTransactions = transactions.filter(tx => 
      moment(tx.timestamp).isBetween(previousStartDate, startDate)
    );
    const previousRevenue = previousTransactions.reduce((sum, tx) => sum + (tx.amountUSD || 0), 0);
    
    const revenueChange = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
      : 0;
    
    const transactionsChange = previousTransactions.length > 0
      ? ((totalTransactions - previousTransactions.length) / previousTransactions.length * 100).toFixed(1)
      : 0;

    // Generate revenue trend data
    const revenueData = generateRevenueData(periodTransactions, period);

    res.json({
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      revenueChange: parseFloat(revenueChange),
      totalTransactions,
      transactionsChange: parseFloat(transactionsChange),
      khqrPayments,
      khqrPercentage: totalTransactions > 0 ? parseFloat((khqrPayments / totalTransactions * 100).toFixed(1)) : 0,
      cashPayments,
      cashPercentage: totalTransactions > 0 ? parseFloat((cashPayments / totalTransactions * 100).toFixed(1)) : 0,
      revenueData
    });

  } catch (error) {
    console.error('Stats API error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all branches with stats
router.get('/branches', async (req, res) => {
  try {
    const branches = await Branch.getAll();
    const transactions = await Transaction.getAll();

    // Calculate stats for each branch
    const branchesWithStats = branches.map(branch => {
      const branchTransactions = transactions.filter(tx => tx.branchId === branch.id);
      const revenue = branchTransactions.reduce((sum, tx) => sum + (tx.amountUSD || 0), 0);

      return {
        ...branch,
        revenue: parseFloat(revenue.toFixed(2)),
        transactions: branchTransactions.length
      };
    });

    res.json(branchesWithStats);

  } catch (error) {
    console.error('Branches API error:', error);
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

// Get recent transactions
router.get('/transactions/recent', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const transactions = await Transaction.getAll();
    const branches = await Branch.getAll();

    // Sort by timestamp descending and limit
    const recentTransactions = transactions
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit))
      .map(tx => {
        const branch = branches.find(b => b.id === tx.branchId);
        return {
          ...tx,
          branchName: branch ? branch.name : 'Unknown Branch'
        };
      });

    res.json(recentTransactions);

  } catch (error) {
    console.error('Transactions API error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get all transactions with filters
router.get('/transactions', async (req, res) => {
  try {
    const { branchId, paymentMethod, startDate, endDate } = req.query;
    let transactions = await Transaction.getAll();

    // Apply filters
    if (branchId) {
      transactions = transactions.filter(tx => tx.branchId === branchId);
    }
    if (paymentMethod) {
      transactions = transactions.filter(tx => tx.paymentMethod === paymentMethod);
    }
    if (startDate) {
      transactions = transactions.filter(tx => 
        moment(tx.timestamp).isAfter(moment(startDate))
      );
    }
    if (endDate) {
      transactions = transactions.filter(tx => 
        moment(tx.timestamp).isBefore(moment(endDate))
      );
    }

    // Sort by timestamp descending
    transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(transactions);

  } catch (error) {
    console.error('Transactions filter API error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Helper function to generate revenue trend data
function generateRevenueData(transactions, period) {
  const labels = [];
  const values = [];

  if (period === 'today') {
    // Hourly data for today
    for (let i = 0; i < 24; i++) {
      labels.push(`${i}:00`);
      const hourTransactions = transactions.filter(tx => 
        moment(tx.timestamp).hour() === i
      );
      const revenue = hourTransactions.reduce((sum, tx) => sum + (tx.amountUSD || 0), 0);
      values.push(parseFloat(revenue.toFixed(2)));
    }
  } else if (period === 'week') {
    // Daily data for the week
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < 7; i++) {
      const dayStart = moment().tz('Asia/Phnom_Penh').startOf('week').add(i, 'days');
      labels.push(days[dayStart.day()]);
      const dayTransactions = transactions.filter(tx => 
        moment(tx.timestamp).isSame(dayStart, 'day')
      );
      const revenue = dayTransactions.reduce((sum, tx) => sum + (tx.amountUSD || 0), 0);
      values.push(parseFloat(revenue.toFixed(2)));
    }
  } else if (period === 'month') {
    // Weekly data for the month
    const weeksInMonth = Math.ceil(moment().daysInMonth() / 7);
    for (let i = 0; i < weeksInMonth; i++) {
      labels.push(`Week ${i + 1}`);
      const weekStart = moment().tz('Asia/Phnom_Penh').startOf('month').add(i * 7, 'days');
      const weekEnd = weekStart.clone().add(7, 'days');
      const weekTransactions = transactions.filter(tx => 
        moment(tx.timestamp).isBetween(weekStart, weekEnd)
      );
      const revenue = weekTransactions.reduce((sum, tx) => sum + (tx.amountUSD || 0), 0);
      values.push(parseFloat(revenue.toFixed(2)));
    }
  }

  return { labels, values };
}

module.exports = router;
