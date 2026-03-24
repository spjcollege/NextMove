import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../api";
import { useAuth } from "../App";

function ForumThread() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState("");
    const { user, showToast } = useAuth();

    useEffect(() => { fetchPost(); }, [id]);

    const fetchPost = () => {
        apiFetch(`/forums/${id}`).then(setPost).catch(() => { });
    };

    const addComment = async () => {
        if (!comment.trim()) return;
        try {
            await apiFetch(`/forums/${id}/comment`, {
                method: "POST",
                body: JSON.stringify({ content: comment }),
            });
            setComment("");
            fetchPost();
            showToast("Comment added!");
        } catch (e) { showToast(e.message, "error"); }
    };

    const likePost = async () => {
        try {
            await apiFetch(`/forums/${id}/like`, { method: "POST" });
            fetchPost();
        } catch (e) { showToast(e.message, "error"); }
    };

    if (!post) return <div className="page"><div className="skeleton" style={{ height: 300 }} /></div>;

    return (
        <div className="page animate-fade-in" style={{ maxWidth: 800, margin: "0 auto" }}>
            <Link to="/forums" style={{ fontSize: "0.82rem", color: "var(--text-tertiary)" }}>← Back to Forums</Link>

            {/* Post */}
            <div className="card" style={{ marginTop: 16, marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <span className="badge badge-blue">{post.category}</span>
                    {post.is_pinned && <span className="badge badge-gold">📌 Pinned</span>}
                </div>
                <h1 style={{ fontSize: "1.5rem", marginBottom: 12 }}>{post.title}</h1>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{post.content}</p>

                <div style={{ display: "flex", gap: 16, marginTop: 20, alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="user-avatar sm">{post.username?.charAt(0).toUpperCase()}</div>
                        <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>{post.username}</span>
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                        {new Date(post.created_at).toLocaleString()}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>👁 {post.views}</span>
                    {user && (
                        <button className="btn btn-outline btn-sm" onClick={likePost}>👍 {post.likes}</button>
                    )}
                </div>
            </div>

            {/* Comments */}
            <h3 style={{ marginBottom: 16 }}>💬 Comments ({post.comments?.length || 0})</h3>

            {user && (
                <div className="card" style={{ display: "flex", gap: 12, marginBottom: 20, padding: 16 }}>
                    <div className="user-avatar sm">{user.username?.charAt(0).toUpperCase()}</div>
                    <input className="input" placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addComment()} style={{ flex: 1 }} />
                    <button className="btn btn-primary" onClick={addComment}>Reply</button>
                </div>
            )}

            <div style={{ display: "grid", gap: 8 }}>
                {post.comments?.map((c) => (
                    <div key={c.id} className="card" style={{ padding: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                            <div className="user-avatar sm">{c.username?.charAt(0).toUpperCase()}</div>
                            <span style={{ fontWeight: 600, fontSize: "0.82rem" }}>{c.username}</span>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>{new Date(c.created_at).toLocaleString()}</span>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", paddingLeft: 38 }}>{c.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ForumThread;
