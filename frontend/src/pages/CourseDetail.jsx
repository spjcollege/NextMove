import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../api";
import { useAuth } from "../App";

function CourseDetail() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [enrolled, setEnrolled] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [loading, setLoading] = useState(false);
    const { user, showToast } = useAuth();

    useEffect(() => {
        apiFetch(`/courses/${id}`).then(setCourse).catch(() => { });
        if (user) {
            apiFetch("/courses/user/enrolled")
                .then((list) => setEnrolled(list.some((c) => c.id === parseInt(id))))
                .catch(() => { });
        }
    }, [id, user]);

    const handleEnrollClick = () => {
        if (!user) { showToast("Please login to enroll", "error"); return; }
        if (course.is_free) {
            processEnroll();
        } else {
            setShowPayment(true);
        }
    };

    const processEnroll = async () => {
        setLoading(true);
        try {
            // Create Razorpay Order
            const orderRes = await apiFetch(`/payment/create-order`, {
                method: "POST",
                body: JSON.stringify({ amount: course.price, currency: "INR" })
            });

            const options = {
                key: "rzp_test_SVtgVzzzyc8S1v", // Razorpay Key ID
                amount: orderRes.amount, 
                currency: "INR",
                name: "NextMove",
                description: `Enroll: ${course.title}`,
                order_id: orderRes.order_id,
                theme: { color: "#D4A843" },
                prefill: {
                    name: user.full_name || user.username,
                    email: user.email || "user@example.com",
                    contact: "9999999999" // Dummy contact often required to reveal UPI options
                },
                config: {
                    display: {
                        blocks: {
                            upi_and_cards: {
                                name: "UPI & Cards",
                                instruments: [
                                    { method: "upi" },
                                    { method: "card" },
                                    { method: "wallet" },
                                    { method: "netbanking" }
                                ]
                            }
                        },
                        sequence: ["block.upi_and_cards"]
                    }
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

                        // Proceed to backend enroll after successful secure payment verification
                        await apiFetch(`/courses/${id}/enroll`, { method: "POST" });
                        setEnrolled(true);
                        setShowPayment(false);
                        showToast(`Payment of ₹${course.price} successful! Enrolled! 🎓`);
                    } catch (err) {
                        showToast("Payment verification failed! " + err.message, "error");
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", function (response) {
                showToast("Payment failed or cancelled.", "error");
            });
            rzp.open();

        } catch (e) {
            showToast(e.message, "error");
        } finally {
            setLoading(false);
        }
    };

    if (!course) {
        return <div className="page"><div className="skeleton" style={{ height: 400 }} /></div>;
    }

    return (
        <div className="page animate-slide-up" style={{ maxWidth: 900 }}>
            <Link to="/courses" style={{ fontSize: "0.82rem", color: "var(--text-tertiary)" }}>← Back to Courses</Link>

            <div style={{ marginTop: 20, marginBottom: 32 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <span className={`badge ${course.difficulty === "beginner" ? "badge-emerald" : course.difficulty === "intermediate" ? "badge-blue" : "badge-red"}`}>{course.difficulty}</span>
                    <span className="badge badge-gold">{course.category}</span>
                    {course.is_free && <span className="badge badge-emerald">FREE</span>}
                </div>

                <h1 style={{ fontSize: "2rem", marginBottom: 12 }}>{course.title}</h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 20 }}>
                    {course.description}
                </p>

                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 24, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    <span>👨‍🏫 {course.instructor}</span>
                    <span>📖 {course.lesson_count} lessons</span>
                    <span>⏱ {course.duration}</span>
                    <span>👥 {course.enrolled_count} enrolled</span>
                </div>

                {!enrolled ? (
                    !showPayment ? (
                        <button className="btn btn-primary btn-lg" onClick={handleEnrollClick}>
                            {course.is_free ? "Enroll for Free" : `Enroll — ₹${course.price}`}
                        </button>
                    ) : (
                        <div className="card animate-fade-in" style={{ padding: 24, maxWidth: 500, border: "2px solid var(--brand-gold)" }}>
                            <h3 style={{ marginBottom: 16 }}>Complete Payment</h3>
                            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: 16 }}>
                                You are purchasing <strong>{course.title}</strong> for <strong>₹{course.price}</strong>.
                            </p>
                            
                            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                                {[
                                    { key: "upi", label: "UPI Payment", icon: "📱" },
                                    { key: "card", label: "Credit / Debit Card", icon: "💳" },
                                ].map((p) => (
                                    <label key={p.key} style={{
                                        display: "flex", alignItems: "center", gap: 12,
                                        padding: "12px 16px", borderRadius: "var(--radius-md)",
                                        cursor: "pointer",
                                        background: paymentMethod === p.key ? "rgba(212,168,67,0.08)" : "transparent",
                                        border: `1px solid ${paymentMethod === p.key ? "rgba(212,168,67,0.3)" : "var(--border-subtle)"}`,
                                    }}>
                                        <input type="radio" name="payment" checked={paymentMethod === p.key} onChange={() => setPaymentMethod(p.key)} style={{ accentColor: "var(--brand-gold)" }} />
                                        <span style={{ fontSize: "1.2rem" }}>{p.icon}</span>
                                        <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{p.label}</span>
                                    </label>
                                ))}
                            </div>

                            <div style={{ display: "flex", gap: 12 }}>
                                <button className="btn btn-primary" style={{ flex: 1 }} onClick={processEnroll} disabled={loading}>
                                    {loading ? "Processing..." : `Pay ₹${course.price}`}
                                </button>
                                <button className="btn btn-outline" onClick={() => setShowPayment(false)} disabled={loading}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )
                ) : (
                    <span className="badge badge-emerald" style={{ fontSize: "0.85rem", padding: "8px 16px" }}>✓ Enrolled</span>
                )}
            </div>

            {/* Lessons */}
            <h2 style={{ marginBottom: 16 }}>📖 Course Curriculum</h2>
            <div style={{ display: "grid", gap: 8 }}>
                {course.lessons?.map((lesson, i) => (
                    <div key={lesson.id} className="card" style={{
                        padding: "16px 20px",
                        display: "flex", alignItems: "center", gap: 16,
                        opacity: enrolled ? 1 : 0.6,
                    }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: "0.85rem", color: "var(--brand-gold)", flexShrink: 0,
                        }}>
                            {i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: "0.9rem" }}>{lesson.title}</h4>
                            <p style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", marginTop: 2 }}>
                                {lesson.duration_minutes} min
                                {lesson.fen_position && " · Interactive Board"}
                            </p>
                        </div>
                        {enrolled && (
                            <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>▶</span>
                        )}
                        {!enrolled && (
                            <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>🔒</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CourseDetail;
