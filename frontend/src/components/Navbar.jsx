import { Link } from "react-router-dom";

function Navbar(){

return(

<nav className="flex justify-between items-center px-10 py-4 bg-white shadow">

<h1 className="font-bold text-lg">
NextMove Chess Store
</h1>

<div className="flex gap-6">

<Link to="/">Shop</Link>

<Link to="/">About</Link>

<button className="bg-black text-white px-3 py-1 rounded">
Cart (0)
</button>

</div>

</nav>

)

}

export default Navbar