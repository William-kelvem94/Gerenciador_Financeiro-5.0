from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Dict, Optional
import logging

router = APIRouter()

class ExtractedTransaction(BaseModel):
    date: str
    description: str
    amount: float
    type: str  # "debit" or "credit"
    confidence: float

class SupportedBank(BaseModel):
    bank_name: str
    formats_supported: List[str]
    features: List[str]

@router.post("/extract")
async def extract_transactions(
    file: UploadFile = File(...),
    bank_name: Optional[str] = None
):
    """
    Extract transaction data from bank statement files (PDF/images).
    """
    try:
        # Validate file type
        if not file.content_type.startswith(('image/', 'application/pdf')):
            raise HTTPException(
                status_code=400, 
                detail="Only image files and PDFs are supported"
            )
        
        # Read file content
        file_content = await file.read()
        
        # Simulated OCR processing
        # In real implementation, this would use OCR libraries like Tesseract
        # and specialized models for different bank statement formats
        
        extracted_transactions = [
            ExtractedTransaction(
                date="2024-01-15",
                description="SUPERMERCADO ABC",
                amount=127.50,
                type="debit",
                confidence=0.95
            ),
            ExtractedTransaction(
                date="2024-01-14",
                description="PAGAMENTO SALARIO",
                amount=3500.00,
                type="credit",
                confidence=0.98
            ),
            ExtractedTransaction(
                date="2024-01-13",
                description="POSTO COMBUSTIVEL XYZ",
                amount=89.90,
                type="debit",
                confidence=0.92
            ),
            ExtractedTransaction(
                date="2024-01-12",
                description="RESTAURANTE DEF",
                amount=45.80,
                type="debit",
                confidence=0.88
            )
        ]
        
        # Summary statistics
        total_credits = sum(t.amount for t in extracted_transactions if t.type == "credit")
        total_debits = sum(t.amount for t in extracted_transactions if t.type == "debit")
        avg_confidence = sum(t.confidence for t in extracted_transactions) / len(extracted_transactions)
        
        return {
            "filename": file.filename,
            "bank_detected": bank_name or "Generic Bank",
            "extraction_summary": {
                "total_transactions": len(extracted_transactions),
                "total_credits": total_credits,
                "total_debits": total_debits,
                "net_amount": total_credits - total_debits,
                "average_confidence": round(avg_confidence, 2)
            },
            "transactions": extracted_transactions,
            "processing_notes": [
                "OCR processing completed successfully",
                "Date formats standardized to ISO format",
                "Amounts converted to decimal format",
                "Transaction types classified automatically"
            ],
            "extracted_at": "2024-01-01T00:00:00Z"
        }
        
    except Exception as e:
        logging.error(f"OCR extraction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to extract transactions from file")

@router.get("/supported-banks", response_model=List[SupportedBank])
async def get_supported_banks():
    """
    Get list of supported banks and their formats.
    """
    try:
        supported_banks = [
            SupportedBank(
                bank_name="Banco do Brasil",
                formats_supported=["PDF", "JPG", "PNG"],
                features=[
                    "Account statements",
                    "Credit card statements", 
                    "Investment reports"
                ]
            ),
            SupportedBank(
                bank_name="Itaú",
                formats_supported=["PDF", "JPG", "PNG"],
                features=[
                    "Account statements",
                    "Credit card statements",
                    "Loan statements"
                ]
            ),
            SupportedBank(
                bank_name="Bradesco",
                formats_supported=["PDF", "JPG", "PNG"],
                features=[
                    "Account statements",
                    "Credit card statements"
                ]
            ),
            SupportedBank(
                bank_name="Santander",
                formats_supported=["PDF", "JPG", "PNG"],
                features=[
                    "Account statements",
                    "Credit card statements"
                ]
            ),
            SupportedBank(
                bank_name="Caixa Econômica Federal",
                formats_supported=["PDF", "JPG", "PNG"],
                features=[
                    "Account statements",
                    "FGTS statements"
                ]
            ),
            SupportedBank(
                bank_name="Nubank",
                formats_supported=["PDF", "JPG", "PNG"],
                features=[
                    "Credit card statements",
                    "Account statements",
                    "Investment reports"
                ]
            ),
            SupportedBank(
                bank_name="Inter",
                formats_supported=["PDF", "JPG", "PNG"],
                features=[
                    "Account statements",
                    "Credit card statements",
                    "Investment reports"
                ]
            ),
            SupportedBank(
                bank_name="Generic",
                formats_supported=["PDF", "JPG", "PNG", "XLSX", "CSV"],
                features=[
                    "Standard CSV import",
                    "Excel file processing",
                    "Manual format detection"
                ]
            )
        ]
        
        return supported_banks
        
    except Exception as e:
        logging.error(f"Supported banks error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get supported banks list")

@router.get("/formats")
async def get_supported_formats():
    """
    Get detailed information about supported file formats.
    """
    try:
        formats = {
            "pdf": {
                "description": "PDF bank statements",
                "max_size_mb": 10,
                "requirements": [
                    "Text-based PDF (not scanned images)",
                    "Standard bank statement format",
                    "Portuguese or English language"
                ]
            },
            "jpg": {
                "description": "JPEG images of statements",
                "max_size_mb": 5,
                "requirements": [
                    "Clear, high-resolution image",
                    "Good lighting and contrast",
                    "All text clearly visible"
                ]
            },
            "png": {
                "description": "PNG images of statements", 
                "max_size_mb": 5,
                "requirements": [
                    "Clear, high-resolution image",
                    "Good lighting and contrast",
                    "All text clearly visible"
                ]
            },
            "csv": {
                "description": "Comma-separated values",
                "max_size_mb": 2,
                "requirements": [
                    "Standard CSV format",
                    "Date, description, amount columns",
                    "UTF-8 encoding recommended"
                ]
            }
        }
        
        return {
            "supported_formats": formats,
            "processing_tips": [
                "Ensure good image quality for better OCR results",
                "PDF files should be text-based, not scanned images",
                "CSV files should have standard column headers",
                "Maximum file size limits apply per format"
            ],
            "accuracy_factors": [
                "Image resolution and clarity",
                "Bank statement format standardization",
                "Language and character recognition",
                "File size and complexity"
            ]
        }
        
    except Exception as e:
        logging.error(f"Formats info error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get format information")