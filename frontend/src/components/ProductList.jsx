import { useEffect,useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ProductList({addToCart}){

const [products,setProducts]=useState([]);
const [search,setSearch]=useState("");

const loadProducts=()=>{

axios
.get("http://127.0.0.1:8000/products")
.then(res=>setProducts(res.data));

};

useEffect(()=>{

loadProducts();

},[]);

const filtered=products.filter(p=>
p.name.toLowerCase().includes(search.toLowerCase())
);

return(

<div>

<div className="mb-10 text-center">

<h2 className="text-4xl font-bold mb-3">
Premium Chess Gear
</h2>

<p className="text-gray-500">
Boards, Pieces & Accessories for Serious Players
</p>

</div>

<input
className="border p-2 mb-6 w-full max-w-md bg-white text-black"
placeholder="Search products..."
onChange={(e)=>setSearch(e.target.value)}
/>

<div className="grid md:grid-cols-3 gap-6">

{filtered.map(product=>(

<div
key={product.id}
className="bg-gray-100 dark:bg-gray-800 p-6 rounded shadow"
>

<img
src={`https://source.unsplash.com/300x200/?chess,${product.id}`}
className="rounded mb-3"
/>

<Link to={`/product/${product.id}`}>
<h3 className="text-xl hover:underline">
{product.name}
</h3>
</Link>

<p className="text-yellow-500 font-bold">
₹{product.price}
</p>

<p className="text-sm text-gray-500">
Stock: {product.stock}
</p>

<div className="text-yellow-400">
★★★★☆
</div>

<button
disabled={product.stock===0}
onClick={()=>addToCart(product)}
className={`mt-3 px-4 py-2 rounded text-black
${product.stock===0
? "bg-gray-400"
: "bg-yellow-500"}
`}
>
{product.stock===0 ? "Out of Stock" : "Add to Cart"}
</button>

</div>

))}

</div>

</div>

)

}

export default ProductList