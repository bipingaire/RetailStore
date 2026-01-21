"""
Hybrid database manager:
- Master database: Global product catalog (shared, read-only for tenants)
- Tenant databases: Users, customers, orders, inventory (isolated)
"""

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import NullPool
from typing import Dict
import logging

from .config import settings

logger = logging.getLogger(__name__)


class DatabaseManager:
    """
    Manages connections to master and tenant databases.
    
    Master DB (shared):
    - Global product catalog (all tenants can read)
    - Tenant registry
    
    Tenant DBs (isolated):
    - Users (login credentials)
    - Customers
    - Inventory
    - Orders
    - Everything else
    """
    
    def __init__(self):
        # Master database engine (for global catalog)
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
        
        logger.info("DatabaseManager initialized: Master + Tenant DBs")
    
    def get_master_session(self) -> Session:
        """Get session for master database (global catalog)."""
        return self.MasterSession()
    
    def get_database_name(self, subdomain: str) -> str:
        """Get database name from subdomain."""
        return f"{settings.tenant_db_prefix}{subdomain}"
    
    def get_tenant_engine(self, database_name: str):
        """Get or create engine for a tenant database."""
        if database_name not in self._tenant_engines:
            tenant_url = (
                f"postgresql://{settings.db_user}:{settings.db_password}"
                f"@{settings.db_host}:{settings.db_port}/{database_name}"
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
            
            logger.info(f"Created tenant engine: {database_name}")
        
        return self._tenant_engines[database_name]
    
    def get_tenant_session(self, database_name: str) -> Session:
        """Get session for a tenant database."""
        if database_name not in self._tenant_sessions:
            self.get_tenant_engine(database_name)
        
        return self._tenant_sessions[database_name]()
    
    def create_tenant_database(self, subdomain: str) -> str:
        """Create a new database for a tenant."""
        database_name = self.get_database_name(subdomain)
        
        postgres_url = (
            f"postgresql://{settings.db_user}:{settings.db_password}"
            f"@{settings.db_host}:{settings.db_port}/postgres"
        )
        
        temp_engine = create_engine(postgres_url, poolclass=NullPool, isolation_level="AUTOCOMMIT")
        
        with temp_engine.connect() as conn:
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
        """Initialize schema for a tenant database."""
        from .models.tenant_models import TenantBase
        
        engine = self.get_tenant_engine(database_name)
        TenantBase.metadata.create_all(bind=engine)
        
        logger.info(f"Initialized tenant schema: {database_name}")
    
    def init_master_schema(self):
        """Initialize master database schema."""
        from .models.master_models import MasterBase
        
        MasterBase.metadata.create_all(bind=self.master_engine)
        logger.info("Initialized master schema")
    
    def close_all(self):
        """Close all database connections."""
        for engine in self._tenant_engines.values():
            engine.dispose()
        self.master_engine.dispose()
        logger.info("All database connections closed")


# Global instance
db_manager = DatabaseManager()


# Dependencies for FastAPI
def get_master_db() -> Session:
    """
    Get master database session (for global catalog).
    
    Usage:
        @router.get("/products")
        def get_products(master_db: Session = Depends(get_master_db)):
            # Access global product catalog
            ...
    """
    db = db_manager.get_master_session()
    try:
        yield db
    finally:
        db.close()


def get_tenant_db_by_name(database_name: str) -> Session:
    """Get tenant database session by name."""
    db = db_manager.get_tenant_session(database_name)
    try:
        yield db
    finally:
        db.close()
