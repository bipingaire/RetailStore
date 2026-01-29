#!/bin/bash
# Backend entrypoint script - runs migrations then starts the app

set -e

echo "========================================="
echo "Backend Startup - Running Migrations"
echo "========================================="

# Wait for database to be ready
echo "Waiting for database..."
python -c "
import time
import psycopg2
import os
from urllib.parse import urlparse

db_url = os.getenv('DATABASE_URL')
result = urlparse(db_url)

max_retries = 30
retry_count = 0

while retry_count < max_retries:
    try:
        conn = psycopg2.connect(
            database=result.path[1:],
            user=result.username,
            password=result.password,
            host=result.hostname,
            port=result.port
        )
        conn.close()
        print('✅ Database is ready!')
        break
    except psycopg2.OperationalError:
        retry_count += 1
        print(f'Database not ready yet... ({retry_count}/{max_retries})')
        time.sleep(2)
else:
    print('❌ Database not available after 60 seconds')
    exit(1)
"

# Run database migrations
echo ""
echo "Running Alembic migrations..."
alembic upgrade head

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully!"
else
    echo "❌ Migration failed!"
    exit 1
fi

echo ""
echo "========================================="
echo "Starting FastAPI Application"
echo "========================================="
echo ""

# Start the FastAPI application
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
