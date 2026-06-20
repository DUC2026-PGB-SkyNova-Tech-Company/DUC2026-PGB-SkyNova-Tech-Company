# How to Get Your Bot Token

## Your Bot: DUC2026-PGB-SkyNova-Tech-Company

You already created the bot! Now you need to get its token.

## Steps:

### 1. Open Telegram

### 2. Search for: @BotFather

### 3. Send this command:
```
/token
```

### 4. BotFather will show you a list of your bots

### 5. Click on: DUC2026-PGB-SkyNova-Tech-Company

### 6. BotFather will send you the token!

It looks like:
```
123456789:ABCdefGHIjklMNOpqrsTUVwxyz-1234567890
```

### 7. Copy the ENTIRE token

### 8. Tell me the token, and I'll configure it for you!

---

## Alternative: If you lost the token

If you can't find the token, send this to @BotFather:

```
/mybots
```

Then:
1. Click on your bot: DUC2026-PGB-SkyNova-Tech-Company
2. Click "API Token"
3. Copy the token

---

## After you get the token:

Just paste it here in the chat, and I'll update your .env file automatically!

Or you can edit .env file yourself:
1. Open .env
2. Replace: TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
3. With: TELEGRAM_BOT_TOKEN=your_actual_token
4. Save
5. Run: npm start
