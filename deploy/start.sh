#!/bin/bash

# RetailStore Production Startup Script
# This script starts the production environment with SSL certificate generation

set -e  # Exit on error

echo "========================================="
echo "RetailStore Production Startup"
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

echo "🚀 Starting production services..."
echo ""

# Start services
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check if services are running
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🔐 Setting up SSL certificates..."
echo ""

# Check if certificates already exist
if [ ! -d "./certbot-data/live/${NEXT_PUBLIC_RETAILOS_DOMAIN}" ]; then
    echo "Obtaining SSL certificate for ${NEXT_PUBLIC_RETAILOS_DOMAIN}..."
    
    docker-compose run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email ${CERTBOT_EMAIL} \
        --agree-tos \
        --no-eff-email \
        -d ${NEXT_PUBLIC_RETAILOS_DOMAIN} \
        -d www.${NEXT_PUBLIC_RETAILOS_DOMAIN}
else
    echo "✓ Certificate for ${NEXT_PUBLIC_RETAILOS_DOMAIN} already exists"
fi

if [ ! -d "./certbot-data/live/${NEXT_PUBLIC_INDUMART_DOMAIN}" ]; then
    echo "Obtaining SSL certificate for ${NEXT_PUBLIC_INDUMART_DOMAIN}..."
    
    docker-compose run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email ${CERTBOT_EMAIL} \
        --agree-tos \
        --no-eff-email \
        -d ${NEXT_PUBLIC_INDUMART_DOMAIN} \
        -d www.${NEXT_PUBLIC_INDUMART_DOMAIN} \
        -d "*.${NEXT_PUBLIC_INDUMART_DOMAIN}"
else
    echo "✓ Certificate for ${NEXT_PUBLIC_INDUMART_DOMAIN} already exists"
fi

echo ""
echo "🔄 Reloading nginx with SSL certificates..."
docker-compose restart nginx

echo ""
echo "✅ Production environment is running!"
echo ""
echo "📍 Access your services:"
echo "   - RetailOS Admin: https://${NEXT_PUBLIC_RETAILOS_DOMAIN}"
echo "   - Indumart Parent: https://${NEXT_PUBLIC_INDUMART_DOMAIN}"
echo "   - Store Example: https://[subdomain].${NEXT_PUBLIC_INDUMART_DOMAIN}"
echo ""
echo "📋 Useful commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop: docker-compose down"
echo "   - Restart: docker-compose restart"
echo ""
