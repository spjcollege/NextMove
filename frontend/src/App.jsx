import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";

// 🔥 ADD THESE (IMPORTANT)
import Courses from "./pages/Courses";
import Community from "./pages/Community";

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { id: product.id, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, qty) => {
    if (qty <= 0) return;

    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-100">

        {/* NAVBAR */}
        <nav className="flex justify-between px-10 py-4 bg-white shadow items-center">

          <Link to="/">
            <h1 className="font-bold text-lg cursor-pointer">
              NextMove Chess Store
            </h1>
          </Link>

          <div className="flex gap-6 items-center">

            <Link to="/">Shop</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/community">Community</Link>

            <Link to="/cart">
              Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
            </Link>

            {user ? (
              <div className="relative">

                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center cursor-pointer"
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded p-2">

                    <p className="text-sm px-2 py-1">
                      {user.name}
                    </p>

                    <Link to="/profile" className="block px-2 py-1">
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-2 py-1 text-red-500"
                    >
                      Logout
                    </button>

                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth">Login</Link>
            )}

          </div>

        </nav>

        {/* ROUTES */}
        <main className="flex-1">
          <Routes>

            <Route path="/" element={<Home />} />

            <Route
              path="/product/:id"
              element={<ProductDetail addToCart={addToCart} />}
            />

            <Route
              path="/cart"
              element={
                <Cart
                  cart={cart}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
              }
            />

            <Route
              path="/checkout"
              element={
                <Checkout cart={cart} setCart={setCart} />
              }
            />

            <Route path="/courses" element={<Courses />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />

          </Routes>
        </main>

        {/* FOOTER */}
        <footer className="bg-black text-white text-center p-4">
          © 2026 NextMove Chess Store
        </footer>

      </div>
    </BrowserRouter>
  );
}

export default App;