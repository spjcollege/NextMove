import { useState } from "react";
import axios from "axios";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {

    await axios.post(
      "http://127.0.0.1:8000/users/register",
      { name, email, password }
    );

    alert("User registered successfully");

  };

  return (

    <div className="max-w-sm">

      <h2 className="text-2xl mb-4">Register</h2>

      <input
        className="p-2 border mb-2 w-full bg-gray-800"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="p-2 border mb-2 w-full bg-gray-800"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="p-2 border mb-2 w-full bg-gray-800"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={registerUser}
        className="bg-yellow-500 px-4 py-2 rounded text-black"
      >
        Register
      </button>

    </div>

  );
}

export default Register;