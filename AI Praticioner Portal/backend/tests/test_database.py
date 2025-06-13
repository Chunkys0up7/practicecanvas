import pytest
from src.services.database_service import DatabaseService, DatabaseError
from src.models.user import User
from datetime import datetime
import uuid
import os

@pytest.fixture
def updated_user_data():
    """Fixture for updated user data"""
    return {
        "username": f"updated_user_{uuid.uuid4()}",
        "hashed_password": "$2b$12$updatedpassword",
        "roles": ["admin", "user"]
    }

def test_database_creation(test_db):
    """Test database service creation"""
    service = DatabaseService()
    assert service.engine is not None
    assert service.SessionLocal is not None
    
    # Verify tables were created
    session = test_db()
    try:
        with session as db:
            # Check if users table exists
            try:
                db.query(User).first()
                assert True  # If we get here, table exists
            except Exception:
                assert False, "Users table does not exist"
            
            # Store a test user
            test_user = {
                "username": f"test_{uuid.uuid4()}",
                "hashed_password": "hashed_password",
                "roles": ["user"]
            }
            success = service.store_user(test_user)
            assert success is True
            
            # Verify the user was stored
            user = db.query(User).filter_by(username=test_user["username"]).first()
            assert user is not None
            assert user.username == test_user["username"]
            assert user.hashed_password == test_user["hashed_password"]
            assert user.roles == test_user["roles"]
            assert user.created_at is not None
            assert user.updated_at is not None
            
            # Commit the transaction
            db.commit()
    finally:
        session.close()

def test_store_user(test_db, test_user):
    """Test storing a new user"""
    session = test_db()
    try:
        with session as db:
            service = DatabaseService()
            success = service.store_user(test_user)
            assert success is True
            
            # Verify the user was stored
            user = db.query(User).filter_by(username=test_user["username"]).first()
            assert user is not None
            assert user.username == test_user["username"]
            assert user.hashed_password == test_user["hashed_password"]
            assert user.roles == test_user["roles"]
            assert user.created_at is not None
            assert user.updated_at is not None
            
            # Verify the user can be retrieved
            retrieved_user = service.get_user(test_user["username"])
            assert retrieved_user is not None
            assert retrieved_user["username"] == test_user["username"]
            
            # Commit the transaction
            db.commit()
    finally:
        session.close()

def test_list_users(test_db, test_user):
    """Test listing users with pagination"""
    session = test_db()
    try:
        with session as db:
            service = DatabaseService()
            
            # Store some test users
            users = []
            for i in range(10):
                user = test_user.copy()
                user["username"] = f"user_{uuid.uuid4()}"
                success = service.store_user(user)
                assert success is True
                users.append(user)
                
            # List users with pagination
            page = 1
            limit = 5
            result = service.list_users(page, limit)
            assert len(result["users"]) == limit
            assert result["total"] == len(users)
            
            # Verify first page results
            for i, user in enumerate(result["users"]):
                assert user["username"] == users[i]["username"]
                assert user["roles"] == users[i]["roles"]
            
            # Test second page
            page = 2
            result = service.list_users(page, limit)
            assert len(result["users"]) == limit
            assert result["total"] == len(users)
            
            # Verify second page results
            for i, user in enumerate(result["users"]):
                assert user["username"] == users[i + 5]["username"]
                assert user["roles"] == users[i + 5]["roles"]
            
            # Test empty page
            page = 3
            result = service.list_users(page, limit)
            assert len(result["users"]) == 0
            assert result["total"] == len(users)
            
            # Verify all users are in the database
            db_users = db.query(User).all()
            assert len(db_users) == len(users)
            assert all(user.username in [u["username"] for u in users] for user in db_users)
            
            # Verify pagination order
            db_users = db.query(User).order_by(User.username).all()
            for i, user in enumerate(db_users):
                assert user.username == users[i]["username"]
                assert user.roles == users[i]["roles"]
            
            # Commit the transaction
            db.commit()
    finally:
        session.close()
    
    # Test listing next page
    result = service.list_users(page=2, page_size=5)
    assert result["total"] == 10
    assert len(result["users"]) == 5

