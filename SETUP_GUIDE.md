# Complete Setup Guide

## Step-by-Step Installation

### 1. Install Node.js

**Windows:**
1. Download from https://nodejs.org/
2. Run the installer
3. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

### 2. Get the Code

**Option A: Download ZIP**
1. Go to GitHub repository
2. Click "Code" → "Download ZIP"
3. Extract to `D:\Projects\DUC2026`

**Option B: Git Clone**
```bash
git clone https://github.com/DUC2026-PGB-SkyNova-Tech-Company/bakong-vendor-bot.git
cd bakong-vendor-bot
```

### 3. Install Dependencies

Open PowerShell or Command Prompt in the project folder:

```bash
cd D:\Projects\DUC2026
npm install
```

### 4. Create Telegram Bot

1. **Open Telegram** on your phone or computer
2. **Search for** `@BotFather`
3. **Send** `/newbot`
4. **Follow the prompts:**
   - Choose a name: `My Vendor Bot`
   - Choose a username: `myvendor_bot` (must end with `_bot`)
5. **Copy the token** - it looks like:
   ```
   123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   ```

### 5. Configure the Bot

1. **Copy the example file:**
   ```bash
   copy .env.example .env
   ```

2. **Edit `.env` file** (use Notepad or VS Code):
   ```env
   # Paste your bot token here
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   
   # Configure your branches
   BRANCHES=Central Market,Russian Market,Olympic Market
   
   # Other settings (optional)
   PORT=3000
   NODE_ENV=development
   ```

### 6. Run the Bot

```bash
npm start
```

You should see:
```
✅ Database initialized
✅ Default branches created
✅ All handlers registered
🚀 Server running on port 3000
🤖 Telegram bot is active
```

### 7. Test the Bot

1. **Open Telegram**
2. **Search for your bot** (the username you created)
3. **Send** `/start`
4. You should see a welcome message!

## Common Issues & Solutions

### Issue: "Cannot find module 'dotenv'"

**Solution:**
```bash
npm install
```

### Issue: "TELEGRAM_BOT_TOKEN not configured"

**Solution:**
1. Make sure you created `.env` file (not `.env.example`)
2. Check that you pasted the correct token
3. No spaces around the `=` sign

### Issue: Bot doesn't respond

**Solution:**
1. Check if the bot is running (you should see "Telegram bot is active")
2. Make sure you're messaging the correct bot
3. Try `/start` command
4. Check for errors in the console

### Issue: "Port 3000 already in use"

**Solution:**
Change the port in `.env`:
```env
PORT=3001
```

## Updating the Bot

### Update branches:
1. Edit `.env` file
2. Change `BRANCHES=...` line
3. Delete `data/branches.json`
4. Restart the bot

### Update code:
```bash
git pull origin main
npm install
npm start
```

## Backup Your Data

**Important:** Backup the `data/` folder regularly!

```bash
# Create backup
copy data data_backup_2026-05-15

# Or use a backup script
xcopy data backup\data /E /I /Y
```

## Production Deployment

### Using PM2 (Process Manager)

1. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

2. **Start the bot:**
   ```bash
   pm2 start src/app.js --name bakong-bot
   ```

3. **Useful PM2 commands:**
   ```bash
   pm2 status          # Check status
   pm2 logs bakong-bot # View logs
   pm2 restart bakong-bot # Restart
   pm2 stop bakong-bot # Stop
   ```

### Running as Windows Service

Use `node-windows` package:
```bash
npm install -g node-windows
```

Create `install-service.js`:
```javascript
var Service = require('node-windows').Service;

var svc = new Service({
  name:'Bakong Vendor Bot',
  description: 'KHQR Payment Tracking Bot',
  script: 'D:\\Projects\\DUC2026\\src\\app.js'
});

svc.on('install', function(){
  svc.start();
});

svc.install();
```

Run:
```bash
node install-service.js
```

## Security Best Practices

1. **Never commit `.env` file** to Git
2. **Keep your bot token secret**
3. **Backup data regularly**
4. **Use HTTPS** for webhooks in production
5. **Limit admin access** to trusted users only

## Getting Help

- Check the [README.md](README.md) for usage instructions
- Create an issue on GitHub
- Contact the development team

## Next Steps

1. ✅ Bot is running
2. 📱 Add staff members to the bot
3. 🏪 Configure branches
4. 📊 Start recording payments
5. 📈 Generate reports

Happy tracking! 🎉
