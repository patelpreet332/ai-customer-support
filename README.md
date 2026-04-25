# AI Customer Support Platform

A full-stack AI-style customer support chat application built using **FastAPI (Python)** for the backend and **Next.js (React + TypeScript)** for the frontend.

This project demonstrates how modern AI-powered support systems can be structured using a conversational interface, session-based memory, and scalable APIs.

For demonstration purposes, the application currently uses **mock AI responses**, allowing the project to run without requiring external API billing.

---

## Features

- AI-style customer support chat interface  
- Real-time communication between frontend and backend  
- Session-based conversation memory  
- REST API built with FastAPI  
- Next.js modern frontend UI  
- Mock AI responses for demonstration and testing  
- Modular architecture ready for real AI integration  

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- CSS

### Backend
- FastAPI
- Python
- Pydantic
- Uvicorn

### Development Tools
- Node.js
- npm
- Git

---

## Project Structure

```
ai-customer-support
│
├── backend
│   ├── app
│   │   └── main.py
│   └── requirements.txt
│
├── frontend
│   ├── app
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Vilas2809/ai-customer-support.git
cd ai-customer-support
```

---

## Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the FastAPI server:

```bash
uvicorn app.main:app --reload
```

Backend will run on:

```
http://127.0.0.1:8000
```

API documentation:

```
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:3000
```

---

## How It Works

1. The user enters a message in the chat interface.
2. The frontend sends the request to the FastAPI backend.
3. The backend processes the request and generates a response.
4. A mock AI reply is returned to the frontend.
5. The chat interface displays the response.

---

## Future Improvements

- Integrate real LLM APIs (OpenAI, Claude, etc.)
- Add authentication system
- Store chat history in a database
- Implement streaming responses
- Deploy backend and frontend to cloud platforms

---

## Author

**Vilas Srirama Reddy**

GitHub:  
https://github.com/Vilas2809

---

## License

This project is for educational and demonstration purposes.