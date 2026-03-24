import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/orders").then((res) => {
      const userOrders = res.data.filter(
        (o) => o.userId === user?.id || o.username === user?.username
      );
      setOrders(userOrders);
    });
  }, []);

  const toggleOrder = (index) => {
    if (expandedOrder === index) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(index);
    }
  };

  // 🔥 CRM: Total spent calculation
  const totalSpent = orders.reduce((sum, order) => {
    return (
      sum +
      order.items.reduce(
        (s, item) => s + item.price * item.quantity,
        0
      )
    );
  }, 0);

  return (
    <div className="max-w-4xl mx-auto p-10">

      {/* 🔥 USER GREETING */}
      <h2 className="text-2xl font-bold mb-2">
        Hello, {user?.username}
      </h2>

      {/* 🔥 CRM INSIGHTS */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <p className="text-sm text-gray-600">
          Total Orders: <span className="font-semibold">{orders.length}</span>
        </p>
        <p className="text-sm text-gray-600">
          Total Spent: <span className="font-semibold">₹{totalSpent}</span>
        </p>
      </div>

      <h3 className="text-xl font-bold mb-6">
        Your Orders
      </h3>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map((order, index) => (

        <div
          key={index}
          className="bg-white shadow rounded mb-4 cursor-pointer"
          onClick={() => toggleOrder(index)}
        >

          {/* ORDER SUMMARY */}
          <div className="p-4 flex justify-between">

            <div>
              <p className="font-semibold">
                Order #{index + 1}
              </p>

              <p className="text-sm text-gray-500">
                {order.items.length} items
              </p>
            </div>

            <div className="text-green-600 font-semibold">
              ₹
              {order.items.reduce(
                (sum, item) =>
                  sum + item.price * item.quantity,
                0
              )}
            </div>

          </div>

          {/* ORDER DETAILS */}
          {expandedOrder === index && (
            <div className="border-t p-4">

              {order.items.map((item) => (

                <div
                  key={item.id}
                  className="flex justify-between py-2 border-b"
                >

                  <div>
                    <p>{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p>
                    ₹{item.price * item.quantity}
                  </p>

                </div>

              ))}

            </div>
          )}

        </div>
      ))}

    </div>
  );
}

export default Profile;