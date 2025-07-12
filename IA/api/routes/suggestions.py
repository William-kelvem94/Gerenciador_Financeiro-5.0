from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import logging

router = APIRouter()

class SavingsSuggestion(BaseModel):
    category: str
    current_spending: float
    suggested_budget: float
    potential_savings: float
    confidence: float
    tips: List[str]

class BudgetSuggestion(BaseModel):
    category: str
    current_budget: float
    suggested_budget: float
    reason: str
    impact: str

@router.get("/savings")
async def get_savings_suggestions(user_id: str):
    """
    Get personalized savings suggestions based on spending patterns.
    """
    try:
        # Simulated AI analysis for demo
        # In real implementation, this would analyze user's transaction history
        
        suggestions = [
            SavingsSuggestion(
                category="Food & Dining",
                current_spending=800.0,
                suggested_budget=600.0,
                potential_savings=200.0,
                confidence=0.85,
                tips=[
                    "Consider cooking more meals at home",
                    "Look for restaurant deals and discounts",
                    "Plan weekly meals to reduce impulse dining"
                ]
            ),
            SavingsSuggestion(
                category="Subscriptions",
                current_spending=150.0,
                suggested_budget=90.0,
                potential_savings=60.0,
                confidence=0.92,
                tips=[
                    "Cancel unused streaming services",
                    "Review and optimize subscription plans",
                    "Consider annual plans for active subscriptions"
                ]
            ),
            SavingsSuggestion(
                category="Transportation",
                current_spending=300.0,
                suggested_budget=220.0,
                potential_savings=80.0,
                confidence=0.78,
                tips=[
                    "Use public transportation more often",
                    "Combine trips to reduce fuel costs",
                    "Consider carpooling for work commute"
                ]
            )
        ]
        
        total_potential_savings = sum(s.potential_savings for s in suggestions)
        
        return {
            "user_id": user_id,
            "total_potential_savings": total_potential_savings,
            "suggestions": suggestions,
            "analysis_date": "2024-01-01T00:00:00Z"
        }
        
    except Exception as e:
        logging.error(f"Savings suggestions error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate savings suggestions")

@router.get("/budget")
async def get_budget_suggestions(user_id: str):
    """
    Get budget optimization recommendations.
    """
    try:
        suggestions = [
            BudgetSuggestion(
                category="Emergency Fund",
                current_budget=0.0,
                suggested_budget=500.0,
                reason="No emergency fund detected",
                impact="High priority - provides financial security"
            ),
            BudgetSuggestion(
                category="Entertainment",
                current_budget=200.0,
                suggested_budget=150.0,
                reason="Spending exceeds typical recommendations",
                impact="Medium priority - improve cash flow"
            ),
            BudgetSuggestion(
                category="Investments",
                current_budget=100.0,
                suggested_budget=300.0,
                reason="Low investment allocation for income level",
                impact="High priority - long-term wealth building"
            )
        ]
        
        return {
            "user_id": user_id,
            "suggestions": suggestions,
            "overall_health_score": 75,
            "analysis_date": "2024-01-01T00:00:00Z"
        }
        
    except Exception as e:
        logging.error(f"Budget suggestions error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate budget suggestions")

@router.get("/categories")
async def get_category_insights(user_id: str):
    """
    Get insights about spending patterns by category.
    """
    try:
        insights = [
            {
                "category": "Food & Dining",
                "percentage_of_income": 25.0,
                "trend": "increasing",
                "comparison_to_peers": "above_average",
                "insight": "Your food spending is 40% higher than similar income brackets"
            },
            {
                "category": "Transportation",
                "percentage_of_income": 15.0,
                "trend": "stable",
                "comparison_to_peers": "average",
                "insight": "Transportation costs are within normal range"
            },
            {
                "category": "Bills & Utilities",
                "percentage_of_income": 20.0,
                "trend": "stable",
                "comparison_to_peers": "below_average",
                "insight": "Good job keeping utility costs low"
            }
        ]
        
        return {
            "user_id": user_id,
            "insights": insights,
            "recommendations": [
                "Focus on reducing food expenses for biggest impact",
                "Consider energy-efficient upgrades to maintain low utility costs",
                "Transportation costs are well-managed"
            ],
            "analysis_date": "2024-01-01T00:00:00Z"
        }
        
    except Exception as e:
        logging.error(f"Category insights error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate category insights")