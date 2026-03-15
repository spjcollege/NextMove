import { useEffect, useState } from "react";
import axios from "axios";

function ProductList({ addToCart }) {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    axios
      .get("http://127.0.0.1:8000/products")
      .then(res => setProducts(res.data));

  }, []);

  return (

    <div>

      <h2 className="text-2xl mb-6">Products</h2>

      <div className="grid grid-cols-3 gap-6">

        {products.map(product => (

          <div
            key={product.id}
            className="bg-gray-900 p-6 rounded border border-gray-700"
          >

            <h3 className="text-xl">{product.name}</h3>

            <p className="text-yellow-400 mt-2">
              ₹{product.price}
            </p>

            <button
              onClick={() => addToCart(product)}
              className="mt-4 bg-yellow-500 px-4 py-2 rounded text-black"
            >
              Add to Cart
            </button>

          </div>

        ))}

      </div>

    </div>

  );
}

export default ProductList;