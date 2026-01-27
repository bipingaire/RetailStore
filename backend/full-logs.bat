@echo off
echo ===== FULL BACKEND ERROR LOG =====
docker logs retailstore-backend 2>&1
echo.
echo ===== END OF LOG =====
pause
