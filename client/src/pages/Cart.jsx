import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { useTranslation } from "../context/TranslationContext";
import { UI_TEXT } from "../config/uiText";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { t } = useTranslation();
  const BASE_URL = import.meta.env.VITE_API_URL;

  if (!cart || cart.length === 0) {
    return (
      <div className="mt-28 text-center py-10 text-gray-500">
        {t(UI_TEXT.cartEmpty)}
      </div>
    );
  }

  // 🔥 SAFE TOTAL (crash önler)
  const total = cart.reduce(
    (sum, item) =>
      sum +
      ((item.price ?? item.productId?.price ?? 0) *
        (item.quantity || 1)),
    0
  );

  return (
    <div className="mt-36 md:mt-32 max-w-5xl mx-4 p-4 md:p-28 rounded-2xl shadow bg-slate-200">

      <h1 className="text-2xl text-slate-800 font-semibold mb-4 text-center">
        {t(UI_TEXT.myCart)}
      </h1>

      <div className="space-y-4 border rounded-3xl shadow bg-slate-50">

        {cart.map((item) => {
          const price = item.price ?? item.productId?.price ?? 0;
          const original =
            item.originalPrice ??
            item.productId?.price ??
            price;

          const showDiscount = original > price;

          return (
            <div
              key={item.id || item._id}
              className="flex items-center justify-between bg-slate-100 shadow p-2 md:p-4 rounded-3xl"
            >

              <div className="flex items-center gap-4">

                <img
                  src={
                    item.images?.length > 0
                      ? item.images[0].startsWith("http")
                        ? item.images[0]
                        : `${BASE_URL}/uploads/${item.images[0]
                            .split("/uploads/")
                            .pop()}`
                      : "/no-image.png"
                  }
                  alt={item.name || t(UI_TEXT.product)}
                  className="w-14 h-14 md:w-20 md:h-20 object-contain"
                />

                <div>

                  <h3 className="font-bold">{item.name}</h3>

                  {/* 🔴 NORMAL FİYAT (ÜSTÜ ÇİZİLİ) */}
                  {showDiscount && (
                    <p className="text-gray-400 line-through text-sm">
                      {original.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} ₺
                    </p>
                  )}

                  {/* 🔥 İNDİRİMLİ FİYAT */}
                  <p className="text-red-500 font-bold">
                    {price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} ₺ x {item.quantity}
                  </p>

                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id || item._id)}
                className="bg-red-500 text-white px-3 md:px-10 py-1 rounded-2xl shadow hover:bg-red-600 transition"
              >
                {t(UI_TEXT.delete)}
              </button>

            </div>
          );
        })}

      </div>

      {/* TOTAL */}
      <div className="mt-4 md:mt-6 flex flex-col md:flex-row gap-3 justify-between items-center border-t pt-4">

        <h2 className="text-lg md:text-xl font-bold px-3 py-1 rounded-2xl shadow bg-slate-50">
          {t(UI_TEXT.total)}: {total.toLocaleString("en-US")} ₺
        </h2>

        <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto">

          <button
            onClick={clearCart}
            className="bg-slate-50 text-red-500 px-3 md:px-4 py-2 font-bold rounded-3xl shadow hover:bg-white w-full md:w-auto"
          >
            {t(UI_TEXT.clearCart)}
          </button>

          <Link
            to="/checkout"
            onClick={() => {
              setTimeout(() => window.location.reload(), 50);
            }}
            className="bg-slate-50 font-bold text-lime-500 px-3 md:px-4 py-2 rounded-3xl shadow hover:bg-white transition text-center w-full md:w-auto"
          >
            {t(UI_TEXT.checkout)}
          </Link>

        </div>
      </div>
    </div>
  );
}