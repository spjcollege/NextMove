import { Link } from "react-router-dom";

function Cart({cart}){

  return(

    <div>

      <h2 className="text-2xl mb-6">
        Cart
      </h2>

      {cart.length===0 && <p>No items in cart</p>}

      {cart.map((item,index)=>(

        <div
          key={index}
          className="border-b py-2"
        >
          {item.name} — ₹{item.price}
        </div>

      ))}

      {cart.length>0 && (

        <Link
          to="/checkout"
          className="bg-green-500 px-4 py-2 rounded mt-4 inline-block"
        >
          Checkout
        </Link>

      )}

    </div>

  )
}

export default Cart