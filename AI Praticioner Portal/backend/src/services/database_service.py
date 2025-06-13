import os
from typing import Dict, Any, Optional, List, Union
from datetime import datetime
from sqlalchemy import create_engine, event, String
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv
from ..models.user import Base, User

# Load environment variables
load_dotenv()

class DatabaseError(Exception):
    """Custom exception for database operations"""
    pass

class DatabaseService:
    def __init__(self, db_url: Optional[str] = None):
        """Initialize the database service with SQLAlchemy"""
        try:
            # Use provided URL or environment variable
            if db_url is None:
                db_url = os.getenv("DATABASE_URL")
                if not db_url:
                    raise DatabaseError("DATABASE_URL environment variable not set")
            
            self.engine = create_engine(db_url, echo=True)
            self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
            
            # Create tables if they don't exist
            Base.metadata.create_all(bind=self.engine)
            
            # Configure database connection pooling
            if db_url.startswith("sqlite:"):
                @event.listens_for(self.engine, "connect")
                def set_sqlite_pragma(dbapi_connection, connection_record):
                    cursor = dbapi_connection.cursor()
                    cursor.execute("PRAGMA foreign_keys=ON")
                    cursor.close()
            

        except SQLAlchemyError as e:
            raise DatabaseError(f"Failed to initialize database connection: {str(e)}") from e

    def get_db(self) -> Session:
        """Get a database session"""
        db = self.SessionLocal()
        return db

    def store_user(self, user_data: Dict[str, Any]) -> bool:
        """
        Store a new user in the database

        Args:
            user_data: Dictionary containing user information
                Required keys: username, hashed_password, roles

        Returns:
            bool: True if user was successfully stored, False otherwise

        Raises:
            DatabaseError: If required fields are missing or user already exists
        """
        required_fields = ["username", "hashed_password", "roles"]
        if not all(field in user_data for field in required_fields):
            raise DatabaseError("Missing required fields in user data")

        try:
            with self.SessionLocal() as db:
                user = User(
                    username=user_data["username"],
                    hashed_password=user_data["hashed_password"],
                    roles=user_data["roles"]
                )
                db.add(user)
                db.commit()
                return True
        except SQLAlchemyError as e:
            db.rollback()
            raise DatabaseError(f"Failed to store user: {str(e)}")

    def get_user(self, username: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve user data by username

        Args:
            username: Username to look up

        Returns:
            Dict[str, Any]: User data if found, None otherwise
        """
        try:
            with self.SessionLocal() as db:
                user = db.query(User).filter(User.username == username).first()
                if user:
                    return {
                        "id": user.id,
                        "username": user.username,
                        "hashed_password": user.hashed_password,
                        "roles": user.roles,
                        "created_at": user.created_at.isoformat(),
                        "updated_at": user.updated_at.isoformat()
                    }
                return None
        except SQLAlchemyError as e:
            raise DatabaseError(f"Failed to get user: {str(e)}")

    def list_users(self, page: int = 1, page_size: int = 10) -> Dict[str, Any]:
        """
        List all users with pagination

        Args:
            page: Page number (1-based)
            page_size: Number of items per page

        Returns:
            Dict containing:
                - total: Total number of users
                - page: Current page number
                - page_size: Number of items per page
                - users: List of user data
        """
        try:
            with self.SessionLocal() as db:
                total = db.query(User).count()
                users = db.query(User).offset((page - 1) * page_size).limit(page_size).all()
                
                return {
                    "total": total,
                    "page": page,
                    "page_size": page_size,
                    "users": [{
                        "id": user.id,
                        "username": user.username,
                        "hashed_password": user.hashed_password,
                        "roles": user.roles,
                        "created_at": user.created_at.isoformat(),
                        "updated_at": user.updated_at.isoformat()
                    } for user in users]
                }
        except SQLAlchemyError as e:
            raise DatabaseError(f"Failed to list users: {str(e)}")

    def search_users(self, query: str, roles: Optional[List[str]] = None, page: int = 1, page_size: int = 10) -> Dict[str, Any]:
        """
        Search users by username or role

        Args:
            query: Search term to match against username
            roles: List of roles to filter by
            page: Page number (1-based)
            page_size: Number of items per page

        Returns:
            Dict containing:
                - total: Total number of matching users
                - page: Current page number
                - page_size: Number of items per page
                - users: List of matching user data
        """
        try:
            with self.SessionLocal() as db:
                query_lower = query.lower()
                
                # Build query
                query = db.query(User)
                
                # Add username filter if query is provided
                if query:
                    query = query.filter(User.username.ilike(f"%{query_lower}%"))
                
                # Add roles filter if roles are provided
                if roles:
                    query = query.filter(User.roles.contains(roles))
                
                # Get total count
                total = query.count()
                
                # Apply pagination
                users = query.offset((page - 1) * page_size).limit(page_size).all()
                
                return {
                    "total": total,
                    "page": page,
                    "page_size": page_size,
                    "users": [{
                        "id": user.id,
                        "username": user.username,
                        "hashed_password": user.hashed_password,
                        "roles": user.roles,
                        "created_at": user.created_at.isoformat(),
                        "updated_at": user.updated_at.isoformat()
                    } for user in users]
                }
        except SQLAlchemyError as e:
            raise DatabaseError(f"Failed to search users: {str(e)}")

    def update_user(self, username: str, updated_data: Dict[str, Any]) -> bool:
        """
        Update existing user data

        Args:
            username: Username to update
            updated_data: Dictionary containing updated user information

        Returns:
            bool: True if user was successfully updated, False otherwise

        Raises:
            DatabaseError: If user doesn't exist or required fields are missing
        """
        required_fields = ["username", "hashed_password", "roles"]
        if not all(field in updated_data for field in required_fields):
            raise DatabaseError("Missing required fields in updated data")

        try:
            with self.SessionLocal() as db:
                user = db.query(User).filter(User.username == username).first()
                if not user:
                    raise DatabaseError(f"User {username} does not exist")

                user.username = updated_data["username"]
                user.hashed_password = updated_data["hashed_password"]
                user.roles = updated_data["roles"]
                
                db.commit()
                return True
        except SQLAlchemyError as e:
            db.rollback()
            raise DatabaseError(f"Failed to update user: {str(e)}")

    def delete_user(self, username: str) -> bool:
        """
        Delete a user from the database

        Args:
            username: Username to delete

        Returns:
            bool: True if user was successfully deleted, False otherwise

        Raises:
            DatabaseError: If user doesn't exist
        """
        try:
            with self.SessionLocal() as db:
                user = db.query(User).filter(User.username == username).first()
                if not user:
                    raise DatabaseError(f"User {username} does not exist")

                db.delete(user)
                db.commit()
                return True
        except SQLAlchemyError as e:
            db.rollback()
            raise DatabaseError(f"Failed to delete user: {str(e)}")
