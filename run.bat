@echo off
echo ========================================
echo Bakong Vendor Bot - Starting...
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo ERROR: .env file not found!
    echo.
    echo Please create .env file first:
    echo 1. Copy .env.example to .env
    echo 2. Edit .env and add your Telegram bot token
    echo.
    echo Run install.bat to set up automatically.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
)

REM Create data directory if it doesn't exist
if not exist data mkdir data

echo.
echo Starting the bot...
echo Press Ctrl+C to stop
echo.
echo ========================================
echo.

node src/app.js

pause
