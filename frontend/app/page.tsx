"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  sender: "user" | "ai";
  text: string;
};

const API_URL =  "https://ai-customer-support-mq3q.onrender.com";

export default function Home() {
  const [conversationId , setConversationId] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
      setConversationId(crypto.randomUUID());
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

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
        }),
      });

      if (!res.ok) {
        console.error("Backend error:", await res.text());
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
    } catch (error) {
      setChat((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Error connecting to backend. Please make sure the backend is running and deployed correctly.",
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

  return (
    <main className="container">
      <div className="chat-card">
        <h1 className="heading">AI Customer Support</h1>
        <p className="subheading">
          Ask questions about password reset, refunds, orders, payments, or cancellations.
        </p>

        <div className="chat-box">
          {chat.length === 0 && !loading && (
            <p className="placeholder">
              Try asking: “How do I reset my password?”
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
          <input
            type="text"
            value={message}
            placeholder="Type your question..."
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