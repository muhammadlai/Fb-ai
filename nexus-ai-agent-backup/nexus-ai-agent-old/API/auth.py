from fastapi import APIRouter, HTTPException, Depends, Header, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime

from backend.app.schemas.auth import UserRegister, UserLogin, UserResponse, TokenResponse
from backend.app.core.security import hash_password, verify_password, create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["Authentication & Access Control"])

security = HTTPBearer(auto_error=False)

# In-memory user database
users_db: Dict[str, Dict[str, Any]] = {
    "admin_001": {
        "id": "admin_001",
        "username": "admin",
        "email": "admin@nexus.ai",
        "password_hash": hash_password("admin123"),
        "role": "admin",
        "created_at": datetime.utcnow(),
        "is_active": True
    },
    "user_001": {
        "id": "user_001",
        "username": "nexususer",
        "email": "user@nexus.ai",
        "password_hash": hash_password("user123"),
        "role": "user",
        "created_at": datetime.utcnow(),
        "is_active": True
    }
}

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Dict[str, Any]:
    """Dependency to retrieve and validate JWT token from request headers."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    payload = decode_access_token(credentials.credentials)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    user_id = payload["sub"]
    user = users_db.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

async def get_current_admin_user(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Dependency to restrict access to Admin role only."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Admin role required."
        )
    return current_user

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    """User Registration with bcrypt password hashing."""
    # Check duplicate username or email
    for u in users_db.values():
        if u["username"] == user_data.username:
            raise HTTPException(status_code=400, detail="Username already registered")
        if u["email"] == user_data.email:
            raise HTTPException(status_code=400, detail="Email already registered")

    user_id = f"usr_{uuid.uuid4().hex[:8]}"
    new_user = {
        "id": user_id,
        "username": user_data.username,
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "role": user_data.role if user_data.role in ["admin", "user"] else "user",
        "created_at": datetime.utcnow(),
        "is_active": True
    }
    users_db[user_id] = new_user

    token = create_access_token({"sub": user_id, "role": new_user["role"], "username": new_user["username"]})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=new_user["id"],
            username=new_user["username"],
            email=new_user["email"],
            role=new_user["role"],
            created_at=new_user["created_at"],
            is_active=new_user["is_active"]
        )
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Authenticate user and return JWT access token."""
    matched_user = None
    for u in users_db.values():
        if u["username"] == credentials.username_or_email or u["email"] == credentials.username_or_email:
            matched_user = u
            break

    if not matched_user or not verify_password(credentials.password, matched_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid username/email or password")

    token = create_access_token({"sub": matched_user["id"], "role": matched_user["role"], "username": matched_user["username"]})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=matched_user["id"],
            username=matched_user["username"],
            email=matched_user["email"],
            role=matched_user["role"],
            created_at=matched_user["created_at"],
            is_active=matched_user["is_active"]
        )
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieve currently authenticated user profile."""
    return UserResponse(
        id=current_user["id"],
        username=current_user["username"],
        email=current_user["email"],
        role=current_user["role"],
        created_at=current_user["created_at"],
        is_active=current_user["is_active"]
    )

@router.get("/users", response_model=List[UserResponse])
async def list_users(admin: Dict[str, Any] = Depends(get_current_admin_user)):
    """Admin-only route: List all registered platform users."""
    return [
        UserResponse(
            id=u["id"],
            username=u["username"],
            email=u["email"],
            role=u["role"],
            created_at=u["created_at"],
            is_active=u["is_active"]
        ) for u in users_db.values()
    ]
