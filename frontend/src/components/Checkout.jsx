import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../hooks/useNotification";

function Checkout({cart}){

const navigate=useNavigate();
const notify = useNotification();

const placeOrder=async()=>{

const user=JSON.parse(localStorage.getItem("user"));

if(!user){
notify.warning("Login required");
return;
}

try {
  await axios.post(
    "http://127.0.0.1:8000/orders/place",
    {
      userId: user.id,
      username: user.username,
      items:cart
    }
  );
  notify.success("Order placed successfully");
  navigate("/profile");
} catch (err) {
  notify.error("Error: " + (err.response?.data?.detail || err.message));
}

return(

<div>

<h2 className="text-2xl mb-4">
Checkout
</h2>

<p className="mb-4">
Items: {cart.length}
</p>

<button
onClick={placeOrder}
className="bg-green-500 px-4 py-2 rounded"
>
Place Order
</button>

</div>

)

}

export default Checkout