# 🚀 24/7 Deployment Guide

## 🎯 Overview

This guide will help you run your bot 24/7 with a centralized cloud database that multiple devices can access.

---

## 📋 Prerequisites

- ✅ Node.js installed
- ✅ Git installed
- ✅ Internet connection
- ✅ Telegram bot token

---

## 🗄️ Option 1: Cloud Database (Recommended for 24/7)

### Step 1: Create Free MongoDB Atlas Account

1. **Go to:** https://www.mongodb.com/cloud/atlas/register
2. **Sign up** for free account
3. **Create a cluster** (Free tier - M0)
4. **Wait 3-5 minutes** for cluster creation

### Step 2: Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://username:<password>@cluster.mongodb.net/bakong-bot
   ```
4. Replace `<password>` with your actual password

### Step 3: Configure Bot

Edit `.env` file:
```env
USE_MONGODB=true
MONGODB_URI=mongodb+srv://username:yourpassword@cluster.mongodb.net/bakong-bot
```

### Step 4: Whitelist IP Addresses

In MongoDB Atlas:
1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

---

## 🖥️ Option 2: Local Database (Testing Only)

For local testing, keep:
```env
USE_MONGODB=false
```

Data will be stored in `./data/` folder (local only).

---

## 🔄 Install PM2 (Process Manager for 24/7)

### Windows:
```bash
npm install -g pm2
npm install -g pm2-windows-startup
pm2-startup install
```

### Linux/Mac:
```bash
npm install -g pm2
pm2 startup
```

---

## 🚀 Deploy for 24/7 Operation

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
```bash
# Copy template
copy .env.example .env

# Edit .env
notepad .env
```

Add:
- Your Telegram bot token
- MongoDB URI (if using cloud database)
- Set USE_MONGODB=true

### Step 3: Start with PM2
```bash
npm run pm2:start
```

### Step 4: Verify It's Running
```bash
pm2 status
```

You should see:
```
┌─────┬──────────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name         │ status  │ restart │ uptime  │ cpu      │
├─────┼──────────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ bakong-bot   │ online  │ 0       │ 5s      │ 0%       │
└─────┴──────────────┴─────────┴─────────┴─────────┴──────────┘
```

---

## 📊 PM2 Commands

### View Status
```bash
npm run pm2:status
# or
pm2 status
```

### View Logs
```bash
npm run pm2:logs
# or
pm2 logs bakong-bot
```

### Restart Bot
```bash
npm run pm2:restart
# or
pm2 restart bakong-bot
```

### Stop Bot
```bash
npm run pm2:stop
# or
pm2 stop bakong-bot
```

### Monitor in Real-Time
```bash
pm2 monit
```

---

## 🌐 Access from Multiple Devices

### Setup on Each Device:

#### Device 1 (Main Server - Runs Bot 24/7):
```bash
git clone https://github.com/DUC2026-PGB-SkyNova-Tech-Company/DUC2026-PGB-SkyNova-Tech-Company.git
cd DUC2026-PGB-SkyNova-Tech-Company
npm install
# Configure .env with MongoDB
npm run pm2:start
```

#### Device 2, 3, 4... (Testing/Development):
```bash
git clone https://github.com/DUC2026-PGB-SkyNova-Tech-Company/DUC2026-PGB-SkyNova-Tech-Company.git
cd DUC2026-PGB-SkyNova-Tech-Company
npm install
# Use SAME MongoDB URI in .env
# DON'T run the bot, just access the database
```

**Important:** Only ONE device should run the Telegram bot at a time!

---

## 🔍 Health Monitoring

### Check Bot Health:
```
http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-05-15T10:00:00.000Z",
  "uptime": 3600,
  "database": "MongoDB",
  "botActive": true
}
```

### Check Statistics:
```
http://localhost:3000/api/stats
```

Response:
```json
{
  "success": true,
  "data": {
    "transactions": 150,
    "branches": 3,
    "users": 12,
    "timestamp": "2026-05-15T10:00:00.000Z"
  }
}
```

---

## 🔄 Auto-Restart Features

PM2 automatically restarts your bot if:
- ✅ It crashes
- ✅ Memory exceeds 500MB
- ✅ Server reboots (with pm2-startup)
- ✅ Daily at 3 AM (scheduled restart)

---

## 📱 Remote Access Setup

### Option 1: Use ngrok (Easy)

1. **Install ngrok:** https://ngrok.com/download
2. **Run:**
   ```bash
   ngrok http 3000
   ```
3. **Get public URL:**
   ```
   https://abc123.ngrok.io
   ```
4. **Access from anywhere:**
   ```
   https://abc123.ngrok.io/health
   https://abc123.ngrok.io/api/stats
   ```

### Option 2: Deploy to Cloud

**Free Options:**
- Heroku (free tier)
- Railway.app
- Render.com
- Fly.io

---

## 🔒 Security Best Practices

### 1. Secure MongoDB
```
✅ Use strong password
✅ Enable IP whitelist
✅ Use connection string with SSL
✅ Regular backups
```

### 2. Secure Bot Token
```
✅ Never commit .env to git
✅ Use environment variables
✅ Rotate token if compromised
```

### 3. Secure Server
```
✅ Use firewall
✅ Keep Node.js updated
✅ Monitor logs regularly
✅ Use HTTPS for API
```

---

## 📊 Monitoring Dashboard

### PM2 Plus (Free Monitoring)

1. **Sign up:** https://pm2.io/
2. **Link PM2:**
   ```bash
   pm2 link <secret> <public>
   ```
3. **View dashboard:** https://app.pm2.io/

Features:
- Real-time monitoring
- Error tracking
- Performance metrics
- Email alerts

---

## 🆘 Troubleshooting

### Bot Not Starting
```bash
# Check logs
pm2 logs bakong-bot

