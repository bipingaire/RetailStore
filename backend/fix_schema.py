import os
import psycopg2
import time

def fix_schema():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("❌ DATABASE_URL not set")
        return

    print(f"🔌 Connecting to database...")
    
    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cur = conn.cursor()
        
        # Check columns
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'users';")
        columns = [row[0] for row in cur.fetchall()]
        print(f"📊 Current columns in 'users' table: {columns}")
        
        if 'hashed_password' in columns:
            print("🛠️  Found 'hashed_password'. Renaming to 'encrypted_password'...")
            cur.execute("ALTER TABLE users RENAME COLUMN hashed_password TO encrypted_password;")
            print("✅ Rename successful!")
        elif 'encrypted_password' in columns:
            print("✅ 'encrypted_password' already exists. Schema is correct.")
        else:
            print("⚠️  Neither 'hashed_password' nor 'encrypted_password' found! Table might be empty or wrong.")
            
        cur.close()
        conn.close()

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    fix_schema()
