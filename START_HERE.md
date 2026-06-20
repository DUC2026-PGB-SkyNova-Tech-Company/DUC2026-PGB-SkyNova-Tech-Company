# 🚀 START HERE - Quick Setup

## ⚠️ IMPORTANT: You Need a Telegram Bot Token!

Your bot is **almost ready** to run, but you need to get a Telegram bot token first.

## Step 1: Create Your Telegram Bot (2 minutes)

### On Your Phone or Computer:

1. **Open Telegram**

2. **Search for: `@BotFather`**
   - This is Telegram's official bot for creating bots
   - It has a blue checkmark ✓

3. **Send this command:** `/newbot`

4. **BotFather will ask for a name:**
   - Type: `My Vendor Bot` (or any name you like)
   - This is the display name users will see

5. **BotFather will ask for a username:**
   - Type: `myvendor_bot` (must end with `_bot`)
   - This must be unique
   - If taken, try: `myshop_bot`, `mystore_bot`, etc.

6. **Copy the token!**
   - BotFather will give you a token like:
   ```
   123456789:ABCdefGHIjklMNOpqrsTUVwxyz-1234567890
   ```
   - **COPY THIS ENTIRE TOKEN!**

## Step 2: Add Token to Your Bot

1. **Open the file:** `.env` (in this folder)

2. **Find this line:**
   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   ```

3. **Replace with your token:**
   ```
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz-1234567890
   ```

4. **Save the file**

## Step 3: Run Your Bot

### Option A: Double-click `run.bat`

### Option B: Use Command Line
```bash
npm start
```

## Step 4: Test Your Bot

1. **Open Telegram**
2. **Search for your bot** (the username you created)
3. **Send:** `/start`
4. **You should see a welcome message!** 🎉

---

## ✅ What You Should See

When you run `npm start`, you should see:

```
✅ Database initialized
✅ Default branches created
✅ All handlers registered
🚀 Server running on port 3000
🤖 Telegram bot is active
```

If you see this, **YOUR BOT IS WORKING!** 🎉

---

## ❌ Troubleshooting

### Error: "TELEGRAM_BOT_TOKEN not configured"
- You didn't add your token to `.env` file
- Make sure there are no spaces around the `=` sign
- Make sure you saved the `.env` file

### Error: "Cannot find module"
- Run: `npm install`
- Wait for it to complete
- Try `npm start` again

### Bot doesn't respond in Telegram
- Make sure `npm start` is running (don't close the window)
- Check you're messaging the correct bot username
- Try sending `/start` command
- Check for errors in the console

### Port 3000 already in use
- Another program is using port 3000
- Change port in `.env`: `PORT=3001`
- Or close other programs and try again

---

## 📱 How to Use (Quick Guide)

### For Staff:
1. `/start` - Start the bot
2. `/branch` - Select your branch
3. Type: `25000 Fried rice` - Record payment
4. Click ✅ to confirm

### For Owners:
1. `/daily` - See today's sales
2. `/report` - Detailed reports
3. All data is saved automatically!

---

## 📚 More Help

- **Full Setup Guide:** [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **User Manual:** [USER_MANUAL.md](USER_MANUAL.md)
- **Quick Start:** [QUICKSTART.md](QUICKSTART.md)
- **README:** [README.md](README.md)

---

## 🎯 Next Steps

1. ✅ Get bot token from @BotFather
2. ✅ Add token to `.env` file
3. ✅ Run `npm start`
4. ✅ Test with `/start` in Telegram
5. 📱 Add your staff to the bot
6. 🏪 Configure your branches
7. 💰 Start tracking payments!

---

**Need help? Check the troubleshooting section above or read the full documentation.**

**Good luck! 🚀**
