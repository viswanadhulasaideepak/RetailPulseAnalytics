from fastapi import HTTPException, status
from sqlalchemy.orm import Query


def apply_company_scope(query: Query, company_id: int) -> Query:
    return query.filter_by(company_id=company_id)


def ensure_company_access(current_user, company_id: int) -> None:
    if current_user.role == "Super Admin":
        return

    if current_user.company_id != company_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this company",
        )
