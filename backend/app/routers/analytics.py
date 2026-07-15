import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from .. import models, schemas
from ..database import get_db
from ..auth import get_current_admin

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


def _pct_change(current: float, previous: float) -> tuple[str, str]:
    """Returns (formatted change string, trend direction) comparing two periods."""
    if previous == 0:
        if current == 0:
            return "0.0%", "flat"
        return "+100.0%", "up"
    delta = (current - previous) / previous * 100
    trend = "up" if delta >= 0 else "down"
    return f"{delta:+.1f}%", trend


@router.get("", response_model=schemas.AnalyticsOut)
def get_analytics(
    db: Session = Depends(get_db),
    _admin: models.Admin = Depends(get_current_admin),
):
    today = datetime.date.today()
    last_7 = (today - datetime.timedelta(days=7)).isoformat()
    prev_14 = (today - datetime.timedelta(days=14)).isoformat()

    total_users = db.query(func.count(models.User.id)).scalar() or 0
    users_last_7 = db.query(func.count(models.User.id)).filter(models.User.joined >= last_7).scalar() or 0
    users_prev_7 = (
        db.query(func.count(models.User.id))
        .filter(models.User.joined >= prev_14, models.User.joined < last_7)
        .scalar()
        or 0
    )
    users_change, users_trend = _pct_change(users_last_7, users_prev_7)

    total_revenue = db.query(func.coalesce(func.sum(models.Order.amount), 0)).scalar() or 0
    revenue_last_7 = (
        db.query(func.coalesce(func.sum(models.Order.amount), 0))
        .filter(models.Order.date >= last_7)
        .scalar()
        or 0
    )
    revenue_prev_7 = (
        db.query(func.coalesce(func.sum(models.Order.amount), 0))
        .filter(models.Order.date >= prev_14, models.Order.date < last_7)
        .scalar()
        or 0
    )
    revenue_change, revenue_trend = _pct_change(float(revenue_last_7), float(revenue_prev_7))

    completed_orders = db.query(func.count(models.Order.id)).filter(models.Order.status == "Completed").scalar() or 0
    total_orders = db.query(func.count(models.Order.id)).scalar() or 0
    conversion_rate = (completed_orders / total_orders * 100) if total_orders else 0

    pending_orders = db.query(func.count(models.Order.id)).filter(models.Order.status == "Pending").scalar() or 0

    kpis = [
        {
            "label": "Total Users",
            "value": f"{total_users:,}",
            "change": users_change,
            "trend": users_trend,
            "icon": "👥",
        },
        {
            "label": "Total Revenue",
            "value": f"₹{total_revenue:,.0f}",
            "change": revenue_change,
            "trend": revenue_trend,
            "icon": "💰",
        },
        {
            "label": "Pending Orders",
            "value": f"{pending_orders:,}",
            "change": "",
            "trend": "flat",
            "icon": "📦",
        },
        {
            "label": "Conversion Rate",
            "value": f"{conversion_rate:.1f}%",
            "change": "",
            "trend": "flat",
            "icon": "🎯",
        },
    ]

    recent_orders = db.query(models.Order).order_by(models.Order.date.desc()).limit(5).all()

    return {"kpis": kpis, "recentOrders": recent_orders}
