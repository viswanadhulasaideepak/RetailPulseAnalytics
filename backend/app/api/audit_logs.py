from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import require_role

from app.schemas.audit_log import AuditLogResponse

from app.services import audit_service

router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit Logs"],
)


@router.get(
    "/",
    response_model=list[AuditLogResponse],
)
def get_logs(
    search: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role(
            "Admin",
            "Company Admin",
        )
    ),
):
    return audit_service.get_audit_logs(
        db,
        current_user.company_id,
        search,
    )