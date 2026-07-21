import sqlite3

DB_PATH = "retailpulse.db"   # Change this if your database has a different name

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

columns = [
    ("invoice_number", "TEXT"),
    ("product_name", "TEXT"),
    ("ip_address", "TEXT"),
    ("browser", "TEXT"),
]

for column_name, column_type in columns:
    try:
        cursor.execute(
            f"ALTER TABLE audit_logs ADD COLUMN {column_name} {column_type}"
        )
        print(f"Added column: {column_name}")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print(f"{column_name} already exists.")
        else:
            print(e)

conn.commit()
conn.close()

print("Audit Logs table updated successfully.")