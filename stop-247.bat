@echo off
echo ========================================
echo   Stopping Bakong Bot
echo ========================================
echo.

call pm2 stop bakong-bot

echo.
echo Bot stopped successfully!
echo.
echo To start again: start-247.bat
echo or: pm2 start bakong-bot
echo.
pause
