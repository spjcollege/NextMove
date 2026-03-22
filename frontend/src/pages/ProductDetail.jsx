import { useParams } from "react-router-dom";
import { useEffect,useState } from "react";

function ProductDetail(){

const {id} = useParams();

const [product,setProduct] = useState(null);

useEffect(()=>{

fetch(`http://127.0.0.1:8000/api/products/${id}`)
.then(res=>res.json())
.then(data=>setProduct(data.product));

},[id]);

if(!product) return <p className="p-10">Loading...</p>;

return(

<div className="grid md:grid-cols-2 gap-10 p-10">

<img
src={product.image}
className="rounded shadow"
/>

<div>

<h1 className="text-3xl font-bold mb-2">
{product.name}
</h1>

<p className="text-yellow-600 text-xl mb-4">
${product.price}
</p>

<p className="text-gray-600 mb-4">
{product.description}
</p>

<button className="bg-yellow-600 text-white px-6 py-2 rounded">
Add to Cart
</button>

</div>

</div>

)

}

export default ProductDetail