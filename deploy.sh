#!/bin/bash
set -e
echo "Deploying RetailOS..."

echo "==> Pulling latest code..."
git pull

echo "==> Tearing down everything..."
docker-compose down --remove-orphans 2>/dev/null || true

# Force-remove any leftover named containers from previous runs
docker rm -f retail_store_backend retail_store_frontend retail_store_db 2>/dev/null || true

# Stop and remove any OTHER container using our ports (Docker holds port at daemon level)
for PORT in 3010 3011; do
  CONTAINERS=$(docker ps -q --filter "publish=$PORT" 2>/dev/null || true)
  if [ -n "$CONTAINERS" ]; then
    echo "  Removing Docker containers holding port $PORT: $CONTAINERS"
    docker rm -f $CONTAINERS 2>/dev/null || true
  fi
done

# Also kill any non-Docker OS processes still bound to those ports
for PORT in 3010 3011 5432; do
  PIDS=$(lsof -ti tcp:$PORT 2>/dev/null || true)
  if [ -n "$PIDS" ]; then
    echo "  Killing OS processes on port $PORT: $PIDS"
    echo "$PIDS" | xargs kill -9 2>/dev/null || true
  fi
done

echo "==> Pruning stopped containers..."
docker container prune -f

echo "==> Building images..."
docker-compose build --no-cache

echo "==> Starting containers..."
docker-compose up -d

echo "==> Waiting for containers to start..."
sleep 15

echo "==> Running Database Migrations..."
docker exec retail_store_backend npx prisma db push --schema prisma/schema-master.prisma
docker exec retail_store_backend npx prisma db push --schema prisma/schema.prisma

echo "Deployment Complete!"
