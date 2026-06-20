const { Branch, User, Transaction } = require('../models/simpleDB');
const { isAdmin } = require('../utils/authUtils');
const moment = require('moment-timezone');
const { formatBothCurrencies } = require('../utils/currencyUtils');

async function adminPanel(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, '❌ Access denied. Admin only.');
    return;
  }
  
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📊 Statistics', callback_data: 'admin_stats' },
          { text: '👥 Users', callback_data: 'admin_users' }
        ],
        [
          { text: '🏪 Branches', callback_data: 'admin_branches' },
          { text: '💰 All Transactions', callback_data: 'admin_transactions' }
        ],
        [
          { text: '📥 Export Data', callback_data: 'admin_export' },
          { text: '🔄 Backup', callback_data: 'admin_backup' }
        ]
      ]
    }
  };
  
  await bot.sendMessage(chatId, 
    '🔐 **Admin Panel**\n\n' +
    'Select an option:',
    { parse_mode: 'Markdown', ...keyboard }
  );
}

async function showStatistics(bot, query) {
  const chatId = query.message.chat.id;
  
  try {
    const transactions = await Transaction.findAll({ includeBranch: true });
    const users = await User.findAll();
    const branches = await Branch.findAll();
    
    const today = moment().tz('Asia/Phnom_Penh').startOf('day').toDate();
    const todayTransactions = transactions.filter(t => new Date(t.createdAt) >= today);
    
    const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const todayAmount = todayTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const qrCount = transactions.filter(t => t.paymentMethod === 'QR').length;
    const cashCount = transactions.filter(t => t.paymentMethod === 'CASH').length;
    
    const totalAmounts = formatBothCurrencies(totalAmount);
    const todayAmounts = formatBothCurrencies(todayAmount);
    
    const stats = `
╔═══════════════════════════════╗
║       SYSTEM STATISTICS       ║
╚═══════════════════════════════╝

📊 **OVERVIEW**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👥 **Users:** ${users.length}
🏪 **Branches:** ${branches.length}
📝 **Total Transactions:** ${transactions.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 **ALL-TIME SALES**
   ${totalAmounts.khr}
   ${totalAmounts.usd}

📅 **TODAY'S SALES**
   ${todayAmounts.khr}
   ${todayAmounts.usd}
   📝 Transactions: ${todayTransactions.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 **PAYMENT METHODS**
   QR Payments: ${qrCount} (${((qrCount/transactions.length)*100).toFixed(1)}%)
   Cash Payments: ${cashCount} (${((cashCount/transactions.length)*100).toFixed(1)}%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 **AVERAGES**
   Avg per transaction: ${formatBothCurrencies(totalAmount/transactions.length).khr}
   Avg per day: ${formatBothCurrencies(totalAmount/30).khr}

╚═══════════════════════════════╝
    `;
    
    await bot.answerCallbackQuery(query.id);
    await bot.sendMessage(chatId, stats, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error showing statistics:', error);
    await bot.answerCallbackQuery(query.id, { text: 'Error loading stats' });
  }
}

async function showUsers(bot, query) {
  const chatId = query.message.chat.id;
  
  try {
    const users = await User.findAll();
    const branches = await Branch.findAll();
    
    let userList = '👥 **REGISTERED USERS**\n\n';
    
    for (const user of users) {
      const branch = branches.find(b => b.id === user.currentBranchId);
      userList += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      userList += `👤 **${user.firstName || 'User'}**\n`;
      userList += `   ID: ${user.telegramId}\n`;
      userList += `   Username: @${user.username || 'N/A'}\n`;
      userList += `   Branch: ${branch?.name || 'Not set'}\n`;
      userList += `   Admin: ${user.isAdmin ? '✅' : '❌'}\n\n`;
    }
    
    await bot.answerCallbackQuery(query.id);
    await bot.sendMessage(chatId, userList, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error showing users:', error);
    await bot.answerCallbackQuery(query.id, { text: 'Error loading users' });
  }
}

async function showBranches(bot, query) {
  const chatId = query.message.chat.id;
  
  try {
    const branches = await Branch.findAll();
    const transactions = await Transaction.findAll({ includeBranch: true });
    
    let branchList = '🏪 **BRANCH OVERVIEW**\n\n';
    
    for (const branch of branches) {
      const branchTxns = transactions.filter(t => t.branchId === branch.id);
      const branchTotal = branchTxns.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const amounts = formatBothCurrencies(branchTotal);
      
      branchList += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      branchList += `🏪 **${branch.name}**\n`;
      branchList += `   Location: ${branch.location}\n`;
      branchList += `   Status: ${branch.isActive ? '✅ Active' : '❌ Inactive'}\n`;
      branchList += `   Total Sales: ${amounts.khr}\n`;
      branchList += `   Transactions: ${branchTxns.length}\n\n`;
    }
    
    await bot.answerCallbackQuery(query.id);
    await bot.sendMessage(chatId, branchList, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error showing branches:', error);
    await bot.answerCallbackQuery(query.id, { text: 'Error loading branches' });
  }
}

async function exportData(bot, query) {
  const chatId = query.message.chat.id;
  
  try {
    const transactions = await Transaction.findAll({ includeBranch: true });
    
    // Create CSV format
    let csv = 'Transaction ID,Date,Time,Branch,Amount (KHR),Amount (USD),Payment Method,Description,Staff\n';
    
    transactions.forEach(t => {
      const date = moment(t.createdAt).tz('Asia/Phnom_Penh');
      const amounts = formatBothCurrencies(t.amount);
      csv += `${t.id},`;
      csv += `${date.format('DD/MM/YYYY')},`;
      csv += `${date.format('HH:mm:ss')},`;
      csv += `"${t.Branch?.name || 'Unknown'}",`;
      csv += `${t.amount},`;
      csv += `${amounts.usdRaw.toFixed(2)},`;
      csv += `${t.paymentMethod || 'CASH'},`;
      csv += `"${t.description}",`;
      csv += `${t.userId}\n`;
    });
    
    // Send as file
    await bot.answerCallbackQuery(query.id, { text: 'Generating export...' });
    await bot.sendDocument(chatId, Buffer.from(csv), {
      filename: `transactions_${moment().format('YYYY-MM-DD')}.csv`,
      caption: '📥 Transaction Export\n\nOpen with Excel or Google Sheets'
    });
    
  } catch (error) {
    console.error('Error exporting data:', error);
    await bot.answerCallbackQuery(query.id, { text: 'Error exporting data' });
  }
}

async function handleAdminCallback(bot, query) {
  const action = query.data.replace('admin_', '');
  
  switch (action) {
    case 'stats':
      await showStatistics(bot, query);
      break;
    case 'users':
      await showUsers(bot, query);
      break;
    case 'branches':
      await showBranches(bot, query);
      break;
    case 'export':
      await exportData(bot, query);
      break;
    case 'backup':
      await bot.answerCallbackQuery(query.id, { text: 'Backup feature coming soon!' });
      break;
    default:
      await bot.answerCallbackQuery(query.id);
  }
}

module.exports = {
  adminPanel,
  handleAdminCallback
};
