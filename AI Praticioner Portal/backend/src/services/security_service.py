from typing import List, Dict, Any
from datetime import datetime, timedelta
import jwt
from fastapi import HTTPException
from passlib.context import CryptContext

# Security settings
SECRET_KEY = "your-secret-key-here"  # In production, this should be in environment variables
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthenticationError(Exception):
    """Raised when authentication fails"""
    pass

class SecurityService:
    def __init__(self) -> None:
        """Initialize security service with in-memory storage"""
        self._users: Dict[str, Dict[str, Any]] = {}  # In-memory user store
        self._roles: Dict[str, List[str]] = {}  # User roles mapping

    def verify_token(self, token: str) -> bool:
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                return False
            return True
        except jwt.exceptions.InvalidTokenError:
            return False

    def authenticate(self, token: str) -> bool:
        """Authenticate user with token"""
        if not self.verify_token(token):
            raise AuthenticationError("Invalid token")
        return True

    def create_access_token(self, data: Dict[str, Any], expires_delta: timedelta = None) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def get_user_roles(self, token: str) -> List[str]:
        """Get user roles from token"""
        if not self.verify_token(token):
            return []
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        return self._roles.get(username, [])

    def authorize_user(self, token: str, required_role: str) -> bool:
        """Check if user has required role"""
        roles = self.get_user_roles(token)
        return required_role in roles

    def hash_password(self, password: str) -> str:
        """Hash a password for storing"""
        return pwd_context.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a stored password against a provided password"""
        return pwd_context.verify(plain_password, hashed_password)

    def add_user(self, username: str, password: str, roles: List[str] = None) -> None:
        """Add a new user with hashed password and optional roles"""
        if roles is None:
            roles = []
        
        self._users[username] = {
            "password": self.hash_password(password)
        }
        self._roles[username] = roles

    def verify_credentials(self, username: str, password: str) -> bool:
        """Verify user credentials"""
        user = self._users.get(username)
        if not user:
            return False
        return self.verify_password(password, user["password"])
