import sqlite3

conn = sqlite3.connect("retailpulse.db")
cursor = conn.cursor()

print("SALES")
cursor.execute("PRAGMA table_info(sales)")
for row in cursor.fetchall():
    print(row)

print("\nSALE_ITEMS")
cursor.execute("PRAGMA table_info(sale_items)")
for row in cursor.fetchall():
    print(row)

conn.close()