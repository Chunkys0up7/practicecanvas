import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

@pytest.fixture(scope="module")
def sqlite_db():
    """SQLite database fixture for testing"""
    engine = create_engine("sqlite://")
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return SessionLocal

@pytest.fixture(scope="module")
def postgres_db():
    """PostgreSQL database fixture for testing"""
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        pytest.skip("DATABASE_URL not set")
    
    engine = create_engine(db_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return SessionLocal

@pytest.fixture(scope="function")
def test_user():
    """Test user data fixture"""
    return {
        "username": "test_user",
        "hashed_password": "$2b$12$somehashedpassword",
        "roles": ["user"],
        "created_at": "2025-06-09T22:55:00+00:00",
        "updated_at": "2025-06-09T22:55:00+00:00"
    }
