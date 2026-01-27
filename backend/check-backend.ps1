Write-Host "=== Docker Container Status ===" -ForegroundColor Cyan
docker ps -a --format "table {{.Names}}`t{{.Status}}`t{{.Ports}}"

Write-Host "`n=== Checking Port 8000 ===" -ForegroundColor Cyan
$port8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($port8000) {
    Write-Host "Port 8000 is in use by process: $($port8000.OwningProcess)" -ForegroundColor Green
    $process = Get-Process -Id $port8000.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Process name: $($process.ProcessName)" -ForegroundColor Green
    }
}
else {
    Write-Host "Port 8000 is NOT in use" -ForegroundColor Red
}

Write-Host "`n=== Backend Container Logs (last 30 lines) ===" -ForegroundColor Cyan
docker logs retailstore-backend --tail 30 2>&1

Write-Host "`n=== Master DB Container Logs (last 20 lines) ===" -ForegroundColor Cyan
docker logs retailstore-master-db --tail 20 2>&1
