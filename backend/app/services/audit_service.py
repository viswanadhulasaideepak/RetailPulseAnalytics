from sqlalchemy.orm import Session
from app.crud import audit_log as audit_crud
from app.models.audit_log import AuditLog


def create_audit_log(
    db: Session,
    *,
    company_id: int,
    user_id: int,
    action: str,
    invoice_number: str | None = None,
    product_name: str | None = None,
    ip_address: str | None = None,
    browser: str | None = None,
):
    log_entry = AuditLog(
        company_id=company_id,
        user_id=user_id,
        action=action,
        invoice_number=invoice_number,
        product_name=product_name,
        ip_address=ip_address,
        browser=browser,
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry

def get_audit_logs(
    db: Session,
    company_id: int,
    search: str |None=None,
):
    return audit_crud.get_audit_logs(
        db,
        company_id,
        search,
    )