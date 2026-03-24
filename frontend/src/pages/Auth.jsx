import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, setAuth } from "../api";
import { useAuth } from "../App";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, showToast } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const body = isLogin
        ? { username, password }
        : { username, email, password, full_name: fullName };

      const data = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      setAuth(data.token, data.user);
      login(data.token, data.user);
      showToast(`Welcome${isLogin ? " back" : ""}, ${data.user.username}! ♔`);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "calc(100vh - var(--nav-height) - 80px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div className="card animate-slide-up" style={{ width: "100%", maxWidth: 420, padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: "2.5rem", display: "block", marginBottom: 12 }}>♔</span>
          <h2 style={{ fontSize: "1.5rem" }}>{isLogin ? "Welcome Back" : "Join NextMove"}</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
            {isLogin ? "Sign in to your account" : "Create your chess journey"}
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "var(--radius-md)", padding: "10px 16px",
            color: "#EF4444", fontSize: "0.82rem", marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Username</label>
              <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" required />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Full Name</label>
                  <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Email</label>
                  <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
                </div>
              </>
            )}

            <div>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Password</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>

            <button className="btn btn-primary btn-lg" type="submit" disabled={loading} style={{ width: "100%" }}>
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </div>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.82rem", color: "var(--text-secondary)" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            style={{ background: "none", border: "none", color: "var(--brand-gold)", cursor: "pointer", fontWeight: 600, fontFamily: "Inter" }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;