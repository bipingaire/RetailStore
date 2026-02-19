#!/bin/bash
set -e
echo "Deploying RetailOS..."

echo "==> Pulling latest code..."
git pull

echo "==> Tearing down Docker containers..."
# Use the NEW docker compose plugin (space, not hyphen) to avoid ContainerConfig bug in old v1.29.2
docker compose down --remove-orphans 2>/dev/null || true
docker rm -f retail_store_backend retail_store_frontend retail_store_db 2>/dev/null || true

echo "==> Pruning stopped containers..."
docker container prune -f

echo "==> Clearing Docker build cache (prevents corrupted layer errors)..."
docker builder prune -f

echo "==> Installing nginx reverse proxy config..."
# Remove ALL known stale per-domain nginx configs that cause conflicts
for OLD in indumart.us retailos.cloud retailos-temp.conf retailstore retailos.conf; do
  rm -f /etc/nginx/sites-enabled/$OLD
done
rm -f /etc/nginx/conf.d/retailos.conf.disabled
# Install fresh unified config
cp nginx/retailos.conf /etc/nginx/sites-available/retailos.conf
ln -sf /etc/nginx/sites-available/retailos.conf /etc/nginx/sites-enabled/retailos.conf
nginx -t && systemctl reload nginx && echo "  ✅ nginx reloaded (zero downtime)"

echo "==> Building images..."
docker compose build --no-cache

echo "==> Starting containers..."
docker compose up -d

echo "==> Waiting for backend to become healthy..."
for i in $(seq 1 30); do
  STATUS=$(docker inspect --format='{{.State.Status}}' retail_store_backend 2>/dev/null || echo 'missing')
  if [ "$STATUS" = "running" ]; then
    echo "  ✅ Backend is running (attempt $i)"
    break
  fi
  echo "  ⏳ Backend status: $STATUS — waiting... ($i/30)"
  sleep 3
done

echo "==> Running Database Migrations..."
docker exec retail_store_backend npx prisma db push --schema prisma/schema-master.prisma || true
docker exec retail_store_backend npx prisma db push --schema prisma/schema.prisma || true

echo "==> Seeding InduMart tenants (highpoint + greensboro)..."
node scripts/seed-indumart-tenants.js || echo "  ⚠️  Seeding skipped (may already exist)"

echo ""
echo "✅ Deployment Complete! Traffic routing:"
echo ""
echo "  System nginx (port 80):"
echo "    retailos.cloud         → localhost:3010 (frontend)"
echo "    indumart.us            → localhost:3010 (frontend)"
echo "    *.indumart.us          → localhost:3010 (frontend)"
echo ""
echo "  Docker containers:"
echo "    retail_store_frontend  → localhost:3010"
echo "    retail_store_backend   → localhost:3011"
echo ""
