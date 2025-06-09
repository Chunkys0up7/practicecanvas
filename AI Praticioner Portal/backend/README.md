# AI Practitioner Canvas - Backend

This is the backend service for the AI Practitioner Canvas application, built with FastAPI.

## Features

- RESTful API endpoints for projects and components
- Gemini API integration for code generation
- Mock API service for development
- Comprehensive test coverage
- CORS support for frontend integration

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and configure your environment variables:
```bash
cp .env.example .env
```

3. Run the application:
```bash
uvicorn src.main:app --reload
```

## Testing

Run tests with coverage report:
```bash
pytest --cov=src
```

## API Documentation

The API is documented using FastAPI's automatic documentation. When the server is running, you can access:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── src/
│   ├── api/           # API endpoints
│   ├── services/      # Business logic services
│   └── main.py        # FastAPI application entry point
├── tests/             # Test files
├── .env.example       # Environment variables template
├── pytest.ini         # Pytest configuration
└── requirements.txt   # Python dependencies
```
