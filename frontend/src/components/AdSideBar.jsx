import { useNavigate } from "react-router-dom";

export default function AdSideBar() {
  const navigate = useNavigate();

  const ads = [
    { id: 1, type: 'promotion', title: "Summer Sale", detail: "20% OFF Boards", color: "#D4A843" },
    { id: 1, type: 'tournament', title: "Blitz Open", detail: "₹1,00,000 Prize", color: "#10B981" },
    { id: 'pro-boards', type: 'promotion', title: "Pro Boards", detail: "Weighted Ebony", color: "#3B82F6" },
    { id: 'master-course', type: 'course', title: "Endgame Prep", detail: "by GM Aronian", color: "#8B5CF6" },
    { id: 'ai-puzzles', type: 'feature', title: "AI Puzzles", detail: "Adaptive Difficulty", color: "#EC4899" },
    { id: 'rewards', type: 'loyalty', title: "Rewards", detail: "1 Point = ₹1 Discount", color: "#D4A843" },
  ];

  const handleAdClick = (ad) => {
    if (ad.type === 'promotion') window.open(`/promotion/${ad.id}`, "_blank");
    else if (ad.type === 'tournament') window.open(`/tournament/${ad.id}`, "_blank");
    else if (ad.type === 'product') navigate(`/?category=boards`);
    else if (ad.type === 'course') navigate(`/courses`);
    else if (ad.type === 'feature') navigate(`/puzzles`);
    else if (ad.type === 'loyalty') navigate(`/loyalty`);
  };

  return (
    <aside className="ad-sidebar">
      <div className="ad-sidebar-inner">
        <p className="ad-label">SPONSORED</p>
        {ads.map((ad, i) => (
          <div 
            key={i} 
            className="ad-item animate-pulse-subtle" 
            style={{ borderColor: ad.color }}
            onClick={() => handleAdClick(ad)}
          >
            <span className="ad-badge" style={{ backgroundColor: ad.color }}>{ad.title}</span>
            <p className="ad-detail">{ad.detail}</p>
          </div>
        ))}
        <div className="ad-item contact-ad" onClick={() => navigate("/support")}>
           <p>Need Help?</p>
           <span>Support 🎧</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ad-sidebar {
          width: 200px;
          padding: 20px 0;
          flex-shrink: 0;
          z-index: 10;
        }
        .ad-sidebar-inner {
          position: sticky;
          top: 80px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: calc(100vh - 100px);
          overflow-y: auto;
          scrollbar-width: none;
        }
        .ad-sidebar-inner::-webkit-scrollbar { display: none; }
        .ad-label {
          font-size: 0.65rem;
          color: var(--text-tertiary);
          letter-spacing: 1px;
          text-align: center;
          margin-bottom: 4px;
        }
        .ad-item {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-left: 4px solid;
          padding: 14px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ad-item:hover {
          transform: translateX(8px);
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .ad-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          color: #000;
          margin-bottom: 4px;
        }
        .ad-detail {
          font-weight: 600;
          font-size: 0.9rem;
        }
        .contact-ad {
          border-left-color: var(--brand-gold);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s infinite;
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @media (max-width: 1200px) {
          .ad-sidebar { display: none; }
        }
      `}} />
    </aside>
  );
}
