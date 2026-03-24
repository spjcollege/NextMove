import { useNavigate } from "react-router-dom";
import { productMeta } from "../productMeta";

function Cart({ cart, removeFromCart, updateQuantity }) {
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6 grid md:grid-cols-3 gap-6">

      {/* LEFT */}
      <div className="md:col-span-2 bg-white p-6 rounded shadow">

        <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>

        {cart.map((item) => {
          const meta = productMeta[item.id];

          return (
            <div key={item.id} className="flex gap-4 border-b py-4">

              <img src={meta.image} className="w-28 h-24 object-cover" />

              <div className="flex-1">
                <p>{item.name}</p>

                <div className="flex gap-2 mt-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>

              <p>₹{item.price}</p>

            </div>
          );
        })}
      </div>

      {/* RIGHT */}
      <div className="bg-white p-6 rounded shadow">
        <h3>Total: ₹{total}</h3>

        <button
          onClick={() => navigate("/checkout")}
          className="bg-yellow-400 w-full mt-4 py-2"
        >
          Proceed to Buy
        </button>
      </div>
    </div>
  );
}

export default Cart;