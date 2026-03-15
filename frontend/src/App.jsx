import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";

function App() {

  const [cart, setCart] = useState([]);

  const addToCart = (product) => {

    const user = localStorage.getItem("user");

    if (!user) {
      alert("Please login first");
      return;
    }

    setCart([...cart, product]);
  };

  return (

    <div>

      <nav className="flex justify-between px-10 py-4 bg-black border-b border-gray-700">

        <h1 className="text-3xl text-yellow-400 font-bold">
          NextMove
        </h1>

        <div className="flex gap-6">

          <Link to="/">Products</Link>
          <Link to="/cart">Cart ({cart.length})</Link>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
          <Link to="/profile">Profile</Link>

        </div>

      </nav>

      <div className="p-10">

        <Routes>

          <Route
            path="/"
            element={<ProductList addToCart={addToCart} />}
          />

          <Route
            path="/cart"
            element={<Cart cart={cart} />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Routes>

      </div>

    </div>

  );
}

export default App;