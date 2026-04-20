import { useState } from "react";
import { useAuth } from "../App";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function Marketing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const discountAds = [
    { id: 1, title: "Summer Chess Sale", discount: "20% OFF", subtitle: "All Premium Boards", color: "#D4A843" },
    { id: 2, title: "Rookie Bundle", discount: "₹500 OFF", subtitle: "Course + Plastic Set", color: "#10B981" },
    { id: 3, title: "Grandmaster Upgrade", discount: "FREE DELIVERY", subtitle: "On orders above ₹5000", color: "#3B82F6" },
    { id: "pro-boards", title: "Pro Ebony Series", discount: "PREMIUM", subtitle: "Hand-crafted Weighted Ebony", color: "#60A5FA" },
  ];

  const competitionAds = [
    { id: 1, name: "Checkmate Championship 2026", prize: "₹1,00,000", date: "June 15-20", type: "Blitz" },
    { id: 2, name: "Junior Chess Wizards", prize: "Elite Coaching", date: "July 05", type: "Rapid" },
  ];

  const instaPosts = [
    {
      id: 1,
      user: "nextmove_chess",
      image: "♟️",
      caption: "Victory isn't just about the king. It's about every move leading to it. #NextMove #ChessLife",
      likes: "1.2k"
    },
    {
      id: 2,
      user: "nextmove_chess",
      image: "🏆",
      caption: "New tournament dates announced! Are you ready to claim the throne? Link in bio.",
      likes: "850"
    }
  ];

  const xPosts = [
    {
      id: 1,
      user: "NextMoveChess",
      handle: "@NextMove_HQ",
      content: "Just launched our new AI-driven puzzle engine! 🧩 Try it now and see how your rating climbs. #ChessTheory #AI",
      date: "2h ago",
      metrics: "124 Recollections · 450 Likes"
    },
    {
      id: 2,
      user: "NextMoveChess",
      handle: "@NextMove_HQ",
      content: "Why do Grandmasters prefer wooden sets for OTB? Let's settle this debate in the thread. 👇",
      date: "5h ago",
      metrics: "89 Recollections · 210 Likes"
    }
  ];

  return (
    <div className="page animate-fade-in">
      <header className="section-header">
        <div>
          <h2>📢 Marketing Hub</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Manage campaigns and social engagement</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate("/admin/dashboard")}>
          ← Back to Dashboard
        </button>
      </header>

      {/* Discount Ads Section */}
      <section style={{ marginBottom: "48px" }}>
        <h3 style={{ marginBottom: "20px" }}>🎟 Active Discount Ads</h3>
        <div className="grid-products">
          {discountAds.map(ad => (
            <div 
              key={ad.id} 
              className="card-glass" 
              style={{ borderLeft: `4px solid ${ad.color}`, padding: "24px", position: "relative", cursor: "pointer" }}
              onClick={() => window.open(`/promotion/${ad.id}`, "_blank")}
            >
              <span className="badge" style={{ backgroundColor: ad.color, color: "#000", position: "absolute", top: "12px", right: "12px" }}>ACTIVE</span>
              <h4 style={{ color: ad.color, fontSize: "1.5rem", marginBottom: "8px" }}>{ad.discount}</h4>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>{ad.title}</h3>
              <p style={{ color: "var(--text-tertiary)", fontSize: "0.85rem" }}>{ad.subtitle}</p>
              <div style={{ marginTop: "16px", display: "flex", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/admin/marketing/discount/${ad.id}`)}>Edit</button>
                <button className="btn btn-sm btn-outline" onClick={() => navigate(`/admin/marketing/discount/${ad.id}`)}>Analytics</button>
              </div>
            </div>
          ))}
          <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center", borderStyle: "dashed", cursor: "pointer" }}>
            <span style={{ fontSize: "2rem", color: "var(--text-tertiary)" }}>+</span>
            <span style={{ marginLeft: "12px", fontWeight: "600" }}>New Promotion</span>
          </div>
        </div>
      </section>

      {/* Competition Ads Section */}
      <section style={{ marginBottom: "48px" }}>
        <h3 style={{ marginBottom: "20px" }}>🎌 Tournament Promotions</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
          {competitionAds.map(ad => (
            <div 
              key={ad.id} 
              className="competition-card" 
              style={{ display: "flex", gap: "24px", alignItems: "center", cursor: "pointer" }}
              onClick={() => window.open(`/tournament/${ad.id}`, "_blank")}
            >
              <div className="ad-image" style={{ width: "120px", height: "120px", flexShrink: 0, background: "rgba(212, 168, 67, 0.1)" }}>
                {ad.type === 'Blitz' ? '⚡' : '⏳'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h4 style={{ color: "var(--brand-gold)" }}>{ad.name}</h4>
                  <span className="badge badge-gold">{ad.type}</span>
                </div>
                <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
                  <div>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", textTransform: "uppercase" }}>Prize Pool</p>
                    <p style={{ fontWeight: "700" }}>{ad.prize}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", textTransform: "uppercase" }}>Commences</p>
                    <p style={{ fontWeight: "700" }}>{ad.date}</p>
                  </div>
                </div>
                <button className="btn btn-sm btn-primary" style={{ marginTop: "16px", width: "100%" }} onClick={(e) => { e.stopPropagation(); /* Boost logic */}}>Boost Ad</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Media Section */}
      <section>
        <h3 style={{ marginBottom: "24px" }}>🌍 Social Media Feed (Live Preview)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "32px" }}>
          
          {/* Instagram Mockup */}
          <div className="card glass-panel" style={{ padding: "0", background: "var(--bg-secondary)" }}>
            <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid var(--border-subtle)" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>♔</div>
              <span style={{ fontWeight: "700", fontSize: "0.9rem" }}>nextmove_chess</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              {instaPosts.map(post => (
                <div key={post.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <div style={{ aspectRatio: "1", background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>
                    {post.image}
                  </div>
                  <div style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: "16px", marginBottom: "8px", fontSize: "1.2rem" }}>
                      <span>❤️</span> <span>💬</span> <span>✈️</span>
                    </div>
                    <p style={{ fontWeight: "700", fontSize: "0.85rem", marginBottom: "4px" }}>{post.likes} likes</p>
                    <p style={{ fontSize: "0.85rem" }}>
                      <span style={{ fontWeight: "700", marginRight: "8px" }}>{post.user}</span>
                      {post.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* X (Twitter) Mockup */}
          <div className="card glass-panel" style={{ padding: "16px", background: "#000" }}>
             <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                <span style={{ color: "#fff", fontWeight: "800", fontSize: "1.1rem" }}>𝕏</span>
                <span style={{ color: "var(--text-tertiary)" }}>Latest Updates</span>
             </div>
             <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
               {xPosts.map(post => (
                 <div key={post.id} style={{ display: "flex", gap: "12px", borderBottom: "1px solid #333", paddingBottom: "20px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--bg-tertiary)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>♔</div>
                    <div style={{ flex: 1 }}>
                       <div style={{ display: "flex", gap: "4px", alignItems: "baseline" }}>
                          <span style={{ fontWeight: "700" }}>{post.user}</span>
                          <span style={{ color: "#666", fontSize: "0.85rem" }}>{post.handle} · {post.date}</span>
                       </div>
                       <p style={{ marginTop: "4px", fontSize: "0.95rem", lineHeight: "1.4" }}>{post.content}</p>
                       <div style={{ marginTop: "12px", color: "#666", fontSize: "0.8rem", display: "flex", gap: "20px" }}>
                          <span>💬 12</span> <span>🔁 45</span> <span>❤️ 125</span> <span>📊 10k</span>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
             <button className="btn btn-sm" style={{ width: "100%", marginTop: "20px", background: "#fff", color: "#000", borderRadius: "20px" }}>
                Post an Update
             </button>
          </div>

        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .competition-card {
           background: var(--bg-card);
           border-radius: var(--radius-lg);
           padding: 24px;
           border: 1px solid var(--border-subtle);
           transition: all 0.3s ease;
        }
        .competition-card:hover {
           border-color: var(--brand-gold);
           transform: translateY(-2px);
           box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
      `}} />
    </div>
  );
}
