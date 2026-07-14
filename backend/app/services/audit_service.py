from typing import Optional

from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


def create_audit_log(
    db: Session,
    *,
    company_id: Optional[int],
    user_id: Optional[int],
    action: str,
    ip_address: Optional[str] = None,
    browser: Optional[str] = None,
) -> AuditLog:
    log_entry = AuditLog(
        company_id=company_id,
        user_id=user_id,
        action=action,
        ip_address=ip_address,
        browser=browser,
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry
