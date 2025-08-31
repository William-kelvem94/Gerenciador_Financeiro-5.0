from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import logging

router = APIRouter()

class ExpensePrediction(BaseModel):
    category: str
    predicted_amount: float
    confidence: float
    factors: List[str]

class BudgetForecast(BaseModel):
    month: str
    predicted_expenses: float
    predicted_income: float
    budget_status: str
    confidence: float

class TrendAnalysis(BaseModel):
    category: str
    trend_direction: str  # "increasing", "decreasing", "stable"
    change_percentage: float
    significance: str  # "high", "medium", "low"

@router.post("/expenses")
async def predict_expenses(
    user_id: str,
    categories: Optional[List[str]] = None,
    months_ahead: int = 3
):
    """
    Predict future expenses for specific categories.
    """
    try:
        # Simulated ML prediction logic
        # In real implementation, this would use time series forecasting models
        
        if not categories:
            categories = ["Food & Dining", "Transportation", "Bills & Utilities", "Shopping"]
        
        predictions = []
        
        for category in categories:
            if category == "Food & Dining":
                predicted_amount = 750.0
                confidence = 0.87
                factors = ["Seasonal variation", "Historical average", "Recent trend"]
            elif category == "Transportation":
                predicted_amount = 280.0
                confidence = 0.82
                factors = ["Fuel price trends", "Usage patterns", "Seasonal factors"]
            elif category == "Bills & Utilities":
                predicted_amount = 320.0
                confidence = 0.95
                factors = ["Fixed costs", "Seasonal adjustments", "Rate changes"]
            else:
                predicted_amount = 200.0
                confidence = 0.70
                factors = ["Historical average", "Market trends"]
            
            predictions.append(ExpensePrediction(
                category=category,
                predicted_amount=predicted_amount,
                confidence=confidence,
                factors=factors
            ))
        
        total_predicted = sum(p.predicted_amount for p in predictions)
        
        return {
            "user_id": user_id,
            "prediction_period": f"{months_ahead} months",
            "total_predicted_expenses": total_predicted,
            "predictions": predictions,
            "generated_at": "2024-01-01T00:00:00Z"
        }
        
    except Exception as e:
        logging.error(f"Expense prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to predict expenses")

@router.post("/budget")
async def forecast_budget_performance(
    user_id: str,
    months_ahead: int = 6
):
    """
    Forecast budget performance for upcoming months.
    """
    try:
        forecasts = []
        
        months = ["2024-02", "2024-03", "2024-04", "2024-05", "2024-06", "2024-07"]
        
        for i, month in enumerate(months[:months_ahead]):
            # Simulate varying predictions
            base_expenses = 2500.0
            variation = (i * 50.0) - 100.0  # Some variation over time
            predicted_expenses = base_expenses + variation
            
            predicted_income = 4000.0  # Stable income
            
            if predicted_expenses > predicted_income * 0.8:
                budget_status = "over_budget"
            elif predicted_expenses < predicted_income * 0.6:
                budget_status = "under_budget"
            else:
                budget_status = "on_track"
            
            forecasts.append(BudgetForecast(
                month=month,
                predicted_expenses=predicted_expenses,
                predicted_income=predicted_income,
                budget_status=budget_status,
                confidence=0.85 - (i * 0.05)  # Confidence decreases for distant predictions
            ))
        
        return {
            "user_id": user_id,
            "forecast_period": f"{months_ahead} months",
            "forecasts": forecasts,
            "recommendations": [
                "Consider reducing discretionary spending in months 4-6",
                "Your income stability provides good budget predictability",
                "Emergency fund recommended for budget overruns"
            ],
            "generated_at": "2024-01-01T00:00:00Z"
        }
        
    except Exception as e:
        logging.error(f"Budget forecast error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to forecast budget")

@router.get("/trends")
async def analyze_spending_trends(user_id: str):
    """
    Analyze spending trends across categories.
    """
    try:
        trends = [
            TrendAnalysis(
                category="Food & Dining",
                trend_direction="increasing",
                change_percentage=15.2,
                significance="high"
            ),
            TrendAnalysis(
                category="Transportation",
                trend_direction="stable",
                change_percentage=-2.1,
                significance="low"
            ),
            TrendAnalysis(
                category="Shopping",
                trend_direction="decreasing",
                change_percentage=-8.7,
                significance="medium"
            ),
            TrendAnalysis(
                category="Bills & Utilities",
                trend_direction="stable",
                change_percentage=1.4,
                significance="low"
            )
        ]
        
        # Calculate overall trend
        significant_trends = [t for t in trends if t.significance in ["high", "medium"]]
        increasing_trends = [t for t in significant_trends if t.trend_direction == "increasing"]
        
        overall_assessment = {
            "status": "attention_needed" if increasing_trends else "stable",
            "primary_concern": increasing_trends[0].category if increasing_trends else None,
            "trends_count": {
                "increasing": len([t for t in trends if t.trend_direction == "increasing"]),
                "decreasing": len([t for t in trends if t.trend_direction == "decreasing"]),
                "stable": len([t for t in trends if t.trend_direction == "stable"])
            }
        }
        
        return {
            "user_id": user_id,
            "analysis_period": "last_6_months",
            "trends": trends,
            "overall_assessment": overall_assessment,
            "recommendations": [
                "Monitor food spending increases closely",
                "Good progress on reducing shopping expenses",
                "Utility costs remain well-controlled"
            ],
            "generated_at": "2024-01-01T00:00:00Z"
        }
        
    except Exception as e:
        logging.error(f"Trend analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze trends")