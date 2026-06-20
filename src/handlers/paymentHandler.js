const { Transaction, Branch, User } = require('../models/simpleDB');
const moment = require('moment-timezone');

async function recordPayment(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Check if user has selected a branch
  const user = await User.findByTelegramId(userId);
  
  if (!user || !user.currentBranchId) {
    await bot.sendMessage(chatId, 
      '⚠️ Please select your branch first using /branch command.'
    );
    return;
  }
  
  await bot.sendMessage(chatId, 
    '💰 **Record New Payment**\n\n' +
    'Please send payment details in this format:\n' +
    '`AMOUNT DESCRIPTION`\n\n' +
    '**Examples:**\n' +
    '• `25000 2x Fried Rice, 1x Coke`\n' +
    '• `15000 Noodle Soup`\n' +
    '• `50000 Mixed order`\n\n' +
    'Or send a screenshot of KHQR payment.',
    { parse_mode: 'Markdown' }
  );
}

async function handlePhotoUpload(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  try {
    // Check if user has selected a branch
    const user = await User.findByTelegramId(userId);
    
    if (!user || !user.currentBranchId) {
      await bot.sendMessage(chatId, 
        '⚠️ Please select your branch first using /branch command.'
      );
      return;
    }
    
    await bot.sendMessage(chatId, '⏳ Processing your payment screenshot...');
    
    // Get the highest resolution photo
    const photo = msg.photo[msg.photo.length - 1];
    const fileId = photo.file_id;
    
    // Store photo reference
    const branch = await Branch.findById(user.currentBranchId);
    
    await bot.sendMessage(chatId, 
      `📸 Screenshot received for **${branch.name}**\n\n` +
      '📝 Please provide payment details:\n\n' +
      'Format: `AMOUNT DESCRIPTION`\n' +
      'Example: `25000 2x Fried Rice`\n\n' +
      'Or use /cancel to cancel',
      { parse_mode: 'Markdown' }
    );
    
    // Store photo file_id temporarily (in production, use session management)
    // For now, we'll handle text input in the next message
    
  } catch (error) {
    console.error('Error processing photo:', error);
    await bot.sendMessage(chatId, 
      '❌ Error processing image. Please try again or use /record to enter details manually.'
    );
  }
}

async function handlePaymentText(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;
  
  try {
    // Check if user has selected a branch
    const user = await User.findByTelegramId(userId);
    
    if (!user || !user.currentBranchId) {
      return; // Not a payment entry
    }
    
    // Parse payment: "AMOUNT DESCRIPTION"
    const parts = text.trim().split(/\s+/);
    const amount = parseFloat(parts[0]);
    
    if (isNaN(amount) || amount <= 0) {
      return; // Not a valid payment format
    }
    
    const description = parts.slice(1).join(' ') || 'Payment';
    const branch = await Branch.findById(user.currentBranchId);
    const timestamp = moment().tz('Asia/Phnom_Penh');
    
    // Ask for payment method
    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📱 QR Payment', callback_data: `method_${amount}_${user.currentBranchId}_${encodeURIComponent(description)}_QR` },
            { text: '💵 Cash Payment', callback_data: `method_${amount}_${user.currentBranchId}_${encodeURIComponent(description)}_CASH` }
          ],
          [
            { text: '❌ Cancel', callback_data: 'confirm_cancel' }
          ]
        ]
      }
    };
    
    const { formatBothCurrencies } = require('../utils/currencyUtils');
    const amounts = formatBothCurrencies(amount);
    
    const invoice = `
╔═══════════════════════════════╗
║       PAYMENT CONFIRMATION     ║
╚═══════════════════════════════╝

🏢 **Company:** DUC2026-PGB-SkyNova-Tech
🏪 **Branch:** ${branch.name}
👤 **Staff:** ${msg.from.first_name || 'Staff'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 **Amount:** ${amounts.khr}
💵 **Amount (USD):** ${amounts.usd}
📝 **Description:** ${description}
📅 **Date:** ${timestamp.format('DD/MM/YYYY')}
🕐 **Time:** ${timestamp.format('HH:mm:ss')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Select Payment Method:**
    `;
    
    await bot.sendMessage(chatId, invoice, { parse_mode: 'Markdown', ...keyboard });
    
  } catch (error) {
    console.error('Error handling payment text:', error);
  }
}

