# AI Customer Support Platform

A high-fidelity, multilingual AI customer support dashboard with real-time sentiment analysis, order tracking, and dynamic visual reactions.

## 🚀 Features

- **Intelligent AI Orchestration**: Multi-intent detection for tracking, refunds, payments, and general queries.
- **Sentiment-Driven UI**: 
  - Dynamic background animation (SaaS-style floating geometric shapes).
  - **Emotional Emoji Reactions**: Real-time visual feedback (flying emojis) when user tone is detected as Angry, Frustrated, or Urgent.
- **Multilingual Support**: Real-time language detection and switching (English, Hindi, Gujarati, etc.).
- **Voice-to-Text**: WhatsApp-style voice input for seamless interaction.
- **Secure Authentication**: Session-locked dashboard and order data.
- **Order Management**: Real-time database integration for order status and tracking.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15+, TypeScript, Vanilla CSS (Premium Glassmorphism).
- **Backend**: Node.js, Express, TypeScript, Groq SDK (Llama 3.3).
- **Database**: MongoDB Atlas.

## 🏁 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ai-customer-support
```

### 2. Backend Setup
```bash
cd backend_Node
npm install
```
Create a `.env` file in `backend_Node`:
```env
PORT=8000
MONGO_URI=your_mongodb_uri
GROQ_API_KEY=your_groq_api_key
```
Run backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Run frontend:
```bash
npm run dev
```

## 🎨 Visual System

The application features a premium **AI SaaS aesthetic**:
- **Background**: Subtle floating gradients and geometric particles.
- **Glassmorphism**: Translucent chat cards with backdrop blur.
- **Animations**: 
  - `flyUpAndFade`: Emojis react to sentiment.
  - `float`: Ambient movement of background elements.

## 📄 License

MIT
