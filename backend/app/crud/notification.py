from sqlalchemy.orm import Session

from app.models.notification import Notification


def create_notification(
    db: Session,
    company_id: int,
    title: str,
    message: str,
):
    notification = Notification(
        company_id=company_id,
        title=title,
        message=message,
    )

    db.add(notification)

    return notification


def get_notifications(
    db: Session,
    company_id: int,
):
    return (
        db.query(Notification)
        .filter(
            Notification.company_id == company_id
        )
        .order_by(Notification.created_at.desc())
        .all()
    )


def mark_as_read(
    db: Session,
    notification_id: int,
):
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id
        )
        .first()
    )

    if notification:

        notification.is_read = True

        db.commit()

        db.refresh(notification)

    return notification