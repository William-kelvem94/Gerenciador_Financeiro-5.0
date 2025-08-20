from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Optional
import logging

router = APIRouter()

class TransactionData(BaseModel):
    description: str
    amount: float
    date: str
    account_type: Optional[str] = None

class ClassificationResult(BaseModel):
    category: str
    confidence: float
    suggested_categories: List[Dict[str, float]]

class BatchClassificationRequest(BaseModel):
    transactions: List[TransactionData]

@router.post("/transaction", response_model=ClassificationResult)
async def classify_transaction(transaction: TransactionData):
    """
    Classify a single transaction into a category.
    """
    try:
        # Simulated AI classification logic
        # In a real implementation, this would use trained ML models
        
        description_lower = transaction.description.lower()
        
        # Simple rule-based classification for demo
        if any(word in description_lower for word in ['restaurant', 'food', 'meal', 'dining']):
            category = "Food & Dining"
            confidence = 0.85
        elif any(word in description_lower for word in ['gas', 'fuel', 'transport', 'uber', 'taxi']):
            category = "Transportation"
            confidence = 0.90
        elif any(word in description_lower for word in ['shop', 'store', 'market', 'purchase']):
            category = "Shopping"
            confidence = 0.75
        elif any(word in description_lower for word in ['bill', 'electric', 'water', 'internet', 'phone']):
            category = "Bills & Utilities"
            confidence = 0.88
        elif any(word in description_lower for word in ['salary', 'income', 'payroll', 'wage']):
            category = "Salary"
            confidence = 0.95
        else:
            category = "Other"
            confidence = 0.60
            
        suggested_categories = [
            {"Food & Dining": 0.25},
            {"Transportation": 0.20},
            {"Shopping": 0.15},
            {"Bills & Utilities": 0.10}
        ]
        
        return ClassificationResult(
            category=category,
            confidence=confidence,
            suggested_categories=suggested_categories
        )
        
    except Exception as e:
        logging.error(f"Classification error: {str(e)}")
        raise HTTPException(status_code=500, detail="Classification failed")

@router.post("/batch")
async def classify_batch(request: BatchClassificationRequest):
    """
    Classify multiple transactions in batch.
    """
    try:
        results = []
        for transaction in request.transactions:
            result = await classify_transaction(transaction)
            results.append({
                "transaction": transaction.dict(),
                "classification": result.dict()
            })
        
        return {
            "processed": len(results),
            "results": results
        }
        
    except Exception as e:
        logging.error(f"Batch classification error: {str(e)}")
        raise HTTPException(status_code=500, detail="Batch classification failed")

@router.post("/feedback")
async def classification_feedback(
    transaction_id: str,
    correct_category: str,
    predicted_category: str,
    confidence: float
):
    """
    Provide feedback to improve classification accuracy.
    """
    try:
        # In a real implementation, this would update the ML model
        # or store feedback for retraining
        
        feedback_data = {
            "transaction_id": transaction_id,
            "correct_category": correct_category,
            "predicted_category": predicted_category,
            "confidence": confidence,
            "timestamp": "2024-01-01T00:00:00Z"
        }
        
        # Log feedback for model improvement
        logging.info(f"Received classification feedback: {feedback_data}")
        
        return {
            "status": "feedback_received",
            "message": "Thank you for the feedback. This will help improve our AI model.",
            "feedback_id": f"fb_{transaction_id}_{correct_category}"
        }
        
    except Exception as e:
        logging.error(f"Feedback processing error: {str(e)}")
        raise HTTPException(status_code=500, detail="Feedback processing failed")