def test_search_users(test_db, test_user):
    """Test searching users by username and role"""
    session = test_db()
    try:
        with session as db:
            service = DatabaseService()

            # Create multiple test users with unique usernames
            users = [
                {"username": f"john_doe_{uuid.uuid4()}", "hashed_password": "pass1", "roles": ["user"]},
                {"username": f"jane_doe_{uuid.uuid4()}", "hashed_password": "pass2", "roles": ["admin", "user"]},
                {"username": f"bob_smith_{uuid.uuid4()}", "hashed_password": "pass3", "roles": ["user"]},
                {"username": f"alice_{uuid.uuid4()}", "hashed_password": "pass4", "roles": ["admin"]},
            ]

            # Store the users
            for user in users:
                success = service.store_user(user)
                assert success is True

            # Search by username
            result = service.search_users(query="doe")
            assert len(result["users"]) == 2
            assert all("doe" in user["username"] for user in result["users"])
            
            # Verify search results
            for user in result["users"]:
                assert user["username"] in [u["username"] for u in users]

            # Search by role
            result = service.search_users(roles=["admin"])
            assert len(result["users"]) == 2
            assert all("admin" in user["roles"] for user in result["users"])
            
            # Verify search results
            for user in result["users"]:
                assert "admin" in users[users.index(user)]["roles"]

            # Search by both username and role
            result = service.search_users(query="doe", roles=["admin"])
            assert len(result["users"]) == 1
            assert "doe" in result["users"][0]["username"]
            assert "admin" in result["users"][0]["roles"]
            
            # Verify combined search results
            for user in result["users"]:
                assert "doe" in user["username"]
                assert "admin" in user["roles"]
                
            # Verify all users are in the database
            db_users = db.query(User).all()
            assert len(db_users) == len(users)
            assert all(user.username in [u["username"] for u in users] for user in db_users)
            
            # Verify search results in database
            db_users = db.query(User).filter(User.username.ilike("%doe%"), User.roles.contains(["admin"]))
            assert len(db_users) == 1
            assert "doe" in db_users[0].username
            assert "admin" in db_users[0].roles
            
            # Commit the transaction
            db.commit()
    finally:
        session.close()

def test_get_user(test_db, test_user):
    """Test getting a user by username"""
    session = test_db()
    try:
        service = DatabaseService()
        service.store_user(test_user)
        
        # Get the user
        user = service.get_user(test_user["username"])
        assert user is not None
        assert user["username"] == test_user["username"]
        assert user["roles"] == test_user["roles"]
        assert user["created_at"] is not None
        assert user["updated_at"] is not None
        
        # Verify user exists in database
        db_user = session.query(User).filter_by(username=test_user["username"]).first()
        assert db_user is not None
        assert db_user.username == test_user["username"]
        assert db_user.roles == test_user["roles"]
    finally:
        session.close()

def test_update_user(test_db, test_user, updated_user_data):
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

def test_delete_user(test_db, test_user):
    """Test deleting a user"""
    session = test_db()
    try:
        service = DatabaseService()
        service.store_user(test_user)
        
        # Delete the user
        success = service.delete_user(test_user["username"])
        assert success is True
        
        # Verify deletion
        with pytest.raises(DatabaseError):
            service.get_user(test_user["username"])
            
        # Verify user is not in database
        user = session.query(User).filter_by(username=test_user["username"]).first()
        assert user is None
    finally:
        session.close()

def test_database_error_handling(test_db):
    """Test database error handling"""
    service = DatabaseService()
    
    # Test invalid database URL
    with pytest.raises(DatabaseError):
        DatabaseService("invalid://url")
    
    # Test storing user with invalid data
    with pytest.raises(DatabaseError):
        service.store_user({"username": "test"})  # Missing required fields
    
    # Test getting non-existent user
    with pytest.raises(DatabaseError):
        service.get_user("nonexistent_user")
    
    # Test deleting non-existent user
    with pytest.raises(DatabaseError):
        service.delete_user("nonexistent_user")
    
    # Test updating non-existent user
    with pytest.raises(DatabaseError):
        service.update_user("nonexistent_user", {"username": "test"})
    
    # Test listing users with invalid page
    with pytest.raises(DatabaseError):
        service.list_users(page=0, page_size=10)
    
    # Test listing users with invalid page size
    with pytest.raises(DatabaseError):
        service.list_users(page=1, page_size=0)
