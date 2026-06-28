/**
 * reportService.js — Business logic for all sales reports
 *
 * All heavy calculation, aggregation, and formatting rules live here.
 * Handlers are only responsible for receiving Telegram messages and
 * calling these service functions — no business logic belongs in handlers.
 */

const { Transaction, Branch } = require('../models/simpleDB');
const moment = require('moment-timezone');
const { formatBothCurrencies } = require('../utils/currencyUtils');

const TZ = 'Asia/Phnom_Penh';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Fetch all transactions within a date range, with branch data attached.
 * @param {Date} startDate
 * @param {Date|null} endDate  defaults to now
 */
async function fetchTransactionsInRange(startDate, endDate = null) {
  const all = await Transaction.findAll({ includeBranch: true });
  return all.filter(t => {
    const d = new Date(t.createdAt);
    const afterStart = d >= startDate;
    const beforeEnd = endDate ? d < endDate : true;
    return afterStart && beforeEnd;
  });
}

/**
 * Sum the amount field across an array of transactions.
 */
function sumAmount(transactions) {
  return transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
}

/**
 * Group transactions by branchName and return an object keyed by name.
 */
function groupByBranch(transactions) {
  const groups = {};
  transactions.forEach(t => {
    const name = t.Branch?.name || 'Unknown';
    if (!groups[name]) groups[name] = { amount: 0, count: 0, qr: 0, cash: 0 };
    groups[name].amount += parseFloat(t.amount || 0);
    groups[name].count += 1;
    if (t.paymentMethod === 'QR') {
      groups[name].qr += parseFloat(t.amount || 0);
    } else {
      groups[name].cash += parseFloat(t.amount || 0);
    }
  });
  return groups;
}

// ─── Report builders ─────────────────────────────────────────────────────────

/**
 * Build the Daily Sales Report message string.
 */
async function buildDailyReport() {
  const todayStart = moment().tz(TZ).startOf('day').toDate();
  const transactions = await fetchTransactionsInRange(todayStart);

  if (transactions.length === 0) {
    return { text: '📭 No transactions recorded today.', empty: true };
  }

  const totalAmount = sumAmount(transactions);
  const qrTxns   = transactions.filter(t => t.paymentMethod === 'QR');
  const cashTxns  = transactions.filter(t => t.paymentMethod === 'CASH');
  const qrTotal   = sumAmount(qrTxns);
  const cashTotal = sumAmount(cashTxns);
  const branchGroups = groupByBranch(transactions);

  const totalFmt = formatBothCurrencies(totalAmount);
  const qrFmt    = formatBothCurrencies(qrTotal);
  const cashFmt  = formatBothCurrencies(cashTotal);

  let msg = `╔═══════════════════════════════╗\n`;
  msg += `║      DAILY SALES REPORT       ║\n`;
  msg += `╚═══════════════════════════════╝\n\n`;
  msg += `📅 **Date:** ${moment().tz(TZ).format('DD/MM/YYYY')}\n\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `💰 **TOTAL SALES**\n`;
  msg += `   ${totalFmt.khr}\n`;
  msg += `   ${totalFmt.usd}\n`;
  msg += `   📝 Transactions: ${transactions.length}\n\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `📱 **QR PAYMENTS**\n`;
  msg += `   ${qrFmt.khr} (${qrTxns.length} txns)\n\n`;
  msg += `💵 **CASH PAYMENTS**\n`;
  msg += `   ${cashFmt.khr} (${cashTxns.length} txns)\n\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `🏪 **BY BRANCH:**\n\n`;

  for (const [name, data] of Object.entries(branchGroups)) {
    const bf = formatBothCurrencies(data.amount);
    msg += `**${name}**\n`;
    msg += `   Total: ${bf.khr} / ${bf.usd}\n`;
    msg += `   📱 QR: ${formatBothCurrencies(data.qr).khr}\n`;
    msg += `   💵 Cash: ${formatBothCurrencies(data.cash).khr}\n`;
    msg += `   📝 ${data.count} transactions\n\n`;
  }

  return { text: msg, empty: false };
}

/**
 * Build the Weekly Analytics Report message string.
 */
async function buildWeeklyReport() {
  const weekStart = moment().tz(TZ).startOf('week').toDate();
  const transactions = await fetchTransactionsInRange(weekStart);

  if (transactions.length === 0) {
    return { text: '📭 No transactions this week.', empty: true };
  }

  const totalAmount = sumAmount(transactions);
  const totalFmt = formatBothCurrencies(totalAmount);

  // Build day-by-day breakdown
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayTotals = {};
  dayNames.forEach(d => (dayTotals[d] = 0));
  transactions.forEach(t => {
    const d = moment(t.createdAt).tz(TZ).format('ddd');
    dayTotals[d] = (dayTotals[d] || 0) + parseFloat(t.amount || 0);
  });

  const qrTotal   = sumAmount(transactions.filter(t => t.paymentMethod === 'QR'));
  const cashTotal = sumAmount(transactions.filter(t => t.paymentMethod === 'CASH'));
  const branchGroups = groupByBranch(transactions);

  let msg = `╔═══════════════════════════════╗\n`;
  msg += `║      WEEKLY ANALYTICS         ║\n`;
  msg += `╚═══════════════════════════════╝\n\n`;
  msg += `📅 Week of ${moment().tz(TZ).startOf('week').format('DD/MM/YYYY')}\n\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `💰 **TOTAL:** ${totalFmt.khr} / ${totalFmt.usd}\n`;
  msg += `📝 **Transactions:** ${transactions.length}\n`;
  msg += `📱 QR: ${formatBothCurrencies(qrTotal).khr}  |  💵 Cash: ${formatBothCurrencies(cashTotal).khr}\n\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `📊 **DAILY BREAKDOWN:**\n\n`;

  for (const day of dayNames) {
    const amt = dayTotals[day] || 0;
    const bar = amt > 0 ? '▓'.repeat(Math.min(10, Math.ceil(amt / (totalAmount / 10)))) : '░';
    msg += `${day}: ${formatBothCurrencies(amt).khr}\n${bar}\n\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `🏪 **BY BRANCH:**\n\n`;
  for (const [name, data] of Object.entries(branchGroups)) {
    msg += `**${name}:** ${formatBothCurrencies(data.amount).khr} (${data.count} txns)\n`;
  }

  return { text: msg, empty: false };
}

