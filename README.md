# AI Customer Support

[![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3-orange?style=for-the-badge)](https://groq.com/)

---

### Experience the Future of Customer Support
A sophisticated, high-fidelity AI orchestration system built for the modern ecommerce era. This platform goes beyond simple chat—it understands **emotion**, speaks **multiple languages**, and delivers **secure, factual data** in real-time.

---

## Key Capabilities

| Feature | Description |
| :--- | :--- |
| **Intelligent Orchestration** | Powered by Llama 3.3 for lightning-fast, context-aware reasoning. |
| **Sentiment Engine** | Detects tone (Anger, Frustration, Joy) and adapts the AI response accordingly. |
| **Visual Reactions** | Real-time emoji "fly-aways" triggered by emotional sentiment. |
| **Multilingual** | Seamlessly switches between English, Hindi, Gujarati, and more. |
| **Voice Interface** | WhatsApp-style voice-to-text for frictionless user interaction. |
| **Session Security** | Strict data isolation—users only access their specific order history. |

---

## System Architecture

### Frontend (Next.js 15+)
- **Premium UI**: Glassmorphism aesthetic with backdrop-blur effects.
- **Ambient Motion**: SaaS-style floating geometric background particles.
- **Real-time Feedback**: Dynamic UI states that react to AI metadata.

### Backend (Node.js & Express)
- **AI Core**: Groq SDK integration for high-performance LLM execution.
- **Data Truth**: Factual injection pipeline to eliminate AI hallucinations.
- **Persistence**: MongoDB Atlas for secure conversation and order storage.

---

## System Workflow

```mermaid
graph TD
    A[User Input: Voice/Text] --> B[Frontend Dashboard]
    B --> C{Backend Orchestrator}
    C --> D[Retrieve Chat History]
    C --> E[Secure Order Data Fetch]
    D & E --> F[AI Context Injection]
    F --> G[Groq Llama 3.3 Processing]
    G --> H[Sentiment & Intent Detection]
    H --> I[Generate Tailored Response]
    I --> J[Return Content + Metadata]
    J --> K[Frontend: Render Response]
    J --> L[Trigger Visual Emotions]
```

---

## Quick Start Guide

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd ai-customer-support
```

### 2. Configure Backend
```bash
cd backend_Node
npm install
```
> [!IMPORTANT]
> Create a `.env` file in `backend_Node` with your `MONGODB_URI` and `GROQ_API_KEY`.

### 3. Launch the Platform
```bash
# In backend_Node
npm run dev

# In a new terminal
cd frontend
npm install
npm run dev
```
---

## Environment Reference

```env
PORT=8000
MONGODB_URI=mongodb+srv://...
GROQ_API_KEY=gsk_...
FRONTEND_URL=http://localhost:3000
```

---

## Security & Performance
- **Prompt Guard**: Multi-intent detection limits AI to ecommerce boundaries.
- **Truth Filtering**: Backend retrieves order data *before* the AI processes the response.
- **Optimization**: Minimal dependencies for ultra-fast page loads and transitions.

---

## Visual Gallery
![Dashboard View](./screenshots/Screenshot%20from%202026-05-18%2014-47-01.png)
![Chat Conversation View](./screenshots/Screenshot%20from%202026-05-18%2014-51-27.png)
![Sentiment & Response View](./screenshots/Screenshot%20from%202026-05-18%2014-55-21.png)
![Voice Input View](./screenshots/Screenshot%20from%202026-05-18%2014-56-36.png)
![Multilingual Interaction View](./screenshots/Screenshot%20from%202026-05-18%2014-57-47.png)

---

