import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import { useAuth } from "../App";

export default function Competitions() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, showToast } = useAuth();

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const data = await apiFetch("/competitions/");
      setCompetitions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (id) => {
    try {
      await apiFetch(`/competitions/${id}/join`, { method: "POST" });
      showToast("Joined competition successfully!");
      fetchCompetitions();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleWin = async (id) => {
    try {
      const res = await apiFetch(`/competitions/${id}/win`, { method: "POST" });
      showToast(`Congratulations! You won and earned ${res.points} points.`);
      fetchCompetitions();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  if (loading) return <div className="page-loading">Loading competitions...</div>;

  return (
    <div className="page animate-fade-in">
      <header className="section-header">
        <div>
          <h1>🏆 Chess Competitions</h1>
          <p style={{ color: "var(--text-secondary)" }}>Join tournaments, compete with masters, and win exclusive rewards.</p>
        </div>
      </header>

      <div className="competitions-layout">
        <div className="competitions-grid">
          {competitions.map((comp) => (
            <div key={comp.id} className="competition-card">
              <div className="comp-badge">{comp.status}</div>
              <h3 style={{ marginBottom: "8px" }}>{comp.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", minHeight: "3em" }}>{comp.description}</p>
              
              <div className="comp-stats">
                <div>
                  <span style={{ color: "var(--text-tertiary)", fontSize: "0.7rem", display: "block" }}>PRIZE POOL</span>
                  <span>₹{comp.prize_pool}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ color: "var(--text-tertiary)", fontSize: "0.7rem", display: "block" }}>REWARD</span>
                  <span style={{ color: "var(--brand-gold)" }}>{comp.points_reward} Pts</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleJoin(comp.id)}>
                  Join Tournament
                </button>
                <button className="btn btn-secondary" title="Simulate Win" onClick={() => handleWin(comp.id)}>
                   🏅
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="marketing-sidebar">
          <div className="ad-card">
            <div className="ad-image">♟️</div>
            <h4>Premium Coaching</h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
              Get 1-on-1 sessions with Grandmasters.
            </p>
            <button className="btn btn-sm btn-outline" style={{ width: "100%" }}>Learn More</button>
          </div>

          <div className="ad-card" style={{ border: "1px solid var(--brand-emerald)" }}>
            <div className="ad-image" style={{ color: "var(--brand-emerald)" }}>💎</div>
            <h4>Pro Subscription</h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
              Unlock all courses and advanced puzzles.
            </p>
            <button className="btn btn-sm btn-primary" style={{ width: "100%", background: "var(--brand-emerald)" }}>Upgrade Now</button>
          </div>

          <div className="card-glass" style={{ padding: "16px" }}>
            <h4 style={{ fontSize: "0.9rem", marginBottom: "8px" }}>📢 Announcements</h4>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              • NextMove Open starts in 3 days!
              <br />
              • New "Endgame Master" course live.
              <br />
              • Leaderboard reset on May 1st.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
