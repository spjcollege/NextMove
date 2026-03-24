import { useState } from "react";
import axios from "axios";
import { useNotification } from "../hooks/useNotification";

function Register() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [address,setAddress] = useState("");
  const [phone,setPhone] = useState("");
  const notify = useNotification();

  const registerUser = async () => {

    await axios.post(
      "http://127.0.0.1:8000/users/register",
      {name,email,password,address,phone}
    );

    notify.success("User registered");
  };

  return(

    <div className="max-w-sm">

      <h2 className="text-2xl mb-4">Create Account</h2>

      <input className="p-2 border mb-2 w-full"
        placeholder="Full Name"
        onChange={(e)=>setName(e.target.value)}
      />

      <input className="p-2 border mb-2 w-full"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input className="p-2 border mb-2 w-full"
        placeholder="Phone"
        onChange={(e)=>setPhone(e.target.value)}
      />

      <input className="p-2 border mb-2 w-full"
        placeholder="Address"
        onChange={(e)=>setAddress(e.target.value)}
      />

      <input type="password"
        className="p-2 border mb-2 w-full"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button
        onClick={registerUser}
        className="bg-yellow-500 px-4 py-2 rounded"
      >
        Register
      </button>

    </div>

  )
}

export default Register