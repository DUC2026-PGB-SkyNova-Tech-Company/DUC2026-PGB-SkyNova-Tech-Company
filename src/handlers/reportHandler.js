const { Transaction, Branch } = require('../models/simpleDB');
const moment = require('moment-timezone');

async function generateReport(bot, msg) {
  const chatId = msg.chat.id;
  
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📅 Today', callback_data: 'report_today' },
          { text: '📆 This Week', callback_data: 'report_week' }
        ],
        [
          { text: '📊 This Month', callback_data: 'report_month' },
          { text: '🏪 By Branch', callback_data: 'report_branch' }
        ]
      ]
    }
  };
  
  await bot.sendMessage(chatId, '📊 Select report type:', keyboard);
}

async function dailyReport(bot, msg) {
  const chatId = msg.chat.id;
  
  try {
    const today = moment().tz('Asia/Phnom_Penh').startOf('day').toDate();
    
    const transactions = await Transaction.findAll({
      where: { createdAt: { $gte: today } },
      includeBranch: true
    });
    
    if (transactions.length === 0) {
      await bot.sendMessage(chatId, '📭 No transactions recorded today.');
      return;
    }
    
    const { formatBothCurrencies } = require('../utils/currencyUtils');
    
    // Calculate totals
    const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const qrTransactions = transactions.filter(t => t.paymentMethod === 'QR');
    const cashTransactions = transactions.filter(t => t.paymentMethod === 'CASH');
    
    const qrTotal = qrTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const cashTotal = cashTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const branchTotals = {};
    
    transactions.forEach(t => {
      const branchName = t.Branch?.name || 'Unknown';
      if (!branchTotals[branchName]) {
        branchTotals[branchName] = { amount: 0, count: 0, qr: 0, cash: 0 };
      }
      branchTotals[branchName].amount += parseFloat(t.amount);
      branchTotals[branchName].count += 1;
      if (t.paymentMethod === 'QR') {
        branchTotals[branchName].qr += parseFloat(t.amount);
      } else {
        branchTotals[branchName].cash += parseFloat(t.amount);
      }
    });
    
    const totalAmounts = formatBothCurrencies(totalAmount);
    const qrAmounts = formatBothCurrencies(qrTotal);
    const cashAmounts = formatBothCurrencies(cashTotal);
    
    let report = `╔═══════════════════════════════╗\n`;
    report += `║      DAILY SALES REPORT       ║\n`;
    report += `╚═══════════════════════════════╝\n\n`;
    report += `📅 **Date:** ${moment().tz('Asia/Phnom_Penh').format('DD/MM/YYYY')}\n\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    report += `💰 **TOTAL SALES**\n`;
    report += `   ${totalAmounts.khr}\n`;
    report += `   ${totalAmounts.usd}\n`;
    report += `   📝 Transactions: ${transactions.length}\n\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    report += `📱 **QR PAYMENTS**\n`;
    report += `   ${qrAmounts.khr}\n`;
    report += `   ${qrAmounts.usd}\n`;
    report += `   📝 Count: ${qrTransactions.length}\n\n`;
    report += `💵 **CASH PAYMENTS**\n`;
    report += `   ${cashAmounts.khr}\n`;
    report += `   ${cashAmounts.usd}\n`;
    report += `   📝 Count: ${cashTransactions.length}\n\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    report += `🏪 **BY BRANCH:**\n\n`;
    
    for (const [branch, data] of Object.entries(branchTotals)) {
      const branchAmounts = formatBothCurrencies(data.amount);
      report += `**${branch}**\n`;
      report += `   Total: ${branchAmounts.khr} / ${branchAmounts.usd}\n`;
      report += `   📱 QR: ${formatBothCurrencies(data.qr).khr}\n`;
      report += `   💵 Cash: ${formatBothCurrencies(data.cash).khr}\n`;
      report += `   📝 Transactions: ${data.count}\n\n`;
    }
    
    await bot.sendMessage(chatId, report, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error generating daily report:', error);
    await bot.sendMessage(chatId, '❌ Error generating report. Please try again.');
  }
}

async function handleReportType(bot, query) {
  const chatId = query.message.chat.id;
  const reportType = query.data.replace('report_', '');
  
  await bot.answerCallbackQuery(query.id, { text: 'Generating report...' });
  
  // Generate specific report based on type
  // Implementation similar to dailyReport but with different date ranges
  
  await bot.sendMessage(chatId, `📊 ${reportType} report will be generated here.`);
}

module.exports = {
  generateReport,
  dailyReport,
  handleReportType
};
