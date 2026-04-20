import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAnalytics, apiFetch } from "../api";
import { useAuth } from "../App";
import "../index.css"; 

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    original_price: "",
    category: "chess sets",
    stock: 10,
    description: "",
    image_url: "",
    loyalty_points: 0
  });

  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate("/");
      return;
    }

    async function loadData() {
      try {
        const result = await getAnalytics();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
    const interval = setInterval(loadData, 10000); // 10s poll
    return () => clearInterval(interval);
  }, [user, navigate]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/products/", {
        method: "POST",
        body: JSON.stringify({ 
          ...newProduct, 
          price: parseFloat(newProduct.price), 
          original_price: parseFloat(newProduct.original_price || newProduct.price), 
          stock: parseInt(newProduct.stock),
          loyalty_points: parseInt(newProduct.loyalty_points)
        })
      });
      showToast("Product added successfully!");
      setNewProduct({ name: "", price: "", original_price: "", category: "chess sets", stock: 10, description: "", image_url: "" });
      const result = await getAnalytics();
      setData(result);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleUpdateStock = async (id, current) => {
    const newStock = prompt("Enter new stock level:", current);
    if (newStock !== null) {
      try {
        await apiFetch(`/products/${id}/stock?stock=${newStock}`, { method: "PATCH" });
        showToast("Stock updated");
        const result = await getAnalytics();
        setData(result);
      } catch (err) {
        showToast(err.message, "error");
      }
    }
  };

  if (loading) return <div className="page-container" style={{ textAlign: "center", padding: "100px" }}>Loading Dashboard...</div>;
  if (error) return <div className="page-container text-center"><p className="error-text">{error}</p></div>;
  if (!data) return null;

  const { sales, inventory, category_performance, marketing } = data;

  return (
    <div className="page animate-fade-in">
      <header className="section-header">
        <div>
          <h2>📊 Vendor Dashboard</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Store Management & Market Analytics</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn btn-primary" onClick={() => navigate("/admin/marketing")}>
            📢 Marketing Tools
          </button>
        </div>
      </header>

      <section style={{ marginBottom: "40px" }}>
        <div className="grid-products">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--brand-emerald)" }}>💰</div>
            <div>
              <div className="stat-value" style={{ color: "var(--brand-emerald)" }}>₹{sales.total_revenue.toFixed(2)}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3B82F6" }}>📦</div>
            <div>
              <div className="stat-value">{sales.total_orders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(212, 168, 67, 0.15)", color: "var(--brand-gold)" }}>🧱</div>
            <div>
              <div className="stat-value">{inventory.total_items}</div>
              <div className="stat-label">Unique Products</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--brand-emerald)" }}>🏦</div>
            <div>
              <div className="stat-value">₹{inventory.total_stock_value.toFixed(0)}</div>
              <div className="stat-label">Stock Value</div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "32px" }}>
            {/* Add Product Form */}
            <div className="card glass-panel" style={{ padding: "24px" }}>
              <h3 style={{ marginBottom: "16px" }}>➕ Add New Product</h3>
              <form onSubmit={handleAddProduct} style={{ display: "grid", gap: "12px" }}>
                <input className="input" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                <div style={{ display: "flex", gap: "12px" }}>
                    <input className="input" type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                    <input className="input" type="number" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} required />
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                    <select className="input" style={{ flex: 1 }} value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                        <option value="chess sets">Chess Sets</option>
                        <option value="boards">Boards</option>
                        <option value="clocks">Clocks</option>
                        <option value="books">Books</option>
                        <option value="accessories">Accessories</option>
                    </select>
                    <input className="input" type="number" style={{ flex: 1 }} placeholder="Loyalty Points" value={newProduct.loyalty_points} onChange={e => setNewProduct({...newProduct, loyalty_points: e.target.value})} />
                </div>
                <textarea className="input" placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} style={{ minHeight: "60px" }} />
                <button className="btn btn-primary" type="submit">Create Product</button>
              </form>
            </div>

            <div>
                <h3 style={{ marginBottom: "16px" }}>Category Performance</h3>
                <div className="card glass-panel" style={{ padding: "20px" }}>
                {category_performance.map((cp) => (
                    <div key={cp.category} style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: "600", textTransform: "capitalize" }}>{cp.category}</span>
                        <span style={{ fontSize: "0.85rem", color: "var(--brand-gold)" }}>₹{cp.revenue.toFixed(0)}</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${Math.min(100, (cp.revenue / (sales.total_revenue || 1)) * 100)}%` }}></div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </div>

        <h3 style={{ marginTop: "40px", marginBottom: "16px" }}>Inventory Management</h3>
        <div className="card glass-panel" style={{ padding: "0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "var(--bg-tertiary)" }}>
                <th style={{ padding: "16px", borderBottom: "1px solid var(--border-default)" }}>Product</th>
                <th style={{ padding: "16px", borderBottom: "1px solid var(--border-default)" }}>Category</th>
                <th style={{ padding: "16px", borderBottom: "1px solid var(--border-default)", textAlign: "center" }}>Price</th>
                <th style={{ padding: "16px", borderBottom: "1px solid var(--border-default)", textAlign: "center" }}>Stock</th>
                <th style={{ padding: "16px", borderBottom: "1px solid var(--border-default)", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.all_products?.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "16px", fontWeight: "500" }}>{p.name}</td>
                  <td style={{ padding: "16px", textTransform: "capitalize", fontSize: "0.8rem", color: "var(--text-tertiary)" }}>{p.category}</td>
                  <td style={{ padding: "16px", textAlign: "center" }}>₹{p.price}</td>
                  <td style={{ padding: "16px", textAlign: "center" }}>
                    <span className={`badge ${p.stock < 5 ? 'badge-red' : 'badge-emerald'}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td style={{ padding: "16px", textAlign: "right" }}>
                    <button className="btn btn-sm btn-outline" onClick={() => handleUpdateStock(p.id, p.stock)}>Update Stock</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={{ marginTop: "40px", marginBottom: "16px" }}>Recent Orders</h3>
        <div className="card glass-panel" style={{ padding: "0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "var(--bg-tertiary)" }}>
                <th style={{ padding: "16px", borderBottom: "1px solid var(--border-default)" }}>Order ID</th>
                <th style={{ padding: "16px", borderBottom: "1px solid var(--border-default)" }}>User</th>
                <th style={{ padding: "16px", borderBottom: "1px solid var(--border-default)" }}>Status</th>
                <th style={{ padding: "16px", borderBottom: "1px solid var(--border-default)", textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.recent_orders.map((o) => (
                <tr key={o.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "16px", fontWeight: "600" }}>#{o.id}</td>
                  <td style={{ padding: "16px" }}>{o.user}</td>
                  <td style={{ padding: "16px" }}>
                    <span className={`badge ${o.status === 'placed' ? 'badge-blue' : 'badge-emerald'}`}>
                      {o.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "16px", textAlign: "right", color: "var(--brand-gold)", fontWeight: "600" }}>
                    ₹{o.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h3 style={{ marginBottom: "16px" }}>Marketing & Platform Engagement</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          <div className="ad-card" style={{ textAlign: "left" }}>
            <h4>👥 Community Growth</h4>
            <div className="stat-value" style={{ marginTop: 8 }}>{marketing.total_users}</div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>Registered Chess Enthusiasts</p>
          </div>
          <div className="ad-card" style={{ textAlign: "left" }}>
            <h4>📚 Education Impact</h4>
            <div className="stat-value" style={{ marginTop: 8 }}>{marketing.total_enrollments}</div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>Course Enrollments To-Date</p>
          </div>
          <div className="ad-card" style={{ textAlign: "left" }}>
            <h4>🎌 Tournament Hype</h4>
            <div className="stat-value" style={{ marginTop: 8 }}>{marketing.total_activities}</div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>User Interactions This Month</p>
          </div>
        </div>
      </section>
    </div>
  );
}
