from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import uvicorn
import os
from typing import List, Dict, Any

from routes import classifier, suggestions, predictions, ocr

# Create FastAPI app
app = FastAPI(
    title="Will Finance 6.0 AI API",
    description="Intelligent financial analysis and automation",
    version="6.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(classifier.router, prefix="/classify", tags=["Classification"])
app.include_router(suggestions.router, prefix="/suggestions", tags=["Suggestions"])
app.include_router(predictions.router, prefix="/predict", tags=["Predictions"])
app.include_router(ocr.router, prefix="/ocr", tags=["OCR"])

@app.get("/")
async def root():
    return {
        "service": "Will Finance 6.0 AI API",
        "version": "6.0.0",
        "status": "operational",
        "features": [
            "Transaction Classification",
            "Savings Suggestions", 
            "Budget Predictions",
            "OCR Processing"
        ]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": "2024-01-01T00:00:00Z",
        "services": {
            "classifier": "operational",
            "suggestions": "operational", 
            "predictions": "operational",
            "ocr": "operational"
        }
    }

if __name__ == "__main__":
    port = int(os.getenv("AI_API_PORT", 8001))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True if os.getenv("ENVIRONMENT") == "development" else False
    )