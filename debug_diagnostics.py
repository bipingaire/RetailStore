
import sys
import os
from sqlalchemy import text, inspect
from app.database_manager import db_manager
from app.models import Vendor

def debug_tenant_connection(subdomain="highpoint"):
    print(f"--- DEBUGGING TENANT: {subdomain} ---")
    
    # 1. Get Engine
    try:
        db_name = db_manager.get_database_name(subdomain)
        print(f"Target Database: {db_name}")
        engine = db_manager.get_tenant_engine(db_name)
        print(f"Engine URL: {engine.url}")
    except Exception as e:
        print(f"FAILED to get engine: {e}")
        return

    # 2. Check Connection & Schema
    try:
        with engine.connect() as conn:
            print("\n[Connection Info]")
            db_current = conn.execute(text("SELECT current_database()")).scalar()
            schema_current = conn.execute(text("SELECT current_schema()")).scalar()
            search_path = conn.execute(text("SHOW search_path")).scalar()
            user_current = conn.execute(text("SELECT current_user")).scalar()
            
            print(f"Connected to DB: {db_current}")
            print(f"Current Schema: {schema_current}")
            print(f"Search Path: {search_path}")
            print(f"Current User: {user_current}")
            
            # 3. Check Table Visibility (Raw SQL)
            print("\n[Raw SQL Check]")
            # Try to select from 'vendors' assuming public schema or search path
            try:
                res = conn.execute(text("SELECT count(*) FROM vendors")).scalar()
                print(f"SELECT count(*) FROM vendors -> SUCCESS: {res}")
            except Exception as e:
                print(f"SELECT count(*) FROM vendors -> FAILED: {e}")
                
            # Try with explicit schema
            try:
                res = conn.execute(text("SELECT count(*) FROM public.vendors")).scalar()
                print(f"SELECT count(*) FROM public.vendors -> SUCCESS: {res}")
            except Exception as e:
                print(f"SELECT count(*) FROM public.vendors -> FAILED: {e}")

    except Exception as e:
        print(f"Connection/Schema Check FAILED: {e}")

    # 4. Check Inspector
    try:
        print("\n[Inspector Check]")
        insp = inspect(engine)
        tables = insp.get_table_names()
        print(f"Visible Tables: {tables}")
        if "vendors" in tables:
            print("Verified: 'vendors' table exists in inspector.")
        else:
            print("CRITICAL: 'vendors' table NOT found in inspector.")
    except Exception as e:
        print(f"Inspector Check FAILED: {e}")

    # 5. Check ORM
    try:
        print("\n[ORM Check]")
        session = db_manager.get_tenant_session(db_name)
        try:
            count = session.query(Vendor).count()
            print(f"ORM Query (Vendor) -> SUCCESS: Count = {count}")
            
            # Print mapping info
            print(f"Vendor Table Name: {Vendor.__tablename__}")
            if hasattr(Vendor, '__table_args__'):
                print(f"Vendor Table Args: {Vendor.__table_args__}")
                
        except Exception as e:
            print(f"ORM Query (Vendor) -> FAILED: {e}")
        finally:
            session.close()
    except Exception as e:
        print(f"ORM Setup FAILED: {e}")

if __name__ == "__main__":
    debug_tenant_connection()
