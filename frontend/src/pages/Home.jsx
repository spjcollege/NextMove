import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api";

const CATEGORIES = [
    { key: "", label: "All Products", icon: "♟" },
    { key: "boards", label: "Boards", icon: "♜" },
    { key: "pieces", label: "Pieces", icon: "♞" },
    { key: "clocks", label: "Clocks", icon: "⏱" },
    { key: "books", label: "Books", icon: "📖" },
    { key: "sets", label: "Sets", icon: "♛" },
    { key: "accessories", label: "Accessories", icon: "🎒" },
];

function Stars({ rating, count }) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (
        <span className="stars">
            {[...Array(5)].map((_, i) => (
                <span key={i} className={i < full ? "" : i === full && half ? "" : "empty"}>
                    {i < full ? "★" : i === full && half ? "★" : "☆"}
                </span>
            ))}
            {count !== undefined && <span style={{ color: "var(--text-tertiary)", marginLeft: 4, fontSize: "0.75rem" }}>({count})</span>}
        </span>
    );
}

function Home() {
    const [products, setProducts] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [news, setNews] = useState([]);
    const [activeCategory, setActiveCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const cat = searchParams.get("category") || "";
        setActiveCategory(cat);
        fetchProducts(cat);
        apiFetch("/products/featured").then(setFeatured).catch(() => { });
        apiFetch("/news/?category=").then((data) => setNews(data.slice(0, 3))).catch(() => { });
    }, [searchParams]);

    const fetchProducts = (cat) => {
        setLoading(true);
        const url = cat ? `/products/?category=${cat}` : "/products/";
        apiFetch(url)
            .then(setProducts)
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <section style={{
                background: "linear-gradient(135deg, #0A0A0F 0%, #1a1520 40%, #0d1117 100%)",
                padding: "80px 24px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", inset: 0,
                    background: "radial-gradient(circle at 50% 50%, rgba(212,168,67,0.06) 0%, transparent 60%)",
                }} />
                <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
                    <span style={{ fontSize: "3rem", display: "block", marginBottom: 16, filter: "drop-shadow(0 0 20px rgba(212,168,67,0.3))" }}>♔</span>
                    <h1 style={{ fontSize: "2.8rem", fontWeight: 900, marginBottom: 16, lineHeight: 1.1 }}>
                        Master Your <span style={{ background: "linear-gradient(135deg, var(--brand-gold), var(--brand-gold-light))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Chess Game</span>
                    </h1>
                    <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
                        Premium equipment, world-class courses, and a thriving community — all in one place.
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <Link to="/courses" className="btn btn-primary btn-lg">Start Learning</Link>
                        <a href="#shop" className="btn btn-outline btn-lg">Shop Collection</a>
                    </div>
                </div>

                {/* Quick Stats */}
                <div style={{
                    display: "flex", justifyContent: "center", gap: 48, marginTop: 56,
                    flexWrap: "wrap", position: "relative",
                }}>
                    {[
                        { label: "Products", value: "20+", icon: "♟" },
                        { label: "Courses", value: "6", icon: "📚" },
                        { label: "Puzzles", value: "10+", icon: "🧩" },
                        { label: "Community", value: "Active", icon: "👥" },
                    ].map((s) => (
                        <div key={s.label} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>{s.icon}</div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--brand-gold)" }}>{s.value}</div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured */}
            {featured.length > 0 && (
                <section className="page" style={{ paddingBottom: 0 }}>
                    <div className="section-header">
                        <h2>⭐ Featured Products</h2>
                        <Link to="/" className="btn btn-secondary btn-sm">View All</Link>
                    </div>
                    <div className="grid-products">
                        {featured.slice(0, 4).map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            )}

            {/* Shop */}
            <section className="page" id="shop">
                <div className="section-header">
                    <h2>♟ The NextMove Collection</h2>
                </div>

                {/* Category Pills */}
                <div className="category-pills">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.key}
                            to={cat.key ? `/?category=${cat.key}` : "/"}
                            className={`pill ${activeCategory === cat.key ? "active" : ""}`}
                        >
                            {cat.icon} {cat.label}
                        </Link>
                    ))}
                </div>

                {loading ? (
                    <div className="grid-products">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="skeleton" style={{ height: 320, borderRadius: "var(--radius-lg)" }} />
                        ))}
                    </div>
                ) : (
                    <div className="grid-products">
                        {products.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div style={{ textAlign: "center", padding: 48, color: "var(--text-tertiary)" }}>
                        <p style={{ fontSize: "2rem", marginBottom: 8 }}>♟</p>
                        <p>No products found in this category.</p>
                    </div>
                )}
            </section>

            {/* News Preview */}
            {news.length > 0 && (
                <section className="page" style={{ paddingTop: 0 }}>
                    <div className="section-header">
                        <h2>📰 Latest News</h2>
                        <Link to="/news" className="btn btn-secondary btn-sm">All Articles</Link>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
                        {news.map((article) => (
                            <div key={article.id} className="card" style={{ cursor: "default" }}>
                                <span className="badge badge-blue" style={{ marginBottom: 8 }}>{article.category}</span>
                                <h3 style={{ fontSize: "1.05rem", marginBottom: 8 }}>{article.title}</h3>
                                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{article.summary}</p>
                                <p style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", marginTop: 12 }}>
                                    By {article.author} · {new Date(article.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

function ProductCard({ product: p }) {
    const discount = p.original_price > p.price
        ? Math.round((1 - p.price / p.original_price) * 100)
        : 0;

    return (
        <Link to={`/product/${p.id}`} className="card" style={{
            padding: 0, overflow: "hidden", textDecoration: "none", color: "inherit",
            display: "flex", flexDirection: "column",
        }}>
            {/* Image placeholder */}
            <div style={{
                height: 180,
                background: `linear-gradient(135deg, ${stringToColor(p.name)} 0%, var(--bg-tertiary) 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2.5rem", position: "relative",
            }}>
                {getCategoryEmoji(p.category)}
                {discount > 0 && (
                    <span className="badge badge-red" style={{ position: "absolute", top: 10, right: 10 }}>
                        -{discount}%
                    </span>
                )}
                {p.is_featured && (
                    <span className="badge badge-gold" style={{ position: "absolute", top: 10, left: 10 }}>
                        ⭐ Featured
                    </span>
                )}
            </div>

            <div style={{ padding: "16px" }}>
                <span className="badge badge-emerald" style={{ marginBottom: 6 }}>{p.category}</span>
                <h4 style={{ fontSize: "0.9rem", marginBottom: 6, lineHeight: 1.3 }}>{p.name}</h4>

                <Stars rating={p.rating_avg} count={p.rating_count} />

                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
                    <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--brand-gold)" }}>₹{p.price}</span>
                    {p.original_price > p.price && (
                        <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", textDecoration: "line-through" }}>
                            ₹{p.original_price}
                        </span>
                    )}
                </div>

                {p.stock <= 5 && p.stock > 0 && (
                    <p style={{ fontSize: "0.7rem", color: "#EF4444", marginTop: 4 }}>Only {p.stock} left!</p>
                )}
            </div>
        </Link>
    );
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    const h = hash % 360;
    return `hsla(${h}, 30%, 15%, 1)`;
}

function getCategoryEmoji(cat) {
    const map = { boards: "♜", pieces: "♞", clocks: "⏱", books: "📖", sets: "♛", accessories: "🎒" };
    return map[cat] || "♟";
}

export default Home;
export { Stars, getCategoryEmoji };