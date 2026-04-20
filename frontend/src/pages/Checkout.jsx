import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import { CartContext, useAuth } from "../App";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { user, login, showToast } = useAuth();
  const navigate = useNavigate();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState("");
  const [payment, setPayment] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);

  useEffect(() => {
    if (user) {
      apiFetch("/auth/me").then(d => {
        login(localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")).token : "", d);
        let parsed = [];
        try {
          parsed = d.address ? JSON.parse(d.address) : [];
        } catch(e) {
          if (typeof d.address === "string" && d.address.trim()) {
            parsed = [{ id: 1, text: d.address }];
          }
        }
        setAddresses(parsed);
        if (parsed.length > 0) setSelectedAddressId(parsed[0].id);
      }).catch(() => {});
    }
  }, [user]);

  const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const pointsDiscount = Math.min(pointsToUse, subTotal * 0.5);
  const total = subTotal - pointsDiscount;

    const handleOrder = async () => {
      if (!user) {
        showToast("Please login first", "error");
        navigate("/auth");
        return;
      }

      if (pointsToUse > user.loyalty_points) {
        showToast("Not enough loyalty points", "error");
        return;
      }

      let finalAddress = "";
      if (selectedAddressId === "new") {
        if (!newAddress.trim()) {
          showToast("Please enter a new delivery address", "error");
          return;
        }
        finalAddress = newAddress.trim();
        
        // Save new address to profile
        const updatedAddrs = [...addresses, { id: Date.now(), text: finalAddress }];
        await apiFetch("/auth/profile", {
          method: "PUT",
          body: JSON.stringify({ address: JSON.stringify(updatedAddrs) })
        }).catch(()=>{});
  
      } else {
        const ad = addresses.find(a => a.id === selectedAddressId);
        if (!ad) {
          showToast("Please select a delivery address", "error");
          return;
        }
        finalAddress = ad.text;
      }
  
      if (payment !== "cod") {
        setLoading(true);
        try {
          const orderRes = await apiFetch(`/payment/create-order`, {
            method: "POST", body: JSON.stringify({ amount: total, currency: "INR" })
          });
          const options = {
            key: "rzp_test_SVtgVzzzyc8S1v",
            amount: orderRes.amount,
            currency: "INR",
            name: "NextMove",
            description: "Store Checkout",
            order_id: orderRes.order_id,
            theme: { color: "#D4A843" },
            prefill: { 
                name: user.full_name || user.username, 
                email: user.email || "user@example.com",
                contact: "9999999999" 
            },
            handler: async function (response) {
              try {
                await apiFetch(`/payment/verify`, {
                  method: "POST",
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                  })
                });
                await placeOrderBackend(finalAddress, "paid_online");
              } catch (err) {
                showToast("Payment verification failed! " + err.message, "error");
                setLoading(false);
              }
            }
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        } catch (e) {
            showToast(e.message, "error");
            setLoading(false);
        }
      } else {
        await placeOrderBackend(finalAddress, "cod");
      }
    };

    const placeOrderBackend = async (finalAddress, paymentStatus) => {
      setLoading(true);
      try {
        await apiFetch("/orders/place", {
          method: "POST",
          body: JSON.stringify({
            items: cart.map((item) => ({ product_id: item.id, quantity: item.quantity })),
            address: finalAddress,
            payment_method: paymentStatus,
            points_to_use: pointsToUse,
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
          
          {addresses.map(addr => (
            <label key={addr.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px", borderRadius: "var(--radius-md)",
              cursor: "pointer", marginBottom: 8,
              background: selectedAddressId === addr.id ? "rgba(212,168,67,0.08)" : "transparent",
              border: `1px solid ${selectedAddressId === addr.id ? "rgba(212,168,67,0.3)" : "var(--border-subtle)"}`,
            }}>
              <input type="radio" name="address" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} style={{ accentColor: "var(--brand-gold)" }} />
              <div style={{ flex: 1, fontSize: "0.9rem" }}>{addr.text}</div>
            </label>
          ))}

          <label style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 16px", borderRadius: "var(--radius-md)",
            cursor: "pointer", marginBottom: 8,
            background: selectedAddressId === "new" ? "rgba(212,168,67,0.08)" : "transparent",
            border: `1px solid ${selectedAddressId === "new" ? "rgba(212,168,67,0.3)" : "var(--border-subtle)"}`,
          }}>
            <input type="radio" name="address" checked={selectedAddressId === "new"} onChange={() => setSelectedAddressId("new")} style={{ accentColor: "var(--brand-gold)" }} />
            <div style={{ flex: 1, fontSize: "0.9rem", fontWeight: 500 }}>➕ Add New Address</div>
          </label>

          {selectedAddressId === "new" && (
            <textarea
              className="input"
              rows={3}
              placeholder="Enter your new full delivery address..."
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              style={{ marginTop: 12 }}
            />
          )}
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
          
          {user?.loyalty_points > 0 && (
            <div style={{ marginTop: 16, marginBottom: 8, padding: 12, background: "rgba(212,168,67,0.1)", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: "0.9rem", marginBottom: 8 }}>Available Points: <strong>{user.loyalty_points}</strong> (1 point = ₹1)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input 
                  type="number" 
                  className="input" 
                  style={{ width: "120px" }}
                  value={pointsToUse}
                  onChange={(e) => setPointsToUse(Math.min(user.loyalty_points, Math.max(0, parseInt(e.target.value) || 0)))}
                  placeholder="Points to use"
                />
                <button className="btn btn-sm btn-outline" onClick={() => setPointsToUse(user.loyalty_points)}>Use Max</button>
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 8 }}>* Max discount 50% of subtotal</p>
            </div>
          )}

          <hr className="divider" />
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            <span>Subtotal</span>
            <span>₹{subTotal}</span>
          </div>
          
          {pointsDiscount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.9rem", color: "var(--brand-emerald)" }}>
              <span>Loyalty Discount</span>
              <span>-₹{pointsDiscount}</span>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 700, marginTop: 8 }}>
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