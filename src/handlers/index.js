const startHandler = require('./startHandler');
const paymentHandler = require('./paymentHandler');
const reportHandler = require('./reportHandler');
const branchHandler = require('./branchHandler');
const adminHandler = require('./adminHandler');
const analyticsHandler = require('./analyticsHandler');

function registerHandlers(bot) {
  // Command handlers
  bot.onText(/\/start/, (msg) => startHandler(bot, msg));
  bot.onText(/\/help/, (msg) => startHandler(bot, msg));
  bot.onText(/\/record/, (msg) => paymentHandler.recordPayment(bot, msg));
  bot.onText(/\/report/, (msg) => reportHandler.generateReport(bot, msg));
  bot.onText(/\/daily/, (msg) => reportHandler.dailyReport(bot, msg));
  bot.onText(/\/weekly/, (msg) => analyticsHandler.weeklyAnalytics(bot, msg));
  bot.onText(/\/monthly/, (msg) => analyticsHandler.monthlyAnalytics(bot, msg));
  bot.onText(/\/branch/, (msg) => branchHandler.selectBranch(bot, msg));
  bot.onText(/\/admin/, (msg) => adminHandler.adminPanel(bot, msg));
  
  // Text button handlers
  bot.onText(/📸 Record Payment/, (msg) => paymentHandler.recordPayment(bot, msg));
  bot.onText(/📊 View Reports/, (msg) => reportHandler.generateReport(bot, msg));
  bot.onText(/🏪 Select Branch/, (msg) => branchHandler.selectBranch(bot, msg));
  bot.onText(/📅 Daily Summary/, (msg) => reportHandler.dailyReport(bot, msg));
  bot.onText(/❓ Help/, (msg) => startHandler(bot, msg));
  
  // Callback query handler for inline buttons
  bot.on('callback_query', async (query) => {
    const data = query.data;
    
    if (data.startsWith('branch_')) {
      await branchHandler.handleBranchSelection(bot, query);
    } else if (data.startsWith('method_')) {
      await paymentHandler.handlePaymentMethod(bot, query);
    } else if (data.startsWith('confirm_')) {
      await paymentHandler.confirmPayment(bot, query);
    } else if (data.startsWith('report_')) {
      await reportHandler.handleReportType(bot, query);
    } else if (data.startsWith('admin_')) {
      await adminHandler.handleAdminCallback(bot, query);
    }
  });
  
  // Handle photo uploads (KHQR screenshots)
  bot.on('photo', (msg) => paymentHandler.handlePhotoUpload(bot, msg));
  
  // Handle text messages for payment input
  bot.on('message', (msg) => {
    // Skip if it's a command, photo, or button text
    if (msg.text && !msg.text.startsWith('/') && !msg.text.includes('📸') && !msg.text.includes('📊') && !msg.text.includes('🏪') && !msg.text.includes('📅') && !msg.text.includes('❓')) {
      paymentHandler.handlePaymentText(bot, msg);
    }
  });
  
  console.log('✅ All handlers registered');
}

module.exports = { registerHandlers };
