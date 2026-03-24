import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await axios.post(
          "http://127.0.0.1:8000/auth/login",
          {
            email: form.email,
            password: form.password
          }
        );

        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Login successful");
        navigate("/");
      } else {
        await axios.post(
          "http://127.0.0.1:8000/users/register",
          form
        );

        alert("Registered! Now login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || "Something went wrong"));
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto bg-white shadow rounded">

      <h2 className="text-xl mb-4">
        {isLogin ? "Login" : "Register"}
      </h2>

      {!isLogin && (
        <input
          placeholder="Name"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
      )}

      <input
        placeholder="Email"
        className="border p-2 w-full mb-2"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-2"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button
        onClick={handleSubmit}
        className="bg-yellow-500 w-full py-2 mt-2"
      >
        {isLogin ? "Login" : "Register"}
      </button>

      <p
        className="text-sm mt-3 cursor-pointer"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "New user? Register" : "Already have an account? Login"}
      </p>

    </div>
  );
}

export default Auth;