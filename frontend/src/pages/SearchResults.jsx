import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { apiFetch } from "../api";
import { Stars, getCategoryEmoji } from "./Home";

function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (query) {
            setLoading(true);
            apiFetch(`/products/?search=${encodeURIComponent(query)}`)
                .then(setProducts)
                .catch(() => { })
                .finally(() => setLoading(false));
        }
    }, [query]);

    return (
        <div className="page animate-fade-in">
            <h1 style={{ marginBottom: 8 }}>Search Results</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 24 }}>
                {loading ? "Searching..." : `${products.length} results for "${query}"`}
            </p>

            {loading ? (
                <div className="grid-products">
                    {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 280 }} />)}
                </div>
            ) : products.length === 0 ? (
                <div style={{ textAlign: "center", padding: 48, color: "var(--text-tertiary)" }}>
                    <p style={{ fontSize: "3rem", marginBottom: 12 }}>🔍</p>
                    <p>No products found for "{query}"</p>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Browse All Products</Link>
                </div>
            ) : (
                <div className="grid-products">
                    {products.map((p) => (
                        <Link key={p.id} to={`/product/${p.id}`} className="card" style={{ padding: 0, overflow: "hidden", textDecoration: "none", color: "inherit" }}>
                            <div style={{ height: 140, background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
                                {getCategoryEmoji(p.category)}
                            </div>
                            <div style={{ padding: 16 }}>
                                <span className="badge badge-emerald" style={{ marginBottom: 6 }}>{p.category}</span>
                                <h4 style={{ fontSize: "0.88rem", marginBottom: 6 }}>{p.name}</h4>
                                <Stars rating={p.rating_avg} count={p.rating_count} />
                                <p style={{ fontWeight: 700, color: "var(--brand-gold)", marginTop: 8, fontSize: "1.1rem" }}>₹{p.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchResults;
