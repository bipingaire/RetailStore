#!/bin/bash

# One-Click Production Deployment Script
# This script builds and starts the entire RetailStore application

set -e  # Exit on error

echo "========================================="
echo "RetailStore - One-Click Deployment"
echo "========================================="
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "⚠️  .env.production not found. Creating from example..."
    if [ -f .env.production.example ]; then
        cp .env.production.example .env.production
        echo "📝 Please edit .env.production with your actual values:"
        echo "   - Domain names"
        echo "   - Database password"
        echo "   - API keys"
        echo "   - Email for SSL certificates"
        echo ""
        read -p "Press Enter after you've configured .env.production..."
    else
        echo "❌ Error: .env.production.example not found!"
        exit 1
    fi
fi

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

echo "🔍 Pre-flight checks..."
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "Install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed!"
    echo "Install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

# Check DNS (optional but recommended)
echo "📡 Checking DNS configuration..."
if ! host ${NEXT_PUBLIC_RETAILOS_DOMAIN:-retailos.cloud} > /dev/null 2>&1; then
    echo "⚠️  Warning: ${NEXT_PUBLIC_RETAILOS_DOMAIN:-retailos.cloud} DNS not configured"
    echo "   SSL certificates will fail without proper DNS!"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "✅ Pre-flight checks passed!"
echo ""
echo "🏗️  Building Docker images..."
echo "   This may take 5-10 minutes on first run..."
echo ""

# Build all images
docker-compose build \
    --build-arg NEXT_PUBLIC_RETAILOS_DOMAIN=${NEXT_PUBLIC_RETAILOS_DOMAIN} \
    --build-arg NEXT_PUBLIC_INDUMART_DOMAIN=${NEXT_PUBLIC_INDUMART_DOMAIN} \
    --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    --build-arg NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL} \
    --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build failed! Check the errors above."
    exit 1
fi

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "🚀 Starting all services..."
echo ""

# Start all services in detached mode
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Show service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🔐 SSL Certificates:"
echo "   Caddy will automatically obtain SSL certificates"
echo "   This happens on first HTTPS request to your domains"
echo "   Check logs: docker-compose logs caddy"

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "==========================================="
echo "🌐 Your Application is Running!"
echo "==========================================="
echo ""
echo "📍 Access Points:"
echo "   🔹 RetailOS Admin: https://${NEXT_PUBLIC_RETAILOS_DOMAIN:-retailos.cloud}"
echo "   🔹 Super Admin: https://${NEXT_PUBLIC_RETAILOS_DOMAIN:-retailos.cloud}/super-admin"
echo "   🔹 Tenant Admin: https://${NEXT_PUBLIC_RETAILOS_DOMAIN:-retailos.cloud}/admin"
echo ""
echo "   🔹 Indumart Parent: https://${NEXT_PUBLIC_INDUMART_DOMAIN:-indumart.us}"
echo "   🔹 Store Example: https://[subdomain].${NEXT_PUBLIC_INDUMART_DOMAIN:-indumart.us}/shop"
echo ""
echo "==========================================="
echo "📋 Useful Commands:"
echo "==========================================="
echo "   View logs:        docker-compose logs -f"
echo "   View specific:    docker-compose logs -f caddy"
echo "   Stop all:         docker-compose down"
echo "   Restart:          docker-compose restart"
echo "   Update code:      git pull && docker-compose up -d --build"
echo ""
echo "🔍 Check Status:     docker-compose ps"
echo "💾 Backup DB:        docker-compose exec db pg_dump -U retailstore > backup.sql"
echo ""
echo "==========================================="
echo ""
echo "🎉 Happy Retailing! 🛍️"
echo ""
