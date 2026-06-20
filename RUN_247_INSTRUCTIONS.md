# 🚀 Run Your Bot 24/7 - Quick Guide

## ✨ Your Bot is Now Ready for 24/7 Operation!

---

## 🎯 Quick Start (3 Steps)

### Step 1: Make Sure .env is Configured
```bash
# Check if .env exists
# If not, copy from example:
copy .env.example .env

# Edit .env and add your bot token
notepad .env
```

### Step 2: Start Bot 24/7
**Double-click:** `start-247.bat`

Or run in terminal:
```bash
npm run pm2:start
```

### Step 3: Verify It's Running
```bash
pm2 status
```

You should see:
```
┌─────┬──────────────┬─────────┬─────────┐
│ id  │ name         │ status  │ uptime  │
├─────┼──────────────┼─────────┼─────────┤
│ 0   │ bakong-bot   │ online  │ 5s      │
└─────┴──────────────┴─────────┴─────────┘
```

**✅ Done! Your bot is now running 24/7!**

---

## 🎮 Control Your Bot

### Start Bot
```bash
# Option 1: Double-click
start-247.bat

# Option 2: Command
npm run pm2:start
```

### Stop Bot
```bash
# Option 1: Double-click
stop-247.bat

# Option 2: Command
npm run pm2:stop
```

### Restart Bot
```bash
npm run pm2:restart
```

### View Status
```bash
pm2 status
```

### View Logs (Real-time)
```bash
# Option 1: Command
npm run pm2:logs

# Option 2: Direct
pm2 logs bakong-bot

# Option 3: Last 100 lines
pm2 logs bakong-bot --lines 100
```

### Monitor (Live Dashboard)
```bash
# Option 1: Double-click
monitor.bat

# Option 2: Command
pm2 monit
```

---

## 🔄 Auto-Restart Features

Your bot will automatically:
- ✅ **Restart on crash** - If it crashes, PM2 restarts it immediately
- ✅ **Restart daily** - Automatically restarts at 3 AM every day
- ✅ **Memory management** - Restarts if memory exceeds 500MB
- ✅ **Run on system startup** - Starts when computer boots (after setup)

---

## 💻 Setup Auto-Start on Windows Boot

### Option 1: Using pm2-windows-startup (Recommended)
```bash
# Install (already done if you used start-247.bat)
npm install -g pm2-windows-startup

# Setup startup
pm2-startup install

# Start your bot
npm run pm2:start

# Save the process list
pm2 save
```

### Option 2: Using Windows Task Scheduler
1. Open **Task Scheduler**
2. Create **Basic Task**
3. Name: "Bakong Bot"
4. Trigger: **At startup**
5. Action: **Start a program**
6. Program: `C:\Program Files\nodejs\pm2.cmd`
7. Arguments: `resurrect`
8. Click **Finish**

---

## 📊 View Dashboard

### Web Dashboard
Open browser and go to:
```
http://localhost:3001
```

Features:
- Real-time statistics
- Interactive charts
- Branch performance
- Recent transactions
- Auto-refresh every 30 seconds

### PM2 Dashboard
```bash
pm2 monit
```

Shows:
- CPU usage
- Memory usage
- Logs in real-time
- Process status

---

## 📝 Log Files

Logs are stored in `./logs/` folder:

```
logs/
├── error.log      - Error messages only
├── out.log        - Standard output
└── combined.log   - All logs combined
```

View logs:
```bash
# View all logs
pm2 logs bakong-bot

# View errors only
type logs\error.log

# View last 50 lines
pm2 logs bakong-bot --lines 50

# Clear logs
pm2 flush bakong-bot
```

---

## 🔍 Health Check

### Check Bot Status
```bash
pm2 status
```

### Check Health Endpoint
```bash
# In browser or curl
http://localhost:3001/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-06-20T..."
}
```

### Test Telegram Bot
1. Open Telegram
2. Find your bot
3. Send `/start`
4. Bot should respond immediately

---

## 🛠️ Troubleshooting

