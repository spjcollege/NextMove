import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";
import { getUser, clearAuth, setAuth, apiFetch } from "./api";
import "./index.css";
import "./App.css";

// Pages
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
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
import AdminDashboard from "./pages/AdminDashboard";
import LegalInfo from "./pages/LegalInfo";
import Competitions from "./pages/Competitions";
import Marketing from "./pages/Marketing";
import MarketingDetail from "./pages/MarketingDetail";
import PromotionLanding from "./pages/PromotionLanding";
import TournamentLanding from "./pages/TournamentLanding";
import Support from "./pages/Support";
import Loyalty from "./pages/Loyalty";
import AdSideBar from "./components/AdSideBar";
import OrderTracking from "./pages/OrderTracking";

// ─── Auth Context ───
export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

// ─── Cart Context ───
export const CartContext = createContext(null);

// ─── TopBar — minimal header ───
function TopBar({ onHamburger }) {
  const { user, logout, theme, toggleTheme } = useAuth();
  const { cart } = useContext(CartContext);
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="topbar">
      {/* Hamburger — mobile only */}
      <button className="topbar-hamburger" onClick={onHamburger} aria-label="Open menu">☰</button>

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

      <div className="topbar-spacer" />

      {/* Actions */}
      <div className="nav-actions">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <Link to="/wishlist" className="nav-action-btn" title="Wishlist">♡</Link>
        <Link to="/cart" className="nav-action-btn" title="Cart" style={{ position: "relative" }}>
          🛒{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        {user ? (
          <div className="user-menu-wrap">
            <button className="user-avatar-btn" onClick={() => setShowMenu(!showMenu)}>
              <div className="user-avatar">{user.username?.charAt(0).toUpperCase()}</div>
            </button>
            {showMenu && (
              <div className="user-dropdown animate-slide-up">
                <div className="dropdown-header">
                  <div className="user-avatar sm">{user.username?.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="dropdown-name">{user.full_name || user.username}</p>
                    <p className="dropdown-tier">{user.subscription_tier} member</p>
                  </div>
                </div>
                <hr className="divider" />
                <Link to="/profile" className="dropdown-item" onClick={() => setShowMenu(false)}>👤 Profile</Link>
                <Link to="/loyalty" className="dropdown-item" onClick={() => setShowMenu(false)}>🏅 My Points</Link>
                {user.is_admin && (
                  <>
                    <Link to="/admin/dashboard" className="dropdown-item" onClick={() => setShowMenu(false)}>📊 Dashboard</Link>
                    <Link to="/admin/marketing" className="dropdown-item" onClick={() => setShowMenu(false)}>📢 Marketing</Link>
                  </>
                )}
                <button className="dropdown-item logout" onClick={() => { logout(); setShowMenu(false); }}>🚪 Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/auth" className="btn btn-primary btn-sm">Sign In</Link>
        )}
      </div>
    </header>
  );
}

// ─── LeftSidebar — all navigation ───
function LeftSidebar({ open, onClose }) {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const mainLinks = [
    { path: "/", label: "Shop", icon: "♟" },
    { path: "/courses", label: "Learn", icon: "📚" },
    { path: "/puzzles", label: "Daily Puzzles", icon: "🧩" },
    { path: "/competitions", label: "Competitions", icon: "🎌" },
    { path: "/news", label: "News", icon: "📰" },
  ];

  const communityLinks = [
    { path: "/forums", label: "Forums", icon: "💬" },
    { path: "/community", label: "Community", icon: "👥" },
    { path: "/leaderboard", label: "Rankings", icon: "🏆" },
    { path: "/loyalty", label: "Loyalty Points", icon: "🏅", badge: "New", badgeStyle: "sidebar-badge-gold" },
  ];

  const utilLinks = [
    { path: "/support", label: "Support", icon: "🎧" },
    { path: "/legal", label: "Privacy Policy", icon: "🔒" },
  ];

  const adminLinks = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/marketing", label: "Marketing", icon: "📢" },
  ];

  const renderLink = (link) => (
    <Link
      key={link.path}
      to={link.path}
      className={`sidebar-link ${isActive(link.path) ? "active" : ""}`}
      onClick={onClose}
    >
      <span className="sidebar-link-icon">{link.icon}</span>
      {link.label}
      {link.badge && (
        <span className={`sidebar-badge ${link.badgeStyle || "sidebar-badge-gold"}`}>{link.badge}</span>
      )}
    </Link>
  );

  return (
    <>
      {/* Mobile overlay */}
      <div className={`sidebar-overlay ${open ? "open" : ""}`} onClick={onClose} />

      <aside className={`left-sidebar ${open ? "open" : ""}`}>
        <span className="sidebar-label">Discover</span>
        {mainLinks.map(renderLink)}

        <hr className="sidebar-divider" />
        <span className="sidebar-label">Community</span>
        {communityLinks.map(renderLink)}

        <hr className="sidebar-divider" />
        <span className="sidebar-label">More</span>
        {utilLinks.map(renderLink)}

        {user?.is_admin && (
          <>
            <hr className="sidebar-divider" />
            <span className="sidebar-label">Admin</span>
            {adminLinks.map(renderLink)}
          </>
        )}
      </aside>
    </>
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
          </div>
          <div className="footer-col">
            <h4>Community</h4>
            <Link to="/forums">Forums</Link>
            <Link to="/loyalty">Loyalty Program</Link>
            <Link to="/support">Support</Link>
            <Link to="/legal">Privacy Policy</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 NextMove Chess Platform. Built with ♟</p>
      </div>
    </footer>
  );
}

// ─── Main Content Wrapper ───
function AppContent() {
  const { theme, showToast, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [toast, setToast] = useState(null);

  // Note: Local toast handling if needed, or use context-based one.
  // The original App had a showToast function that set toast state.
  
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      <TopBar onHamburger={() => setSidebarOpen((o) => !o)} />
      <LeftSidebar open={sidebarOpen} onClose={closeSidebar} />

      <div className="app-body">
        <main className="app-main">
          <div key={location.pathname} className="animate-page-transition">
            <Routes location={location}>
              <Route path="/" element={user ? <Home /> : <LandingPage />} />
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
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/marketing" element={<Marketing />} />
              <Route path="/admin/marketing/:type/:id" element={<MarketingDetail />} />
              <Route path="/loyalty" element={<Loyalty />} />
              <Route path="/promotion/:id" element={<PromotionLanding />} />
              <Route path="/tournament/:id" element={<TournamentLanding />} />
              <Route path="/support" element={<Support />} />
              <Route path="/legal" element={<LegalInfo />} />
              <Route path="/competitions" element={<Competitions />} />
              <Route path="/orders/:id" element={<OrderTracking />} />
            </Routes>
          </div>
          <Footer />
        </main>
        <AdSideBar />
      </div>
    </div>
  );
}


// ─── App Root ───
function App() {
  const [user, setUser] = useState(getUser());
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

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
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    showToast(`${product.name} added to cart`);
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

  const updateQuantity = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));
  };

  const clearCart = () => setCart([]);

  return (
    <AuthContext.Provider value={{ user, login, logout, showToast, theme, toggleTheme }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
        <BrowserRouter>
          <AppContent />
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