async function confirmPayment(bot, query) {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;
  
  try {
    if (data === 'confirm_cancel') {
      await bot.answerCallbackQuery(query.id, { text: 'Cancelled' });
      await bot.sendMessage(chatId, '❌ Payment recording cancelled.');
      return;
    }
    
    // Parse confirmation data: confirm_AMOUNT_BRANCHID_DESCRIPTION_METHOD
    const parts = data.replace('confirm_', '').split('_');
    const amount = parseFloat(parts[0]);
    const branchId = parseInt(parts[1]);
    const description = decodeURIComponent(parts[2]);
    const paymentMethod = parts[3] || 'CASH';
    
    // Save transaction
    const transaction = await Transaction.create({
      amount: amount,
      currency: 'KHR',
      description: description,
      branchId: branchId,
      userId: userId,
      paymentMethod: paymentMethod,
      verificationStatus: 'verified'
    });
    
    const branch = await Branch.findById(branchId);
    const timestamp = moment().tz('Asia/Phnom_Penh');
    const { formatBothCurrencies } = require('../utils/currencyUtils');
    const amounts = formatBothCurrencies(amount);
    
    // Payment method icon
    const methodIcon = paymentMethod === 'QR' ? '📱' : '💵';
    const methodText = paymentMethod === 'QR' ? 'QR Payment' : 'Cash Payment';
    
    // Generate invoice receipt
    const receipt = `
╔═══════════════════════════════╗
║         PAYMENT RECEIPT        ║
╚═══════════════════════════════╝

🏢 **DUC2026-PGB-SkyNova-Tech Company**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 **Transaction ID:** #${transaction.id}
🏪 **Branch:** ${branch.name}
👤 **Staff:** ${query.from.first_name || 'Staff'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 **Description:** ${description}
💰 **Amount (KHR):** ${amounts.khr}
💵 **Amount (USD):** ${amounts.usd}
${methodIcon} **Payment Method:** ${methodText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 **Date:** ${timestamp.format('DD/MM/YYYY')}
🕐 **Time:** ${timestamp.format('HH:mm:ss')}
✅ **Status:** PAID

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for your payment!
Use /daily to see today's summary.

╚═══════════════════════════════╝
    `;
    
    await bot.answerCallbackQuery(query.id, { text: '✅ Payment recorded!' });
    await bot.sendMessage(chatId, receipt, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error confirming payment:', error);
    await bot.answerCallbackQuery(query.id, { text: 'Error saving payment' });
    await bot.sendMessage(chatId, '❌ Error saving payment. Please try again.');
  }
}

async function handlePaymentMethod(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;
  
  try {
    // Parse method data: method_AMOUNT_BRANCHID_DESCRIPTION_METHOD
    const parts = data.replace('method_', '').split('_');
    const amount = parseFloat(parts[0]);
    const branchId = parseInt(parts[1]);
    const description = decodeURIComponent(parts[2]);
    const paymentMethod = parts[3];
    
    // Show final confirmation
    const branch = await Branch.findById(branchId);
    const { formatBothCurrencies } = require('../utils/currencyUtils');
    const amounts = formatBothCurrencies(amount);
    const methodIcon = paymentMethod === 'QR' ? '📱' : '💵';
    const methodText = paymentMethod === 'QR' ? 'QR Payment' : 'Cash Payment';
    
    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Confirm', callback_data: `confirm_${amount}_${branchId}_${encodeURIComponent(description)}_${paymentMethod}` },
            { text: '❌ Cancel', callback_data: 'confirm_cancel' }
          ]
        ]
      }
    };
    
    await bot.answerCallbackQuery(query.id, { text: `Selected: ${methodText}` });
    await bot.sendMessage(chatId,
      `${methodIcon} **${methodText} Selected**\n\n` +
      `🏪 Branch: ${branch.name}\n` +
      `💰 Amount: ${amounts.khr}\n` +
      `💵 Amount: ${amounts.usd}\n` +
      `📝 Description: ${description}\n\n` +
      `Confirm this payment?`,
      { parse_mode: 'Markdown', ...keyboard }
    );
    
  } catch (error) {
    console.error('Error handling payment method:', error);
    await bot.answerCallbackQuery(query.id, { text: 'Error processing' });
  }
}

module.exports = {
  recordPayment,
  handlePhotoUpload,
  handlePaymentText,
  confirmPayment,
  handlePaymentMethod
};
