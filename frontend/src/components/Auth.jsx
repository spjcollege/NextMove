import { useState } from "react";
import axios from "axios";

function Auth({setUser}){

const [isLogin,setIsLogin]=useState(true);

const [name,setName]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const submit=async()=>{

if(isLogin){

const res=await axios.post(
"http://127.0.0.1:8000/auth/login",
{email,password}
);

localStorage.setItem(
"user",
JSON.stringify(res.data.user)
);

setUser(res.data.user);

alert("Login successful");

}else{

await axios.post(
"http://127.0.0.1:8000/users/register",
{name,email,password}
);

alert("Registration successful");

setIsLogin(true);

}

};

return(

<div className="max-w-sm mx-auto">

<h2 className="text-2xl mb-4">

{isLogin ? "Login" : "Create Account"}

</h2>

{!isLogin && (

<input
className="p-2 border mb-2 w-full bg-white text-black"
placeholder="Name"
onChange={(e)=>setName(e.target.value)}
/>

)}

<input
className="p-2 border mb-2 w-full bg-white text-black"
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
className="p-2 border mb-2 w-full bg-white text-black"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={submit}
className="bg-yellow-500 px-4 py-2 rounded text-black w-full"
>
{isLogin ? "Login" : "Register"}
</button>

<p
className="mt-4 cursor-pointer text-blue-500"
onClick={()=>setIsLogin(!isLogin)}
>

{isLogin
? "New user? Create account"
: "Already have an account? Login"}

</p>

</div>

)

}

export default Auth