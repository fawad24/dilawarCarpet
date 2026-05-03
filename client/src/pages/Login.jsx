import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate} from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


 const handleSubmit = async (e) => {
  e.preventDefault();

  const success = await login(email, password);

  if (success) {
    navigate("/", { replace: true }); // 🔥 HOME
  }
};

  return (
    <div className="max-w-md lg:mx-auto mx-4 lg:mt-28 mt-56 bg-slate-200 p-6 rounded-3xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Welcome Back!</h2>
      <p className="text2xl text-center font-bold mb-4">Log in</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="email" placeholder="Email" className="w-full  px-3 py-2 rounded-3xl bg-slate-50 shadow hover:bg-white" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Şifre" className="w-full  px-3 py-2 rounded-3xl bg-slate-50 shadow hover:bg-white" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-slate-700 hover:bg-slate-800 text-white py-2 rounded-3xl shadow mx-auto block">Log in</button>
      </form>
    </div>
  );
}
