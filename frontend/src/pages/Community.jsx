import { useEffect, useState, useRef } from "react";
import { getToken } from "../api";
import { useAuth } from "../App";

const WS_URL = "ws://127.0.0.1:8000/community/ws";

function Community() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);
  const { user, showToast } = useAuth();
  const wsRef = useRef(null);
  const bottomRef = useRef(null);

  const retryRef = useRef(null);
  const retryDelay = useRef(2000); // starts at 2s, doubles up to 30s

  const connect = () => {
    const token = getToken() || "";
    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      retryDelay.current = 2000; // reset backoff on success
      if (retryRef.current) {
        clearTimeout(retryRef.current);
        retryRef.current = null;
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "history") {
        setMessages(data.messages);
      } else if (data.type === "message") {
        setMessages((prev) => [...prev, data]);
      } else if (data.type === "error") {
        showToast(data.detail, "error");
      }
    };

    ws.onclose = () => {
      setConnected(false);
      const delay = retryDelay.current;
      retryDelay.current = Math.min(delay * 2, 30000); // exponential backoff, max 30s
      retryRef.current = setTimeout(() => connect(), delay);
    };

    ws.onerror = () => {
      ws.close(); // triggers onclose → reconnect
    };
  };

  useEffect(() => {
    connect();
    return () => {
      if (retryRef.current) clearTimeout(retryRef.current);
      wsRef.current?.close();
    };
  }, []);


  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const postMessage = () => {
    if (!text.trim()) return;
    if (!user) { showToast("Please login to post", "error"); return; }
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      showToast("Not connected to chat", "error");
      return;
    }
    wsRef.current.send(JSON.stringify({ text }));
    setText("");
  };

  return (
    <div className="page animate-fade-in" style={{ maxWidth: 700, margin: "0 auto" }}>
      <div className="section-header">
        <h1>👥 Community Chat</h1>
        <span style={{
          fontSize: "0.75rem", padding: "4px 10px", borderRadius: 999,
          background: connected ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
          color: connected ? "var(--brand-emerald)" : "#EF4444",
          fontWeight: 600,
        }}>
          {connected ? "● Live" : "○ Connecting..."}
        </span>
      </div>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 24 }}>
        Connect with fellow chess enthusiasts in real-time. Messages appear instantly for everyone.
      </p>

      {/* Messages */}
      <div style={{
        display: "grid", gap: 8, maxHeight: 480, overflowY: "auto",
        marginBottom: 24, padding: "4px 0",
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: 48, color: "var(--text-tertiary)" }}>
            <p style={{ fontSize: "2rem", marginBottom: 8 }}>💬</p>
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className="card" style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div className="user-avatar sm">{msg.username?.charAt(0).toUpperCase()}</div>
              <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{msg.username}</span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                {new Date(msg.created_at).toLocaleString()}
              </span>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", paddingLeft: 38 }}>{msg.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Post */}
      {user ? (
        <div className="card" style={{ display: "flex", gap: 12, padding: 16 }}>
          <div className="user-avatar sm">{user.username?.charAt(0).toUpperCase()}</div>
          <input
            className="input"
            placeholder="Share your thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && postMessage()}
            style={{ flex: 1 }}
            disabled={!connected}
          />
          <button className="btn btn-primary" onClick={postMessage} disabled={!connected}>
            Post
          </button>
        </div>
      ) : (
        <div className="card" style={{ textAlign: "center", padding: 16, color: "var(--text-tertiary)", fontSize: "0.85rem" }}>
          <a href="/auth" style={{ color: "var(--brand-gold)" }}>Sign in</a> to join the conversation.
        </div>
      )}
    </div>
  );
}

export default Community;