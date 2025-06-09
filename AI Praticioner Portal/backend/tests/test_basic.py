import pytest
from src.services.minimal_security import MinimalSecurity

def test_basic_creation():
    """Test basic service creation"""
    service = MinimalSecurity()
    assert isinstance(service, MinimalSecurity)

def test_password_hashing():
    """Test password hashing functionality"""
    service = MinimalSecurity()
    password = "test_password"
    
    # Test password hashing
    hashed = service.hash_password(password)
    assert hashed != password
    assert service.verify_password(password, hashed) is True
    
    # Test with wrong password
    assert service.verify_password("wrong_password", hashed) is False
