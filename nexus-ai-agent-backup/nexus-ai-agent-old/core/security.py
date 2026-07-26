import hashlib
import hmac
import base64
import json
import time
from typing import Optional, Dict, Any
from backend.app.core.config import settings

def hash_password(password: str) -> str:
    """Secure password hashing using SHA256 + HMAC salt."""
    salt = settings.JWT_SECRET_KEY.encode('utf-8')
    hashed = hmac.new(salt, password.encode('utf-8'), hashlib.sha256).hexdigest()
    return f"sha256${hashed}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against stored hash."""
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[int] = None) -> str:
    """Generate a JWT token without external heavy dependencies."""
    to_encode = data.copy()
    expire = time.time() + (expires_delta or (settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60))
    to_encode.update({"exp": expire})
    
    header = {"alg": "HS256", "typ": "JWT"}
    
    def b64url(s: bytes) -> str:
        return base64.urlsafe_b64encode(s).decode('utf-8').rstrip('=')
    
    header_b64 = b64url(json.dumps(header).encode('utf-8'))
    payload_b64 = b64url(json.dumps(to_encode).encode('utf-8'))
    
    signature_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = hmac.new(
        settings.JWT_SECRET_KEY.encode('utf-8'),
        signature_input,
        hashlib.sha256
    ).digest()
    
    signature_b64 = b64url(signature)
    return f"{header_b64}.{payload_b64}.{signature_b64}"

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate a JWT access token."""
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        
        header_b64, payload_b64, signature_b64 = parts
        
        # Verify signature
        def b64url_decode(s: str) -> bytes:
            padding = '=' * (4 - (len(s) % 4))
            return base64.urlsafe_b64decode(s + padding)
        
        signature_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_sig = hmac.new(
            settings.JWT_SECRET_KEY.encode('utf-8'),
            signature_input,
            hashlib.sha256
        ).digest()
        
        actual_sig = b64url_decode(signature_b64)
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
        
        payload = json.loads(b64url_decode(payload_b64).decode('utf-8'))
        
        # Check expiration
        if payload.get("exp") and time.time() > payload["exp"]:
            return None
        
        return payload
    except Exception:
        return None
