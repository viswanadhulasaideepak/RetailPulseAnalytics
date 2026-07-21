from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.base import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String(255), nullable=False)
    invoice_number = Column(String(100),nullable=True)
    product_name = Column(String(255),nullable=True)
    ip_address = Column(String(100))
    browser = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    company = relationship("Company",lazy="joined")
    user = relationship("User",back_populates="audit_logs",lazy="joined")