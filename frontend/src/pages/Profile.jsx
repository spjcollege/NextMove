import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // 🔥 NEW: COURSES STATE
  const [myCourses, setMyCourses] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    // 🔥 FETCH ORDERS
    axios.get("http://127.0.0.1:8000/orders").then((res) => {
      const userOrders = res.data.filter(
        (o) => o.user === user?.email
      );
      setOrders(userOrders);
    });

    // 🔥 FETCH COURSES (SUBSCRIPTIONS)
    axios
      .get(`http://127.0.0.1:8000/courses/user/${user.email}`)
      .then((res) => setMyCourses(res.data));

  }, []);

  const toggleOrder = (index) => {
    if (expandedOrder === index) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(index);
    }
  };

  // 🔥 CRM: Total spent
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
        Hello, {user?.name}
      </h2>

      {/* 🔥 CRM INSIGHTS */}
      <div className="bg-white shadow rounded p-4 mb-6">

        <p className="text-sm text-gray-600">
          Total Orders:{" "}
          <span className="font-semibold">
            {orders.length}
          </span>
        </p>

        <p className="text-sm text-gray-600">
          Total Spent:{" "}
          <span className="font-semibold">
            ₹{totalSpent}
          </span>
        </p>

        {/* 🔥 NEW: COURSE INSIGHT */}
        <p className="text-sm text-gray-600">
          Subscribed Courses:{" "}
          <span className="font-semibold">
            {myCourses.length}
          </span>
        </p>

      </div>

      {/* 🛒 ORDERS */}
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
                    <p>{item.name || `Product ${item.id}`}</p>

                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p>
                    ₹{item.price * item.quantity || 0}
                  </p>

                </div>

              ))}

            </div>
          )}

        </div>
      ))}

      {/* 📚 COURSES SECTION */}
      <h3 className="text-xl font-bold mt-10 mb-4">
        My Courses
      </h3>

      {myCourses.length === 0 && (
        <p className="text-gray-500">
          No subscriptions yet
        </p>
      )}

      {myCourses.map((course) => (

        <div
          key={course.id}
          className="bg-blue-50 border rounded p-4 mb-3"
        >

          <h4 className="font-bold text-lg">
            {course.title}
          </h4>

          <p className="text-sm">
            Duration: {course.duration}
          </p>

          <p className="text-sm">
            Price: ₹{course.price}
          </p>

          <div className="text-sm mt-2">
            <strong>Topics:</strong>

            <ul className="ml-4">
              {course.content.map((c, i) => (
                <li key={i}>• {c}</li>
              ))}
            </ul>
          </div>

        </div>

      ))}

    </div>
  );
}

export default Profile;