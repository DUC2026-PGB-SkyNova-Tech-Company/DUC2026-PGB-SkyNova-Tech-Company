@echo off
title SkyNovaTech_Bot - 24/7 Launcher
color 0A

echo.
echo  =====================================================
echo   @SkyNovaTech_Bot  ^|  24/7 Auto-Run Launcher
echo   Accessible from ALL devices via Telegram
echo  =====================================================
echo.

REM ── Step 1: Check .env exists ───────────────────────────────────────────────
if not exist .env (
    echo [ERROR] .env file not found!
    echo.
    echo  Please run setup-247.bat first, OR:
    echo  1. Copy .env.example to .env
    echo  2. Make sure TELEGRAM_BOT_TOKEN is set
    echo.
    pause
    exit /b 1
)

REM ── Step 2: Check Node.js is installed ──────────────────────────────────────
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found!
    echo.
    echo  Please install Node.js from: https://nodejs.org/
    echo  Then re-run this script.
    echo.
    pause
    exit /b 1
)

REM ── Step 3: Install dependencies if needed ──────────────────────────────────
if not exist node_modules (
    echo [1/5] Installing npm dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed!
        pause
        exit /b 1
    )
    echo  Done.
    echo.
) else (
    echo [1/5] Dependencies already installed. Skipping.
)

REM ── Step 4: Install PM2 globally if not present ─────────────────────────────
pm2 --version >nul 2>&1
if errorlevel 1 (
    echo [2/5] Installing PM2 process manager...
    call npm install -g pm2
    if errorlevel 1 (
        echo [ERROR] PM2 install failed. Try running as Administrator.
        pause
        exit /b 1
    )
    echo  Done.
    echo.
) else (
    echo [2/5] PM2 already installed. Skipping.
)

REM ── Step 5: Create logs and data directories ────────────────────────────────
echo [3/5] Creating logs and data directories...
if not exist logs mkdir logs
if not exist data mkdir data
echo  Done.

REM ── Step 6: Stop any old instance cleanly ───────────────────────────────────
echo [4/5] Stopping any existing bot instance...
pm2 delete SkyNovaTech_Bot >nul 2>&1
echo  Done.

REM ── Step 7: Start bot with PM2 ──────────────────────────────────────────────
echo [5/5] Starting @SkyNovaTech_Bot with PM2...
call pm2 start ecosystem.config.js
if errorlevel 1 (
    echo [ERROR] Failed to start bot with PM2!
    echo.
    echo  Check logs with: pm2 logs SkyNovaTech_Bot
    pause
    exit /b 1
)

REM ── Step 8: Save PM2 process list (survives reboot) ─────────────────────────
echo.
echo  Saving PM2 process list for auto-start on reboot...
call pm2 save

REM ── Step 9: Configure Windows startup ───────────────────────────────────────
echo  Configuring Windows auto-start...
call pm2-startup install >nul 2>&1
call pm2 startup >nul 2>&1

REM ── Done ─────────────────────────────────────────────────────────────────────
echo.
echo  =====================================================
echo   Bot is NOW RUNNING 24/7
echo  =====================================================
echo.
echo   Telegram Bot:   @SkyNovaTech_Bot
echo   Web Dashboard:  http://localhost:3001
echo   Health Check:   http://localhost:3001/health
echo.
echo   Useful commands:
echo     View logs:    pm2 logs SkyNovaTech_Bot
echo     Status:       pm2 status
echo     Stop bot:     pm2 stop SkyNovaTech_Bot
echo     Restart:      pm2 restart SkyNovaTech_Bot
echo     Monitor:      pm2 monit
echo.
echo   For remote access from other devices:
echo     Use your PC's local IP: http://YOUR_IP:3001
echo     (find it with: ipconfig)
echo.
echo  =====================================================
echo.

REM Show live status
call pm2 status

echo.
pause
