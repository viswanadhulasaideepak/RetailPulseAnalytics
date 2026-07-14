from pydantic import BaseModel


class TokenData(BaseModel):
    sub: str
    role: str
    company_id: int