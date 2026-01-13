# Reverse Proxy Setup for Shared Hosting

Since you have multiple applications on the same server, we'll use your existing web server as a reverse proxy.

## Step 1: Deploy the App (Without Caddy)

On your VPS:

```bash
cd ~/retailstore/RetailStore/deploy

# Stop any existing containers
docker compose -f docker-compose.prod.yml down 2>/dev/null

# Start just the app (no Caddy)
docker compose -f docker-compose.simple.yml --env-file .env.production up -d

# Verify it's running
docker ps
curl http://localhost:3010
```

## Step 2: Configure Your Web Server

### For Nginx:

```bash
# Copy the config
sudo cp nginx-proxy.conf /etc/nginx/sites-available/retailos.conf

# Enable the site
sudo ln -s /etc/nginx/sites-available/retailos.conf /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### For Apache:

```bash
# Enable required modules
sudo a2enmod proxy proxy_http ssl rewrite

# Copy the config
sudo cp apache-proxy.conf /etc/apache2/sites-available/retailos.conf

# Enable the site
sudo a2ensite retailos

# Test configuration
sudo apache2ctl configtest

# Reload Apache
sudo systemctl reload apache2
```

## Step 3: Get SSL Certificate

```bash
# Install Certbot (if not already installed)
sudo apt update
sudo apt install certbot

# For Nginx
sudo apt install python3-certbot-nginx
sudo certbot --nginx -d retailos.cloud -d *.retailos.cloud

# For Apache
sudo apt install python3-certbot-apache
sudo certbot --apache -d retailos.cloud -d *.retailos.cloud
```

## Step 4: Verify

Visit https://retailos.cloud in your browser!

## Troubleshooting

**Port 3010 not accessible?**
```bash
# Check if app is running
docker logs retailos-app

# Check if port is listening
sudo netstat -tulpn | grep 3010
```

**502 Bad Gateway?**
- App might not be running
- Check `docker logs retailos-app`
- Ensure proxy config points to `localhost:3010`

**SSL errors?**
- Ensure DNS points to your server
- Wait 5 minutes for DNS propagation
- Run certbot again
