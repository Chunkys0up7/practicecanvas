import pytest
from typing import List
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.services.security_service import SecurityService, AuthenticationError

def test_valid_token_authentication():
    """Test successful token authentication"""
    service = SecurityService()
    token = "valid_token_123"
    
    # Mock the token verification
    service.verify_token = lambda t: True if t == token else False
    
    result = service.authenticate(token)
    assert result is True

def test_create_token():
    """Test token creation"""
    service = SecurityService()
    data = {"sub": "test_user"}
    token = service.create_access_token(data)
    assert isinstance(token, str)
    assert len(token) > 0

def test_password_hashing():
    """Test password hashing functionality"""
    service = SecurityService()
    password = "secure_password_123"
    
    # Test password hashing
    hashed = service.hash_password(password)
    assert hashed != password
    assert service.verify_password(password, hashed) is True
    
    # Test with wrong password
    assert service.verify_password("wrong_password", hashed) is False
