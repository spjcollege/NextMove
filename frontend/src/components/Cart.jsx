function Cart({ cart }) {

  return (

    <div>

      <h2 className="text-2xl mb-6">Cart</h2>

      {cart.length === 0 && (
        <p>No items in cart</p>
      )}

      {cart.map((item, index) => (

        <div key={index} className="border-b py-2">

          {item.name} — ₹{item.price}

        </div>

      ))}

    </div>

  );
}

export default Cart;