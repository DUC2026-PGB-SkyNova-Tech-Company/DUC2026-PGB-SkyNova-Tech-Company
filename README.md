# Bakong-Integrated Micro-Vendor Bot

A Telegram bot for tracking KHQR payments across multiple street food/retail branches in Phnom Penh.

## 🎯 Problem Solved
- **Eliminates manual screenshot sharing** in group chats
- **Automated sales reconciliation** across branches
- **Real-time payment tracking** via Bakong integration
- **No more reconciliation nightmares** for franchise owners

## ✨ Features
- 🤖 **Telegram bot interface** for staff
- 💰 **KHQR payment recording** with photo support
- 📊 **Branch-wise sales tracking**
- 📈 **Real-time reporting and reconciliation**
- 🔐 **Secure payment verification**
- 📱 **Mobile-friendly** - works on any device with Telegram

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Telegram account
- Internet connection

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DUC2026-PGB-SkyNova-Tech-Company/bakong-vendor-bot.git
   cd bakong-vendor-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a Telegram Bot**
   - Open Telegram and search for `@BotFather`
   - Send `/newbot` command
   - Follow instructions to create your bot
   - Copy the bot token you receive

4. **Configure environment**
   ```bash
   # Copy the example env file
   copy .env.example .env
   
   # Edit .env and add your bot token
   # TELEGRAM_BOT_TOKEN=your_actual_token_here
   ```

5. **Configure branches**
   Edit `.env` and set your branches:
   ```
   BRANCHES=Central Market,Russian Market,Olympic Market
   ```

6. **Run the bot**
   ```bash
   npm start
   ```

## 📖 How to Use

### For Staff (Branch Workers)

1. **Start the bot**
   - Open Telegram
   - Search for your bot name
   - Send `/start`

2. **Select your branch**
   - Click "🏪 Select Branch" or send `/branch`
   - Choose your branch from the list

3. **Record a payment**
   - Click "📸 Record Payment" or send `/record`
   - Enter payment details: `AMOUNT DESCRIPTION`
   - Example: `25000 2x Fried Rice, 1x Coke`
   - Or send a screenshot of KHQR payment

4. **View daily summary**
   - Click "📅 Daily Summary" or send `/daily`

### For Owners/Managers

1. **View reports**
   - Send `/report` to see report options
   - Choose from:
     - 📅 Today's sales
     - 📆 This week
     - 📊 This month
     - 🏪 By branch

2. **Daily reconciliation**
   - Send `/daily` anytime to see:
     - Total sales
     - Number of transactions
     - Sales by branch

## 💡 Usage Examples

### Recording a Payment
```
Staff: 25000 Fried rice and drink
Bot: ✅ Payment Recorded Successfully!
     🆔 Transaction ID: #123
     🏪 Branch: Central Market
     💰 Amount: 25,000 KHR
     📝 Description: Fried rice and drink
```

### Daily Report
```
Owner: /daily
Bot: 📅 Daily Sales Report
     Date: 15/05/2026
     
     💰 Total Sales: 450,000 KHR
     📝 Transactions: 18
     
     🏪 By Branch:
     • Central Market: 200,000 KHR (8 txns)
     • Russian Market: 150,000 KHR (6 txns)
     • Olympic Market: 100,000 KHR (4 txns)
```

## 🏗️ Project Structure

```
/DUC2026-PGB-SkyNova-Tech-Company
├── .github/                    # GitHub templates
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── src/                        # Source code
│   ├── handlers/               # Telegram command handlers
│   │   ├── startHandler.js
│   │   ├── branchHandler.js
│   │   ├── paymentHandler.js
│   │   └── reportHandler.js
│   ├── models/                 # Data models
│   │   └── simpleDB.js        # JSON-based database
│   ├── services/               # External services
│   │   └── bakongService.js
│   ├── utils/                  # Helper functions
│   │   ├── authUtils.js
│   │   └── qrUtils.js
│   └── app.js                  # Main entry point
├── data/                       # Database files (auto-created)
├── tests/                      # Tests
├── .env.example                # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token from @BotFather | ✅ Yes |
| `BAKONG_API_URL` | Bakong API endpoint | ⚠️ Optional |
| `BAKONG_API_KEY` | Bakong API key | ⚠️ Optional |
| `BRANCHES` | Comma-separated branch names | ✅ Yes |
| `PORT` | Server port (default: 3000) | ❌ No |

### Branch Configuration

Edit `.env` file:
```env
BRANCHES=Branch A,Branch B,Branch C,Branch D
```

## 📊 Data Storage

The bot uses a simple JSON-based database stored in the `data/` folder:
- `branches.json` - Branch information
- `users.json` - User/staff information
- `transactions.json` - Payment records

**Backup**: Simply copy the `data/` folder to backup all your data.

## 🛠️ Development

### Run in development mode
```bash
npm run dev
```

### Run tests
```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

**SkyNova Tech Company**
- DUC2026 Project
- Phnom Penh, Cambodia

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Contact: [Your contact information]

## 🎓 Project Context

This bot was developed to solve a real business problem faced by street food franchises in Phnom Penh:
- **Before**: Staff manually send KHQR payment screenshots to group chats
- **Problem**: Reconciliation is a nightmare for owners
- **After**: Automated tracking with instant reports and reconciliation

---

Made with ❤️ by SkyNova Tech Company
