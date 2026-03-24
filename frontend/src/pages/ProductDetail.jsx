import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { productMeta } from "../productMeta";

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) {
    return <p className="p-10">Loading...</p>;
  }

  const meta = productMeta[product.id];

  return (
    <div className="max-w-6xl mx-auto p-10 grid md:grid-cols-2 gap-10">
      
      {/* LEFT: PRODUCT IMAGE */}
      <div>
        <img
          src={meta?.image}
          alt={product.name}
          className="rounded-lg shadow w-full"
        />
      </div>

      {/* RIGHT: PRODUCT DETAILS */}
      <div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-3">
          {product.name}
        </h1>

        {/* PRICE */}
        <p className="text-yellow-600 text-xl mb-4">
          ₹{product.price}
        </p>

        {/* MARKETING TAG */}
        <span className="inline-block bg-black text-white text-xs px-2 py-1 mb-4">
          Premium Quality
        </span>

        {/* DESCRIPTION */}
        <p className="text-gray-600 mb-6">
          Premium chess equipment crafted for serious players and enthusiasts.
        </p>

        {/* SCM: STOCK STATUS */}
        <p className="mb-3 text-sm">
          <strong>Stock Available:</strong> {product.stock}
        </p>

        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-red-500 mb-4">
            Hurry! Only few items left
          </p>
        )}

        {product.stock === 0 && (
          <p className="text-red-600 mb-4 font-semibold">
            Out of Stock
          </p>
        )}

        {/* ADD TO CART BUTTON */}
        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className={`px-6 py-2 rounded transition ${
            product.stock === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-600 text-white hover:bg-yellow-700"
          }`}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>

        {/* PRODUCT INFO BOX */}
        <div className="mt-6 border rounded">
          <p className="p-3 border-b">
            <strong>Category:</strong> {meta?.category}
          </p>

          <p className="p-3">
            <strong>Product ID:</strong> {product.id}
          </p>
        </div>

        {/* TRUST BADGES */}
        <div className="mt-6 text-sm text-gray-500">
          <p>✔ Secure Checkout</p>
          <p>✔ 30 Day Returns</p>
          <p>✔ Premium Quality Assured</p>
        </div>

      </div>

    </div>
  );
}

export default ProductDetail;