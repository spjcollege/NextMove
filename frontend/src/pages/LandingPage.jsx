import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import { Stars, getCategoryEmoji } from "./Home";

// ─── Tier badge helper ───
function TierBadge({ tier }) {
    const map = { free: { icon: "🥉", label: "Bronze", color: "#cd7f32" }, premium: { icon: "🥇", label: "Gold", color: "var(--brand-gold)" }, pro: { icon: "💎", label: "Grandmaster", color: "#a78bfa" } };
    const t = map[tier] || map.free;
    return <span style={{ color: t.color, fontWeight: 700 }}>{t.icon} {t.label}</span>;
}

const TESTIMONIALS = [
    { name: "Arjun M.", city: "Pune", rating: 5, text: "I went from 900 to 1400 Elo in 3 months using NextMove courses. The puzzles are absolutely addictive!" },
    { name: "Priya K.", city: "Bengaluru", rating: 5, text: "My Staunton set arrived beautifully packaged. Best chess gear I've ever bought online. Will order again." },
    { name: "Rohit S.", city: "Delhi", rating: 5, text: "Won the Blitz Championship and redeemed my loyalty points for a free course. This platform is incredible." },
];

const YOUTUBE_VIDEOS = [
    { title: "The Sicilian Defence — Complete Beginner's Guide", views: "142K views", thumb: "🎬", duration: "18:34" },
    { title: "5 Endgame Techniques Every Player Must Know", views: "98K views", thumb: "🎬", duration: "22:11" },
    { title: "How Magnus Carlsen Thinks in Blitz Chess", views: "213K views", thumb: "🎬", duration: "14:05" },
];

const TRUST_ITEMS = [
    { icon: "🔒", title: "Razorpay Secured", desc: "256-bit encrypted payments" },
    { icon: "🚚", title: "Fast Delivery", desc: "Ships in 2–3 business days" },
    { icon: "🔄", title: "Easy Returns", desc: "7-day hassle-free policy" },
    { icon: "🎧", title: "Expert Support", desc: "Chess experts, always on hand" },
];

