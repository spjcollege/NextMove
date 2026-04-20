import sqlite3
import os

db_path = "d:/Nirmay pc/ENGINEERING/projects/NextMove/backend/nextmove.db"

def check_orders():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(orders)")
    columns = [c[1] for c in cursor.fetchall()]
    print(f"Order columns: {columns}")
    
    # Check for tracking related columns added in recent tasks
    target_cols = ["tracking_number", "estimated_delivery", "status_updated_at"]
    for col in target_cols:
        if col not in columns:
            print(f"Adding {col} to orders...")
            # tracking_number is String, others are DateTime (NULL ok)
            if col == "tracking_number":
                cursor.execute(f"ALTER TABLE orders ADD COLUMN {col} TEXT DEFAULT ''")
            else:
                cursor.execute(f"ALTER TABLE orders ADD COLUMN {col} DATETIME")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    check_orders()
