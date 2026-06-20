@echo off
echo ========================================
echo Bakong Bot - 24/7 Setup
echo ========================================
echo.

echo [1/5] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo.

echo [2/5] Installing PM2 globally...
call npm install -g pm2
if errorlevel 1 (
    echo WARNING: PM2 installation failed. You may need admin rights.
    echo Try running as Administrator.
)
echo.

echo [3/5] Setting up environment...
if not exist .env (
    copy .env.example .env
    echo .env file created!
    echo.
    echo IMPORTANT: Edit .env file and configure:
    echo 1. TELEGRAM_BOT_TOKEN
    echo 2. USE_MONGODB=true (for cloud database)
    echo 3. MONGODB_URI (get from MongoDB Atlas)
    echo.
    notepad .env
)
echo.

echo [4/5] Creating logs directory...
if not exist logs mkdir logs
echo.

echo [5/5] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Make sure .env is configured
echo 2. Start bot: npm run pm2:start
echo 3. Check status: pm2 status
echo 4. View logs: pm2 logs bakong-bot
echo.
echo For 24/7 operation, read: DEPLOYMENT_247.md
echo.
pause
