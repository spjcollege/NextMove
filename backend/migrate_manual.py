import sqlite3
import os

db_path = "d:/Nirmay pc/ENGINEERING/projects/NextMove/backend/nextmove.db"

def migrate():
    if not os.path.exists(db_path):
        print("DB not found")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Check products
    cursor.execute("PRAGMA table_info(products)")
    columns = [c[1] for c in cursor.fetchall()]
    if "loyalty_points" not in columns:
        print("Adding loyalty_points to products...")
        cursor.execute("ALTER TABLE products ADD COLUMN loyalty_points INTEGER DEFAULT 0")
    
    # Check users
    cursor.execute("PRAGMA table_info(users)")
    columns = [c[1] for c in cursor.fetchall()]
    if "loyalty_points" not in columns:
        print("Adding loyalty_points to users...")
        cursor.execute("ALTER TABLE users ADD COLUMN loyalty_points INTEGER DEFAULT 0")

    conn.commit()
    conn.close()
    print("Migration finished")

if __name__ == "__main__":
    migrate()
