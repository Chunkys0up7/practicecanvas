import pytest
from src.services.database_service import DatabaseService, DatabaseError
from src.models.user import User
from datetime import datetime

@pytest.fixture
def test_user():
    """Test user data fixture"""
    return {
        "username": "test_user",
        "hashed_password": "$2b$12$somehashedpassword",
        "roles": ["user"]
    }

@pytest.fixture
def updated_user_data():
    """Fixture for updated user data"""
    return {
        "username": "updated_user",
        "hashed_password": "$2b$12$updatedpassword",
        "roles": ["admin", "user"]
    }

@pytest.mark.parametrize("db_type", ["sqlite", "postgres"])
def test_database_creation(db_type, request):
    """Test database service creation"""
    service = DatabaseService()
    assert service.engine is not None
    assert service.SessionLocal is not None

def test_store_user(sqlite_db, test_user):
    """Test storing a new user"""
    service = DatabaseService()
    success = service.store_user(test_user)
    assert success is True
    
    # Verify the user was stored
    with sqlite_db() as session:
        user = session.query(User).filter_by(username=test_user["username"]).first()
        assert user is not None
        assert user.username == test_user["username"]
        assert user.hashed_password == test_user["hashed_password"]
        assert user.roles == test_user["roles"]
        assert user.created_at is not None
        assert user.updated_at is not None

def test_list_users(sqlite_db, test_user):
    """Test listing users with pagination"""
    service = DatabaseService()
    
    # Store some test users
    for i in range(10):
        user = test_user.copy()
        user["username"] = f"user{i}"
        service.store_user(user)
    
    # Test listing with pagination
    result = service.list_users(page=1, page_size=5)
    assert result["total"] == 10
    assert len(result["users"]) == 5
    
    # Test listing next page
    result = service.list_users(page=2, page_size=5)
    assert result["total"] == 10
    assert len(result["users"]) == 5

def test_search_users(sqlite_db, test_user):
    """Test searching users by username and role"""
    service = DatabaseService()

    # Create multiple test users
    users = [
        {"username": "john_doe", "hashed_password": "pass1", "roles": ["user"]},
        {"username": "jane_doe", "hashed_password": "pass2", "roles": ["admin", "user"]},
        {"username": "bob_smith", "hashed_password": "pass3", "roles": ["user"]},
        {"username": "alice", "hashed_password": "pass4", "roles": ["admin"]},
    ]

    for user in users:
        service.store_user(user)

    # Test searching by username
    result = service.search_users("doe", page=1, page_size=10)
    assert result["total"] == 2
    assert len(result["users"]) == 2
    assert all("doe" in user["username"].lower() for user in result["users"])

    # Test searching by role
    result = service.search_users("", role="admin", page=1, page_size=10)
    assert result["total"] == 2
    assert len(result["users"]) == 2
    assert all("admin" in user["roles"] for user in result["users"])

def test_get_user(sqlite_db, test_user):
    """Test getting a user by username"""
    service = DatabaseService()
    service.store_user(test_user)
    
    # Get the user
    user = service.get_user(test_user["username"])
    assert user is not None
    assert user["username"] == test_user["username"]
    assert user["roles"] == test_user["roles"]
    assert user["created_at"] is not None
    assert user["updated_at"] is not None

def test_update_user(sqlite_db, test_user, updated_user_data):
    """Test updating a user"""
    service = DatabaseService()
    service.store_user(test_user)
    
    # Update the user
    success = service.update_user(test_user["username"], updated_user_data)
    assert success is True
    
    # Verify the update
    user = service.get_user(updated_user_data["username"])
    assert user is not None
    assert user["username"] == updated_user_data["username"]
    assert user["roles"] == updated_user_data["roles"]
    assert user["hashed_password"] == updated_user_data["hashed_password"]

def test_delete_user(sqlite_db, test_user):
    """Test deleting a user"""
    service = DatabaseService()
    service.store_user(test_user)
    
    # Delete the user
    success = service.delete_user(test_user["username"])
    assert success is True
    
    # Verify deletion
    with pytest.raises(DatabaseError):
        service.get_user(test_user["username"])

def test_database_error_handling(sqlite_db):
    """Test database error handling"""
    service = DatabaseService()
    
    # Test error on invalid user ID
    with pytest.raises(DatabaseError):
        service.get_user("nonexistent_user")

def test_postgres_database(postgres_db, test_user):
    """Test PostgreSQL database operations"""
    if postgres_db is None:
        pytest.skip("PostgreSQL database not available")
    
    service = DatabaseService()
    success = service.store_user(test_user)
    assert success is True
    
    # Verify the user was stored in PostgreSQL
    with postgres_db() as session:
        user = session.query(User).filter_by(username=test_user["username"]).first()
        assert user is not None
        assert user.username == test_user["username"]
        assert user.hashed_password == test_user["hashed_password"]
        assert user.roles == test_user["roles"]
        assert user.created_at is not None
        assert user.updated_at is not None

    # Test deleting non-existent user
    with pytest.raises(DatabaseError):
        service.delete_user("nonexistent_user")
