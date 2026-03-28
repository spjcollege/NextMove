import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import { useAuth } from "../App";

function Profile() {
  const [orders, setOrders] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { user, login, showToast } = useAuth();
  const navigate = useNavigate();

  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    apiFetch("/orders/").then(setOrders).catch(() => { });
    apiFetch("/courses/user/enrolled").then(setEnrollments).catch(() => { });
    
    apiFetch("/auth/me").then(d => {
      login(localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")).token : "", d);
    }).catch(() => {});
  }, []);

  if (!user) return null;

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  const statusColor = {
    placed: "badge-blue",
    confirmed: "badge-gold",
    shipped: "badge-emerald",
    delivered: "badge-emerald",
  };

  const parsedAddresses = (() => {
    try { return user.address ? JSON.parse(user.address) : []; }
    catch(e) { return (typeof user.address === "string" && user.address.trim()) ? [{ id: 1, text: user.address }] : []; }
  })();

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return;
    const newAddrs = [...parsedAddresses, { id: Date.now(), text: newAddress.trim() }];
    try {
      const updatedUser = await apiFetch("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({ address: JSON.stringify(newAddrs) })
      });
      login(localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")).token : "", updatedUser);
      setNewAddress("");
      showToast("Address added");
    } catch(e) {
      showToast(e.message, "error");
    }
  };

  const removeAddress = async (id) => {
    const newAddrs = parsedAddresses.filter(a => a.id !== id);
    try {
      const updatedUser = await apiFetch("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({ address: JSON.stringify(newAddrs) })
      });
      login(localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")).token : "", updatedUser);
      showToast("Address removed");
    } catch(e) {
      showToast(e.message, "error");
    }
  };

  return (
    <div className="page animate-fade-in" style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div className="card" style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 32, padding: 28 }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--brand-gold), var(--brand-gold-dark))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.8rem", fontWeight: 800, color: "#000", flexShrink: 0,
        }}>
          {user.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontSize: "1.5rem", marginBottom: 4 }}>{user.full_name || user.username}</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>@{user.username}</p>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <span className="badge badge-gold">{user.subscription_tier} member</span>
            <span className="badge badge-blue">Rating: {user.rating}</span>
            <span className="badge badge-emerald">Puzzle: {user.puzzle_rating}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6" }}>📦</div>
          <div>
            <div className="stat-value">{orders.length}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(212,168,67,0.15)", color: "var(--brand-gold)" }}>💰</div>
          <div>
            <div className="stat-value">₹{totalSpent}</div>
            <div className="stat-label">Total Spent</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(16,185,129,0.15)", color: "var(--brand-emerald)" }}>📚</div>
          <div>
            <div className="stat-value">{enrollments.length}</div>
            <div className="stat-label">Enrolled Courses</div>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <h2 style={{ marginBottom: 16 }}>📍 My Addresses</h2>
      <div className="card" style={{ marginBottom: 32 }}>
        {parsedAddresses.length === 0 ? (
          <p style={{ color: "var(--text-tertiary)", marginBottom: 16 }}>No addresses saved yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
            {parsedAddresses.map(addr => (
              <div key={addr.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
                <span style={{ fontSize: "0.9rem" }}>{addr.text}</span>
                <button className="btn btn-sm btn-danger" onClick={() => removeAddress(addr.id)}>Remove</button>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 12 }}>
          <input 
            type="text" 
            className="input" 
            placeholder="Add a new address..." 
            value={newAddress} 
            onChange={e => setNewAddress(e.target.value)} 
            style={{ flex: 1 }} 
            onKeyDown={(e) => e.key === "Enter" && handleAddAddress()}
          />
          <button className="btn btn-primary" onClick={handleAddAddress}>Add</button>
        </div>
      </div>

      {/* Orders */}
      <h2 style={{ marginBottom: 16 }}>📦 Your Orders</h2>
      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 32, marginBottom: 32 }}>
          <p style={{ color: "var(--text-tertiary)" }}>No orders yet</p>
          <Link to="/" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 8, marginBottom: 32 }}>
          {orders.map((order) => (
            <div key={order.id} className="card" style={{ cursor: "pointer", padding: 16 }} onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Order #{order.id}</span>
                  <span className={`badge ${statusColor[order.status] || "badge-blue"}`} style={{ marginLeft: 8 }}>{order.status}</span>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: 4 }}>
                    {order.items.length} items · {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span style={{ fontWeight: 700, color: "var(--brand-gold)", fontSize: "1.1rem" }}>₹{order.total}</span>
              </div>

              {expandedOrder === order.id && (
                <div style={{ marginTop: 16, borderTop: "1px solid var(--border-subtle)", paddingTop: 12 }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "0.82rem" }}>
                      <span style={{ color: "var(--text-secondary)" }}>{item.name} × {item.quantity}</span>
                      <span style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Enrolled Courses */}
      <h2 style={{ marginBottom: 16 }}>📚 My Courses</h2>
      {enrollments.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <p style={{ color: "var(--text-tertiary)" }}>No courses enrolled yet</p>
          <Link to="/courses" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Browse Courses</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {enrollments.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`} className="card" style={{ padding: 16, display: "flex", gap: 16, alignItems: "center", textDecoration: "none", color: "inherit" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "var(--radius-md)", flexShrink: 0,
                background: "rgba(212,168,67,0.1)", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem",
              }}>📚</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: "0.9rem", marginBottom: 4 }}>{course.title}</h4>
                <div className="progress-bar" style={{ maxWidth: 200 }}>
                  <div className="progress-fill" style={{ width: `${course.progress || 0}%` }} />
                </div>
                <p style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", marginTop: 4 }}>{course.progress || 0}% complete</p>
              </div>
              <span className="badge badge-gold">{course.difficulty}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;