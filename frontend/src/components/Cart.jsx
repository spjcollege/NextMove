import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart({ cart, removeFromCart, updateQuantity }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await Promise.all(
        cart.map(async (item) => {
          const res = await fetch(
            `http://127.0.0.1:8000/products/${item.id}`
          );
          const product = await res.json();

          return {
            ...product,
            quantity: item.quantity,
          };
        })
      );

      setProducts(data);
    };

    if (cart.length > 0) fetchProducts();
    else setProducts([]);
  }, [cart]);

  const total = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-10">
      <h2 className="text-2xl mb-6">Cart</h2>

      {cart.length === 0 && <p>No items in cart</p>}

      {products.map((item) => (
        <div key={item.id} className="border-b py-4">

          <p className="font-semibold">{item.name}</p>

          <p>₹{item.price}</p>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() =>
                updateQuantity(item.id, item.quantity - 1)
              }
              className="px-2 bg-gray-300"
            >
              -
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() =>
                updateQuantity(item.id, item.quantity + 1)
              }
              className="px-2 bg-gray-300"
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-500 mt-2"
          >
            Remove
          </button>

        </div>
      ))}

      {cart.length > 0 && (
        <>
          <p className="mt-6 font-bold text-lg">
            Total: ₹{total}
          </p>

          <Link
            to="/checkout"
            className="bg-green-500 px-4 py-2 rounded mt-4 inline-block"
          >
            Checkout
          </Link>
        </>
      )}
    </div>
  );
}

export default Cart;