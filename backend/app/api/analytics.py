from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_role
from app.database.session import get_db
from app.models.user import User
from app.services.analytics_service import get_dashboard_data

from app.services.analytics_service import (
    revenue_trend,
    sales_trend,
    top_products,
    top_categories,
    payment_methods,
    sales_channels,
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("/",dependencies=[Depends(require_role("Super Admin","Company Admin", "Analyst"))],)
def list_analytics(
    current_user: User = Depends(get_current_user),
):
    return {
        "items": [],
        "company_id": current_user.company_id,
        "role": current_user.role,
        "message": "Analytics endpoint ready for company-scoped data access",
    }


@router.get("/dashboard",dependencies=[Depends(require_role("Company Admin", "Analyst"))],)
def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_dashboard_data(
        db,
        current_user.company_id,
    )
    
#-----------------Revenue Trend-----------------

@router.get(
    "/revenue-trend",
    dependencies=[
        Depends(
            require_role(
                "Super Admin",
                "Company Admin",
                "Analyst",
            )
        )
    ],
)
def revenue_chart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return revenue_trend(
        db,
        current_user.company_id,
    )
    
#------------------------Sales Trend---------------------- 

@router.get(
    "/sales-trend",
    dependencies=[
        Depends(
            require_role(
                "Super Admin",
                "Company Admin",
                "Analyst",
            )
        )
    ],
)
def sales_chart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return sales_trend(
        db,
        current_user.company_id,
    )
    
#-------------------Top Products--------------------

@router.get(
    "/top-products",
    dependencies=[
        Depends(
            require_role(
                "Super Admin",
                "Company Admin",
                "Analyst",
            )
        )
    ],
)
def products_chart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return top_products(
        db,
        current_user.company_id,
    )
    
#--------------------Top Caegories--------------------

@router.get(
    "/top-categories",
    dependencies=[
        Depends(
            require_role(
                "Super Admin",
                "Company Admin",
                "Analyst",
            )
        )
    ],
)
def categories_chart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return top_categories(
        db,
        current_user.company_id,
    )
    
#-------------------Payment Methods-----------------------

@router.get(
    "/payment-methods",
    dependencies=[
        Depends(
            require_role(
                "Super Admin",
                "Company Admin",
                "Analyst",
            )
        )
    ],
)
def payment_chart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return payment_methods(
        db,
        current_user.company_id,
    )
    
#-----------------Sales Channels--------------------

@router.get(
    "/sales-channels",
    dependencies=[
        Depends(
            require_role(
                "Super Admin",
                "Company Admin",
                "Analyst",
            )
        )
    ],
)
def channel_chart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return sales_channels(
        db,
        current_user.company_id,
    )                       