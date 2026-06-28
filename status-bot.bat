@echo off
title SkyNovaTech_Bot - Status Monitor
color 0B

echo.
echo  =====================================================
echo   @SkyNovaTech_Bot  ^|  Live Status
echo  =====================================================
echo.

pm2 status

echo.
echo  ── Recent Logs (last 30 lines) ─────────────────────
echo.

pm2 logs SkyNovaTech_Bot --lines 30 --nostream

echo.
echo  ── Health Check ────────────────────────────────────
echo.

REM Try to hit the health endpoint
curl -s http://localhost:3001/health 2>nul
if errorlevel 1 (
    echo  [WARNING] Could not reach http://localhost:3001/health
    echo  Bot may still be starting up. Wait 10 seconds and try again.
)

echo.
echo.
echo  Dashboard:   http://localhost:3001
echo  Bot handle:  @SkyNovaTech_Bot
echo.
pause
