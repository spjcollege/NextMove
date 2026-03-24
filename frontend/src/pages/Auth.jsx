import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../hooks/useNotification";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const navigate = useNavigate();
  const notify = useNotification();

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await axios.post(
          "http://127.0.0.1:8000/auth/login",
          {
            username: form.username,
            password: form.password
          }
        );
        localStorage.setItem("user", JSON.stringify(res.data.user));
        notify.success("Login successful");
        navigate("/");
      } else {
        await axios.post(
          "http://127.0.0.1:8000/users/register",
          form
        );
        notify.success("Registered! Now login.");
        setIsLogin(true);
      }
    } catch (err) {
      notify.error("Error: " + (err.response?.data?.detail || "Something went wrong"));
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto bg-white shadow rounded">

      <h2 className="text-xl mb-4">
        {isLogin ? "Login" : "Register"}
      </h2>

      <input
        placeholder="Username"
        className="border p-2 w-full mb-2"
        value={form.username}
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
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