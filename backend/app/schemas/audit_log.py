from datetime import datetime
from pydantic import BaseModel, ConfigDict


class AuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: int | None
    user_id: int | None

    action: str
    ip_address: str | None
    browser: str | None

    created_at: datetime

    user_name: str | None = None
    user_email: str | None = None