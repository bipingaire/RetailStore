from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Master Database (Global data: tenants, users, global catalog)
    master_database_url: str = Field(..., env="MASTER_DATABASE_URL")
    
    # Tenant Databases (Per-tenant data: inventory, orders, etc.)
    tenant_db_host: str = Field(default="localhost", env="TENANT_DB_HOST")
    tenant_db_port: int = Field(default=5432, env="TENANT_DB_PORT")
    tenant_db_user: str = Field(default="postgres", env="TENANT_DB_USER")
    tenant_db_password: str = Field(..., env="TENANT_DB_PASSWORD")
    tenant_db_prefix: str = Field(default="retailstore_tenant_", env="TENANT_DB_PREFIX")
    
    # Connection Pool Settings
    db_pool_size: int = Field(default=20, env="DB_POOL_SIZE")
    db_max_overflow: int = Field(default=10, env="DB_MAX_OVERFLOW")
    
    # JWT
    secret_key: str = Field(..., env="SECRET_KEY")
    algorithm: str = Field(default="HS256", env="ALGORITHM")
    access_token_expire_minutes: int = Field(default=30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_days: int = Field(default=7, env="REFRESH_TOKEN_EXPIRE_DAYS")
    
    # CORS
    cors_origins: List[str] = Field(
        default=["http://localhost:3000"],
        env="CORS_ORIGINS"
    )
    
    # File Storage
    upload_dir: str = Field(default="./uploads", env="UPLOAD_DIR")
    max_upload_size_mb: int = Field(default=10, env="MAX_UPLOAD_SIZE_MB")
    
    # AWS S3 (Optional)
    aws_access_key_id: str | None = Field(default=None, env="AWS_ACCESS_KEY_ID")
    aws_secret_access_key: str | None = Field(default=None, env="AWS_SECRET_ACCESS_KEY")
    aws_s3_bucket: str | None = Field(default=None, env="AWS_S3_BUCKET")
    aws_region: str = Field(default="us-east-1", env="AWS_REGION")
    
    # Redis (Optional)
    redis_url: str | None = Field(default=None, env="REDIS_URL")
    
    # App
    environment: str = Field(default="development", env="ENVIRONMENT")
    debug: bool = Field(default=True, env="DEBUG")
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        
        # Allow parsing comma-separated values for CORS_ORIGINS
        @staticmethod
        def parse_env_var(field_name: str, raw_val: str):
            if field_name == "CORS_ORIGINS":
                return [origin.strip() for origin in raw_val.split(",")]
            return raw_val


# Global settings instance
settings = Settings()
