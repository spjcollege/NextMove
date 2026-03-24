import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";
import { useAuth } from "../App";

function Forums() {
    const [posts, setPosts] = useState([]);
    const [activeCategory, setActiveCategory] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("general");
    const { user, showToast } = useAuth();

    useEffect(() => { fetchPosts(); }, [activeCategory]);

    const fetchPosts = () => {
        const url = activeCategory ? `/forums/?category=${activeCategory}` : "/forums/";
        apiFetch(url).then(setPosts).catch(() => { });
    };

    const createPost = async () => {
        if (!title.trim() || !content.trim()) return;
        try {
            await apiFetch("/forums/", {
                method: "POST",
                body: JSON.stringify({ title, content, category }),
            });
            showToast("Post created! 📝");
            setTitle(""); setContent(""); setShowCreate(false);
            fetchPosts();
        } catch (e) { showToast(e.message, "error"); }
    };

    const categories = ["", "general", "openings", "endgame", "tournament", "analysis"];

    return (
        <div className="page animate-fade-in">
            <div className="section-header">
                <h1>💬 Forums</h1>
                {user && (
                    <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
                        + New Post
                    </button>
                )}
            </div>

            {/* Create Post */}
            {showCreate && (
                <div className="card animate-slide-up" style={{ marginBottom: 24 }}>
                    <h3 style={{ marginBottom: 16 }}>Create New Post</h3>
                    <input className="input" placeholder="Post title..." value={title} onChange={(e) => setTitle(e.target.value)} style={{ marginBottom: 12 }} />
                    <textarea className="input" placeholder="Write your post..." value={content} onChange={(e) => setContent(e.target.value)} style={{ marginBottom: 12, minHeight: 100 }} />
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: 160 }}>
                            <option value="general">General</option>
                            <option value="openings">Openings</option>
                            <option value="endgame">Endgame</option>
                            <option value="tournament">Tournament</option>
                            <option value="analysis">Analysis</option>
                        </select>
                        <button className="btn btn-primary" onClick={createPost}>Post</button>
                        <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Category Filter */}
            <div className="category-pills">
                {categories.map((c) => (
                    <button key={c} className={`pill ${activeCategory === c ? "active" : ""}`} onClick={() => setActiveCategory(c)}>
                        {c || "All"}
                    </button>
                ))}
            </div>

            {/* Posts */}
            <div style={{ display: "grid", gap: 8 }}>
                {posts.map((post) => (
                    <Link key={post.id} to={`/forums/${post.id}`} className="card" style={{
                        padding: 16, textDecoration: "none", color: "inherit",
                        display: "flex", gap: 16, alignItems: "flex-start",
                    }}>
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
                    <p>No forum posts yet. Start a discussion!</p>
                </div>
            )}
        </div>
    );
}

export default Forums;
