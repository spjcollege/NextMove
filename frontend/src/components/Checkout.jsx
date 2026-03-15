import axios from "axios";

function Checkout({cart}){

  const placeOrder = async ()=>{

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if(!user){
      alert("Login required");
      return;
    }

    await axios.post(
      "http://127.0.0.1:8000/orders/place",
      {
        user:user.email,
        items:cart
      }
    );

    alert("Order placed!");
  };

  return(

    <div>

      <h2 className="text-2xl mb-4">
        Checkout
      </h2>

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