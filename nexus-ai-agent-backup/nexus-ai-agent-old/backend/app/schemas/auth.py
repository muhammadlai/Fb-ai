from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Optional[str] = "user"  # "admin" or "user"

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str
    created_at: datetime
    is_active: bool = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
