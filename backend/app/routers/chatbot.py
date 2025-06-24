from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from openai import OpenAI, RateLimitError, APIConnectionError, APIStatusError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from .. import database, models
import os

router = APIRouter()
openai_api_key = os.getenv("OPENAI_API_KEY")

# Request model
class ChatRequest(BaseModel):
    question: str

@router.post("/chatbot")
def ask_llm(request: ChatRequest, db: Session = Depends(database.get_db)):
    if not openai_api_key:
        raise HTTPException(staoptiontus_code=500, detail="Missing OpenAI API key")

    question = request.question

    # Fetch context from DB
    users = db.query(models.User).all()
    groups = db.query(models.Group).all()
    expenses = db.query(models.Expense).all()

    context = {
        "users": [ {"id": u.id, "name": u.name} for u in users ],
        "groups": [ {"id": g.id, "name": g.name} for g in groups ],
        "expenses": [ 
            {
                "description": e.description,
                "amount": e.amount,
                "paid_by": e.paid_by,
                "group_id": e.group_id,
                "split_type": e.split_type,
                "splits": [{ "user_id": s.user_id, "amount": s.amount } for s in e.splits]
            } for e in expenses
        ]
    }

    client = OpenAI(api_key=openai_api_key)
    messages = [
        { "role": "system", "content": "You are a financial assistant for a Splitwise-like app." },
        { "role": "user", "content": f"Context:\n{context}\n\nQuestion:\n{question}" }
    ]

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.5,
            max_tokens=300
        )
        return { "answer": response.choices[0].message.content.strip() }

    except RateLimitError:
        return JSONResponse(status_code=429, content={"error": "OpenAI quota exceeded. Please check your usage or billing."})

    except APIConnectionError:
        return JSONResponse(status_code=503, content={"error": "Connection to OpenAI API failed."})

    except APIStatusError as e:
        return JSONResponse(status_code=500, content={"error": f"OpenAI API error: {str(e)}"})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Unexpected error: {str(e)}"})
# This code defines a FastAPI router for a chatbot that interacts with an LLM (Large Language Model)
# to answer questions about a financial management application. It fetches context from the database,
# including users, groups, and expenses, and sends this context along with the user's question to the LLM.  
# The response from the LLM is returned as the answer to the user's question.
# It also handles various exceptions that may occur during the API call, such as rate limits and connection errors.