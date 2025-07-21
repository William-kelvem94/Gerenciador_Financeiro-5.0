# Will Finance 6.0 - AI Module

## Overview
This module provides intelligent financial analysis capabilities for the Will Finance 6.0 system, including:

- **Automatic Transaction Classification**: AI-powered categorization of transactions
- **Expense Pattern Analysis**: Detection of spending patterns and anomalies  
- **Savings Suggestions**: Personalized recommendations for financial optimization
- **Budget Predictions**: Forecasting future expenses based on historical data
- **OCR for Bank Statements**: Extract transaction data from PDF/image statements

## Architecture

```
IA/
├── api/                    # FastAPI REST endpoints
│   ├── main.py            # FastAPI application
│   ├── routes/            # API route handlers
│   └── middleware/        # Request processing middleware
├── models/                # AI models and training scripts
│   ├── classifier/        # Transaction classification models
│   ├── predictor/         # Budget prediction models
│   └── ocr/              # OCR processing models
├── services/              # Business logic services
│   ├── classifier.py      # Transaction classification service
│   ├── suggestions.py     # Savings suggestions service
│   ├── predictions.py     # Budget prediction service
│   └── ocr.py            # OCR processing service
├── datasets/              # Training data and samples
├── notebooks/             # Jupyter notebooks for experimentation
├── requirements.txt       # Python dependencies
└── Dockerfile            # Container configuration
```

## Features

### 1. Transaction Classification
- Automatically categorizes transactions based on description and amount
- Learns from user corrections to improve accuracy
- Supports custom categories and rules

### 2. Expense Analysis
- Identifies spending patterns and trends
- Detects unusual transactions and potential fraud
- Provides insights on budget performance

### 3. Savings Suggestions
- Analyzes spending habits to suggest optimizations
- Identifies subscription services and recurring expenses
- Recommends budget adjustments based on goals

### 4. Budget Predictions
- Forecasts future expenses based on historical data
- Predicts budget performance and potential overruns
- Suggests optimal budget allocations

### 5. OCR Processing
- Extracts transaction data from bank statements (PDF/images)
- Supports multiple Brazilian bank formats
- Validates and cleans extracted data

## API Endpoints

### Classification
- `POST /classify/transaction` - Classify a single transaction
- `POST /classify/batch` - Classify multiple transactions
- `POST /classify/feedback` - Provide feedback for model improvement

### Suggestions
- `GET /suggestions/savings` - Get personalized savings suggestions
- `GET /suggestions/budget` - Get budget optimization recommendations
- `GET /suggestions/categories` - Get category-based insights

### Predictions
- `POST /predict/expenses` - Predict future expenses
- `POST /predict/budget` - Forecast budget performance
- `GET /predict/trends` - Get spending trend analysis

### OCR
- `POST /ocr/extract` - Extract transactions from statement images/PDFs
- `GET /ocr/supported-banks` - List supported bank formats

## Setup

### Development
```bash
# Install dependencies
pip install -r requirements.txt

# Start the AI API server
python api/main.py

# Or with Docker
docker-compose up ai-service
```

### Production
```bash
# Build and run with Docker
docker build -t will-finance-ai .
docker run -p 8001:8001 will-finance-ai
```

## Integration

The AI module integrates with the main Will Finance backend through:

1. **REST API**: Real-time classification and suggestions
2. **Background Jobs**: Batch processing of historical data
3. **Webhooks**: Proactive notifications for anomalies
4. **Data Pipeline**: Continuous learning from user interactions

## Environment Variables

```bash
AI_API_PORT=8001
AI_MODEL_PATH=/app/models
AI_LOG_LEVEL=INFO
DATABASE_URL=postgresql://user:pass@localhost/will_finance_ai
REDIS_URL=redis://localhost:6379
```

## Models

The AI module uses several machine learning models:

- **Text Classification**: For transaction categorization
- **Anomaly Detection**: For unusual spending detection
- **Time Series Forecasting**: For budget predictions
- **OCR Models**: For statement processing

Models are automatically downloaded and cached on first use.
