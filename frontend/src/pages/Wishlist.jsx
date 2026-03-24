import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";
import { useAuth } from "../App";

function Wishlist() {
    const [items, setItems] = useState([]);
    const { user, showToast } = useAuth();

    useEffect(() => {
        if (user) apiFetch("/wishlist/").then(setItems).catch(() => { });
    }, [user]);

    const removeItem = async (productId) => {
        try {
            await apiFetch(`/wishlist/${productId}`, { method: "DELETE" });
            setItems(items.filter((i) => i.product_id !== productId));
            showToast("Removed from wishlist");
        } catch (e) { showToast(e.message, "error"); }
    };

    if (!user) {
        return (
            <div className="page" style={{ textAlign: "center", padding: "80px 24px" }}>
                <p style={{ fontSize: "3rem", marginBottom: 16 }}>♡</p>
                <h2>Sign in to view your wishlist</h2>
                <Link to="/auth" className="btn btn-primary btn-lg" style={{ marginTop: 20 }}>Sign In</Link>
            </div>
        );
    }

    return (
        <div className="page animate-fade-in">
            <h1 style={{ marginBottom: 24 }}>♡ My Wishlist ({items.length})</h1>
            {items.length === 0 ? (
                <div style={{ textAlign: "center", padding: 48, color: "var(--text-tertiary)" }}>
                    <p style={{ fontSize: "3rem", marginBottom: 12 }}>♡</p>
                    <p>Your wishlist is empty</p>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Products</Link>
                </div>
            ) : (
                <div className="grid-products">
                    {items.map((item) => (
                        <div key={item.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                            <Link to={`/product/${item.product_id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <div style={{ height: 140, background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>♟</div>
                                <div style={{ padding: 16 }}>
                                    <h4 style={{ fontSize: "0.9rem", marginBottom: 6 }}>{item.name}</h4>
                                    <span style={{ fontWeight: 700, color: "var(--brand-gold)", fontSize: "1.1rem" }}>₹{item.price}</span>
                                    {item.stock > 0 ? (
                                        <p style={{ fontSize: "0.72rem", color: "var(--brand-emerald)", marginTop: 4 }}>In Stock</p>
                                    ) : (
                                        <p style={{ fontSize: "0.72rem", color: "#EF4444", marginTop: 4 }}>Out of Stock</p>
                                    )}
                                </div>
                            </Link>
                            <div style={{ padding: "0 16px 16px" }}>
                                <button className="btn btn-danger btn-sm" style={{ width: "100%" }} onClick={() => removeItem(item.product_id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Wishlist;
