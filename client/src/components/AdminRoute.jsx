import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  // 🔄 Loading sırasında gösterilecek
  if (loading) return <div className="p-8">Yükleniyor...</div>;

  // 🔒 Login değilse login sayfasına yönlendir
  if (!user) return <Navigate to="/login" replace />;

  // 👑 Admin kontrol (sadece sen)
  if (user.email !== "fawaddilawar24@gmail.com") {
    return <div className="p-8 text-red-600 font-bold">Admin yetkisi yok!</div>;
  }

  return children;
}
