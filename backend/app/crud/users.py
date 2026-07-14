from sqlalchemy.orm import Session
from datetime import datetime
from app.models.user import User

# ------------------GET USERS-----------------

def get_user_by_id(
    db: Session,
    user_id: int,
):
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


def get_user_by_email(
    db: Session,
    email: str,
):
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


def get_company_users(
    db: Session,
    company_id: int,
):
    return (
        db.query(User)
        .filter(User.company_id == company_id)
        .order_by(User.created_at.desc())
        .all()
    )

#-------------------- CREATE USER--------------------

def create_user(
    db: Session,
    company_id: int,
    name: str,
    email: str,
    password_hash: str,
    role: str,
):
    user = User(
        company_id=company_id,
        name=name,
        email=email,
        password_hash=password_hash,
        role=role,
        status="Active",
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

# --------------------UPDATE USER-------------------

def update_user(
    db: Session,
    user: User,
    name: str,
    role: str,
    status: str,
):
    user.name = name
    user.role = role
    user.status = status

    db.commit()
    db.refresh(user)

    return user

#--------------- UPDATE PASSWORD-----------------

def update_password(
    db: Session,
    user: User,
    password_hash: str,
):
    user.password_hash = password_hash

    db.commit()
    db.refresh(user)

    return user

#--------------------- UPDATE LAST LOGIN------------------

def update_last_login(
    db: Session,
    user: User,
):
    user.last_login = datetime.utcnow()

    db.commit()
    db.refresh(user)

    return user

#---------------------- DELETE USER------------------------

def delete_user(
    db: Session,
    user: User,
):
    db.delete(user)
    db.commit()

#---------------- ROLE FILTERS------------------

def get_users_by_role(
    db: Session,
    company_id: int,
    role: str,
):
    return (
        db.query(User)
        .filter(
            User.company_id == company_id,
            User.role == role,
        )
        .all()
    )

# ----------------------STATUS FILTERS-----------------------

def get_users_by_status(
    db: Session,
    company_id: int,
    status: str,
):
    return (
        db.query(User)
        .filter(
            User.company_id == company_id,
            User.status == status,
        )
        .all()
    )

# -------------------COMPANY ISOLATION--------------------

def user_belongs_to_company(
    db: Session,
    user_id: int,
    company_id: int,
):
    return (
        db.query(User)
        .filter(
            User.id == user_id,
            User.company_id == company_id,
        )
        .first()
    )