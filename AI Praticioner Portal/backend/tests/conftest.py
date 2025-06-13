import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from datetime import datetime
from src.models.user import Base
import os

# Load environment variables
load_dotenv()

@pytest.fixture(scope="module")
def sqlite_db():
    """SQLite database fixture for testing"""
    engine = create_engine("sqlite://")
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    return SessionLocal

@pytest.fixture(scope="module")
def postgres_db():
    """PostgreSQL database fixture for testing"""
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        pytest.skip("DATABASE_URL not set")
    
    engine = create_engine(db_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    return SessionLocal

@pytest.fixture(scope="function")
def test_db(postgres_db):
    """Test database fixture that creates and drops tables for each test"""
    SessionLocal = postgres_db
    
    def get_session():
        db = SessionLocal()
        try:
            # Start a transaction
            db.begin()
            yield db
            # Rollback the transaction after test
            db.rollback()
        finally:
            db.close()
    
    return get_session()
