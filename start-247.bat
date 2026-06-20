@echo off
echo ========================================
echo   Bakong Bot - 24/7 Startup Script
echo ========================================
echo.

echo Checking if PM2 is installed...
pm2 -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: PM2 is not installed!
    echo.
    echo Installing PM2...
    call npm install -g pm2
    call npm install -g pm2-windows-startup
    echo.
)

echo Checking .env file...
if not exist .env (
    echo ERROR: .env file not found!
    echo Please create .env file with your bot token.
    echo Run: copy .env.example .env
    pause
    exit /b 1
)

echo Creating logs directory...
if not exist logs mkdir logs

echo.
echo Starting bot with PM2...
call pm2 start ecosystem.config.js

echo.
echo Saving PM2 process list...
call pm2 save

echo.
echo ========================================
echo   Bot Started Successfully!
echo ========================================
echo.
echo Status: pm2 status
echo Logs:   pm2 logs bakong-bot
echo Stop:   pm2 stop bakong-bot
echo.
echo Dashboard: http://localhost:3001
echo.
echo Your bot will now run 24/7!
echo.
pause
