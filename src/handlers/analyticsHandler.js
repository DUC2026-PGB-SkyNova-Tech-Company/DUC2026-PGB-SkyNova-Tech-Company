const { Transaction, Branch } = require('../models/simpleDB');
const moment = require('moment-timezone');
const { formatBothCurrencies } = require('../utils/currencyUtils');

/**
 * Generate weekly analytics
 */
async function weeklyAnalytics(bot, msg) {
  const chatId = msg.chat.id;
  
  try {
    const weekStart = moment().tz('Asia/Phnom_Penh').startOf('week').toDate();
    const transactions = await Transaction.findAll({
      where: { createdAt: { $gte: weekStart } },
      includeBranch: true
    });
    
    if (transactions.length === 0) {
      await bot.sendMessage(chatId, '📭 No transactions this week.');
      return;
    }
    
    // Group by day
    const dayTotals = {};
    for (let i = 0; i < 7; i++) {
      const day = moment().tz('Asia/Phnom_Penh').startOf('week').add(i, 'days');
      dayTotals[day.format('ddd')] = 0;
    }
    
    transactions.forEach(t => {
      const day = moment(t.createdAt).tz('Asia/Phnom_Penh').format('ddd');
      dayTotals[day] += parseFloat(t.amount);
    });
    
    const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const amounts = formatBothCurrencies(totalAmount);
    
    let report = `╔═══════════════════════════════╗\n`;
    report += `║      WEEKLY ANALYTICS         ║\n`;
    report += `╚═══════════════════════════════╝\n\n`;
    report += `📅 Week: ${moment().tz('Asia/Phnom_Penh').format('DD/MM/YYYY')}\n\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    report += `💰 **TOTAL:** ${amounts.khr} / ${amounts.usd}\n`;
    report += `📝 **Transactions:** ${transactions.length}\n\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    report += `📊 **DAILY BREAKDOWN:**\n\n`;
    
    for (const [day, amount] of Object.entries(dayTotals)) {
      const dayAmounts = formatBothCurrencies(amount);
      const bar = '█'.repeat(Math.floor(amount / (totalAmount / 20)));
      report += `${day}: ${dayAmounts.khr}\n${bar}\n\n`;
    }
    
    await bot.sendMessage(chatId, report, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error generating weekly analytics:', error);
    await bot.sendMessage(chatId, '❌ Error generating analytics.');
  }
}

/**
 * Generate monthly analytics
 */
async function monthlyAnalytics(bot, msg) {
  const chatId = msg.chat.id;
  
  try {
    const monthStart = moment().tz('Asia/Phnom_Penh').startOf('month').toDate();
    const transactions = await Transaction.findAll({
      where: { createdAt: { $gte: monthStart } },
      includeBranch: true
    });
    
    if (transactions.length === 0) {
      await bot.sendMessage(chatId, '📭 No transactions this month.');
      return;
    }
    
    const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const qrTotal = transactions.filter(t => t.paymentMethod === 'QR').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const cashTotal = transactions.filter(t => t.paymentMethod === 'CASH').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const amounts = formatBothCurrencies(totalAmount);
    const qrAmounts = formatBothCurrencies(qrTotal);
    const cashAmounts = formatBothCurrencies(cashTotal);
    
    // Top branch
    const branchTotals = {};
    transactions.forEach(t => {
      const branchName = t.Branch?.name || 'Unknown';
      branchTotals[branchName] = (branchTotals[branchName] || 0) + parseFloat(t.amount);
    });
    
    const topBranch = Object.entries(branchTotals).sort((a, b) => b[1] - a[1])[0];
    
    let report = `╔═══════════════════════════════╗\n`;
    report += `║     MONTHLY ANALYTICS         ║\n`;
    report += `╚═══════════════════════════════╝\n\n`;
    report += `📅 Month: ${moment().tz('Asia/Phnom_Penh').format('MMMM YYYY')}\n\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    report += `💰 **TOTAL SALES**\n`;
    report += `   ${amounts.khr}\n`;
    report += `   ${amounts.usd}\n`;
    report += `   📝 ${transactions.length} transactions\n\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    report += `📱 **QR:** ${qrAmounts.khr} (${((qrTotal/totalAmount)*100).toFixed(1)}%)\n`;
    report += `💵 **Cash:** ${cashAmounts.khr} (${((cashTotal/totalAmount)*100).toFixed(1)}%)\n\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    report += `🏆 **TOP BRANCH**\n`;
    report += `   ${topBranch[0]}\n`;
    report += `   ${formatBothCurrencies(topBranch[1]).khr}\n\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    report += `📈 **AVERAGES**\n`;
    report += `   Per day: ${formatBothCurrencies(totalAmount/30).khr}\n`;
    report += `   Per transaction: ${formatBothCurrencies(totalAmount/transactions.length).khr}\n`;
    
    await bot.sendMessage(chatId, report, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error generating monthly analytics:', error);
    await bot.sendMessage(chatId, '❌ Error generating analytics.');
  }
}

module.exports = {
  weeklyAnalytics,
  monthlyAnalytics
};
