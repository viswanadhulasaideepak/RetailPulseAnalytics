from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserProfile(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    company_id: int
    status: str
    last_login: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    status: str

    model_config = ConfigDict(from_attributes=True)