@echo off
echo ============================================
echo Docker Backend Build Script
echo ============================================
echo.

echo [1/5] Checking Docker status...
docker --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker is not responding
    echo Please restart Docker Desktop and try again
    pause
    exit /b 1
)

echo.
echo [2/5] Stopping existing containers...
docker compose down
timeout /t 2 /nobreak > nul

echo.
echo [3/5] Building Docker images (this may take a few minutes)...
docker compose build --no-cache

echo.
echo [4/5] Starting containers...
docker compose up -d

echo.
echo [5/5] Waiting for services to start...
timeout /t 10 /nobreak > nul

echo.
echo ============================================
echo Checking container status...
echo ============================================
docker ps

echo.
echo ============================================
echo Backend logs:
echo ============================================
docker logs retailstore-backend --tail 30

echo.
echo ============================================
echo Testing backend health...
echo ============================================
timeout /t 3 /nobreak > nul
curl http://localhost:8000/health

echo.
echo ============================================
echo Build complete!
echo ============================================
echo Backend API: http://localhost:8000/docs
echo Frontend: http://localhost:3000
echo.
pause