### Bot Not Starting
```bash
# Check logs for errors
pm2 logs bakong-bot

# Check .env file exists
dir .env

# Verify bot token in .env
notepad .env

# Restart bot
pm2 restart bakong-bot
```

### Bot Stops After Closing Terminal
This is normal! PM2 runs in the background.

To check if it's still running:
```bash
pm2 status
```

### View Real-Time Errors
```bash
pm2 logs bakong-bot --err
```

### Reset Everything
```bash
# Stop all
pm2 stop all

# Delete all processes
pm2 delete all

# Start fresh
npm run pm2:start
```

---

## 📈 Production Deployment

### For Real 24/7 Operation (Optional)

#### Option 1: Keep Computer Running
- ✅ PM2 is already set up
- ✅ Bot will run as long as computer is on
- ✅ Will restart on crashes
- ⚠️ Need to keep computer on 24/7

#### Option 2: Deploy to Cloud (Recommended)
See [DEPLOYMENT_247.md](DEPLOYMENT_247.md) for:
- MongoDB Atlas setup (free cloud database)
- Cloud hosting options (Heroku, Railway, Render)
- Access from multiple devices
- True 24/7 uptime

---

## 🎯 PM2 Commands Cheat Sheet

```bash
# Start
pm2 start ecosystem.config.js
npm run pm2:start

# Stop
pm2 stop bakong-bot
npm run pm2:stop

# Restart
pm2 restart bakong-bot
npm run pm2:restart

# Delete
pm2 delete bakong-bot

# Status
pm2 status
npm run pm2:status

# Logs
pm2 logs bakong-bot
npm run pm2:logs

# Monitor
pm2 monit

# Info
pm2 info bakong-bot

# Save process list
pm2 save

# Resurrect saved processes
pm2 resurrect

# Update PM2
npm install -g pm2@latest
pm2 update
```

---

## 🔐 Security Tips

1. **Protect .env file**
   - Never commit to Git (already in .gitignore)
   - Keep bot token secret
   - Backup securely

2. **Monitor logs regularly**
   ```bash
   pm2 logs bakong-bot --lines 50
   ```

3. **Check bot status daily**
   ```bash
   pm2 status
   ```

4. **Update dependencies**
   ```bash
   npm update
   pm2 restart bakong-bot
   ```

---

## 📊 Monitoring & Alerts

### PM2 Plus (Free Monitoring - Optional)
1. Sign up: https://pm2.io/
2. Get keys from dashboard
3. Link PM2:
   ```bash
   pm2 link <secret> <public>
   ```
4. View real-time dashboard online
5. Get email alerts for crashes

---

## ✅ Daily Checklist

### Morning Routine:
```bash
# 1. Check status
pm2 status

# 2. View recent logs
pm2 logs bakong-bot --lines 20

# 3. Check dashboard
# Open: http://localhost:3001

# 4. Test bot in Telegram
# Send: /start
```

### If Issues:
```bash
# View errors
pm2 logs bakong-bot --err

# Restart
pm2 restart bakong-bot

# Check health
# Open: http://localhost:3001/health
```

---

## 🎉 Success!

Your bot is now configured for 24/7 operation!

**What happens now:**
- ✅ Bot runs continuously in the background
- ✅ Auto-restarts if it crashes
- ✅ Auto-restarts daily at 3 AM
- ✅ Logs all activity
- ✅ Can be monitored anytime
- ✅ Survives terminal closing

**Quick Commands:**
```bash
start-247.bat    # Start bot
stop-247.bat     # Stop bot
monitor.bat      # Live monitoring
pm2 status       # Check status
pm2 logs         # View logs
```

**Dashboard:**
```
http://localhost:3001
```

---

## 📞 Need Help?

- 📖 Full guide: [DEPLOYMENT_247.md](DEPLOYMENT_247.md)
- 🔧 Setup guide: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- 📚 User manual: [USER_MANUAL.md](USER_MANUAL.md)
- 🌐 PM2 docs: https://pm2.keymetrics.io/

---

**Your bot is now running 24/7! 🚀**

Monitor it anytime with `pm2 status` or open http://localhost:3001
