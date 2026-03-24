import { useEffect, useState } from "react";
import { apiFetch } from "../api";

function News() {
    const [articles, setArticles] = useState([]);
    const [activeCategory, setActiveCategory] = useState("");
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        const url = activeCategory ? `/news/?category=${activeCategory}` : "/news/";
        apiFetch(url).then(setArticles).catch(() => { });
    }, [activeCategory]);

    const categories = ["", "news", "tutorial", "tournament", "update"];

    return (
        <div className="page animate-fade-in" style={{ maxWidth: 800, margin: "0 auto" }}>
            <h1 style={{ marginBottom: 8 }}>📰 Chess News & Articles</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 24 }}>
                Stay updated with the latest from the chess world
            </p>

            <div className="category-pills">
                {categories.map((c) => (
                    <button key={c} className={`pill ${activeCategory === c ? "active" : ""}`} onClick={() => setActiveCategory(c)}>
                        {c || "All"}
                    </button>
                ))}
            </div>

            <div style={{ display: "grid", gap: 16 }}>
                {articles.map((article) => (
                    <div key={article.id} className="card" style={{ cursor: "pointer" }} onClick={() => setExpanded(expanded === article.id ? null : article.id)}>
                        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                            <span className="badge badge-blue">{article.category}</span>
                        </div>
                        <h3 style={{ fontSize: "1.1rem", marginBottom: 8 }}>{article.title}</h3>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                            {expanded === article.id ? article.content : article.summary}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                            <span>By {article.author}</span>
                            <span>{new Date(article.created_at).toLocaleDateString()}</span>
                        </div>
                        {expanded !== article.id && (
                            <p style={{ fontSize: "0.78rem", color: "var(--brand-gold)", marginTop: 8 }}>Click to read more →</p>
                        )}
                    </div>
                ))}
            </div>

            {articles.length === 0 && (
                <div style={{ textAlign: "center", padding: 48, color: "var(--text-tertiary)" }}>
                    <p style={{ fontSize: "2rem", marginBottom: 8 }}>📰</p>
                    <p>No articles found.</p>
                </div>
            )}
        </div>
    );
}

export default News;
