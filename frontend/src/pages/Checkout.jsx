import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import { CartContext, useAuth } from "../App";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { user, showToast } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("cod");
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (!user) {
      showToast("Please login first", "error");
      navigate("/auth");
      return;
    }
    if (!address.trim()) {
      showToast("Please enter delivery address", "error");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/orders/place", {
        method: "POST",
        body: JSON.stringify({
          items: cart.map((item) => ({ product_id: item.id, quantity: item.quantity })),
          address,
          payment_method: payment,
        }),
      });
      clearCart();
      showToast("Order placed successfully! 🎉");
      navigate("/profile");
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "80px 24px" }}>
        <p style={{ fontSize: "3rem", marginBottom: 16 }}>📦</p>
        <h2>No items to checkout</h2>
      </div>
    );
  }

  return (
    <div className="page animate-fade-in" style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 32 }}>📦 Checkout</h1>

      <div style={{ display: "grid", gap: 24 }}>
        {/* Address */}
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>📍 Delivery Address</h3>
          <textarea
            className="input"
            rows={3}
            placeholder="Enter your full delivery address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Payment */}
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>💳 Payment Method</h3>
          {[
            { key: "cod", label: "Cash on Delivery", icon: "💵" },
            { key: "upi", label: "UPI Payment", icon: "📱" },
            { key: "card", label: "Credit / Debit Card", icon: "💳" },
          ].map((p) => (
            <label key={p.key} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px", borderRadius: "var(--radius-md)",
              cursor: "pointer", marginBottom: 8,
              background: payment === p.key ? "rgba(212,168,67,0.08)" : "transparent",
              border: `1px solid ${payment === p.key ? "rgba(212,168,67,0.3)" : "var(--border-subtle)"}`,
              transition: "all var(--transition-fast)",
            }}>
              <input type="radio" name="payment" checked={payment === p.key} onChange={() => setPayment(p.key)} style={{ accentColor: "var(--brand-gold)" }} />
              <span style={{ fontSize: "1.2rem" }}>{p.icon}</span>
              <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{p.label}</span>
            </label>
          ))}
        </div>

        {/* Order Summary */}
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>🧾 Order Summary</h3>
          {cart.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.85rem" }}>
              <span style={{ color: "var(--text-secondary)" }}>{item.name} × {item.quantity}</span>
              <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <hr className="divider" />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 700 }}>
            <span>Total</span>
            <span style={{ color: "var(--brand-gold)" }}>₹{total}</span>
          </div>
        </div>

        <button className="btn btn-primary btn-lg" onClick={handleOrder} disabled={loading} style={{ width: "100%" }}>
          {loading ? "Placing Order..." : `Place Order — ₹${total}`}
        </button>
      </div>
    </div>
  );
}

export default Checkout;