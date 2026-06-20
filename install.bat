@echo off
echo ========================================
echo Bakong Vendor Bot - Installation Script
echo ========================================
echo.

echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js is installed!
node --version
echo.

echo [2/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

echo [3/4] Setting up configuration...
if not exist .env (
    copy .env.example .env
    echo .env file created! Please edit it with your bot token.
    echo.
    echo IMPORTANT: You need to:
    echo 1. Create a bot with @BotFather on Telegram
    echo 2. Copy the bot token
    echo 3. Edit .env file and paste your token
    echo.
    notepad .env
) else (
    echo .env file already exists.
)
echo.

echo [4/4] Creating data directory...
if not exist data mkdir data
echo Data directory ready!
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure you've added your bot token to .env
echo 2. Run: npm start
echo 3. Open Telegram and search for your bot
echo 4. Send /start to begin!
echo.
pause
