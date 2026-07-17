from sqlalchemy.orm import Session, joinedload

from app.models.audit_log import AuditLog
from app.models.user import User


def get_audit_logs(
    db: Session,
    company_id: int,
    search: str | None = None,
):
    query = (
        db.query(AuditLog)
        .options(joinedload(AuditLog.user))
        .filter(AuditLog.company_id == company_id)
    )

    if search:
        query = query.filter(
            AuditLog.action.ilike(f"%{search}%")
        )

    logs = (
        query.order_by(AuditLog.created_at.desc())
        .all()
    )

    results = []

    for log in logs:
        log.user_name = log.user.name if log.user else "-"
        log.user_email = log.user.email if log.user else "-"
        results.append(log)

    return results