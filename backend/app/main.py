from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from .database import Base, engine
from app.routers import chatbot
from app.routers import users, groups, expenses, balances

# Load .env variables
load_dotenv()

# Print DB connection info for debug
print("DB Connected:", os.getenv("DATABASE_URL"))

# Create DB tables
Base.metadata.create_all(bind=engine)

# Initialize app
app = FastAPI(
    title="Splitwise Clone API",
    description="Backend for managing groups, expenses, and balances.",
    version="1.0.0"
)

# ✅ Add CORS middleware BEFORE routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # for local dev (optional)
        "https://splitwise-clone-three.vercel.app"  # ✅ no trailing slash!
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(users.router, prefix="/users", tags=["Users"])
# app.include_router(groups.router, prefix="/groups", tags=["Groups"])
# app.include_router(expenses.router, prefix="/groups", tags=["Expenses"])  # ✅ This is KEY
# app.include_router(balances.router, prefix="/groups", tags=["Balances"])


app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(groups.router, prefix="/groups", tags=["Groups"])
app.include_router(expenses.router, tags=["Expenses"])  # ✅ Correct
app.include_router(balances.router, tags=["Balances"])
app.include_router(chatbot.router, prefix="/api", tags=["Chatbot"])