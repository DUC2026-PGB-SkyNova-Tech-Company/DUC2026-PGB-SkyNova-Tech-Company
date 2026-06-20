require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const { initDatabase } = require('./models/simpleDB');
const { registerHandlers } = require('./handlers');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Check if bot token is configured
if (!process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN === 'your_telegram_bot_token_here') {
  console.error('❌ TELEGRAM_BOT_TOKEN not configured!');
  console.log('\n📝 Please follow these steps:');
  console.log('1. Open Telegram and search for @BotFather');
  console.log('2. Send /newbot and follow instructions');
  console.log('3. Copy the token and add it to .env file');
  console.log('4. Update TELEGRAM_BOT_TOKEN in .env\n');
  process.exit(1);
}

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Initialize database
initDatabase().then(() => {
  console.log('✅ Database initialized');
}).catch(err => {
  console.error('❌ Database initialization failed:', err);
  process.exit(1);
});

// Register bot command handlers
registerHandlers(bot);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api', apiRoutes);

// Express webhook endpoint (optional, for production)
app.use(express.json());
app.post('/webhook/bakong', async (req, res) => {
  // Handle Bakong webhook notifications
  const { handleBakongWebhook } = require('./services/bakongService');
  await handleBakongWebhook(req.body, bot);
  res.sendStatus(200);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Dashboard available at http://localhost:${PORT}`);
  console.log('🤖 Telegram bot is active');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  bot.stopPolling();
  process.exit(0);
});
