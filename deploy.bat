@echo off
REM One-Click Production Deployment Script (Windows)
REM This script builds and starts the entire RetailStore application

echo =========================================
echo RetailStore - One-Click Deployment
echo =========================================
echo.

REM Check if .env.production exists
if not exist .env.production (
    echo Warning: .env.production not found. Creating from example...
    if exist .env.production.example (
        copy .env.production.example .env.production
        echo.
        echo Please edit .env.production with your actual values:
        echo    - Domain names
        echo    - Database password
        echo    - API keys
        echo    - Email for SSL certificates
        echo.
        pause
    ) else (
        echo Error: .env.production.example not found!
        exit /b 1
    )
)

echo Pre-flight checks...
echo.

REM Check Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed!
    echo Install Docker Desktop: https://www.docker.com/products/docker-desktop
    exit /b 1
)

REM Check Docker Compose
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker Compose is not installed!
    exit /b 1
)

echo.
echo Pre-flight checks passed!
echo.
echo Building Docker images...
echo This may take 5-10 minutes on first run...
echo.

REM Build all images
docker-compose build

if %errorlevel% neq 0 (
    echo.
    echo Build failed! Check the errors above.
    exit /b 1
)

echo.
echo Build completed successfully!
echo.
echo Starting all services...
echo.

REM Start all services
docker-compose up -d

echo.
echo Waiting for services to be ready...
timeout /t 10 /nobreak

REM Show service status
echo.
echo Service Status:
docker-compose ps

echo.
echo SSL Certificates:
echo    Caddy will automatically obtain SSL certificates
echo    This happens on first HTTPS request to your domains
echo    Check logs: docker-compose logs caddy

echo.
echo =========================================
echo Deployment Complete!
echo =========================================
echo.
echo Your Application is Running!
echo.
echo Access Points:
echo    RetailOS Admin: https://retailos.cloud
echo    Super Admin: https://retailos.cloud/super-admin
echo    Tenant Admin: https://retailos.cloud/admin
echo.
echo    Indumart Parent: https://indumart.us
echo    Store Example: https://[subdomain].indumart.us/shop
echo.
echo =========================================
echo Useful Commands:
echo =========================================
echo    View logs:        docker-compose logs -f
echo    Stop all:         docker-compose down
echo    Restart:          docker-compose restart
echo.
echo Happy Retailing!
echo.
pause
