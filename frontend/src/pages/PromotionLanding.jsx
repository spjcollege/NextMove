import { useParams, useNavigate } from "react-router-dom";
import "../index.css";

export default function PromotionLanding() {
  const { id } = useParams();
  const navigate = useNavigate();

  const promotions = {
    1: { title: "Summer Chess Sale", discount: "20% OFF", description: "Get the best wooden boards at unbeatable prices this summer.", code: "SUMMER20", color: "#D4A843" },
    2: { title: "Rookie Bundle", discount: "₹500 OFF", description: "Perfect for beginners. Includes a weighted plastic set and our 'Basics of Opening' course.", code: "ROOKIE500", color: "#10B981" },
    3: { title: "Grandmaster Upgrade", discount: "FREE DELIVERY", description: "Order any premium set above ₹5000 and get free express delivery across India.", code: "SHIPFREE", color: "#3B82F6" },
    "pro-boards": { title: "Pro Ebony Series", discount: "PREMIUM", description: "Experience the weight and elegance of genuine ebony wood. Our 'Pro' series is designed for masters.", code: "EBONYPRO", color: "#3B82F6" },
  };

  const promo = promotions[id] || { title: "Special Offer", discount: "Limited Time", description: "Don't miss out on our latest chess deals!", code: "CHECKMATE", color: "var(--brand-gold)" };

  return (
    <div className="page animate-fade-in">
      <div className="promo-hero" style={{ backgroundColor: promo.color, padding: "80px 40px", borderRadius: "12px", textAlign: "center", color: "#000", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "4rem", fontWeight: "900", marginBottom: "16px" }}>{promo.discount}</h1>
        <h2 style={{ fontSize: "2rem", marginBottom: "24px" }}>{promo.title}</h2>
        <p style={{ fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto 32px" }}>{promo.description}</p>
        <div style={{ display: "inline-block", padding: "16px 32px", border: "3px dashed #000", fontSize: "1.5rem", fontWeight: "bold", borderRadius: "8px" }}>
          CODE: {promo.code}
        </div>
      </div>

      <div className="grid-products">
        {[1, 2, 3].map(i => (
          <div key={i} className="card-glass" style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
             <p style={{ color: "var(--text-tertiary)" }}>Featured Product {i}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <button className="btn btn-primary btn-lg" onClick={() => navigate("/")}>Shop the Sale</button>
      </div>
    </div>
  );
}
