# 🤖 AI Customer Support Chatbot

A full-stack AI-powered customer support application that provides real-time responses to user queries such as password resets, refunds, orders, payments, and cancellations.

---

## 🚀 Live Demo

* 🌐 Frontend (Vercel): https://ai-customer-support-fbdyygvhk-vilas2809s-projects.vercel.app
* ⚙️ Backend (Render): https://ai-customer-support-mq3q.onrender.com

---

## 🛠️ Tech Stack

### Frontend

* Next.js (React)
* TypeScript
* CSS / Tailwind (if used)

### Backend

* FastAPI (Python)
* Groq API (LLM integration)
* Pydantic
* Uvicorn

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## ✨ Features

* 💬 Real-time AI chat interface
* 🤖 LLM-powered responses using Groq API
* 🔗 Full-stack integration (Next.js + FastAPI)
* 🌐 Deployed on cloud (Vercel + Render)
* 🔐 CORS-enabled secure API communication
* ⚡ Fast and responsive UI

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

git clone https://github.com/your-username/ai-customer-support.git
cd ai-customer-support

---

### 2️⃣ Backend Setup (FastAPI)

cd backend
python -m venv venv
source venv/bin/activate   (Mac/Linux)
venv\Scripts\activate      (Windows)

pip install -r requirements.txt

#### Create `.env` file

GROQ_API_KEY=your_api_key_here
FRONTEND_URL=http://localhost:3000

#### Run backend

uvicorn app.main:app --reload

---

### 3️⃣ Frontend Setup (Next.js)

cd frontend
npm install
npm run dev

---

## 🔗 API Endpoints

### POST `/chat`

**Request:**
{
"conversation_id": "test123",
"message": "Hello"
}

**Response:**
{
"reply": "Hello. How can I assist you today?"
}

---

## 🚨 CORS Configuration

allow_origins = [
"https://ai-customer-support-fbdyygvhk-vilas2809s-projects.vercel.app",
"http://localhost:3000"
]

---

## 📦 Deployment

### Frontend (Vercel)

* Connected GitHub repo
* Auto deployment enabled

### Backend (Render)

* requirements.txt configured
* Start command:
  uvicorn app.main:app --host 0.0.0.0 --port 10000

---

## 🧠 Learnings

* Full-stack development with Next.js and FastAPI
* API integration and async handling
* Debugging production issues (CORS)
* Cloud deployment and environment configuration
* Working with LLM APIs (Groq)

---

## 📌 Future Improvements

* 🔐 User authentication (login/signup)
* 💾 Database integration (store chat history)
* 🎨 Improved UI/UX (animations, typing effect)
* 📊 Analytics dashboard

---

## 👨‍💻 Author

Vilas Reddy
GitHub: https://github.com/Vilas2809

---

## ⭐️ Show Your Support

If you like this project, give it a ⭐️ on GitHub!
