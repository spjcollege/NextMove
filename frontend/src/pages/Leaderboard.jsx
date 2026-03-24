import { useEffect, useState } from "react";
import { apiFetch } from "../api";

function Leaderboard() {
    const [activeTab, setActiveTab] = useState("puzzles");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchLeaderboard(); }, [activeTab]);

    const fetchLeaderboard = () => {
        setLoading(true);
        apiFetch(`/leaderboard/${activeTab}`)
            .then(setData)
            .catch(() => setData([]))
            .finally(() => setLoading(false));
    };

    const tabs = [
        { key: "puzzles", label: "🧩 Puzzle Rating" },
        { key: "players", label: "♔ Player Rating" },
        { key: "community", label: "💬 Community" },
    ];

    const getValueLabel = () => {
        if (activeTab === "puzzles") return "Puzzle Rating";
        if (activeTab === "players") return "Rating";
        return "Posts";
    };

    const getValue = (item) => {
        if (activeTab === "puzzles") return item.puzzle_rating;
        if (activeTab === "players") return item.rating;
        return item.post_count;
    };

    return (
        <div className="page animate-fade-in" style={{ maxWidth: 700, margin: "0 auto" }}>
            <h1 style={{ marginBottom: 8 }}>🏆 Leaderboard</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 24 }}>
                Top players in the NextMove community
            </p>

            {/* Tabs */}
            <div className="category-pills" style={{ marginBottom: 24 }}>
                {tabs.map((tab) => (
                    <button key={tab.key} className={`pill ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ display: "grid", gap: 8 }}>
                    {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 56 }} />)}
                </div>
            ) : data.length === 0 ? (
                <div style={{ textAlign: "center", padding: 48, color: "var(--text-tertiary)" }}>
                    <p>No data yet.</p>
                </div>
            ) : (
                <div style={{ display: "grid", gap: 4 }}>
                    {/* Header */}
                    <div style={{
                        display: "grid", gridTemplateColumns: "50px 1fr 100px",
                        padding: "10px 16px", fontSize: "0.72rem", fontWeight: 600,
                        color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.5px",
                    }}>
                        <span>#</span>
                        <span>Player</span>
                        <span style={{ textAlign: "right" }}>{getValueLabel()}</span>
                    </div>

                    {data.map((item, i) => (
                        <div key={i} className="card" style={{
                            display: "grid", gridTemplateColumns: "50px 1fr 100px",
                            padding: "12px 16px", alignItems: "center",
                            background: i < 3 ? "rgba(212,168,67,0.04)" : "var(--bg-card)",
                        }}>
                            <span style={{
                                fontWeight: 800, fontSize: "0.9rem",
                                color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "var(--text-tertiary)",
                            }}>
                                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : item.rank}
                            </span>

                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div className="user-avatar sm">{item.username?.charAt(0).toUpperCase()}</div>
                                <div>
                                    <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{item.username}</span>
                                    {item.subscription_tier && item.subscription_tier !== "free" && (
                                        <span className="badge badge-gold" style={{ marginLeft: 6, fontSize: "0.6rem" }}>{item.subscription_tier}</span>
                                    )}
                                </div>
                            </div>

                            <span style={{ textAlign: "right", fontWeight: 700, fontSize: "1rem", color: "var(--brand-gold)" }}>
                                {getValue(item)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Leaderboard;
