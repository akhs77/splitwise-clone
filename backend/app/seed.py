from app.database import SessionLocal
from app.models import User  # ✅ This is the SQLAlchemy model

def seed_users():
    db = SessionLocal()

    # Check if users already exist to prevent duplicates
    if db.query(User).count() > 0:
        print("⚠️ Users already exist. Skipping seeding.")
        return

    users = [
        User(name="Alice"),
        User(name="Bob"),
        User(name="Charlie")
    ]
    db.add_all(users)
    db.commit()
    print("✅ Seeded users!")

if __name__ == "__main__":
    seed_users()
