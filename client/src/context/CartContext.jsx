import React, { createContext, useEffect, useState, useContext } from "react";
import { useAuth } from "./AuthContext.jsx";
import toast from "react-hot-toast";

export const CartContext = createContext();
const API_URL = import.meta.env.VITE_API_URL + "/api";

export default function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCart([]);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/cart`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Sepet alınamadı");

        const data = await res.json();
        setCart(data.items || []);
      } catch (err) {
        console.error("Fetch cart error:", err);
        setCart([]);
      }
    };

    fetchCart();
  }, [user]);

  const addToCart = async (product) => {
    if (!user) {
      toast.error("Önce giriş yapmalısınız veya kayıt olun!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: product._id }),
      });
      if (!res.ok) throw new Error("Ürün sepete eklenemedi");

      const data = await res.json();
      setCart(data.items || []);
      toast.success(`${product.name} sepete eklendi`);
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Ürün sepete eklenemedi");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/cart/remove/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Ürün sepetten çıkarılamadı");

      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch(`${API_URL}/cart/clear`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Sepet temizlenemedi");

      setCart([]);
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
