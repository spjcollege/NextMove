import {useEffect,useState} from "react";
import axios from "axios";

function Profile(){

const user=JSON.parse(localStorage.getItem("user"));

const [orders,setOrders]=useState([]);

useEffect(()=>{

axios
.get("http://127.0.0.1:8000/orders")
.then(res=>setOrders(res.data));

},[]);

if(!user){
return <p>Please login first</p>;
}

const logout=()=>{

localStorage.removeItem("user");

window.location="/";

};

return(

<div>

<h2 className="text-3xl mb-6">
Your Account
</h2>

<div className="grid md:grid-cols-2 gap-6">

<div className="p-6 bg-gray-100 dark:bg-gray-800 rounded">

<h3 className="text-xl mb-2">
Profile Information
</h3>

<p><b>Name:</b> {user.name}</p>
<p><b>Email:</b> {user.email}</p>

</div>

<div className="p-6 bg-gray-100 dark:bg-gray-800 rounded">

<h3 className="text-xl mb-2">
Orders
</h3>

{orders.map((order,i)=>(
<div key={i}>
Order #{i+1} – {order.items.length} items
</div>
))}

</div>

<div className="p-6 bg-gray-100 dark:bg-gray-800 rounded">

<button
onClick={logout}
className="bg-red-500 px-4 py-2 rounded"
>
Logout
</button>

</div>

</div>

</div>

)

}

export default Profile