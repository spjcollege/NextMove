import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

import Home from "./pages/Home"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Profile from "./pages/Profile"

function App(){

const [cart,setCart] = useState([])

const addToCart = (product) => {

setCart([...cart,product])

}

return(

<BrowserRouter>

<div className="min-h-screen flex flex-col">

<Navbar cartCount={cart.length} />

<main className="flex-1">

<Routes>

<Route
path="/"
element={<Home addToCart={addToCart}/>}
/>

<Route
path="/product/:id"
element={<ProductDetail addToCart={addToCart}/>}
/>

<Route
path="/cart"
element={<Cart cart={cart}/>}
/>

<Route
path="/checkout"
element={<Checkout cart={cart}/>}
/>

<Route
path="/profile"
element={<Profile/>}
/>

</Routes>

</main>

<Footer/>

</div>

</BrowserRouter>

)

}

export default App