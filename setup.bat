@echo off
REM Quick Setup Script for Finance App (Windows)
REM This script automates the initial setup process

echo.
echo 🚀 Finance App - Quick Setup
echo ============================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install from https://nodejs.org/
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js version: %NODE_VERSION%
echo ✅ npm version: %NPM_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo 📝 Creating .env.local file...
    copy .env.example .env.local
    echo ✅ .env.local created from template
    echo.
    echo ⚠️  Please edit .env.local and add your Supabase credentials:
    echo    VITE_SUPABASE_URL=your_url_here
    echo    VITE_SUPABASE_ANON_KEY=your_key_here
) else (
    echo ✅ .env.local already exists
)

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Edit .env.local with your Supabase credentials
echo 2. Run: npm run dev
echo 3. Open http://localhost:5173 in your browser
echo.
echo For detailed setup instructions, see SETUP_GUIDE.md
echo.
pause
