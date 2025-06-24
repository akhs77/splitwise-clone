# 💸 Splitwise Clone – Neurix Assignment

A simplified clone of Splitwise built as part of the Neurix Full-Stack SDE Intern application. This app allows you to create groups, split expenses (equally or by percentage), and track balances between users.

---

## 🚀 Tech Stack

- **Backend:** FastAPI + SQLAlchemy + PostgreSQL
- **Frontend:** React + TailwindCSS
- **Database:** PostgreSQL
- **Extras:** Docker, OpenAI API (optional chatbot)

---

## 📦 Features

### ✅ Core

- Create groups with multiple users
- Add expenses to a group:
  - Equal split
  - Percentage-based split
- Track who owes whom within a group
- View personal balances across all groups

### 💬 Bonus

- **LLM-powered chatbot** that answers natural queries like:
  - “How much does Alice owe in Goa Trip?”
  - “Show my last 3 expenses”
  - “Who paid the most in Weekend Trip?”

---


## 🐳 Quick Start (Docker)

```bash
git clone https://github.com/Akhs77/splitwise-clone.git
cd splitwise-clone

# Copy and edit the .env file
cp backend/.env.example backend/.env
# Add your OpenAI key inside backend/.env

# Start full stack
docker-compose up --build

Backend: http://localhost:8000/docs (For Full Swagger docs)

Frontend: http://localhost:5173