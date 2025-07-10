# backend/auth.py
import os, time, jwt
from passlib.context import CryptContext
from typing import Optional

JWT_SECRET   = os.getenv("JWT_SECRET", "super-secret-key")
JWT_EXP_SEC  = 60 * 60 * 24  # 24 hours
pwd_ctx      = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_pw(password: str) -> str:
    """Return bcrypt hash of the password."""
    return pwd_ctx.hash(password)


def verify_pw(password: str, hashed: str) -> bool:
    """Verify plain password against hashed."""
    return pwd_ctx.verify(password, hashed)


def create_token(email: str) -> str:
    payload = {"sub": email, "exp": time.time() + JWT_EXP_SEC}
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def decode_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload["sub"]
    except Exception:
        return None
