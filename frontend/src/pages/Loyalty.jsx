import { useAuth } from "../App";
import { Link } from "react-router-dom";
import "../index.css";

export default function Loyalty() {
  const { user } = useAuth();

  const tiers = [
    { name: "Bronze", points: "0+", perks: ["Basic rewards", "Community access"], color: "#CD7F32" },
    { name: "Silver", points: "1,000+", perks: ["5% off courses", "Early sale access"], color: "#C0C0C0" },
    { name: "Gold", points: "5,000+", perks: ["10% off everything", "Free express shipping"], color: "#D4A843" },
    { name: "Grandmaster", points: "25,000+", perks: ["1-on-1 coaching session", "Exclusive merchandise"], color: "#8B5CF6" },
  ];

  return (
    <div className="page animate-fade-in">
      <header className="section-header" style={{ textAlign: "center", display: "block" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "16px" }}>🏆 NextMove Rewards</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto" }}>
          Your loyalty deserves an opening. Earn points with every move you make on our platform.
        </p>
      </header>

      {user && (
        <div className="card-glass" style={{ marginBottom: "48px", padding: "40px", textAlign: "center", border: "2px solid var(--brand-gold)" }}>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "8px" }}>Current Balance</p>
          <h2 style={{ fontSize: "4rem", color: "var(--brand-gold)", marginBottom: "16px" }}>{user.loyalty_points || 0} pts</h2>
          <div className="badge badge-gold">Value: ₹{user.loyalty_points || 0}</div>
          <div style={{ marginTop: "24px" }}>
             <Link to="/" className="btn btn-primary">Redeem in Shop</Link>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "64px" }}>
        <div className="card">
          <h3>How to Earn 📈</h3>
          <ul style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <li style={{ display: "flex", gap: "12px" }}>
              <span style={{ fontSize: "1.5rem" }}>🛍️</span>
              <div>
                <strong>Shop & Earn</strong>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Get 1 point for every ₹100 spent on products.</p>
              </div>
            </li>
            <li style={{ display: "flex", gap: "12px" }}>
              <span style={{ fontSize: "1.5rem" }}>🎌</span>
              <div>
                <strong>Compete</strong>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Participate and win in tournaments to earn up to 500 points.</p>
              </div>
            </li>
            <li style={{ display: "flex", gap: "12px" }}>
              <span style={{ fontSize: "1.5rem" }}>🧩</span>
              <div>
                <strong>Daily Puzzles</strong>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Solve daily puzzles to earn 5 points daily streak bonus.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="card">
          <h3>How to Redeem 🎁</h3>
          <ul style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <li style={{ display: "flex", gap: "12px" }}>
              <span style={{ fontSize: "1.5rem" }}>💸</span>
              <div>
                <strong>Instant Discount</strong>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>1 Point = ₹1. Apply at checkout for up to 50% off.</p>
              </div>
            </li>
            <li style={{ display: "flex", gap: "12px" }}>
              <span style={{ fontSize: "1.5rem" }}>📦</span>
              <div>
                <strong>Exclusive Items</strong>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Unlock limited edition boards and pieces only available via points.</p>
              </div>
            </li>
            <li style={{ display: "flex", gap: "12px" }}>
              <span style={{ fontSize: "1.5rem" }}>🎓</span>
              <div>
                <strong>Course Access</strong>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Redeem points for premium grandmaster courses.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <h3 style={{ marginBottom: "24px" }}>Membership Tiers</h3>
      <div className="grid-products">
        {tiers.map(tier => (
          <div key={tier.name} className="card-glass" style={{ borderTop: `6px solid ${tier.color}`, padding: "24px" }}>
            <h4 style={{ color: tier.color, fontSize: "1.2rem", marginBottom: "4px" }}>{tier.name}</h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", marginBottom: "16px" }}>{tier.points}</p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              {tier.perks.map(perk => (
                <li key={perk} style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "var(--brand-gold)" }}>✓</span> {perk}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "64px", background: "var(--bg-secondary)", padding: "40px", borderRadius: "16px", textAlign: "center" }}>
          <h2>The Legendary Quest ♟️</h2>
          <p style={{ maxWidth: "600px", margin: "16px auto 32px", color: "var(--text-secondary)" }}>
            Our most loyal members get access to the "Legendary Grandmaster Board" — hand-crafted and strictly limited. Cost: 100,000 Points.
          </p>
          <Link to="/?search=Legendary" className="btn btn-outline btn-lg">View Secret Product</Link>
      </div>
    </div>
  );
}
