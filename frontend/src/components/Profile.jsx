import { useEffect,useState } from "react";
import axios from "axios";

function Profile(){

const user=JSON.parse(localStorage.getItem("user"));

const [orders,setOrders]=useState([]);

useEffect(()=>{

axios
.get("http://127.0.0.1:8000/orders")
.then(res=>{

const userOrders=res.data.filter(
o=>o.userId===user.id || o.username===user.username
);

setOrders(userOrders);

});

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

<p><b>Username:</b> {user.username}</p>
<p><b>ID:</b> {user.id}</p>

</div>

<div className="p-6 bg-gray-100 dark:bg-gray-800 rounded">

<h3 className="text-xl mb-2">
Your Orders
</h3>

{orders.length===0 && <p>No orders yet</p>}

{orders.map((order,i)=>(

<div key={i} className="border-b py-2">

Order #{i+1}

<p className="text-sm">
Items: {order.items.length}
</p>

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