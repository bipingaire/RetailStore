#!/bin/bash
echo "Deploying RetailOS..."
git pull
docker-compose down
docker-compose build
docker-compose up -d
echo "Deployment Complete!"
