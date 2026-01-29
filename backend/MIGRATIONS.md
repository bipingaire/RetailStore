# Automatic Database Migrations

The backend is configured to **automatically run database migrations** on startup.

## How It Works

When the backend container starts:

1. **Waits for database** - Ensures PostgreSQL is ready (up to 60 seconds)
2. **Runs migrations** - Executes `alembic upgrade head`
3. **Starts application** - Launches FastAPI server

This happens automatically via the `entrypoint.sh` script.

## Files

- `backend/entrypoint.sh` - Startup script with migration logic
- `backend/alembic/` - Migration files directory
- `backend/alembic.ini` - Alembic configuration

## Creating New Migrations

```bash
# Enter backend container
docker-compose exec backend bash

# Create a new migration
alembic revision --autogenerate -m "description of changes"

# Apply migration (automatic on restart)
alembic upgrade head
```

## Manual Migration Commands

```bash
# Apply all pending migrations
docker-compose exec backend alembic upgrade head

# Rollback one migration
docker-compose exec backend alembic downgrade -1

# View migration history
docker-compose exec backend alembic history

# Check current version
docker-compose exec backend alembic current
```

## Local Development

For local development (without Docker):

```bash
cd backend

# Run migrations
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "add user table"

# Start app
uvicorn app.main:app --reload
```

## Troubleshooting

### Migration Fails on Startup

Check logs:
```bash
docker-compose logs backend
```

Common issues:
- Database not ready (increase wait time in entrypoint.sh)
- Migration conflict (check `alembic history`)
- Database credentials incorrect

### Reset Database

```bash
# Stop everything
docker-compose down

# Remove database volume
docker volume rm retailstore_postgres-data

# Start fresh (migrations run automatically)
docker-compose up -d
```

## Production Notes

- ✅ Migrations run automatically on deployment
- ✅ Zero-downtime if migrations are backward compatible
- ✅ Logs show migration status
- ⚠️ Always backup database before major migrations
- ⚠️ Test migrations on staging first

## Best Practices

1. **Always test migrations** on staging environment
2. **Backup database** before major schema changes
3. **Use alembic downgrade** for reversible migrations
4. **Review migration SQL** with `alembic upgrade head --sql`
5. **Keep migrations small** and focused
