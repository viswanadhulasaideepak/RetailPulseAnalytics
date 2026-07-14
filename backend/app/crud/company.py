from sqlalchemy.orm import Session

from app.models.company import Company

# -------------------GET COMPANY-----------------

def get_company_by_id(db: Session, company_id: int):
    return (
        db.query(Company)
        .filter(Company.id == company_id)
        .first()
    )


def get_company_by_email(db: Session, email: str):
    return (
        db.query(Company)
        .filter(Company.email == email)
        .first()
    )


def get_company_by_name(db: Session, name: str):
    return (
        db.query(Company)
        .filter(Company.name == name)
        .first()
    )

#--------------------LIST COMPANIES---------------------

def get_all_companies(db: Session):
    return (
        db.query(Company)
        .order_by(Company.created_at.desc())
        .all()
    )

# -------------------UPDATE COMPANY-----------------

def update_company(
    db: Session,
    company: Company,
    name: str,
    industry: str,
    email: str,
    address: str,
    phone: str,
):
    company.name = name
    company.industry = industry
    company.email = email
    company.address = address
    company.phone = phone

    db.commit()
    db.refresh(company)

    return company

# -------------------------DELETE COMPANY--------------------

def delete_company(
    db: Session,
    company: Company,
):
    db.delete(company)
    db.commit()

#---------------- COMPANY ISOLATION------------

def get_company_by_company_id(
    db: Session,
    company_id: int,
):
    return (
        db.query(Company)
        .filter(Company.id == company_id)
        .first()
    )