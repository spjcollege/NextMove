import { useEffect,useState } from "react"
import ProductCard from "../components/ProductCard"

function Home(){

const [products,setProducts] = useState([])

useEffect(()=>{

fetch("http://127.0.0.1:8000/products")
.then(res=>res.json())
.then(data=>setProducts(data))

},[])

return(

<div>

{/* HERO */}

<section
className="h-[60vh] flex flex-col justify-center items-center text-white text-center"
style={{
backgroundImage:"url('/images/prod1.jpeg')",
backgroundSize:"cover"
}}
>

<h2 className="text-4xl font-bold mb-4">
Master Your Game
</h2>

<p className="mb-4">
Discover premium chess equipment
</p>

<a
href="#shop"
className="bg-yellow-600 px-5 py-2 rounded"
>
Shop Collection
</a>

</section>

{/* PRODUCTS */}

<section
id="shop"
className="bg-gray-100 py-12 px-10"
>

<h2 className="text-2xl font-bold text-center mb-8">
The NextMove Collection
</h2>

<div className="grid md:grid-cols-3 gap-6">

{products.map(product=>(

<ProductCard
key={product.id}
product={product}
/>

))}

</div>

</section>

</div>

)

}

export default Home