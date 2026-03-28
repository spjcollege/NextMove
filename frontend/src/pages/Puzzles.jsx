import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { useAuth } from "../App";

function Puzzles() {
    const [daily, setDaily] = useState(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [result, setResult] = useState(null);
    const [stats, setStats] = useState(null);
    const { user, showToast } = useAuth();

    useEffect(() => {
        apiFetch("/puzzles/daily").then(setDaily).catch(() => { });
        if (user) {
            apiFetch("/puzzles/stats").then(setStats).catch(() => { });
        }
    }, [user]);

    const handleSolve = async () => {
        if (!user) { showToast("Login to solve puzzles", "error"); return; }
        if (!userAnswer.trim()) return;
        try {
            const res = await apiFetch(`/puzzles/${daily.id}/solve`, {
                method: "POST",
                body: JSON.stringify({ solution: userAnswer }),
            });
            setResult(res);
            if (res.correct) showToast("Correct! 🎉");
            else showToast("Incorrect. Try again!", "error");
            apiFetch("/puzzles/stats").then(setStats);
        } catch (e) { showToast(e.message, "error"); }
    };

    return (
        <div className="page animate-fade-in" style={{ maxWidth: 800, margin: "0 auto" }}>
            <div className="section-header">
                <div>
                    <h1>🧩 Daily Puzzle</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 4 }}>
                        Sharpen your tactical vision every day
                    </p>
                </div>
            </div>

            {/* Stats */}
            {stats && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: "rgba(212,168,67,0.15)", color: "var(--brand-gold)" }}>🧩</div>
                        <div>
                            <div className="stat-value">{stats.puzzle_rating}</div>
                            <div className="stat-label">Puzzle Rating</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: "rgba(16,185,129,0.15)", color: "var(--brand-emerald)" }}>✓</div>
                        <div>
                            <div className="stat-value">{stats.solved}</div>
                            <div className="stat-label">Solved</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6" }}>📊</div>
                        <div>
                            <div className="stat-value">{stats.accuracy}%</div>
                            <div className="stat-label">Accuracy</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Puzzle */}
            {daily && (
                <div className="card" style={{ padding: 32 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                        <span className="badge badge-gold">{daily.theme}</span>
                        <span className="badge badge-blue">Rating: {daily.difficulty}</span>
                    </div>

                    {/* Chess Position (Embedded Lichess Board) */}
                    <div style={{
                        borderRadius: "var(--radius-lg)",
                        height: 400, overflow: "hidden",
                        marginBottom: 24, border: "1px solid var(--border-subtle)",
                    }}>
                        <iframe 
                            src={`https://lichess.org/analysis/standard/${encodeURIComponent(daily.fen)}`} 
                            style={{ width: "100%", height: "100%", border: "none" }}
                            title="Chess Board"
                        />
                    </div>

                    <h3 style={{ marginBottom: 12 }}>Your Move</h3>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: 16 }}>
                        Find the best move in this position. Enter in algebraic notation (e.g., Qxf7#, Nxe5, etc.)
                    </p>

                    <div style={{ display: "flex", gap: 12 }}>
                        <input
                            className="input"
                            placeholder="Enter your move..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSolve()}
                            style={{ flex: 1 }}
                            disabled={result?.correct}
                        />
                        <button className="btn btn-primary" onClick={handleSolve} disabled={result?.correct}>
                            {result?.correct ? "✓ Solved" : "Submit"}
                        </button>
                    </div>

                    {result && (
                        <div style={{
                            marginTop: 16, padding: 16,
                            background: result.correct ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                            border: `1px solid ${result.correct ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                            borderRadius: "var(--radius-md)",
                        }}>
                            <p style={{ fontWeight: 600, color: result.correct ? "var(--brand-emerald)" : "#EF4444" }}>
                                {result.correct ? "🎉 Correct!" : "❌ Incorrect"}
                            </p>
                            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 4 }}>
                                Solution: <strong>{result.solution}</strong>
                            </p>
                            <p style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", marginTop: 4 }}>
                                New Puzzle Rating: {result.new_rating}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Puzzles;
