import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useTranslation } from "../context/TranslationContext";
import { UI_TEXT } from "../config/uiText";

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();

  const BASE_URL = import.meta.env.VITE_API_URL;

  const imageUrl = product.images?.length
    ? `${BASE_URL}${product.images[0]}`
    : "/no-image.png";

  // 🔥 Kurban Bayramı indirimi
  const DISCOUNT_AMOUNT = 4000;

  const originalPrice = product.price;
  const discountedPrice = Math.max(
    originalPrice - DISCOUNT_AMOUNT,
    0
  );

  const handleAddToCart = () => {
    if (!user) {
      toast.error(t(UI_TEXT.loginRequired));
      return;
    }

    // 🔥 Sepete indirimli fiyatla ekle
    addToCart({
      ...product,
      price: discountedPrice,
      originalPrice: originalPrice,
    });

    toast.success(`${product.name} ${t(UI_TEXT.addedToCart)}`);
  };

  return (
    <div className="bg-slate-200 rounded-xl mt-1 w-full max-w-[180px] mx-auto lg:w-full shadow p-4 text-center hover:shadow-2xl transition flex flex-col h-full">
      
      <Link to={`/product/${product._id}`}>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-auto object-cover rounded-lg mb-3"
        />
      </Link>

      <h3 className="mt-auto text-lg font-semibold">
        {product.name}
      </h3>

      {/* 🔥 Eski fiyat */}
      <p className="text-gray-500 line-through text-sm">
        {originalPrice.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{" "}
        TRY
      </p>

      {/* 🔥 İndirimli fiyat */}
      <p className="font-bold text-red-600 text-lg mb-2">
        {discountedPrice.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{" "}
        TRY
      </p>

      {/* 🔥 İndirim etiketi */}
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mb-2 inline-block">
        Kurban Bayramı İndirimi
      </span>

      <button
        onClick={handleAddToCart}
        className="mt-auto bg-slate-50 font-bold text-lime-400 px-4 py-2 rounded-2xl shadow hover:bg-white transition"
      >
        {t(UI_TEXT.addToCart)}
      </button>
    </div>
  );
}