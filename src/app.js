require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const db = require('./models');
const { registerHandlers } = require('./handlers');

const app = express();

// Enable CORS for API access
app.use(cors());
app.use(express.json());

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
async function initializeApp() {
  try {
    if (process.env.USE_MONGODB === 'true') {
      await db.connectDatabase();
    } else {
      await db.initDatabase();
    }
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
  }
}

// Register bot command handlers
registerHandlers(bot);

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
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: process.env.USE_MONGODB === 'true' ? 'MongoDB' : 'JSON',
    botActive: true
  });
});

// API endpoint to get statistics
app.get('/api/stats', async (req, res) => {
  try {
    const { Transaction, Branch, User } = db;
    
    const totalTransactions = await (Transaction.countDocuments ? Transaction.countDocuments() : Promise.resolve((await Transaction.findAll()).length));
    const totalBranches = await (Branch.countDocuments ? Branch.countDocuments() : Promise.resolve((await Branch.findAll()).length));
    const totalUsers = await (User.countDocuments ? User.countDocuments() : Promise.resolve((await User.findAll()).length));
    
    res.json({
      success: true,
      data: {
        transactions: totalTransactions,
        branches: totalBranches,
        users: totalUsers,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

// Start server and bot
async function startServer() {
  await initializeApp();
  
  // Register bot command handlers
  registerHandlers(bot);
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`📊 API Stats: http://localhost:${PORT}/api/stats`);
    console.log('🤖 Telegram bot is active');
    console.log(`📊 Database: ${process.env.USE_MONGODB === 'true' ? 'MongoDB (Cloud)' : 'JSON (Local)'}`);
    console.log('\n✅ Bot is running 24/7!');
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  bot.stopPolling();
  process.exit(0);
});
