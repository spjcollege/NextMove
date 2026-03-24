import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";
import { getUser, clearAuth, setAuth, apiFetch } from "./api";
import "./index.css";
import "./App.css";

// Pages
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Community from "./pages/Community";
import Forums from "./pages/Forums";
import ForumThread from "./pages/ForumThread";
import Puzzles from "./pages/Puzzles";
import Wishlist from "./pages/Wishlist";
import Leaderboard from "./pages/Leaderboard";
import News from "./pages/News";
import SearchResults from "./pages/SearchResults";

// ─── Auth Context ───
export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

// ─── Cart Context ───
export const CartContext = createContext(null);

// ─── Navbar Component ───
function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useContext(CartContext);
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { path: "/", label: "Shop", icon: "♟" },
    { path: "/courses", label: "Learn", icon: "📚" },
    { path: "/puzzles", label: "Puzzles", icon: "🧩" },
    { path: "/forums", label: "Forums", icon: "💬" },
    { path: "/community", label: "Community", icon: "👥" },
    { path: "/leaderboard", label: "Rankings", icon: "🏆" },
    { path: "/news", label: "News", icon: "📰" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span className="logo-icon">♔</span>
          <span className="logo-text">NextMove</span>
        </Link>

        {/* Search */}
        <form className="nav-search" onSubmit={handleSearch}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products, courses, players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>

        {/* Links */}
        <div className={`nav-links ${mobileNav ? "open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
              onClick={() => setMobileNav(false)}
            >
              <span className="nav-link-icon">{link.icon}</span>
              <span className="nav-link-label">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="nav-actions">
          <Link to="/wishlist" className="nav-action-btn" title="Wishlist">
            ♡
          </Link>

          <Link to="/cart" className="nav-action-btn cart-btn" title="Cart">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu-wrap">
              <button
                className="user-avatar-btn"
                onClick={() => setShowMenu(!showMenu)}
              >
                <div className="user-avatar">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
              </button>

              {showMenu && (
                <div className="user-dropdown animate-slide-up">
                  <div className="dropdown-header">
                    <div className="user-avatar sm">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="dropdown-name">{user.full_name || user.username}</p>
                      <p className="dropdown-tier">{user.subscription_tier} member</p>
                    </div>
                  </div>
                  <hr className="divider" style={{ margin: "8px 0" }} />
                  <Link to="/profile" className="dropdown-item" onClick={() => setShowMenu(false)}>
                    👤 Profile
                  </Link>
                  <Link to="/wishlist" className="dropdown-item" onClick={() => setShowMenu(false)}>
                    ♡ Wishlist
                  </Link>
                  <button
                    className="dropdown-item logout"
                    onClick={() => { logout(); setShowMenu(false); }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          )}

          <button
            className="mobile-toggle"
            onClick={() => setMobileNav(!mobileNav)}
          >
            {mobileNav ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Footer ───
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo-icon">♔</span>
          <span className="logo-text">NextMove</span>
          <p className="footer-tagline">Your complete chess ecosystem</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/?category=boards">Boards</Link>
            <Link to="/?category=pieces">Pieces</Link>
            <Link to="/?category=books">Books</Link>
          </div>
          <div className="footer-col">
            <h4>Learn</h4>
            <Link to="/courses">Courses</Link>
            <Link to="/puzzles">Puzzles</Link>
          </div>
          <div className="footer-col">
            <h4>Community</h4>
            <Link to="/forums">Forums</Link>
            <Link to="/leaderboard">Rankings</Link>
            <Link to="/news">News</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 NextMove Chess Platform. Built with ♟ for the chess community.</p>
      </div>
    </footer>
  );
}

// ─── App ───
function App() {
  const [user, setUser] = useState(getUser());
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const login = (token, userData) => {
    setAuth(token, userData);
    setUser(userData);
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    setCart([]);
    showToast("Logged out successfully", "info");
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    showToast(`${product.name} added to cart`);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => setCart([]);

  return (
    <AuthContext.Provider value={{ user, login, logout, showToast }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
        <BrowserRouter>
          <div className="app-layout">
            <Navbar />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/community" element={<Community />} />
                <Route path="/forums" element={<Forums />} />
                <Route path="/forums/:id" element={<ForumThread />} />
                <Route path="/puzzles" element={<Puzzles />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/news" element={<News />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/auth" element={<Auth />} />
              </Routes>
            </main>
            <Footer />
          </div>

          {/* Toast Notification */}
          {toast && (
            <div className={`toast toast-${toast.type}`}>
              {toast.type === "success" && "✅"}
              {toast.type === "error" && "❌"}
              {toast.type === "info" && "ℹ️"}
              {toast.message}
            </div>
          )}
        </BrowserRouter>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;