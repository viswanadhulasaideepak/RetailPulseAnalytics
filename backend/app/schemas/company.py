from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator


class CompanyRegister(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=150)
    industry: str = Field(..., min_length=2, max_length=100)
    company_email: EmailStr
    company_address: str = Field(..., min_length=5)
    company_phone: str = Field(..., min_length=10, max_length=20)

    owner_name: str = Field(..., min_length=2, max_length=100)
    owner_email: EmailStr

    password: str = Field(..., min_length=8)
    confirm_password: str

    @model_validator(mode="after")
    def validate_passwords(self):
        if self.password != self.confirm_password:
            raise ValueError("Password and Confirm Password do not match")
        return self


class CompanyResponse(BaseModel):
    id: int
    name: str
    industry: str
    email: EmailStr
    address: str
    phone: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)