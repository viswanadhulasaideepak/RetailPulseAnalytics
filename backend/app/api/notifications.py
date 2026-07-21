from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user

from app.schemas.notification import NotificationResponse

from app.services import notification_service

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)

#-----------------------Get Notifications-----------------------
@router.get(
    "/",
    response_model=list[NotificationResponse],
)
def get_notifications(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return notification_service.get_notifications(
        db,
        current_user.company_id,
    )

#-------------------Mark as Read----------------------
@router.put("/{notification_id}")
def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
):
    return notification_service.mark_as_read(
        db,
        notification_id,
    )