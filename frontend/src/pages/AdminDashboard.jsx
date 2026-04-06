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

  const { sales, marketing } = data;

  return (
    <div className="page animate-fade-in">
      <header className="section-header">
        <div>
          <h2>📊 Admin Dashboard</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Overview of NextMove Sales and Marketing</p>
        </div>
      </header>

      <section style={{ marginBottom: "40px" }}>
        <h3 style={{ marginBottom: "16px" }}>Sales Statistics</h3>
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
        </div>

        <h3 style={{ marginTop: "32px", marginBottom: "16px" }}>Top Selling Products</h3>
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
              {sales.top_products.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ padding: "32px", textAlign: "center", color: "var(--text-tertiary)" }}>No sales yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h3 style={{ marginTop: "32px", marginBottom: "16px" }}>Recent Orders</h3>
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
              {sales.recent_orders.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: "32px", textAlign: "center", color: "var(--text-tertiary)" }}>No orders yet</td>
                </tr>
              )}
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
      </section>
    </div>
  );
}
