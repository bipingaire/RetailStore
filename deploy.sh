#!/bin/bash
set -e
echo "Deploying RetailOS..."

echo "==> Pulling latest code..."
git pull

echo "==> Tearing down Docker containers..."
docker-compose down --remove-orphans 2>/dev/null || true
docker rm -f retail_store_backend retail_store_frontend retail_store_db 2>/dev/null || true

echo "==> Pruning stopped containers..."
docker container prune -f

echo "==> Installing nginx reverse proxy config..."
cp nginx/retailos.conf /etc/nginx/sites-available/retailos.conf
# Enable the site if not already linked
ln -sf /etc/nginx/sites-available/retailos.conf /etc/nginx/sites-enabled/retailos.conf
# Test config and reload (does NOT kill nginx, just reloads — zero downtime)
nginx -t && systemctl reload nginx && echo "  ✅ nginx reloaded (zero downtime)"

echo "==> Building images..."
docker-compose build --no-cache

echo "==> Starting containers..."
docker-compose up -d

echo "==> Waiting for containers to start..."
sleep 20

echo "==> Running Database Migrations..."
docker exec retail_store_backend npx prisma db push --schema prisma/schema-master.prisma
docker exec retail_store_backend npx prisma db push --schema prisma/schema.prisma

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
