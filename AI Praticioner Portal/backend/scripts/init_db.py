import os
import sys
from pathlib import Path

# Add the project root to PYTHONPATH
project_root = str(Path(__file__).parent.parent)
sys.path.append(project_root)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_database():
    """Create the database and tables"""
    try:
        # Get database URL from environment
        db_url = os.getenv("DATABASE_URL")
        if not db_url:
            raise ValueError("DATABASE_URL environment variable not set")

        # Create engine
        engine = create_engine(db_url)
        
        # Create tables
        from src.models.user import Base
        Base.metadata.create_all(bind=engine)
        
        print("Database and tables created successfully!")
        
    except Exception as e:
        print(f"Error creating database: {str(e)}")

if __name__ == "__main__":
    create_database()
