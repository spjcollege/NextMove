import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";
import { useAuth } from "../App";

// ─── Tier config ─────────────────────────────────────────────────────────────
//  free     → can read all, post in: general, help
//  premium  → + post in: openings, endgame, tournament, analysis
//             + access "Coach Q&A" (read + post)
//  pro      → all above + access "Grandmaster Lounge" (read + post)
// ─────────────────────────────────────────────────────────────────────────────
const TIER_ORDER = { free: 0, premium: 1, pro: 2 };

const CATEGORIES = [
    {
        key: "general",
        label: "General",
        icon: "💬",
        minTierToPost: "free",
        description: "Open to all — ask anything, share your chess journey.",
    },
    {
        key: "help",
        label: "Help & Doubts",
        icon: "🙋",
        minTierToPost: "free",
        description: "Quick questions welcome. Free for every member.",
    },
    {
        key: "openings",
        label: "Openings",
        icon: "♟",
        minTierToPost: "premium",
        description: "Deep opening theory. Premium members can post.",
    },
    {
        key: "endgame",
        label: "Endgame",
        icon: "♛",
        minTierToPost: "premium",
        description: "Endgame studies and technique. Premium members can post.",
    },
    {
        key: "tournament",
        label: "Tournament",
        icon: "🏆",
        minTierToPost: "premium",
        description: "Tournament prep & reports. Premium members can post.",
    },
    {
        key: "analysis",
        label: "Analysis",
        icon: "🔍",
        minTierToPost: "premium",
        description: "Position analysis and game review. Premium members can post.",
    },
    {
        key: "coach_qa",
        label: "Coach Q&A",
        icon: "🎓",
        minTierToPost: "premium",
        description: "Ask titled coaches directly. Premium & Pro exclusive.",
        badge: "Premium",
    },
    {
        key: "gm_lounge",
        label: "GM Lounge",
        icon: "💎",
        minTierToPost: "pro",
        description: "Private Grandmaster discussions. Pro members only.",
        badge: "Pro",
    },
];

function canPost(user, category) {
    if (!user) return false;
    const tier = user.subscription_tier || "free";
    return TIER_ORDER[tier] >= TIER_ORDER[category.minTierToPost];
}

function TierGate({ category, user }) {
    const tierLabel = category.minTierToPost === "pro" ? "💎 Pro" : "🥇 Premium";
    return (
        <div style={{
            marginBottom: 24, padding: "16px 20px",
            background: "linear-gradient(135deg, rgba(212,168,67,0.08), rgba(212,168,67,0.04))",
            border: "1px solid rgba(212,168,67,0.25)",
            borderRadius: "var(--radius-lg)",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.4rem" }}>🔒</span>
                <div>
                    <p style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 2 }}>
                        {tierLabel} members can post here
                    </p>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                        {user
                            ? `You're on the ${user.subscription_tier || "free"} plan. Upgrade to post in this category.`
                            : "Sign in and upgrade to post in this category."}
                    </p>
                </div>
            </div>
            <Link to="/profile" className="btn btn-primary btn-sm">Upgrade Plan →</Link>
        </div>
    );
}