/**
 * Build the Monthly Analytics Report message string.
 */
async function buildMonthlyReport() {
  const monthStart = moment().tz(TZ).startOf('month').toDate();
  const transactions = await fetchTransactionsInRange(monthStart);

  if (transactions.length === 0) {
    return { text: '📭 No transactions this month.', empty: true };
  }

  const totalAmount = sumAmount(transactions);
  const qrTxns    = transactions.filter(t => t.paymentMethod === 'QR');
  const cashTxns  = transactions.filter(t => t.paymentMethod === 'CASH');
  const qrTotal   = sumAmount(qrTxns);
  const cashTotal = sumAmount(cashTxns);

  const branchGroups = groupByBranch(transactions);
  const topBranch = Object.entries(branchGroups).sort((a, b) => b[1].amount - a[1].amount)[0];

  const daysInMonth = moment().tz(TZ).daysInMonth();
  const weeksInMonth = Math.ceil(daysInMonth / 7);

  // Weekly breakdown
  const weeklyData = [];
  for (let i = 0; i < weeksInMonth; i++) {
    const wStart = moment().tz(TZ).startOf('month').add(i * 7, 'days').toDate();
    const wEnd   = moment().tz(TZ).startOf('month').add((i + 1) * 7, 'days').toDate();
    const wTxns  = transactions.filter(t => {
      const d = new Date(t.createdAt);
      return d >= wStart && d < wEnd;
    });
    weeklyData.push({ week: i + 1, amount: sumAmount(wTxns), count: wTxns.length });
  }

  const totalFmt = formatBothCurrencies(totalAmount);
  const avgPerDay = totalAmount / daysInMonth;
  const avgPerTxn = transactions.length > 0 ? totalAmount / transactions.length : 0;

  let msg = `╔═══════════════════════════════╗\n`;
  msg += `║     MONTHLY ANALYTICS         ║\n`;
  msg += `╚═══════════════════════════════╝\n\n`;
  msg += `📅 ${moment().tz(TZ).format('MMMM YYYY')}\n\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `💰 **TOTAL SALES**\n`;
  msg += `   ${totalFmt.khr}\n`;
  msg += `   ${totalFmt.usd}\n`;
  msg += `   📝 ${transactions.length} transactions\n\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `📱 **QR:** ${formatBothCurrencies(qrTotal).khr} (${qrTxns.length} txns)\n`;
  msg += `💵 **Cash:** ${formatBothCurrencies(cashTotal).khr} (${cashTxns.length} txns)\n\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `📊 **WEEKLY BREAKDOWN:**\n\n`;
  for (const w of weeklyData) {
    msg += `Week ${w.week}: ${formatBothCurrencies(w.amount).khr} (${w.count} txns)\n`;
  }
  msg += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `🏆 **TOP BRANCH:** ${topBranch ? topBranch[0] : 'N/A'}\n`;
  if (topBranch) msg += `   ${formatBothCurrencies(topBranch[1].amount).khr}\n`;
  msg += `\n📈 **AVERAGES**\n`;
  msg += `   Per day: ${formatBothCurrencies(avgPerDay).khr}\n`;
  msg += `   Per transaction: ${formatBothCurrencies(avgPerTxn).khr}\n`;

  return { text: msg, empty: false };
}

/**
 * Build the By-Branch Report message string.
 */
async function buildBranchReport() {
  const branches = await Branch.findAll();
  const allTxns  = await Transaction.findAll({ includeBranch: true });

  if (allTxns.length === 0) {
    return { text: '📭 No transactions recorded yet.', empty: true };
  }

  const totalAmount = sumAmount(allTxns);

  let msg = `╔═══════════════════════════════╗\n`;
  msg += `║      BY-BRANCH REPORT         ║\n`;
  msg += `╚═══════════════════════════════╝\n\n`;
  msg += `📅 All-time | ${moment().tz(TZ).format('DD/MM/YYYY')}\n\n`;

  for (const branch of branches) {
    const txns = allTxns.filter(t => t.branchId === branch.id);
    const amt  = sumAmount(txns);
    const pct  = totalAmount > 0 ? ((amt / totalAmount) * 100).toFixed(1) : '0.0';
    const qrAmt   = sumAmount(txns.filter(t => t.paymentMethod === 'QR'));
    const cashAmt = sumAmount(txns.filter(t => t.paymentMethod === 'CASH'));

    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🏪 **${branch.name}**\n`;
    msg += `   Total: ${formatBothCurrencies(amt).khr} (${pct}%)\n`;
    msg += `   📱 QR: ${formatBothCurrencies(qrAmt).khr}\n`;
    msg += `   💵 Cash: ${formatBothCurrencies(cashAmt).khr}\n`;
    msg += `   📝 Transactions: ${txns.length}\n\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 **GRAND TOTAL:** ${formatBothCurrencies(totalAmount).khr}\n`;

  return { text: msg, empty: false };
}

module.exports = {
  buildDailyReport,
  buildWeeklyReport,
  buildMonthlyReport,
  buildBranchReport
};
