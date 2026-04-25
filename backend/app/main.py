from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = Groq(api_key=GROQ_API_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[""],  # use exact frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conversation_store = {}

class ChatRequest(BaseModel):
    conversation_id: str
    message: str

@app.get("/")
def home():
    return {"message": "AI Customer Support Backend Running"}

@app.post("/chat")
def chat(request: ChatRequest):
    conversation_id = request.conversation_id
    user_message = request.message.strip()

    if not user_message:
        return {"reply": "Please type a message.", "conversation_id": conversation_id, "history": []}

    if conversation_id not in conversation_store:
        conversation_store[conversation_id] = [
            {
                "role": "system",
                "content": (
                    "You are a helpful AI customer support assistant. "
                    "Answer clearly, politely, and briefly. "
                    "If order-specific help is needed, ask for the order ID."
                )
            }
        ]

    conversation_store[conversation_id].append({
        "role": "user",
        "content": user_message
    })

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=conversation_store[conversation_id],
            temperature=0.7,
            max_tokens=300,
        )

        ai_reply = completion.choices[0].message.content

    except Exception as e:
        ai_reply = f"Error from AI service: {str(e)}"

    conversation_store[conversation_id].append({
        "role": "assistant",
        "content": ai_reply
    })

    return {
        "reply": ai_reply,
        "conversation_id": conversation_id,
        "history": conversation_store[conversation_id]
    }