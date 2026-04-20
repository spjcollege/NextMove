import { useParams, useNavigate } from "react-router-dom";
import "../index.css";

export default function TournamentLanding() {
  const { id } = useParams();
  const navigate = useNavigate();

  const tournaments = {
    1: { name: "Checkmate Championship 2026", prize: "₹1,00,000", date: "June 15-20", type: "Blitz", format: "Swiss System", rounds: "11 Rounds" },
    2: { name: "Junior Chess Wizards", prize: "Elite Coaching", date: "July 05", type: "Rapid", format: "Knockout", rounds: "Single Elimination" },
  };

  const tourney = tournaments[id] || { name: "Upcoming Tournament", prize: "Exciting Rewards", date: "Coming Soon", type: "Classic" };

  return (
    <div className="page animate-fade-in">
      <div className="card-glass" style={{ padding: "60px", textAlign: "center", marginBottom: "40px" }}>
        <span className="badge badge-gold" style={{ marginBottom: "16px" }}>{tourney.type}</span>
        <h1 style={{ fontSize: "3rem", color: "var(--brand-gold)", marginBottom: "16px" }}>{tourney.name}</h1>
        <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", marginBottom: "32px" }}>Join the ultimate chess battle and prove your tactical supremacy.</p>
        
        <div className="grid-products" style={{ textAlign: "left" }}>
            <div className="stat-card">
                <div className="stat-label">Prize Pool</div>
                <div className="stat-value">{tourney.prize}</div>
            </div>
            <div className="stat-card">
                <div className="stat-label">Date</div>
                <div className="stat-value">{tourney.date}</div>
            </div>
            <div className="stat-card">
                <div className="stat-label">Format</div>
                <div className="stat-value">{tourney.format || "Standard"}</div>
            </div>
        </div>
      </div>

      <div className="card" style={{ padding: "32px" }}>
        <h3>Tournament Rules</h3>
        <ul style={{ marginTop: "16px", color: "var(--text-secondary)", lineHeight: "2" }}>
            <li>Standard FIDE blitz/rapid rules apply.</li>
            <li>Players must remain connected throughout the games.</li>
            <li>Fair play and anti-cheat measures are strictly enforced.</li>
            <li>Winners will be notified via email within 48 hours.</li>
        </ul>
        <button className="btn btn-primary btn-lg" style={{ marginTop: "32px", width: "100%" }}>Register Now</button>
      </div>

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <button className="btn btn-outline" onClick={() => navigate("/competitions")}>View All Competitions</button>
      </div>
    </div>
  );
}
