#!/bin/bash

# RetailStore Production Build Script
# This script builds the Docker images for production deployment

set -e  # Exit on error

echo "========================================="
echo "RetailStore Production Build"
echo "========================================="
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please copy .env.production.example and configure it."
    exit 1
fi

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

echo "📦 Building Docker images..."
echo ""

# Build with docker-compose
docker-compose -f docker-compose.yml build \
    --build-arg NEXT_PUBLIC_RETAILOS_DOMAIN=${NEXT_PUBLIC_RETAILOS_DOMAIN} \
    --build-arg NEXT_PUBLIC_INDUMART_DOMAIN=${NEXT_PUBLIC_INDUMART_DOMAIN} \
    --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    --build-arg NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL} \
    --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "Next steps:"
echo "1. Configure your DNS records (see deploy/README.md)"
echo "2. Run: ./deploy/start.sh"
echo ""
