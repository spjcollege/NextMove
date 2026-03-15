import { useState,useEffect } from "react";
import { Routes,Route,Link } from "react-router-dom";

import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Auth from "./components/Auth";
import Profile from "./components/Profile";

function App(){

const [cart,setCart]=useState([]);
const [user,setUser]=useState(null);

useEffect(()=>{

const storedUser=localStorage.getItem("user");

if(storedUser){
setUser(JSON.parse(storedUser));
}

},[]);

const addToCart=(product)=>{

if(!user){
alert("Please login first");
return;
}

setCart([...cart,product]);

};

const toggleTheme=()=>{

document.documentElement.classList.toggle("dark");

};

const logout=()=>{

localStorage.removeItem("user");
setUser(null);

};

return(

<div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">

<nav className="flex justify-between items-center px-10 py-4 bg-gray-100 dark:bg-black shadow">

<h1 className="text-3xl font-bold text-yellow-500">
NextMove
</h1>

<div className="flex gap-6 items-center">

<Link to="/">Products</Link>

<Link to="/cart">Cart ({cart.length})</Link>

{user ? (

<>
<Link to="/profile">Profile</Link>

<button
onClick={logout}
className="bg-red-500 px-3 py-1 rounded text-white"
>
Logout
</button>
</>

):(

<Link to="/auth">
Login / Register
</Link>

)}

<button
onClick={toggleTheme}
className="bg-yellow-500 px-3 py-1 rounded text-black"
>
Theme
</button>

</div>

</nav>

<div className="p-10">

<Routes>

<Route path="/" element={<ProductList addToCart={addToCart}/>}/>

<Route path="/product/:id" element={<ProductDetail addToCart={addToCart}/>}/>

<Route path="/cart" element={<Cart cart={cart}/>}/>

<Route path="/checkout" element={<Checkout cart={cart}/>}/>

<Route path="/auth" element={<Auth setUser={setUser}/>}/>

<Route path="/profile" element={<Profile/>}/>

</Routes>

</div>

</div>

)

}

export default App