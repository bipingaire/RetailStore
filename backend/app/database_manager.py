"""
Multi-database manager for database-per-tenant architecture.

This module handles:
- Master database connection (global data)
- Tenant database connections (per-tenant data)
- Dynamic connection routing
"""

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import NullPool
from typing import Dict, Optional
import logging

from .config import settings

logger = logging.getLogger(__name__)


class DatabaseManager:
    """
    Manages connections to master database and multiple tenant databases.
    
    Architecture:
    - Master DB: tenants, users, global products, superadmins
    - Tenant DBs: inventory, orders, customers, vendors (per tenant)
    """
    
    def __init__(self):
        # Master database engine
        self.master_engine = create_engine(
            settings.master_database_url,
            pool_pre_ping=True,
            echo=settings.debug
        )
        self.MasterSession = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self.master_engine
        )
        
        # Tenant database engines cache
        self._tenant_engines: Dict[str, any] = {}
        self._tenant_sessions: Dict[str, sessionmaker] = {}
        
        logger.info("DatabaseManager initialized with master DB")
    
    def get_master_session(self) -> Session:
        """Get a session for the master database."""
        return self.MasterSession()
    
    def get_tenant_engine(self, database_name: str):
        """
        Get or create engine for a tenant database.
        
        Args:
            database_name: Name of the tenant database
            
        Returns:
            SQLAlchemy engine for the tenant database
        """
        if database_name not in self._tenant_engines:
            # Build connection URL for tenant database
            tenant_url = (
                f"postgresql://{settings.tenant_db_user}:{settings.tenant_db_password}"
                f"@{settings.tenant_db_host}:{settings.tenant_db_port}/{database_name}"
            )
            
            self._tenant_engines[database_name] = create_engine(
                tenant_url,
                pool_pre_ping=True,
                pool_size=settings.db_pool_size,
                max_overflow=settings.db_max_overflow,
                echo=settings.debug
            )
            
            self._tenant_sessions[database_name] = sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=self._tenant_engines[database_name]
            )
            
            logger.info(f"Created engine for tenant database: {database_name}")
        
        return self._tenant_engines[database_name]
    
    def get_tenant_session(self, database_name: str) -> Session:
        """
        Get a session for a specific tenant database.
        
        Args:
            database_name: Name of the tenant database
            
        Returns:
            SQLAlchemy session for the tenant database
        """
        if database_name not in self._tenant_sessions:
            self.get_tenant_engine(database_name)
        
        return self._tenant_sessions[database_name]()
    
    def create_tenant_database(self, subdomain: str) -> str:
        """
        Create a new database for a tenant.
        
        Args:
            subdomain: Tenant subdomain
            
        Returns:
            Database name created
        """
        database_name = f"{settings.tenant_db_prefix}{subdomain}"
        
        # Connect to PostgreSQL without database to create new one
        postgres_url = (
            f"postgresql://{settings.tenant_db_user}:{settings.tenant_db_password}"
            f"@{settings.tenant_db_host}:{settings.tenant_db_port}/postgres"
        )
        
        # Use NullPool for this operation
        temp_engine = create_engine(postgres_url, poolclass=NullPool, isolation_level="AUTOCOMMIT")
        
        with temp_engine.connect() as conn:
            # Check if database exists
            result = conn.execute(
                text(f"SELECT 1 FROM pg_database WHERE datname = '{database_name}'")
            ).fetchone()
            
            if not result:
                conn.execute(text(f'CREATE DATABASE "{database_name}"'))
                logger.info(f"Created database: {database_name}")
            else:
                logger.info(f"Database already exists: {database_name}")
        
        temp_engine.dispose()
        
        return database_name
    
    def init_tenant_schema(self, database_name: str):
        """
        Initialize schema for a tenant database.
        
        Creates all tenant-specific tables.
        """
        from .models.tenant_models import TenantBase
        
        engine = self.get_tenant_engine(database_name)
        TenantBase.metadata.create_all(bind=engine)
        
        logger.info(f"Initialized schema for: {database_name}")
    
    def close_all(self):
        """Close all database connections."""
        for engine in self._tenant_engines.values():
            engine.dispose()
        self.master_engine.dispose()
        logger.info("All database connections closed")


# Global database manager instance
db_manager = DatabaseManager()


# Dependency functions for FastAPI
def get_master_db() -> Session:
    """
    FastAPI dependency for master database session.
    
    Usage:
        @router.get("/tenants")
        def get_tenants(db: Session = Depends(get_master_db)):
            ...
    """
    db = db_manager.get_master_session()
    try:
        yield db
    finally:
        db.close()


def get_tenant_db(database_name: str) -> Session:
    """
    Get tenant database session by database name.
    
    Note: This is typically not used directly. Use get_current_tenant_db instead.
    """
    db = db_manager.get_tenant_session(database_name)
    try:
        yield db
    finally:
        db.close()