export default function LandingPage() {
    const [featured, setFeatured] = useState([]);
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        apiFetch("/products/featured").then((d) => setFeatured(d.slice(0, 4))).catch(() => {});
        apiFetch("/courses/?").then((d) => setCourses(d.slice(0, 3))).catch(() => {});
    }, []);

    return (
        <div className="animate-fade-in" style={{ overflowX: "hidden" }}>

            {/* ══════════════════════════════════════════
                SECTION 1 — HERO
            ══════════════════════════════════════════ */}
            <section style={{
                minHeight: "92vh", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "linear-gradient(160deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-primary) 100%)",
                position: "relative", overflow: "hidden", padding: "80px 24px",
                textAlign: "center",
            }}>
                {/* Animated chessboard grid background */}
                <div style={{
                    position: "absolute", inset: 0, opacity: 0.04,
                    backgroundImage: "repeating-conic-gradient(var(--brand-gold) 0% 25%, transparent 0% 50%)",
                    backgroundSize: "60px 60px",
                }} />
                {/* Radial glow */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(212,168,67,0.09) 0%, transparent 70%)",
                }} />

                <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,168,67,0.12)", border: "1px solid rgba(212,168,67,0.3)", borderRadius: 999, padding: "6px 16px", marginBottom: 24, fontSize: "0.8rem", color: "var(--brand-gold)", fontWeight: 600 }}>
                        ♔ India's Premier Chess Ecosystem
                    </div>

                    <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
                        Your Chess Journey{" "}
                        <span style={{ background: "linear-gradient(135deg, var(--brand-gold), #f5d78e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Starts Here
                        </span>
                    </h1>

                    <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", marginBottom: 40, lineHeight: 1.6, maxWidth: 560, margin: "0 auto 40px" }}>
                        Shop premium equipment, learn from titled players, compete in live tournaments — and build your legacy, all in one platform.
                    </p>

                    <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
                        <Link to="/auth" className="btn btn-primary btn-lg" style={{ fontSize: "1rem", padding: "14px 32px" }}>
                            🚀 Join Free — No Card Needed
                        </Link>
                        <a href="#shop" className="btn btn-outline btn-lg" style={{ fontSize: "1rem", padding: "14px 32px" }}>
                            Browse the Shop
                        </a>
                    </div>

                    {/* Floating stat badges */}
                    <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
                        {[
                            { icon: "👥", val: "5,000+", label: "Players" },
                            { icon: "📦", val: "20+", label: "Products" },
                            { icon: "📚", val: "6", label: "Courses" },
                            { icon: "🏆", val: "Monthly", label: "Tournaments" },
                            { icon: "⭐", val: "4.8/5", label: "Rating" },
                        ].map((s) => (
                            <div key={s.label} style={{ textAlign: "center" }}>
                                <div style={{ fontSize: "1.4rem", marginBottom: 2 }}>{s.icon}</div>
                                <div style={{ fontWeight: 800, color: "var(--brand-gold)", fontSize: "1.2rem" }}>{s.val}</div>
                                <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll hint */}
                <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", animation: "bounce 2s infinite", color: "var(--text-tertiary)", fontSize: "1.4rem" }}>↓</div>
                <style>{`@keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-8px)} }`}</style>
            </section>

            {/* ══════════════════════════════════════════
                SECTION 2 — FEATURE PILLARS
            ══════════════════════════════════════════ */}
            <section style={{ padding: "80px 24px", background: "var(--bg-secondary)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 56 }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 12 }}>Everything You Need to Excel</h2>
                        <p style={{ color: "var(--text-secondary)" }}>One platform. Four ways to grow.</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
                        {[
                            {
                                icon: "♜", color: "rgba(212,168,67,0.12)", border: "rgba(212,168,67,0.3)",
                                title: "Shop World-Class Gear",
                                desc: "Handpicked boards, pieces, clocks, and books from top manufacturers. Every order is quality-checked.",
                                cta: "Browse Shop", link: "/#shop",
                            },
                            {
                                icon: "📚", color: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)",
                                title: "Learn from Grandmasters",
                                desc: "Structured courses from beginner to advanced. Daily puzzles keep your tactics razor-sharp.",
                                cta: "See Courses", link: "/courses",
                            },
                            {
                                icon: "🎌", color: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)",
                                title: "Compete & Rise",
                                desc: "Join live tournaments, earn loyalty points for winning, and climb the global leaderboard.",
                                cta: "View Competitions", link: "/competitions",
                            },
                            {
                                icon: "💬", color: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.3)",
                                title: "Ask. Discuss. Improve.",
                                desc: "Open forum for all — free forever. Upgrade for private coach Q&As and strategy deep-dives.",
                                cta: "Join the Forum", link: "/forums",
                            },
                        ].map((p) => (
                            <div key={p.title} className="card" style={{ background: p.color, border: `1px solid ${p.border}`, padding: 28, display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ fontSize: "2.2rem" }}>{p.icon}</div>
                                <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{p.title}</h3>
                                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.6, flex: 1 }}>{p.desc}</p>
                                <Link to={p.link} className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-start", marginTop: 8 }}>{p.cta} →</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                SECTION 3 — FEATURED PRODUCTS
            ══════════════════════════════════════════ */}
            {featured.length > 0 && (
                <section id="shop" style={{ padding: "80px 24px" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 12 }}>
                            <div>
                                <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 8 }}>⭐ Top Picks This Week</h2>
                                <p style={{ color: "var(--text-secondary)" }}>Handpicked by our chess experts</p>
                            </div>
                            <Link to="/" className="btn btn-secondary">See All 20+ Products →</Link>
                        </div>
                        <div className="grid-products">
                            {featured.map((p) => {
                                const discount = p.original_price > p.price ? Math.round((1 - p.price / p.original_price) * 100) : 0;
                                return (
                                    <Link key={p.id} to={`/product/${p.id}`} className="card" style={{ padding: 0, overflow: "hidden", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}>
                                        <div style={{ height: 160, background: `linear-gradient(135deg, rgba(212,168,67,0.1), var(--bg-tertiary))`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", position: "relative" }}>
                                            {getCategoryEmoji(p.category)}
                                            {discount > 0 && <span className="badge badge-red" style={{ position: "absolute", top: 10, right: 10 }}>-{discount}%</span>}
                                        </div>
                                        <div style={{ padding: 16 }}>
                                            <span className="badge badge-emerald" style={{ marginBottom: 6 }}>{p.category}</span>
                                            <h4 style={{ fontSize: "0.9rem", marginBottom: 8, lineHeight: 1.3 }}>{p.name}</h4>
                                            <Stars rating={p.rating_avg} count={p.rating_count} />
                                            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
                                                <span style={{ fontWeight: 700, color: "var(--brand-gold)", fontSize: "1.1rem" }}>₹{p.price}</span>
                                                {p.original_price > p.price && <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", textDecoration: "line-through" }}>₹{p.original_price}</span>}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ══════════════════════════════════════════
                SECTION 4 — COURSES TEASER
            ══════════════════════════════════════════ */}
            {courses.length > 0 && (
                <section style={{ padding: "80px 24px", background: "var(--bg-secondary)" }}>
                    <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 56, alignItems: "center" }}>
                        <div>
                            <div style={{ display: "inline-block", background: "rgba(212,168,67,0.12)", border: "1px solid rgba(212,168,67,0.3)", borderRadius: 999, padding: "5px 14px", fontSize: "0.75rem", color: "var(--brand-gold)", fontWeight: 600, marginBottom: 16 }}>
                                📚 STRUCTURED LEARNING
                            </div>
                            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>Learn from Titled Players</h2>
                            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 24 }}>
                                Whether you're a complete beginner or an aspiring master, we have a structured path for you — with interactive lessons, annotated games, and daily puzzles.
                            </p>
                            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 32 }}>
                                Create a free account to unlock your first lesson instantly. No credit card required.
                            </p>
                            <Link to="/auth" className="btn btn-primary">Create Free Account →</Link>
                        </div>
                        <div style={{ display: "grid", gap: 16 }}>
                            {courses.map((c) => (
                                <Link key={c.id} to={`/courses/${c.id}`} className="card" style={{ padding: 16, textDecoration: "none", color: "inherit", display: "flex", gap: 16, alignItems: "center" }}>
                                    <div style={{ width: 56, height: 56, borderRadius: "var(--radius-md)", background: c.is_free ? "rgba(16,185,129,0.15)" : "rgba(212,168,67,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", flexShrink: 0 }}>📚</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                                            <span className={`badge ${c.difficulty === "beginner" ? "badge-emerald" : c.difficulty === "intermediate" ? "badge-blue" : "badge-red"}`}>{c.difficulty}</span>
                                            {c.is_free && <span className="badge badge-emerald">FREE</span>}
                                        </div>
                                        <h4 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: 2 }}>{c.title}</h4>
                                        <p style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>By {c.instructor} · {c.lesson_count} lessons</p>
                                    </div>
                                    <div style={{ fontWeight: 700, color: c.is_free ? "var(--brand-emerald)" : "var(--brand-gold)", fontSize: "1rem", flexShrink: 0 }}>
                                        {c.is_free ? "Free" : `₹${c.price}`}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ══════════════════════════════════════════
                SECTION 5 — YOUTUBE CHANNEL
            ══════════════════════════════════════════ */}
            <section style={{ padding: "80px 24px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 999, padding: "6px 16px", marginBottom: 16, fontSize: "0.8rem", color: "#ef4444", fontWeight: 600 }}>
                            ▶ YOUTUBE · 3.2K SUBSCRIBERS
                        </div>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 12 }}>Start Learning for Free on YouTube</h2>
                        <p style={{ color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto" }}>
                            Our channel covers openings, tactics, and grandmaster games — completely free. Ready to go deeper? Our full courses are structured, interactive, and certified.
                        </p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 36 }}>
                        {YOUTUBE_VIDEOS.map((v) => (
                            <div key={v.title} className="card" style={{ padding: 0, overflow: "hidden" }}>
                                <div style={{ height: 160, background: "linear-gradient(135deg, rgba(239,68,68,0.15), var(--bg-tertiary))", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: "pointer" }}>
                                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(239,68,68,0.9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>▶</div>
                                    <span style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.75)", color: "#fff", fontSize: "0.72rem", padding: "2px 8px", borderRadius: 4 }}>{v.duration}</span>
                                </div>
                                <div style={{ padding: 16 }}>
                                    <h4 style={{ fontSize: "0.88rem", lineHeight: 1.4, marginBottom: 6 }}>{v.title}</h4>
                                    <p style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>NextMove Chess · {v.views}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: "center", display: "flex", gap: 12, justifyContent: "center" }}>
                        <a href="https://youtube.com/@nextmovechess" target="_blank" rel="noreferrer" className="btn btn-outline">▶ Visit YouTube Channel</a>
                        <Link to="/courses" className="btn btn-primary">See Full Courses →</Link>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                SECTION 6 — LOYALTY PROGRAM
            ══════════════════════════════════════════ */}
            <section style={{ padding: "80px 24px", background: "linear-gradient(135deg, rgba(212,168,67,0.08) 0%, var(--bg-secondary) 50%, rgba(212,168,67,0.06) 100%)" }}>
                <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
                    <div style={{ fontSize: "3rem", marginBottom: 16 }}>🏅</div>
                    <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 16 }}>Earn Points. Unlock Rewards.</h2>
                    <p style={{ color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 }}>
                        Every purchase earns you NextMove Loyalty Points. Win competitions for bonus points. Redeem them for discounts, exclusive gear, and even free courses.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 48 }}>
                        {[
                            { icon: "🥉", tier: "Bronze", condition: "Join for free", perks: "Forum access · Earn points" },
                            { icon: "🥈", tier: "Silver", condition: "500+ points", perks: "5% discount · Analysis threads" },
                            { icon: "🥇", tier: "Gold", condition: "2,000+ points", perks: "10% discount · Coach Q&A" },
                            { icon: "💎", tier: "Grandmaster", condition: "10,000+ points", perks: "15% discount · Exclusive gear" },
                        ].map((t) => (
                            <div key={t.tier} className="card" style={{ padding: 20, textAlign: "center", border: "1px solid rgba(212,168,67,0.2)" }}>
                                <div style={{ fontSize: "2rem", marginBottom: 8 }}>{t.icon}</div>
                                <h4 style={{ color: "var(--brand-gold)", marginBottom: 4, fontWeight: 700 }}>{t.tier}</h4>
                                <p style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", marginBottom: 8 }}>{t.condition}</p>
                                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{t.perks}</p>
                            </div>
                        ))}
                    </div>
                    <Link to="/auth" className="btn btn-primary btn-lg">Start Earning Today — Join Free</Link>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                SECTION 7 — TESTIMONIALS
            ══════════════════════════════════════════ */}
            <section style={{ padding: "80px 24px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 12 }}>Loved by Players Across India</h2>
                        <p style={{ color: "var(--text-secondary)" }}>Real reviews from real players</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                        {TESTIMONIALS.map((t) => (
                            <div key={t.name} className="card" style={{ padding: 28 }}>
                                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                                    {[...Array(t.rating)].map((_, i) => <span key={i} style={{ color: "var(--brand-gold)" }}>★</span>)}
                                </div>
                                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontStyle: "italic", marginBottom: 20 }}>"{t.text}"</p>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div className="user-avatar sm">{t.name.charAt(0)}</div>
                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: "0.88rem" }}>{t.name}</p>
                                        <p style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>{t.city}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                SECTION 8 — TRUST STRIP
            ══════════════════════════════════════════ */}
            <section style={{ padding: "40px 24px", background: "var(--bg-secondary)", borderTop: "1px solid var(--border-default)", borderBottom: "1px solid var(--border-default)" }}>
                <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
                    {TRUST_ITEMS.map((item) => (
                        <div key={item.title} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: "1.8rem" }}>{item.icon}</span>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: "0.88rem" }}>{item.title}</p>
                                <p style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════════
                SECTION 9 — FINAL CTA
            ══════════════════════════════════════════ */}
            <section style={{
                padding: "100px 24px", textAlign: "center",
                background: "linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)",
                position: "relative", overflow: "hidden",
            }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(212,168,67,0.07) 0%, transparent 65%)" }} />
                <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
                    <div style={{ fontSize: "3.5rem", marginBottom: 20 }}>♔</div>
                    <h2 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>
                        Ready to Make Your{" "}
                        <span style={{ background: "linear-gradient(135deg, var(--brand-gold), #f5d78e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            NextMove?
                        </span>
                    </h2>
                    <p style={{ color: "var(--text-secondary)", marginBottom: 40, lineHeight: 1.7 }}>
                        Join thousands of chess players. Free account, no credit card required. Start shopping, learning, and competing today.
                    </p>
                    <Link to="/auth" className="btn btn-primary btn-lg" style={{ fontSize: "1.05rem", padding: "16px 40px" }}>
                        Create Free Account →
                    </Link>
                    <p style={{ marginTop: 16, fontSize: "0.78rem", color: "var(--text-tertiary)" }}>
                        Already have an account? <Link to="/auth" style={{ color: "var(--brand-gold)" }}>Sign in</Link>
                    </p>
                </div>
            </section>
        </div>
    );
}