function Forums() {
    const [posts, setPosts] = useState([]);
    const [activeCategory, setActiveCategory] = useState("general");
    const [showCreate, setShowCreate] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const { user, showToast } = useAuth();

    const activeCatObj = CATEGORIES.find((c) => c.key === activeCategory) || CATEGORIES[0];
    const userCanPost = canPost(user, activeCatObj);

    useEffect(() => { fetchPosts(); }, [activeCategory]);

    const fetchPosts = () => {
        const url = activeCategory ? `/forums/?category=${activeCategory}` : "/forums/";
        apiFetch(url).then(setPosts).catch(() => {});
    };

    const createPost = async () => {
        if (!title.trim() || !content.trim()) return;
        if (!userCanPost) { showToast("Upgrade your plan to post here.", "error"); return; }
        try {
            await apiFetch("/forums/", {
                method: "POST",
                body: JSON.stringify({ title, content, category: activeCategory }),
            });
            showToast("Post created! 📝");
            setTitle(""); setContent(""); setShowCreate(false);
            fetchPosts();
        } catch (e) { showToast(e.message, "error"); }
    };

    return (
        <div className="page animate-fade-in">
            <div className="section-header" style={{ marginBottom: 8 }}>
                <div>
                    <h1>💬 Forums</h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: 4 }}>
                        Everyone can read. Post access depends on your membership tier.
                    </p>
                </div>
                {!user && (
                    <Link to="/auth" className="btn btn-primary btn-sm">Sign In to Post</Link>
                )}
            </div>

            {/* ─── Tier Access Legend ─── */}
            <div style={{
                display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24, padding: "12px 16px",
                background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)",
                fontSize: "0.78rem", color: "var(--text-secondary)",
            }}>
                <span style={{ fontWeight: 700, color: "var(--text-primary)", marginRight: 4 }}>Forum Access:</span>
                <span>🥉 <strong>Free</strong> — Read all · Post in General & Help</span>
                <span style={{ color: "var(--text-tertiary)" }}>·</span>
                <span>🥇 <strong>Premium</strong> — + Openings, Endgame, Analysis, Coach Q&A</span>
                <span style={{ color: "var(--text-tertiary)" }}>·</span>
                <span>💎 <strong>Pro</strong> — + GM Lounge (all categories)</span>
            </div>

            {/* ─── Category Pills ─── */}
            <div className="category-pills" style={{ marginBottom: 24 }}>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.key}
                        className={`pill ${activeCategory === cat.key ? "active" : ""}`}
                        onClick={() => { setActiveCategory(cat.key); setShowCreate(false); }}
                        style={{ display: "flex", alignItems: "center", gap: 5 }}
                    >
                        {cat.icon} {cat.label}
                        {cat.badge && (
                            <span style={{
                                fontSize: "0.6rem", fontWeight: 800, padding: "1px 5px",
                                background: cat.badge === "Pro" ? "rgba(167,139,250,0.2)" : "rgba(212,168,67,0.2)",
                                color: cat.badge === "Pro" ? "#a78bfa" : "var(--brand-gold)",
                                borderRadius: 999, marginLeft: 2,
                            }}>{cat.badge}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* ─── Category Info Bar ─── */}
            <div style={{ marginBottom: 20, padding: "10px 16px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    {activeCatObj.icon} <strong>{activeCatObj.label}</strong> — {activeCatObj.description}
                </p>
                {userCanPost && !showCreate && (
                    <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>+ New Post</button>
                )}
            </div>

            {/* ─── Tier Gate (non-posting members) ─── */}
            {user && !userCanPost && <TierGate category={activeCatObj} user={user} />}
            {!user && activeCatObj.minTierToPost !== "free" && (
                <div style={{ marginBottom: 24, padding: "14px 20px", background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>🔒 Sign in with a Premium or Pro account to post here.</p>
                    <Link to="/auth" className="btn btn-primary btn-sm">Sign In</Link>
                </div>
            )}

            {/* ─── Create Post ─── */}
            {showCreate && userCanPost && (
                <div className="card animate-slide-up" style={{ marginBottom: 24 }}>
                    <h3 style={{ marginBottom: 16 }}>Create New Post in "{activeCatObj.label}"</h3>
                    <input className="input" placeholder="Post title..." value={title} onChange={(e) => setTitle(e.target.value)} style={{ marginBottom: 12 }} />
                    <textarea className="input" placeholder="Write your post..." value={content} onChange={(e) => setContent(e.target.value)} style={{ marginBottom: 12, minHeight: 100 }} />
                    <div style={{ display: "flex", gap: 12 }}>
                        <button className="btn btn-primary" onClick={createPost}>Publish</button>
                        <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* ─── Posts List ─── */}
            <div style={{ display: "grid", gap: 8 }}>
                {posts.map((post) => (
                    <Link key={post.id} to={`/forums/${post.id}`} className="card" style={{ padding: 16, textDecoration: "none", color: "inherit", display: "flex", gap: 16, alignItems: "flex-start" }}>
                        <div className="user-avatar sm" style={{ flexShrink: 0, marginTop: 4 }}>
                            {post.username?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                                {post.is_pinned && <span className="badge badge-gold">📌 Pinned</span>}
                                <span className="badge badge-blue">{post.category}</span>
                            </div>
                            <h3 style={{ fontSize: "0.95rem", marginBottom: 4 }}>{post.title}</h3>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {post.content}
                            </p>
                            <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                                <span>By {post.username}</span>
                                <span>👍 {post.likes}</span>
                                <span>💬 {post.comment_count}</span>
                                <span>👁 {post.views}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {posts.length === 0 && (
                <div style={{ textAlign: "center", padding: 48, color: "var(--text-tertiary)" }}>
                    <p style={{ fontSize: "2rem", marginBottom: 8 }}>💬</p>
                    <p>No posts in this category yet. Be the first!</p>
                </div>
            )}
        </div>
    );
}

export default Forums;
