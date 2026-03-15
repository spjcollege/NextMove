import { useParams } from "react-router-dom";
import { useEffect,useState } from "react";
import axios from "axios";

function ProductDetail({addToCart}){

const {id}=useParams();
const [product,setProduct]=useState(null);

useEffect(()=>{

axios
.get("http://127.0.0.1:8000/products")
.then(res=>{

const item=res.data.find(p=>p.id==id);
setProduct(item);

});

},[id]);

if(!product) return <p>Loading...</p>;

return(

<div className="max-w-xl">

<img
src="https://source.unsplash.com/500x300/?chess"
className="rounded mb-4"
/>

<h2 className="text-3xl mb-2">
{product.name}
</h2>

<p className="text-yellow-500 text-xl">
₹{product.price}
</p>

<p className="text-gray-500">
Stock available: {product.stock}
</p>

<div className="text-yellow-400 mt-2">
★★★★☆
</div>

<button
disabled={product.stock===0}
onClick={()=>addToCart(product)}
className={`mt-4 px-4 py-2 rounded text-black
${product.stock===0
? "bg-gray-400"
: "bg-yellow-500"}
`}
>
{product.stock===0 ? "Out of Stock" : "Add to Cart"}
</button>

</div>

)

}

export default ProductDetail