#!/bin/bash
echo "Deploying RetailOS..."
git pull
docker-compose down
docker-compose build
docker-compose up -d
echo "Waiting for containers to start..."
sleep 10
echo "Running Database Migrations (Standard Practice)..."
docker exec retail_store_backend npx prisma db push --schema prisma/schema-master.prisma
docker exec retail_store_backend npx prisma db push --schema prisma/schema.prisma
echo "Deployment Complete!"
