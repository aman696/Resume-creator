import os
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from jose import JWTError, jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv, find_dotenv
import bcrypt

# ✅ Load environment variables
load_dotenv(find_dotenv())

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")


# ✅ Connect to MongoDB Atlas
try:
    client = MongoClient(MONGODB_URL, tls=True)
    db = client[DATABASE_NAME]
    users_collection = db["users"]
    print("✅ Connected to MongoDB Atlas")
except Exception as e:
    print(f"❌ MongoDB Connection Error: {e}")
    raise

# ✅ Initialize FastAPI
app = FastAPI()
router = APIRouter(tags=["auth"])

# ✅ CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ JWT Token generation
def create_jwt(email: str):
    expiration = datetime.utcnow() + timedelta(days=7)
    payload = {"sub": email, "exp": expiration}
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")
    return token

# ✅ Verify JWT token
def verify_jwt(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token.")
        return email
    except JWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token verification failed.")

# ✅ User Schema
class User(BaseModel):
    email: EmailStr
    name: str
    picture: str | None = None

# ✅ Login Schema
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# ✅ Register User
@router.post("/register")
async def register(user: LoginRequest):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "User already exists.")

    # ✅ Hash password (converted to string for MongoDB)
    hashed_password = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    user_data = {
        "email": user.email,
        "password": hashed_password,
        "provider": "email",
        "created_at": datetime.utcnow(),
    }

    users_collection.insert_one(user_data)
    return {"message": "User registered successfully!"}

# ✅ Login User
@router.post("/login")
async def login(user: LoginRequest):
    db_user = users_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password.")

    # ✅ bcrypt check
    if not bcrypt.checkpw(user.password.encode("utf-8"), db_user["password"].encode("utf-8")):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password.")

    token = create_jwt(user.email)
    return {"token": token}

# ✅ Get User Profile (Protected)
@router.get("/profile")
async def profile(email: str = Depends(verify_jwt)):
    user = users_collection.find_one({"email": email}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found.")
    return user

# ✅ Add router to FastAPI
app.include_router(router)

# ✅ Root Endpoint
@app.get("/")
async def root():
    return {"message": "Authentication Service is running."}
