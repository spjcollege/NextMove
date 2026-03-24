import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../api";
import { CartContext, useAuth } from "../App";
import { Stars, getCategoryEmoji } from "./Home";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const { addToCart } = useContext(CartContext);
  const { user, showToast } = useAuth();

  useEffect(() => {
    apiFetch(`/products/${id}`).then(setProduct).catch(() => { });
    apiFetch(`/reviews/product/${id}`).then(setReviews).catch(() => { });
    apiFetch(`/products/?category=`).then((all) => {
      setRelated(all.filter((p) => p.id !== parseInt(id)).slice(0, 4));
    }).catch(() => { });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await apiFetch(`/wishlist/${id}`, { method: "POST" });
      showToast("Added to wishlist ♡");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const submitReview = async () => {
    try {
      await apiFetch(`/reviews/product/${id}`, {
        method: "POST",
        body: JSON.stringify({ rating: reviewRating, text: reviewText }),
      });
      showToast("Review posted!");
      setReviewText("");
      apiFetch(`/reviews/product/${id}`).then(setReviews);
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  if (!product) {
    return (
      <div className="page">
        <div className="skeleton" style={{ height: 400, borderRadius: "var(--radius-lg)" }} />
      </div>
    );
  }

  const discount = product.original_price > product.price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  return (
    <div className="page animate-slide-up">
      {/* Breadcrumb */}
      <div style={{ display: "flex", gap: 8, fontSize: "0.8rem", color: "var(--text-tertiary)", marginBottom: 24 }}>
        <Link to="/" style={{ color: "var(--text-tertiary)" }}>Shop</Link>
        <span>/</span>
        <Link to={`/?category=${product.category}`} style={{ color: "var(--text-tertiary)", textTransform: "capitalize" }}>{product.category}</Link>
        <span>/</span>
        <span style={{ color: "var(--text-secondary)" }}>{product.name}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 48 }}>
        {/* Image */}
        <div style={{
          background: `linear-gradient(135deg, rgba(212,168,67,0.05) 0%, var(--bg-tertiary) 100%)`,
          borderRadius: "var(--radius-xl)", height: 400,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "5rem", border: "1px solid var(--border-subtle)",
        }}>
          {getCategoryEmoji(product.category)}
        </div>

        {/* Details */}
        <div>
          <span className="badge badge-emerald" style={{ marginBottom: 12 }}>{product.category}</span>
          <h1 style={{ fontSize: "1.8rem", marginBottom: 12 }}>{product.name}</h1>

          <Stars rating={product.rating_avg} count={product.rating_count} />

          <div style={{ display: "flex", alignItems: "baseline", gap: 12, margin: "16px 0" }}>
            <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--brand-gold)" }}>₹{product.price}</span>
            {product.original_price > product.price && (
              <>
                <span style={{ fontSize: "1.1rem", color: "var(--text-tertiary)", textDecoration: "line-through" }}>₹{product.original_price}</span>
                <span className="badge badge-red">-{discount}% OFF</span>
              </>
            )}
          </div>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 20 }}>
            {product.description}
          </p>

          <p style={{ fontSize: "0.85rem", color: product.stock > 5 ? "var(--brand-emerald)" : "#EF4444", marginBottom: 20 }}>
            {product.stock > 0 ? `${product.stock > 5 ? "✓ In Stock" : `Only ${product.stock} left!`}` : "✗ Out of Stock"}
          </p>

          {/* Quantity + Add to Cart */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)" }}>
              <button className="btn btn-sm" style={{ borderRadius: "var(--radius-md) 0 0 var(--radius-md)" }} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span style={{ padding: "0 16px", fontWeight: 600 }}>{qty}</span>
              <button className="btn btn-sm" style={{ borderRadius: "0 var(--radius-md) var(--radius-md) 0" }} onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleAddToCart} disabled={product.stock === 0}>
              🛒 Add to Cart
            </button>
            {user && (
              <button className="btn btn-outline" onClick={handleAddToWishlist}>♡</button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section>
        <h2 style={{ marginBottom: 20 }}>Customer Reviews ({reviews.length})</h2>

        {user && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h4 style={{ marginBottom: 12 }}>Write a Review</h4>
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setReviewRating(n)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.4rem", color: n <= reviewRating ? "var(--brand-gold)" : "var(--text-tertiary)" }}>
                  ★
                </button>
              ))}
            </div>
            <textarea className="input" placeholder="Share your experience..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} style={{ marginBottom: 12 }} />
            <button className="btn btn-primary" onClick={submitReview}>Submit Review</button>
          </div>
        )}

        {reviews.length === 0 && <p style={{ color: "var(--text-tertiary)" }}>No reviews yet. Be the first!</p>}
        {reviews.map((r) => (
          <div key={r.id} className="card" style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="user-avatar sm">{r.username?.charAt(0).toUpperCase()}</div>
                <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{r.username}</span>
              </div>
              <Stars rating={r.rating} />
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{r.text}</p>
            <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginTop: 8 }}>{new Date(r.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <h2 style={{ marginBottom: 20 }}>You May Also Like</h2>
          <div className="grid-products">
            {related.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="card" style={{ padding: 0, overflow: "hidden", textDecoration: "none", color: "inherit" }}>
                <div style={{ height: 120, background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
                  {getCategoryEmoji(p.category)}
                </div>
                <div style={{ padding: 12 }}>
                  <h4 style={{ fontSize: "0.82rem", marginBottom: 4 }}>{p.name}</h4>
                  <span style={{ fontWeight: 700, color: "var(--brand-gold)" }}>₹{p.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetail;