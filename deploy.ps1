Write-Host "Deploying RetailOS..."
git pull
docker-compose down
docker-compose build
docker-compose up -d
Write-Host "Waiting for containers to start..."
Start-Sleep -Seconds 10
Write-Host "Running Database Migrations (Standard Practice)..."
docker exec retail_store_backend npx prisma db push --schema prisma/schema-master.prisma
docker exec retail_store_backend npx prisma db push --schema prisma/schema.prisma
Write-Host "Deployment Complete!"
