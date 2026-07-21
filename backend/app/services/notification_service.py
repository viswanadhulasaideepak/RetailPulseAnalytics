from app.crud import notification as notification_crud


def create_notification(
    db,
    company_id,
    title,
    message,
):
    return notification_crud.create_notification(
        db,
        company_id,
        title,
        message,
    )


def get_notifications(
    db,
    company_id,
):
    return notification_crud.get_notifications(
        db,
        company_id,
    )


def mark_as_read(
    db,
    notification_id,
):
    return notification_crud.mark_as_read(
        db,
        notification_id,
    )