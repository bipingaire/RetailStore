#!/bin/bash

# Setup script for RetailStore VPS Deployment (GitHub Workflow)

# Stop on error
set -e

echo "🚀 Starting RetailStore VPS Setup..."

# 1. Update System
echo "📦 Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install Docker & Docker Compose if not present
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
    
    # Add current user to docker group
    sudo usermod -aG docker $USER
    echo "⚠️  User added to docker group. You might need to log out and back in if this script fails next."
else
    echo "✅ Docker already installed"
fi

# 3. Check for .env.production file
ENV_FILE=".env.production"
if [ -f .env.production ]; then
    ENV_FILE=".env.production"
elif [ -f ../.env.production ]; then
    ENV_FILE="../.env.production"
else
    echo "❌ Error: .env.production file not found in current or parent directory!"
    echo "👉 Please create .env.production with your secrets."
    exit 1
fi

echo "Using env file: $ENV_FILE"

# 4. Deploy
echo "🚀 Deploying containers..."
# Use docker-compose.prod.yml with .env.production
docker compose -f docker-compose.prod.yml --env-file "$ENV_FILE" up -d --build --remove-orphans

echo "✅ Deployment complete!"
echo "🌍 Your app should be live at https://retailOS.cloud and https://indumart.us"
echo "🔍 Check logs with: docker compose -f docker-compose.prod.yml logs -f"
