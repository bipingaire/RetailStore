@echo off
echo Checking container status...
docker ps -a --filter "name=retailstore-backend"

echo.
echo Checking container state...
docker inspect retailstore-backend --format="Status: {{.State.Status}}"
docker inspect retailstore-backend --format="Restarting: {{.State.Restarting}}"
docker inspect retailstore-backend --format="ExitCode: {{.State.ExitCode}}"
docker inspect retailstore-backend --format="Error: {{.State.Error}}"

echo.
echo Last 50 lines of logs:
docker logs retailstore-backend --tail 50

pause
