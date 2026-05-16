# 🌐 Multi-Device Access Guide

## 🎯 Goal

Run bot on ONE device 24/7, but allow multiple devices to access the same database for testing and development.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   MongoDB Atlas (Cloud)                  │
│              Centralized Database Storage                │
└─────────────────────────────────────────────────────────┘
                            ↕
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   Device 1    │   │   Device 2    │   │   Device 3    │
│  (Main Server)│   │  (Developer)  │   │  (Testing)    │
│               │   │               │   │               │
│ ✅ Bot Running│   │ ❌ Bot OFF    │   │ ❌ Bot OFF    │
│ ✅ 24/7 Active│   │ ✅ DB Access  │   │ ✅ DB Access  │
└───────────────┘   └───────────────┘   └───────────────┘
```

---

## 📋 Setup Instructions

### Device 1: Main Server (Runs Bot 24/7)

#### Step 1: Clone Repository
```bash
git clone https://github.com/DUC2026-PGB-SkyNova-Tech-Company/DUC2026-PGB-SkyNova-Tech-Company.git
cd DUC2026-PGB-SkyNova-Tech-Company
```

#### Step 2: Install Dependencies
```bash
npm install
npm install -g pm2
```

#### Step 3: Configure .env
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
USE_MONGODB=true
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bakong-bot
BRANCHES=SkyNova-Tech-Company A,SkyNova-Tech-Company B,SkyNova-Tech-Company C
```

#### Step 4: Start Bot 24/7
```bash
npm run pm2:start
```

#### Step 5: Verify
```bash
pm2 status
pm2 logs bakong-bot
```

---

### Device 2, 3, 4...: Development/Testing

#### Step 1: Clone Repository
```bash
git clone https://github.com/DUC2026-PGB-SkyNova-Tech-Company/DUC2026-PGB-SkyNova-Tech-Company.git
cd DUC2026-PGB-SkyNova-Tech-Company
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Configure .env (SAME MongoDB URI!)
```env
# DON'T add bot token (we won't run the bot)
USE_MONGODB=true
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bakong-bot
```

#### Step 4: Access Database
You can now:
- View transactions
- Generate reports
- Export data
- Test features

**DON'T run `npm start` or `npm run pm2:start`!**

---

## 🔑 MongoDB Atlas Setup (One Time)

### Step 1: Create Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free)
3. Verify email

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose "FREE" (M0)
3. Select region (closest to you)
4. Click "Create"
5. Wait 3-5 minutes

### Step 3: Create Database User
1. Click "Database Access"
2. Click "Add New Database User"
3. Username: `bakong-admin`
4. Password: Generate strong password
5. Click "Add User"

### Step 4: Whitelist IPs
1. Click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Click "Database" → "Connect"
2. Choose "Connect your application"
3. Copy connection string:
   ```
   mongodb+srv://bakong-admin:<password>@cluster0.xxxxx.mongodb.net/bakong-bot
   ```
4. Replace `<password>` with your actual password

---

## 📊 Testing from Multiple Devices

### Scenario 1: View Transactions

**Device 2 (Developer):**
```javascript
// test-db.js
require('dotenv').config();
process.env.USE_MONGODB = 'true';

const { Transaction } = require('./src/models');

async function test() {
  const transactions = await Transaction.find().limit(10);
  console.log('Latest transactions:', transactions);
}

test();
```

Run:
```bash
node test-db.js
```

### Scenario 2: Generate Report

**Device 3 (Manager):**
```javascript
// generate-report.js
require('dotenv').config();
process.env.USE_MONGODB = 'true';

const { Transaction, Branch } = require('./src/models');
const moment = require('moment-timezone');

async function generateReport() {
  const today = moment().startOf('day').toDate();
  const transactions = await Transaction.find({
    createdAt: { $gte: today }
  }).populate('branchId');
  
  console.log(`Today's transactions: ${transactions.length}`);
  // ... more report logic
}

generateReport();
```

### Scenario 3: Export Data

**Device 4 (Accountant):**
```javascript
// export-data.js
require('dotenv').config();
process.env.USE_MONGODB = 'true';

const { Transaction } = require('./src/models');
const fs = require('fs');

async function exportToCSV() {
  const transactions = await Transaction.find().populate('branchId');
  
  let csv = 'ID,Date,Branch,Amount,Method\n';
  transactions.forEach(t => {
    csv += `${t._id},${t.createdAt},${t.branchId.name},${t.amount},${t.paymentMethod}\n`;
  });
  
  fs.writeFileSync('export.csv', csv);
  console.log('Exported to export.csv');
}

exportToCSV();
```

---

## ⚠️ Important Rules

### ✅ DO:
- Use SAME MongoDB URI on all devices
- Only run bot on ONE device
- Test database access on other devices
- Keep .env file secure
- Backup MongoDB regularly

### ❌ DON'T:
- Run bot on multiple devices simultaneously
- Share bot token publicly
- Commit .env to git
- Use different MongoDB URIs
- Forget to whitelist IPs

---

## 🔍 Monitoring

### From Main Server (Device 1):
```bash
# Check bot status
pm2 status

# View logs
pm2 logs bakong-bot

# Monitor resources
pm2 monit

# Check health
curl http://localhost:3000/health
```

### From Any Device:
```bash
# Test MongoDB connection
node -e "require('mongoose').connect('YOUR_MONGODB_URI').then(() => console.log('✅ Connected')).catch(err => console.error('❌ Failed:', err))"
```

---

## 🚨 Troubleshooting

### Problem: Can't connect to MongoDB from Device 2

**Solution:**
1. Check MongoDB Atlas IP whitelist
2. Verify connection string is correct
3. Test internet connection
4. Check firewall settings

### Problem: Bot running on multiple devices

**Solution:**
1. Stop bot on all devices: `pm2 stop bakong-bot`
2. Choose ONE device as main server
3. Start bot only on that device: `npm run pm2:start`

### Problem: Data not syncing

**Solution:**
1. Verify all devices use SAME MongoDB URI
2. Check MongoDB Atlas status
3. Verify network connectivity
4. Check MongoDB logs

---

## 📈 Best Practices

### For Main Server:
```
✅ Use reliable internet
✅ Keep computer running 24/7
✅ Enable auto-start on boot
✅ Monitor logs daily
✅ Keep Node.js updated
```

### For Development Devices:
```
✅ Pull latest code regularly
✅ Test in development mode
✅ Don't run bot
✅ Use read-only database access
✅ Report issues to main server admin
```

---

## 🎯 Summary

**Main Server (Device 1):**
- Runs bot 24/7 with PM2
- Connects to MongoDB
- Handles all Telegram messages

**Other Devices (2, 3, 4...):**
- Connect to SAME MongoDB
- Access data for testing/reports
- DON'T run the bot

**Result:**
- ✅ Bot runs 24/7
- ✅ Data accessible everywhere
- ✅ Team can collaborate
- ✅ No conflicts

---

**Ready to go multi-device!** 🚀
