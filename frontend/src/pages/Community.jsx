import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useAuth } from "../App";

function Community() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { user, showToast } = useAuth();

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = () => {
    apiFetch("/community/messages").then(setMessages).catch(() => { });
  };

  const postMessage = async () => {
    if (!text.trim()) return;
    if (!user) { showToast("Please login to post", "error"); return; }
    try {
      await apiFetch("/community/messages", {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      setText("");
      fetchMessages();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  return (
    <div className="page animate-fade-in" style={{ maxWidth: 700, margin: "0 auto" }}>
      <div className="section-header">
        <h1>👥 Community Chat</h1>
      </div>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 24 }}>
        Connect with fellow chess enthusiasts. Share ideas, discuss strategies, and make friends.
      </p>

      {/* Post */}
      {user && (
        <div className="card" style={{ display: "flex", gap: 12, marginBottom: 24, padding: 16 }}>
          <div className="user-avatar sm">{user.username?.charAt(0).toUpperCase()}</div>
          <input
            className="input"
            placeholder="Share your thoughts..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && postMessage()}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={postMessage}>Post</button>
        </div>
      )}

      {/* Messages */}
      <div style={{ display: "grid", gap: 8 }}>
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
      </div>
    </div>
  );
}

export default Community;