import axios from "axios";
import { useNavigate } from "react-router-dom";

function Checkout({ cart, setCart }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const placeOrder = async () => {
    // LOGIN CHECK
    if (!user) {
      alert("Please login first");
      navigate("/auth");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/orders/place",
        {
          user: user.email,
          items: cart
        }
      );

      if (res.data.error) {
        alert(res.data.error);
        return;
      }

      alert("Order placed successfully!");

      // Clear cart
      setCart([]);
      localStorage.removeItem("cart");

      navigate("/profile");

    } catch (err) {
      alert("Something went wrong");
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-10">

      <h2 className="text-2xl font-bold mb-6">
        Checkout
      </h2>

      {/* ORDER SUMMARY */}
      <div className="bg-white p-6 rounded shadow mb-6">

        <h3 className="text-lg font-semibold mb-4">
          Order Summary
        </h3>

        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b py-2"
          >
            <span>
              {item.name} × {item.quantity}
            </span>

            <span>
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}

        <h3 className="text-xl font-bold mt-4">
          Total: ₹{total}
        </h3>

      </div>

      {/* PLACE ORDER BUTTON */}
      <button
        onClick={placeOrder}
        className="bg-green-500 text-white px-6 py-3 rounded w-full"
      >
        Place Order
      </button>

    </div>
  );
}

export default Checkout;