import { useParams, useNavigate } from "react-router-dom";
import "../index.css";

export default function MarketingDetail() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const details = {
    discount: {
      1: { title: "Summer Chess Sale", performance: "High", reach: "15,000", conversion: "12%", spend: "₹2,500" },
      2: { title: "Rookie Bundle", performance: "Medium", reach: "5,200", conversion: "8%", spend: "₹1,200" },
      3: { title: "Grandmaster Upgrade", performance: "Trending", reach: "22,000", conversion: "15%", spend: "₹4,000" },
    },
    tournament: {
      1: { title: "Checkmate Championship 2026", entrants: "450", prize_distributed: "₹0", engagement: "Very High" },
      2: { title: "Junior Chess Wizards", entrants: "120", prize_distributed: "₹0", engagement: "Moderate" },
    }
  };

  const data = details[type]?.[id] || { title: "Campaign Not Found", performance: "N/A" };

  return (
    <div className="page animate-fade-in">
      <header className="section-header">
        <div>
          <h2>📈 {data.title}</h2>
          <p style={{ color: "var(--text-secondary)" }}>Detailed Campaign Analytics - {type.toUpperCase()}</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate("/admin/marketing")}>← Back</button>
      </header>

      <div className="grid-products" style={{ marginBottom: "40px" }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.1)" }}>📊</div>
          <div>
            <div className="stat-value">{data.reach || data.entrants}</div>
            <div className="stat-label">{data.reach ? "Total Reach" : "Participants"}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(212, 168, 67, 0.1)" }}>🎯</div>
          <div>
            <div className="stat-value">{data.conversion || data.engagement}</div>
            <div className="stat-label">{data.conversion ? "Conversion Rate" : "Engagement"}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(59, 130, 246, 0.1)" }}>💰</div>
          <div>
            <div className="stat-value">{data.spend || "₹0"}</div>
            <div className="stat-label">Budget Allocated</div>
          </div>
        </div>
      </div>

      <div className="card-glass">
         <h3>Performance Timeline</h3>
         <div style={{ height: "200px", background: "var(--bg-tertiary)", marginTop: "20px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed var(--border-strong)" }}>
            <p style={{ color: "var(--text-tertiary)" }}>Graphic Visualization Loading...</p>
         </div>
      </div>

       <div style={{ marginTop: "32px", display: "flex", gap: "16px" }}>
          <button className="btn btn-primary">Edit Content</button>
          <button className="btn btn-danger">Pause Campaign</button>
       </div>
    </div>
  );
}
