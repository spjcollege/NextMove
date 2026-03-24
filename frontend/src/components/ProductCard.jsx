import { Link } from "react-router-dom";
import { productMeta } from "../productMeta";

function ProductCard({ product }) {
  const meta = productMeta[product.id];

  return (
    <Link to={`/product/${product.id}`}>

      <div className="bg-white rounded shadow hover:scale-105 transition p-4">

        <img
          src={meta.image}
          className="w-full h-40 object-cover"
        />

        {/* UNIQUE FEATURE */}
        <span className="text-xs bg-black text-white px-2 py-1 mt-2 inline-block">
          Premium
        </span>

        <h3 className="mt-2">{product.name}</h3>

        <p className="text-yellow-600">
          ₹{product.price}
        </p>

      </div>

    </Link>
  );
}

export default ProductCard;