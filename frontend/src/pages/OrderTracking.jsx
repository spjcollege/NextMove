import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import { useAuth } from "../App";
import { getCategoryEmoji } from "./Home";

// ─── Status colour map ───
const STATUS_COLORS = {
    placed:           { bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.4)",  text: "#3B82F6" },
    confirmed:        { bg: "rgba(212,168,67,0.12)",  border: "rgba(212,168,67,0.4)",  text: "var(--brand-gold)" },
    shipped:          { bg: "rgba(139,92,246,0.12)",  border: "rgba(139,92,246,0.4)",  text: "#8B5CF6" },
    out_for_delivery: { bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.4)",  text: "#F97316" },
    delivered:        { bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.4)",  text: "var(--brand-emerald)" },
};

// ─── Admin status update panel ───
function AdminStatusPanel({ order, onUpdate }) {
    const STATUS_FLOW = ["placed", "confirmed", "shipped", "out_for_delivery", "delivered"];
    const { user } = useAuth();
    const [updating, setUpdating] = useState(false);

    if (!user?.is_admin) return null;

    const advance = async (newStatus) => {
        setUpdating(true);
        try {
            const updated = await apiFetch(`/orders/${order.id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
            });
            onUpdate(updated);
        } catch (e) {
            alert(e.message);
        } finally {
            setUpdating(false);
        }
    };

    const currentIdx = STATUS_FLOW.indexOf(order.status);
    const nextStatus = currentIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIdx + 1] : null;

    return (
        <div style={{
            padding: "16px 20px", borderRadius: "var(--radius-lg)",
            background: "rgba(212,168,67,0.06)", border: "1px solid rgba(212,168,67,0.2)",
            marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
            <div>
                <p style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 2 }}>📊 Admin: Update Order Status</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                    Current: <strong>{order.status_label}</strong>
                    {nextStatus && ` → Next: ${nextStatus.replace(/_/g, " ")}`}
                </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
                {STATUS_FLOW.filter((s, i) => i !== currentIdx).map((s) => (
                    <button
                        key={s}
                        className="btn btn-secondary btn-sm"
                        onClick={() => advance(s)}
                        disabled={updating}
                        style={{ fontSize: "0.72rem" }}
                    >
                        → {s.replace(/_/g, " ")}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Main tracking page ───
export default function OrderTracking() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) { navigate("/auth"); return; }
        apiFetch(`/orders/${id}`)
            .then(setOrder)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [id, user]);

    if (!user) return null;

    if (loading) return (
        <div className="page" style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
            <div className="skeleton" style={{ width: "100%", maxWidth: 720, height: 480, borderRadius: "var(--radius-lg)" }} />
        </div>
    );

    if (error) return (
        <div className="page" style={{ textAlign: "center", paddingTop: 80 }}>
            <p style={{ fontSize: "2rem", marginBottom: 12 }}>❌</p>
            <h2 style={{ marginBottom: 8 }}>Order Not Found</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>{error}</p>
            <Link to="/profile" className="btn btn-primary">← Back to Orders</Link>
        </div>
    );

    const statusColor = STATUS_COLORS[order.status] || STATUS_COLORS.placed;

    return (
        <div className="page animate-fade-in" style={{ maxWidth: 820, margin: "0 auto" }}>
            {/* ─── Header ─── */}
            <div style={{ marginBottom: 8 }}>
                <Link to="/profile" style={{ fontSize: "0.82rem", color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 4, marginBottom: 16 }}>
                    ← Back to My Orders
                </Link>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                    <div>
                        <h1 style={{ fontSize: "1.6rem", marginBottom: 4 }}>Order #{order.id}</h1>
                        <p style={{ fontSize: "0.82rem", color: "var(--text-tertiary)" }}>
                            Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                    </div>
                    <div style={{
                        padding: "6px 18px", borderRadius: "var(--radius-full)",
                        background: statusColor.bg, border: `1px solid ${statusColor.border}`,
                        color: statusColor.text, fontWeight: 700, fontSize: "0.82rem",
                        display: "flex", alignItems: "center", gap: 6,
                    }}>
                        {order.status_icon} {order.status_label}
                    </div>
                </div>
            </div>

            <AdminStatusPanel order={order} onUpdate={setOrder} />

            {/* ─── Tracking Number + ETA ─── */}
            <div className="card" style={{ marginBottom: 24, padding: "20px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
                <div>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Tracking Number</p>
                    <p style={{ fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "var(--brand-gold)", fontSize: "1rem" }}>
                        {order.tracking_number || "—"}
                    </p>
                </div>
                <div>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Estimated Delivery</p>
                    <p style={{ fontWeight: 700, fontSize: "1rem" }}>
                        {order.status === "delivered"
                            ? "✅ Delivered"
                            : order.estimated_delivery
                                ? new Date(order.estimated_delivery).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                                : "Calculating..."}
                    </p>
                </div>
                <div>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Payment</p>
                    <p style={{ fontWeight: 700, fontSize: "1rem", textTransform: "uppercase" }}>{order.payment_method}</p>
                </div>
                <div>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Order Total</p>
                    <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--brand-gold)" }}>₹{order.total?.toFixed(2)}</p>
                </div>
            </div>

            {/* ─── Visual Timeline ─── */}
            <div className="card" style={{ marginBottom: 24, padding: "28px 32px" }}>
                <h3 style={{ marginBottom: 32, fontSize: "1rem" }}>📍 Shipment Progress</h3>
                <div style={{ position: "relative" }}>
                    {/* Connector line */}
                    <div style={{
                        position: "absolute", top: 20, left: 20,
                        width: "calc(100% - 40px)", height: 3,
                        background: "var(--bg-tertiary)", borderRadius: 99,
                        zIndex: 0,
                    }} />
                    {/* Progress fill */}
                    {(() => {
                        const totalSteps = order.timeline.length - 1;
                        const completedSteps = order.timeline.filter(t => t.completed).length - 1;
                        const pct = totalSteps > 0 ? Math.max(0, (completedSteps / totalSteps) * 100) : 0;
                        return (
                            <div style={{
                                position: "absolute", top: 20, left: 20,
                                width: `calc((100% - 40px) * ${pct / 100})`,
                                height: 3,
                                background: "linear-gradient(90deg, var(--brand-gold), var(--brand-emerald))",
                                borderRadius: 99, zIndex: 1,
                                transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
                            }} />
                        );
                    })()}

                    {/* Steps */}
                    <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
                        {order.timeline.map((step, i) => (
                            <div key={step.status} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                                {/* Circle */}
                                <div style={{
                                    width: 42, height: 42,
                                    borderRadius: "50%",
                                    background: step.active
                                        ? "linear-gradient(135deg, var(--brand-gold), var(--brand-gold-dark))"
                                        : step.completed
                                            ? "rgba(16,185,129,0.15)"
                                            : "var(--bg-tertiary)",
                                    border: step.active
                                        ? "3px solid var(--brand-gold)"
                                        : step.completed
                                            ? "2px solid var(--brand-emerald)"
                                            : "2px solid var(--border-default)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "1.1rem",
                                    boxShadow: step.active ? "0 0 16px rgba(212,168,67,0.4)" : "none",
                                    transition: "all 0.4s ease",
                                    marginBottom: 10,
                                }}>
                                    {step.completed ? (step.active ? step.icon : "✓") : step.icon}
                                </div>
                                {/* Label */}
                                <p style={{
                                    fontSize: "0.7rem", fontWeight: step.active ? 700 : 500,
                                    color: step.active ? "var(--brand-gold)" : step.completed ? "var(--text-primary)" : "var(--text-tertiary)",
                                    textAlign: "center", maxWidth: 80, lineHeight: 1.3,
                                }}>
                                    {step.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active step description */}
                {order.timeline.find(t => t.active) && (
                    <div style={{
                        marginTop: 28, padding: "12px 16px", borderRadius: "var(--radius-md)",
                        background: statusColor.bg, border: `1px solid ${statusColor.border}`,
                        display: "flex", alignItems: "center", gap: 10,
                    }}>
                        <span style={{ fontSize: "1.3rem" }}>{order.status_icon}</span>
                        <div>
                            <p style={{ fontWeight: 700, fontSize: "0.88rem", color: statusColor.text }}>{order.status_label}</p>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                                {order.timeline.find(t => t.active)?.desc}
                            </p>
                        </div>
                        <p style={{ marginLeft: "auto", fontSize: "0.72rem", color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>
                            {new Date(order.status_updated_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                    </div>
                )}
            </div>

            {/* ─── Delivery Address ─── */}
            {order.address && (
                <div className="card" style={{ marginBottom: 24, padding: "20px 24px" }}>
                    <h3 style={{ fontSize: "0.95rem", marginBottom: 12 }}>📍 Delivery Address</h3>
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.88rem" }}>{order.address}</p>
                </div>
            )}

            {/* ─── Order Items ─── */}
            <div className="card" style={{ padding: "20px 24px" }}>
                <h3 style={{ fontSize: "0.95rem", marginBottom: 16 }}>🛒 Items in This Order</h3>
                <div style={{ display: "grid", gap: 12 }}>
                    {order.items.map((item, i) => (
                        <div key={i} style={{
                            display: "flex", alignItems: "center", gap: 16,
                            padding: "12px 16px", borderRadius: "var(--radius-md)",
                            background: "var(--bg-tertiary)",
                        }}>
                            {/* Product icon placeholder */}
                            <div style={{
                                width: 52, height: 52, borderRadius: "var(--radius-md)",
                                background: "linear-gradient(135deg, rgba(212,168,67,0.12), var(--bg-secondary))",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "1.5rem", flexShrink: 0,
                            }}>
                                {getCategoryEmoji(item.category)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 2 }}>{item.name}</p>
                                <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                                    Qty: {item.quantity} · ₹{item.price} each
                                </p>
                            </div>
                            <p style={{ fontWeight: 700, color: "var(--brand-gold)", flexShrink: 0 }}>
                                ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
                <div style={{ borderTop: "1px solid var(--border-subtle)", marginTop: 16, paddingTop: 16, display: "flex", justifyContent: "space-between" }}>
                    <p style={{ fontWeight: 700 }}>Order Total</p>
                    <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--brand-gold)" }}>₹{order.total?.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}
