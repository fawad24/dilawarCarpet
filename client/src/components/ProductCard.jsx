import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext"; // 🔹 user için
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useTranslation } from "../context/TranslationContext";
import { UI_TEXT } from "../config/uiText";


export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext); // 🔹 user al
  const { t } = useTranslation();
  const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

  const imageUrl =
  product.images?.length > 0
    ? `${BASE_URL}${product.images[0]}`
    : product.image?.length > 0
    ? `${BASE_URL}${product.image[0]}`
    : "/no-image.png";
     
  const handleAddToCart = () => {
    if (!user) {
      toast.error(t(UI_TEXT.loginRequired));
      return;
    }

    addToCart(product);
    toast.success(`${product.name}  ${t(UI_TEXT.addedToCart)}`);
  };

  return (
    <div className="bg-slate-200 rounded-xl mt-1  w-full max-w-[180px] mx-auto  lg:w-full  shadow p-4 text-center hover:shadow-2xl transition flex flex-col h-full">
      <Link to={`/product/${product._id}`}>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-auto object-cover rounded-lg mb-3"
        />
      </Link>

      <h3 className="mt-auto text-lg font-semibold">{product.name}</h3>

      <p className="mt-auto font-bold text-blue-700 mb-2">
        {product.price.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{" "}
       TRY
      </p>

      <button
        onClick={handleAddToCart}
        className="mt-auto bg-slate-50 font-bold text-black px-4 py-2 rounded-2xl shadow hover:bg-white transition"
      >
        {t(UI_TEXT.addToCart)}
      </button>
    </div>
  );
}
