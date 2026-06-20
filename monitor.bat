@echo off
echo ========================================
echo   Bakong Bot - Live Monitor
echo ========================================
echo.
echo Press Ctrl+C to exit monitoring
echo.
pause
call pm2 monit
