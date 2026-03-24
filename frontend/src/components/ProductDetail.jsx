import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { productMeta } from "../productMeta";
import { useNotification } from "../hooks/useNotification";

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // 🔥 Track count for alert
  const [addedCount, setAddedCount] = useState(0);
  const [recommended, setRecommended] = useState([]);

  // 🔥 CRM TRACK FUNCTION
  const track = async (action, productData) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !productData) return;

    await fetch("http://127.0.0.1:8000/users/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.email,
        action,
        productId: productData.id,
        price: productData.price,
      }),
    });
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        track("view", data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    fetch(`http://127.0.0.1:8000/products/recommend/${user.email}`)
      .then((res) => res.json())
      .then((data) => setRecommended(data));
  }, []);

  if (!product) {
    return <p className="p-10">Loading...</p>;
  }

  const meta = productMeta[product.id];

  const handleAddToCart = () => {
    addToCart(product);

    const newCount = addedCount + 1;
    setAddedCount(newCount);

    // ✅ SIMPLE ALERT
    alert(`Added ${product.id} x${newCount}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-10 grid md:grid-cols-2 gap-10">
      <div>
        <img
          src={meta?.image}
          alt={product.name}
          className="rounded-lg shadow w-full"
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

        <p className="text-yellow-600 text-xl mb-4">
          ₹{product.price}
        </p>

        <p className="mb-3 text-sm">
          <strong>Stock Available:</strong> {product.stock}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="px-6 py-2 bg-yellow-600 text-white rounded"
        >
          Add to Cart
        </button>

        {/* 🔥 RECOMMENDATIONS */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-3">Recommended</h2>

          {recommended.map((p) => (
            <div key={p.id} className="border p-2 mb-2">
              {p.name} — ₹{p.price}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;