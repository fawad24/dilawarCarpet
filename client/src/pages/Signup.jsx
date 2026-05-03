import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup } = useContext(AuthContext);
   const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    phone: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();

  const success = await signup(form);

  if (success) {
    navigate("/", { replace: true }); // 🔥 HOME
  }
};

 



  return (
    <div className="max-w-md lg:mx-auto mx-4 lg:mt-28 mt-32 bg-slate-200 p-6 rounded-3xl shadow">

  <h1 className="text-3xl font-bold text-center mb-4">
    Welcome
  </h1>
  <p className="text2xl text-gray-500 text-center mb-4 font-semibold">
    Create your account
  </p>

  

  <form onSubmit={handleSubmit} className="space-y-3">
    <input name="firstName" placeholder="Ad" onChange={handleChange} className="w-full px-3 py-2 rounded-3xl bg-slate-50 shadow hover:bg-white " />
    <input name="lastName" placeholder="Soyad" onChange={handleChange} className="w-full px-3 py-2 rounded-3xl bg-slate-50 shadow hover:bg-white" />
    <input name="email" placeholder="Email" onChange={handleChange} className="w-full px-3 py-2 rounded-3xl bg-slate-50 shadow hover:bg-white" />
    <input name="password" type="password" placeholder="Şifre" onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 rounded-3xl shadow hover:bg-slate-50" />
    <input name="address" placeholder="Adres (opsiyonel)" onChange={handleChange} className="w-full px-3 py-2 rounded-3xl bg-slate-50  shadow hover:bg-white" />
    <input name="phone" placeholder="Telefon (opsiyonel)" onChange={handleChange} className="w-full px-3 py-2 rounded-3xl bg-slate-50 shadow hover:bg-white " />

    <button className="w-full bg-slate-700 hover:bg-slate-800 text-white py-2 rounded-3xl shadow mx-auto block">
      Sign up
    </button>
  </form>
</div>

  );
}
