@echo off
REM RetailStore Production Build Script (Windows)
REM This script builds the Docker images for production deployment

echo =========================================
echo RetailStore Production Build
echo =========================================
echo.

REM Check if .env.production exists
if not exist .env.production (
    echo Error: .env.production file not found!
    echo Please copy .env.production and configure it.
    exit /b 1
)

echo Building Docker images...
echo.

REM Build with docker-compose
docker-compose -f docker-compose.yml build

if %errorlevel% neq 0 (
    echo.
    echo Build failed! Check the errors above.
    exit /b 1
)

echo.
echo Build completed successfully!
echo.
echo Next steps:
echo 1. Configure your DNS records (see deploy\README.md)
echo 2. Run: deploy\start.bat or deploy the build to your server
echo.
pause
