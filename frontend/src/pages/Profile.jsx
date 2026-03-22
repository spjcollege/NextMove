import { useEffect,useState } from "react"
import axios from "axios"

function Profile(){

const user = JSON.parse(localStorage.getItem("user"))

const [orders,setOrders] = useState([])

useEffect(()=>{

axios
.get("http://127.0.0.1:8000/orders")
.then(res=>{

const userOrders = res.data.filter(
o => o.user === user.email
)

setOrders(userOrders)

})

},[])

if(!user) return <p>Please login first</p>

return(

<div className="p-10">

<h2 className="text-2xl mb-6">
Your Orders
</h2>

{orders.length === 0 && <p>No orders yet</p>}

{orders.map((order,i)=>(

<div
key={i}
className="border-b py-3"
>

<p>Order #{i+1}</p>

<p className="text-sm">
Items: {order.items.length}
</p>

</div>

))}

</div>

)

}

export default Profile