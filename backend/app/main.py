from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory conversation store
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

    if conversation_id not in conversation_store:
        conversation_store[conversation_id] = []

    conversation_store[conversation_id].append({
        "role": "user",
        "content": user_message
    })

    text = user_message.lower()

    if "reset my password" in text or "password" in text:
        ai_reply = (
            "You can reset your password by clicking 'Forgot Password' on the "
            "login page and following the instructions sent to your email."
        )
    elif "refund" in text:
        ai_reply = (
            "Refunds usually take 5 to 7 business days after approval. "
            "Please share your order ID if you want help checking the status."
        )
    elif "order" in text or "track" in text or "delivery" in text:
        ai_reply = (
            "Please share your order ID and I can help you track your order status."
        )
    elif "payment" in text or "card" in text or "checkout" in text:
        ai_reply = (
            "Please verify your card details, billing address, and available balance. "
            "If the issue continues, contact support with the payment time and order details."
        )
    elif "cancel" in text:
        ai_reply = (
            "You can cancel your order from the orders page if it has not been shipped yet. "
            "If it has already shipped, you may need to request a return instead."
        )
    elif "hello" in text or "hi" in text:
        ai_reply = "Hello! How can I help you today?"
    else:
        ai_reply = (
            f"I understand your question: '{user_message}'. "
            "This is a mock AI support response for now."
        )

    conversation_store[conversation_id].append({
        "role": "assistant",
        "content": ai_reply
    })

    return {
        "reply": ai_reply,
        "conversation_id": conversation_id,
        "history": conversation_store[conversation_id]
    }