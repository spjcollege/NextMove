import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../App";
import { getCategoryEmoji } from "./Home";

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = cart.reduce((sum, item) => {
    const orig = item.original_price || item.price;
    return sum + (orig - item.price) * item.quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "80px 24px" }}>
        <p style={{ fontSize: "3rem", marginBottom: 16 }}>🛒</p>
        <h2 style={{ marginBottom: 8 }}>Your cart is empty</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>Browse our collection and find something you love.</p>
        <Link to="/" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="page animate-fade-in">
      <h1 style={{ marginBottom: 24 }}>🛒 Shopping Cart ({cart.length})</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }}>
        {/* Items */}
        <div>
          {cart.map((item) => (
            <div key={item.id} className="card" style={{
              display: "flex", gap: 20, marginBottom: 12, padding: 16,
            }}>
              <div style={{
                width: 80, height: 80, flexShrink: 0,
                background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem",
              }}>
                {getCategoryEmoji(item.category)}
              </div>

              <div style={{ flex: 1 }}>
                <Link to={`/product/${item.id}`} style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.9rem" }}>
                  {item.name}
                </Link>
                <span className="badge badge-emerald" style={{ marginLeft: 8 }}>{item.category}</span>

                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)" }}>
                    <button className="btn btn-sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span style={{ padding: "0 12px", fontWeight: 600, fontSize: "0.85rem" }}>{item.quantity}</span>
                    <button className="btn btn-sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>

                  <span style={{ fontWeight: 700, color: "var(--brand-gold)", fontSize: "1.05rem" }}>₹{item.price * item.quantity}</span>

                  <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)} style={{ marginLeft: "auto" }}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card" style={{ alignSelf: "flex-start", position: "sticky", top: 88 }}>
          <h3 style={{ marginBottom: 16 }}>Order Summary</h3>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            <span>Subtotal ({cart.length} items)</span>
            <span>₹{total}</span>
          </div>

          {savings > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.85rem", color: "var(--brand-emerald)" }}>
              <span>You save</span>
              <span>-₹{savings}</span>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            <span>Shipping</span>
            <span style={{ color: "var(--brand-emerald)" }}>Free</span>
          </div>

          <hr className="divider" />

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontSize: "1.1rem", fontWeight: 700 }}>
            <span>Total</span>
            <span style={{ color: "var(--brand-gold)" }}>₹{total}</span>
          </div>

          <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: "100%" }}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;