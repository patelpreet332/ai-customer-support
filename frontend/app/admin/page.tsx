"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

type Sentiment = {
  score: number;
  emotion: string;
  label: string;
};

type Message = {
  role: string;
  content: string;
  sentiment?: Sentiment;
  timestamp: string;
};

type Conversation = {
  _id: string;
  conversation_id: string;
  user_email?: string;
  user_name?: string;
  messages: Message[];
  language?: string;
};

const API_URL = "http://localhost:8000";

export default function AdminDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/conversations`);
      const data = await res.json();
      setConversations(data);
      
      // Select the first customer by default if available
      if (data.length > 0) {
        const firstWithEmail = data.find((c: Conversation) => c.user_email);
        if (firstWithEmail) setSelectedUserEmail(firstWithEmail.user_email);
        else setSelectedUserEmail("Anonymous");
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group conversations by user email
  const groupedByCustomer = useMemo(() => {
    return conversations.reduce((acc, conv) => {
      const email = conv.user_email || "Anonymous";
      if (!acc[email]) {
        acc[email] = {
          name: conv.user_name || "Anonymous Customer",
          email: email,
          conversations: []
        };
      }
      acc[email].conversations.push(conv);
      return acc;
    }, {} as Record<string, { name: string, email: string, conversations: Conversation[] }>);
  }, [conversations]);

  const customerList = Object.values(groupedByCustomer);
  const activeCustomer = selectedUserEmail ? groupedByCustomer[selectedUserEmail] : null;

  const getSentimentColor = (label?: string) => {
    switch (label) {
      case "positive": return "#10b981";
      case "negative": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getSentimentBg = (label?: string) => {
    switch (label) {
      case "positive": return "#ecfdf5";
      case "negative": return "#fef2f2";
      default: return "#f9fafb";
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f1f5f9", fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar: Customer List */}
      <div style={{ width: "350px", background: "white", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px", borderBottom: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#1e293b", margin: 0 }}>Customers</h2>
          <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>Select a customer to view threads</p>
        </div>
        
        <div style={{ flex: 1, overflowY: "auto" }}>
          {customerList.map((customer) => (
            <div 
              key={customer.email}
              onClick={() => setSelectedUserEmail(customer.email)}
              style={{ 
                padding: "16px 24px", 
                cursor: "pointer", 
                borderBottom: "1px solid #f1f5f9",
                background: selectedUserEmail === customer.email ? "#eff6ff" : "transparent",
                borderLeft: selectedUserEmail === customer.email ? "4px solid #3b82f6" : "4px solid transparent",
                transition: "all 0.2s"
              }}
            >
              <div style={{ fontWeight: "700", color: "#1e293b", fontSize: "14px" }}>{customer.name}</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{customer.email}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                <span style={{ fontSize: "10px", background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px", color: "#475569", fontWeight: "600" }}>
                  {customer.conversations.length} Threads
                </span>
              </div>
            </div>
          ))}
          {loading && <div style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>Loading...</div>}
        </div>

        <div style={{ padding: "20px", borderTop: "1px solid #e2e8f0" }}>
          <button 
            onClick={() => router.push("/")}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#1e293b", color: "white", border: "none", cursor: "pointer", fontWeight: "600" }}
          >
            Back to Agent
          </button>
        </div>
      </div>

      {/* Main Content: Threads for selected customer */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh" }}>
        {activeCustomer ? (
          <>
            <header style={{ padding: "24px 40px", background: "white", borderBottom: "1px solid #e2e8f0" }}>
              <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#1e293b", margin: 0 }}>{activeCustomer.name}</h1>
              <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "14px" }}>{activeCustomer.email}</p>
            </header>

            <div style={{ flex: 1, overflowY: "auto", padding: "40px" }}>
              <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" }}>
                {activeCustomer.conversations.map((conv, cIdx) => (
                  <div key={conv._id}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                       <div style={{ height: "1px", flex: 1, background: "#cbd5e1" }}></div>
                       <span style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                         Thread: {conv.conversation_id.substring(0, 8)}...
                       </span>
                       <div style={{ height: "1px", flex: 1, background: "#cbd5e1" }}></div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {conv.messages.map((msg, mIdx) => (
                        <div key={mIdx} style={{ 
                          padding: "16px", 
                          borderRadius: "12px", 
                          background: msg.role === 'user' ? getSentimentBg(msg.sentiment?.label) : "white",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                          alignSelf: msg.role === 'user' ? "flex-start" : "flex-end",
                          maxWidth: "85%",
                          position: "relative"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", gap: "24px" }}>
                            <span style={{ fontSize: "11px", fontWeight: "800", color: msg.role === 'user' ? getSentimentColor(msg.sentiment?.label) : "#64748b" }}>
                              {msg.role === 'user' ? activeCustomer.name.toUpperCase() : "SUPPORT AI"}
                            </span>
                            {msg.sentiment && (
                              <div style={{ display: "flex", gap: "6px" }}>
                                <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "99px", background: getSentimentColor(msg.sentiment.label), color: "white", fontWeight: "800" }}>
                                  {msg.sentiment.emotion.toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div style={{ fontSize: "14px", color: "#334155", lineHeight: "1.6" }}>{msg.content}</div>
                          <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "8px", textAlign: "right" }}>
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
              <p>Select a customer from the sidebar to view their threads</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
