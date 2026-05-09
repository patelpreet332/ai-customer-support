"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import EmojiFlyer from "../components/EmojiFlyer";
import BackgroundAnimation from "../components/BackgroundAnimation";

type ChatMessage = {
  sender: "user" | "ai";
  text: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [conversationId, setConversationId] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const [isListening, setIsListening] = useState(false);
  const [speechLang, setSpeechLang] = useState("en-IN");
  const recognitionRef = useRef<any>(null);

  const initRecognition = (lang: string) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      if (recognitionRef.current) recognitionRef.current.stop();

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = lang;

      recognitionRef.current.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setMessage((prev) => prev + event.results[i][0].transcript);
          }
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(savedUser));
    }
    setConversationId(crypto.randomUUID());
    initRecognition(speechLang);
  }, [router, speechLang]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const [activeEmoji, setActiveEmoji] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!message.trim() || loading || !user) return;
    if (isListening) toggleListening(); // Stop listening on send

    const currentMessage = message.trim();

    setChat((prev) => [...prev, { sender: "user", text: currentMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: currentMessage,
          user_email: user.email, // Pass the logged-in user's email
        }),
      });

      if (!res.ok) {
        throw new Error("Backend request failed");
      }

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.reply || "No response from AI.",
        },
      ]);

      // Handle Sentiment-based Emojis
      if (data.metadata?.sentiment?.emotion) {
        const emotion = data.metadata.sentiment.emotion;
        // console.log("[SENTIMENT-DEBUG] Emotion detected:", emotion);
        
        const emojiMap: Record<string, string> = {
          anger: "😡",
          frustration: "😤",
          urgency: "🚨",
          disappointment: "😞",
          sadness: "😢",
          confusion: "❓",
          happiness: "✨",
          satisfaction: "✅"
        };

        if (emojiMap[emotion]) {
          setActiveEmoji(emojiMap[emotion]);
        }
      }
    } catch (error) {
      setChat((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Error connecting to backend. Please make sure the backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  if (!user) return null; // Prevent flicker before redirect

  return (
    <main className="container">
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .listening {
          animation: pulse 1.5s infinite;
          background: #ef4444 !important;
        }
      `}</style>
      
      {activeEmoji && (
        <EmojiFlyer 
          emoji={activeEmoji} 
          onComplete={() => setActiveEmoji(null)} 
        />
      )}
      
      <div className="chat-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#2563eb", color: "white", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", fontWeight: "bold" }}>
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px" }}>{user.name}</h3>
              <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Online</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #d1d5db", background: "white", cursor: "pointer", fontSize: "13px" }}
          >
            Logout
          </button>
        </div>

        <h1 className="heading">AI Customer Support</h1>
        <p className="subheading">
          Welcome back, {user.name.split(' ')[0]}! How can I help you with your orders today?
        </p>

        <div className="chat-box">
          {chat.length === 0 && !loading && (
            <p className="placeholder">
              Try asking: “Where is my recent order?”
            </p>
          )}

          {chat.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "user" ? "user-message" : "ai-message"}`}
            >
              <strong>{msg.sender === "user" ? "You" : "Support AI"}:</strong>
              <span> {msg.text}</span>
            </div>
          ))}

          {loading && (
            <div className="message ai-message">
              <strong>Support AI:</strong>
              <span> Typing...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="input-area">
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <button
              onClick={() => setSpeechLang(speechLang === "en-IN" ? "hi-IN" : "en-IN")}
              style={{ padding: "4px 8px", fontSize: "10px", borderRadius: "4px", border: "1px solid #cbd5e1", background: "white", fontWeight: "bold" }}
            >
              {speechLang === "en-IN" ? "EN" : "HI"}
            </button>
            <button
              onClick={toggleListening}
              className={`send-button ${isListening ? "listening" : ""}`}
              style={{ background: "#64748b", padding: "12px" }}
              title="Speak"
            >
              {isListening ? "🛑" : "🎤"}
            </button>
          </div>
          <input
            type="text"
            value={message}
            placeholder={isListening ? `Listening (${speechLang === "en-IN" ? "English" : "Hindi"})...` : "Type your question..."}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="chat-input"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            className="send-button"
            disabled={loading || !message.trim()}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </main>
  );
}