/**
 * reportHandler.js — Telegram message routing for reports
 *
 * This file is intentionally thin. All business logic (calculations,
 * aggregations, formatting) lives in src/services/reportService.js.
 * This handler's only job is to receive Telegram events and delegate.
 */

const {
  buildDailyReport,
  buildWeeklyReport,
  buildMonthlyReport,
  buildBranchReport
} = require('../services/reportService');

/**
 * Show the report type selection keyboard.
 */
async function generateReport(bot, msg) {
  const chatId = msg.chat.id;

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📅 Today',     callback_data: 'report_today' },
          { text: '📆 This Week', callback_data: 'report_week'  }
        ],
        [
          { text: '📊 This Month', callback_data: 'report_month'  },
          { text: '🏪 By Branch',  callback_data: 'report_branch' }
        ]
      ]
    }
  };

  await bot.sendMessage(chatId, '📊 Select report type:', keyboard);
}

/**
 * Send today's sales report.
 */
async function dailyReport(bot, msg) {
  const chatId = msg.chat.id;
  try {
    const { text } = await buildDailyReport();
    await bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error generating daily report:', error);
    await bot.sendMessage(chatId, '❌ Error generating report. Please try again.');
  }
}

/**
 * Handle inline keyboard report type selection.
 * Immediately answers the callback to dismiss the Telegram spinner,
 * then fetches and sends the requested report.
 */
async function handleReportType(bot, query) {
  const chatId    = query.message.chat.id;
  const reportType = query.data.replace('report_', '');

  // Dismiss spinner immediately — required for graceful spinner resolution
  await bot.answerCallbackQuery(query.id, { text: 'Generating report...' });

  try {
    let result;
    switch (reportType) {
      case 'today':
        result = await buildDailyReport();
        break;
      case 'week':
        result = await buildWeeklyReport();
        break;
      case 'month':
        result = await buildMonthlyReport();
        break;
      case 'branch':
        result = await buildBranchReport();
        break;
      default:
        await bot.sendMessage(chatId, '❓ Unknown report type.');
        return;
    }

    await bot.sendMessage(chatId, result.text, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error handling report type:', error);
    await bot.sendMessage(chatId, '❌ Error generating report. Please try again.');
  }
}

module.exports = {
  generateReport,
  dailyReport,
  handleReportType
};
