@echo off
title SkyNovaTech_Bot - Stop
color 0C

echo.
echo  =====================================================
echo   @SkyNovaTech_Bot  ^|  Stopping Bot
echo  =====================================================
echo.

echo  Stopping SkyNovaTech_Bot...
pm2 stop SkyNovaTech_Bot

echo.
echo  Bot stopped. To restart, run: start-bot.bat
echo.
pause
