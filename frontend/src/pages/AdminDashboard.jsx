import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAnalytics } from "../api";
import { useAuth } from "../App";
import "../index.css"; // Ensure access to global tokens

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Basic protection on frontend, actual checking occurs on backend too
    if (!user || !user.is_admin) {
      navigate("/");
      return;
    }

    async function loadData() {
      try {
        const result = await getAnalytics();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user, navigate]);

  if (loading) return <div className="page-container"><div className="loading-spinner"></div></div>;
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
      </header>

      <section style={{ marginBottom: "40px" }}>
        <div className="grid-products">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--brand-emerald)" }}>💰</div>
            <div>
              <div className="stat-value" style={{ color: "var(--brand-emerald)" }}>${sales.total_revenue.toFixed(2)}</div>
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
              <div className="stat-value">${inventory.total_stock_value.toFixed(0)}</div>
              <div className="stat-label">Stock Value</div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "32px" }}>
          <div>
            <h3 style={{ marginBottom: "16px" }}>Category Performance</h3>
            <div className="card glass-panel" style={{ padding: "20px" }}>
              {category_performance.map((cp) => (
                <div key={cp.category} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontWeight: "600", textTransform: "capitalize" }}>{cp.category}</span>
                    <span style={{ color: "var(--brand-gold)" }}>${cp.revenue.toFixed(0)}</span>
                  </div>
                  <div style={{ height: "8px", background: "var(--bg-tertiary)", borderRadius: "4px", overflow: "hidden" }}>
                    <div 
                      style={{ 
                        height: "100%", 
                        width: `${Math.min(100, (cp.revenue / (sales.total_revenue || 1)) * 100)}%`, 
                        background: "linear-gradient(90deg, var(--brand-gold), var(--brand-gold-muted))",
                        borderRadius: "4px"
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: "16px" }}>Low Stock Alerts</h3>
            <div className="card glass-panel" style={{ padding: "0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "var(--bg-tertiary)" }}>
                    <th style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-default)" }}>Product</th>
                    <th style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-default)", textAlign: "center" }}>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.low_stock_items.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "12px 16px", fontSize: "14px" }}>{item.name}</td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <span className="badge badge-error" style={{ background: "rgba(239, 68, 68, 0.2)", color: "#EF4444" }}>
                          {item.stock} left
                        </span>
                      </td>
                    </tr>
                  ))}
                  {inventory.low_stock_items.length === 0 && (
                    <tr>
                      <td colSpan="2" style={{ padding: "24px", textAlign: "center", color: "var(--text-tertiary)" }}>All products well stocked</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <h3 style={{ marginTop: "40px", marginBottom: "16px" }}>Top Selling Products</h3>
        <div className="card glass-panel" style={{ padding: "0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "var(--bg-tertiary)" }}>
                <th style={{ padding: "16px", borderBottom: "1px solid var(--border-default)" }}>Product</th>
                <th style={{ padding: "16px", borderBottom: "1px solid var(--border-default)", textAlign: "center" }}>Units Sold</th>
                <th style={{ padding: "16px", borderBottom: "1px solid var(--border-default)", textAlign: "right" }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {sales.top_products.map((tp) => (
                <tr key={tp.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "16px" }}>{tp.name}</td>
                  <td style={{ padding: "16px", textAlign: "center" }}>
                    <span className="badge badge-blue">{tp.total_sold} units</span>
                  </td>
                  <td style={{ padding: "16px", textAlign: "right", color: "var(--brand-gold)", fontWeight: "600" }}>
                    ${tp.revenue.toFixed(2)}
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
                <th style={{ padding: "16px", borderBottom: "1px solid var(--border-default)", textAlign: "right" }}>Date</th>
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
                    ${o.total.toFixed(2)}
                  </td>
                  <td style={{ padding: "16px", textAlign: "right", color: "var(--text-secondary)" }}>
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h3 style={{ marginBottom: "16px" }}>Marketing & Engagement</h3>
        <div className="grid-products">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(212, 168, 67, 0.15)", color: "var(--brand-gold)" }}>👥</div>
            <div>
              <div className="stat-value">{marketing.total_users}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--brand-emerald)" }}>📚</div>
            <div>
              <div className="stat-value">{marketing.total_enrollments}</div>
              <div className="stat-label">Total Enrollments</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#EF4444" }}>🖱️</div>
            <div>
              <div className="stat-value">{marketing.total_activities}</div>
              <div className="stat-label">User Activities</div>
            </div>
          </div>
        </div>

        <h3 style={{ marginTop: "32px", marginBottom: "16px" }}>Recent Registrations</h3>
        <div className="card glass-panel" style={{ padding: "0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "var(--bg-tertiary)" }}>
                <th style={{ padding: "16px", borderBottom: "1px solid var(--border-default)" }}>Username</th>
                <th style={{ padding: "16px", borderBottom: "1px solid var(--border-default)", textAlign: "right" }}>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {marketing.recent_registrations.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "16px", fontWeight: "600" }}>{u.username}</td>
                  <td style={{ padding: "16px", textAlign: "right", color: "var(--text-secondary)" }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
