from sqlalchemy import text

from app.database.session import SessionLocal

db = SessionLocal()

try:
    db.execute(
        text(
            """
            ALTER TABLE audit_logs
            ADD COLUMN quantity_changed INTEGER
            """
        )
    )
    print("✓ Added quantity_changed")
except Exception as e:
    print("quantity_changed:", e)

try:
    db.execute(
        text(
            """
            ALTER TABLE audit_logs
            ADD COLUMN movement_type VARCHAR(100)
            """
        )
    )
    print("✓ Added movement_type")
except Exception as e:
    print("movement_type:", e)

db.commit()
db.close()

print("Audit table updated successfully.")