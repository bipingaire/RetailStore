Write-Host "Deploying RetailOS..."
git pull
docker-compose down
docker-compose build
docker-compose up -d
Write-Host "Deployment Complete!"
