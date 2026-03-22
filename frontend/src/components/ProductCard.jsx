import { Link } from "react-router-dom";

function ProductCard({product}){

return(

<Link
to={`/product/${product.id}`}
className="bg-white rounded shadow hover:shadow-lg transition overflow-hidden"
>

<div className="relative">

<img
src={product.image}
className="w-full h-48 object-cover"
/>

<span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
{product.category}
</span>

</div>

<div className="p-4">

<h3 className="font-semibold">
{product.name}
</h3>

<p className="text-yellow-600 font-bold">
${product.price.toFixed(2)}
</p>

</div>

</Link>

)

}

export default ProductCard