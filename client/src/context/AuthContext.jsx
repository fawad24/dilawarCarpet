import React, { createContext, useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL + "/api/auth"; // 🔹 Backend auth URL
console.log("API:", import.meta.env.VITE_API_URL);
console.log("FULL:", import.meta.env);
console.log("ENV CHECK:", import.meta.env.VITE_API_URL);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  // 🔄 Sayfa açılınca kullanıcıyı çek
  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/me`, {
        credentials: "include", // cookie gönderimi
      });

      if (!res.ok) throw new Error("Kullanıcı çekilemedi");

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error("Fetch user error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔐 Login
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        toast.success("Giriş başarılı");
        return true;
      } else {
        toast.error(data.message || "Giriş başarısız");
        return false;
      }
    } catch (err) {
      console.error(err);
      toast.error("Giriş başarısız");
    }
    return false;

  };

  // 📝 Signup
  const signup = async (form) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        toast.success("Kayıt başarılı");
        return true;
      } else {
        toast.error(data.message || "Kayıt başarısız");
        return false;
      }
    } catch (err) {
      console.error(err);
      toast.error("Kayıt başarısız");
    }
    return false;
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      const res = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setUser(null);
        toast.success("Çıkış yapıldı");
      } else {
        toast.error("Çıkış yapılamadı");
      }
    } catch (err) {
      console.error(err);
      toast.error("Çıkış yapılamadı");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔹 useAuth hook
export const useAuth = () => useContext(AuthContext);