# Check status
pm2 status

# Restart
pm2 restart bakong-bot
```

### Database Connection Failed
```bash
# Check MongoDB URI
# Verify IP whitelist
# Test connection:
node -e "require('mongoose').connect('YOUR_MONGODB_URI').then(() => console.log('Connected!')).catch(err => console.error(err))"
```

### Bot Stops After Closing Terminal
```bash
# Make sure PM2 startup is configured
pm2 startup
# Run the command it shows
# Then save:
pm2 save
```

### Multiple Devices Can't Access Database
```bash
# Make sure all devices use SAME MongoDB URI
# Check MongoDB Atlas IP whitelist
# Verify network connectivity
```

---

## 📈 Scaling Up

### When Your Business Grows:

1. **Upgrade MongoDB:**
   - Free: M0 (512MB)
   - Paid: M10+ (2GB+)

2. **Add More Features:**
   - Web dashboard
   - Mobile app
   - SMS notifications
   - Email reports

3. **Deploy to Cloud:**
   - AWS
   - Google Cloud
   - Azure
   - DigitalOcean

---

## ✅ Checklist

Before going live:

- [ ] MongoDB Atlas account created
- [ ] Connection string configured
- [ ] Bot token added to .env
- [ ] PM2 installed
- [ ] Bot started with PM2
- [ ] PM2 startup configured
- [ ] Health endpoint accessible
- [ ] Logs are clean
- [ ] Test from Telegram
- [ ] Test from multiple devices
- [ ] Backup strategy in place

---

## 🎉 You're Live 24/7!

Your bot is now:
- ✅ Running 24/7
- ✅ Auto-restarts on crash
- ✅ Accessible from multiple devices
- ✅ Using cloud database
- ✅ Production-ready

**Monitor your bot:**
```bash
pm2 monit
```

**View logs:**
```bash
pm2 logs bakong-bot --lines 100
```

**Check health:**
```
http://localhost:3000/health
```

---

## 📞 Support

Need help?
- Read: [README.md](README.md)
- Read: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- MongoDB Docs: https://docs.mongodb.com/
- PM2 Docs: https://pm2.keymetrics.io/

---

**Congratulations! Your bot is now enterprise-grade!** 🚀
