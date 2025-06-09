import os
import sys
from pathlib import Path

# Add the project root to PYTHONPATH
project_root = str(Path(__file__).parent.parent)
sys.path.append(project_root)

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def verify_database():
    """Verify database connection and list tables"""
    try:
        # Get database URL from environment
        db_url = os.getenv("DATABASE_URL")
        if not db_url:
            raise ValueError("DATABASE_URL environment variable not set")

        # Create engine and session
        engine = create_engine(db_url)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        session = SessionLocal()

        # Test connection
        result = session.execute(text("SELECT 1")).scalar()
        if result == 1:
            print("Database connection successful!")

        # List tables
        from src.models.user import Base
        print("\nTables in database:")
        for table in Base.metadata.sorted_tables:
            print(f"- {table.name}")

        # Test user table
        print("\nTesting user table:")
        result = session.execute(text("SELECT * FROM users LIMIT 1")).fetchone()
        if result:
            print("User table has data")
        else:
            print("User table is empty")

    except Exception as e:
        print(f"Error verifying database: {str(e)}")
    finally:
        session.close()

if __name__ == "__main__":
    verify_database()
