import {useState} from "react";
import axios from "axios";

function Login(){

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const login=async()=>{

const res=await axios.post(
"http://127.0.0.1:8000/auth/login",
{email,password}
);

localStorage.setItem(
"user",
JSON.stringify(res.data.user)
);

alert("Login successful");

window.location="/";

};

return(

<div className="max-w-sm">

<h2 className="text-2xl mb-4">
Login
</h2>

<input
className="p-2 border mb-2 w-full"
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
className="p-2 border mb-2 w-full"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={login}
className="bg-yellow-500 px-4 py-2 rounded"
>
Login
</button>

</div>

)

}

export default Login