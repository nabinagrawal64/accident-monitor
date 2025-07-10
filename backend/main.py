# backend/main.py
from fastapi import FastAPI, UploadFile, File, Header, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from threading import Lock
from pathlib import Path
import logging
logger = logging.getLogger(__name__)

# ─────────  Email  ─────────
import smtplib, ssl
from email.mime.text import MIMEText
from geocode import reverse_geocode
from dotenv import load_dotenv
import os
load_dotenv()

# ─────────  ML  ─────────
import torch, torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io

# ─────────  DB  (SQLite + SQLAlchemy) ─────────
from sqlalchemy import (
    create_engine, Column, Integer, String, Float, DateTime, ForeignKey
)
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.exc import IntegrityError

# ─────────  Auth Helpers ─────────
from auth import hash_pw, verify_pw, create_token, decode_token

# ------------------------------------------------------------------
#  1. DATABASE INITIALISATION
# ------------------------------------------------------------------
DB_URL = "sqlite:///./app.db"
engine = create_engine(DB_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id         = Column(Integer, primary_key=True, index=True)
    email      = Column(String, unique=True, index=True, nullable=False)  # was username
    name       = Column(String, nullable=True)                            # new
    password_hash = Column(String, nullable=False)
    vehicleId  = Column(String, nullable=True)
    driverId   = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AccidentReport(Base):
    __tablename__ = "accidents"
    id        = Column(Integer, primary_key=True, index=True)
    vehicleId = Column(String)
    driverId  = Column(String)
    lat       = Column(Float)
    lng       = Column(Float)
    timestamp = Column(DateTime)
    severity  = Column(String)
    notes     = Column(String)
    reported_by = Column(Integer, ForeignKey("users.id"))

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------------------------------------------------------
#  2. ML MODEL (unchanged)
# ------------------------------------------------------------------
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = Path(__file__).with_name("accident_classifier_resnet18.pth")

T = transforms.Compose(
    [
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ]
)

def load_model():
    m = models.resnet18(weights=None)
    m.fc = nn.Sequential(
        nn.Linear(m.fc.in_features, 256),
        nn.LeakyReLU(),
        nn.Dropout(0.3),
        nn.Linear(256, 2),
    )
    m.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    m.to(DEVICE).eval()
    return m

model, mdl_lock = load_model(), Lock()

def predict(img_bytes: bytes) -> int:
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    x   = T(img).unsqueeze(0).to(DEVICE)
    with torch.no_grad(), mdl_lock:
        prob = torch.softmax(model(x), 1)[0, 1].item()
    return int(prob > 0.5)

# ------------------------------------------------------------------
#  3. FASTAPI APP
# ------------------------------------------------------------------
app = FastAPI(title="Accident Monitor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)

# ---------- Pydantic Schemas ----------
class UserCreds(BaseModel):
    email:  EmailStr
    password: str
    name: Optional[str] = None

class ReportIn(BaseModel):
    vehicleId: Optional[str] = "WEBCAM-VEH"
    driverId: Optional[str]  = "LIVE"
    lat:      float
    lng:      float
    timestamp: datetime
    severity: Optional[str] = "auto"
    notes:    Optional[str] = "Accident detected"

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    vehicleId: Optional[str] = None
    driverId: Optional[str] = None


# ------------------------------------------------------------------
#  4. Email send
# ------------------------------------------------------------------

EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = 587
EMAIL_SENDER = os.getenv("EMAIL_SENDER")   # our app email
EMAIL_PASS = os.getenv("EMAIL_PASS")             # Gmail App Password or SMTP pass
ALERT_TO   = os.getenv("ALERT_TO")        # user email to receive alerts

def send_alert_email(subject: str, body: str, to: str = ALERT_TO):
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"]    = EMAIL_SENDER
    msg["To"]      = to

    context = ssl.create_default_context()
    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
        server.starttls(context=context)
        server.login(EMAIL_SENDER, EMAIL_PASS)
        server.sendmail(EMAIL_SENDER, [to], msg.as_string())

# ---------- Auth Dependency ----------
def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing auth header")

    token   = authorization.split(" ", 1)[1]
    email   = decode_token(token)                # email string
    if not email:
        raise HTTPException(401, "Invalid or expired token")

    # ⬇️  fetch by email
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(401, "User not found")

    return user          # user.name is now available

# ---------- Signup ----------
@app.post("/signup")
def signup(creds: UserCreds, db: Session = Depends(get_db)):
    # duplicate check
    if db.query(User).filter_by(email=creds.email).first():
        raise HTTPException(400, "User already exists")

    # use provided name, else derive from email prefix
    display_name = creds.name or creds.email.split("@")[0].capitalize()

    user = User(
        email=creds.email,
        name=display_name,
        password_hash=hash_pw(creds.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token(user.id)
    return {
        "access_token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
        },
    }

# ---------- Login ----------
@app.post("/login")
def login(creds: UserCreds, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=creds.email).first()
    if not user or not verify_pw(creds.password, user.password_hash):
        raise HTTPException(401, "Bad credentials")

    token = create_token(user.email)

    # expose only safe, non‑sensitive fields
    user_data = {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "driverId": user.driverId,
        "vehicleId": user.vehicleId,
    }

    return {"access_token": token, "user": user_data}

@app.patch("/profile")
async def update_profile(
    name: str = Form(None),
    vehicleId: str = Form(None),
    driverId: str  = Form(None),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update mutable profile fields for the logged‑in user."""
    changed = False

    if name and name != user.name:
        user.name = name
        changed = True

    if vehicleId is not None and vehicleId != user.vehicleId:
        user.vehicleId = vehicleId
        changed = True

    if driverId is not None and driverId != user.driverId:
        user.driverId = driverId
        changed = True

    if changed:
        db.commit()
        db.refresh(user)

    return {
        "msg": "Profile updated" if changed else "No changes",
        "user": {
            "email": user.email,
            "name": user.name,
            "vehicleId": user.vehicleId,
            "driverId": user.driverId,
        },
    }

# ---------- Predict (protected) ----------
@app.post("/predict")
async def predict_endpoint(
    file: UploadFile = File(...),
    _user: User = Depends(get_current_user),
):
    img_bytes = await file.read()
    return {"pred": predict(img_bytes)}

# ---------- Report Accident (protected) ----------
@app.post("/report-accident")
def report_accident(
    rep: ReportIn,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    print(rep)
    db_rep = AccidentReport(
        vehicleId=user.vehicleId,
        driverId=user.driverId,
        lat=rep.lat,
        lng=rep.lng,
        timestamp=rep.timestamp,
        severity=rep.severity,
        notes=rep.notes,
        reported_by=user.id,
    )
    db.add(db_rep)
    db.commit()
    db.refresh(db_rep)

    address = reverse_geocode(rep.lat, rep.lng) or "Unknown location"

    subject = "🚨 Accident Detected by LogiGuardians"
    body = (
        f"Accident Reported by: {user.name} ({user.email})\n"
        f"Vehicle ID : {user.vehicleId}\n"
        f"Driver ID  : {user.driverId}\n"
        f"Location   : {rep.lat}, {rep.lng}\n"
        f"Address    : {address}\n"
        f"Time       : {rep.timestamp}\n"
        f"Severity   : {rep.severity}\n"
        f"Notes      : {rep.notes or '—'}\n"
        f"DB record  : #{db_rep.id}"
    )

    try:
        send_alert_email(subject, body, user.email)
        email_status = "sent"
    except Exception as e:
        print("Email send error:", e)
        email_status = "failed"

    print(f"🚨 REPORT by {user.name}: {rep.dict()}")
    return {
        "status"      : "logged",
        "email_status": email_status,
        "record_id"   : db_rep.id,
        "by"          : user.name,
    }

@app.post("/stop-webcam")
def stop_webcam():
    with open("quit_webcam.txt", "w") as f:
        f.write("stop")
    return {"status": "stopping"}

# ---------- Dev runner ----------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

