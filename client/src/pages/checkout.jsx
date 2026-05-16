import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "../context/TranslationContext";
import { UI_TEXT } from "../config/uiText";

export default function Checkout() {
  const API_URL = import.meta.env.VITE_API_URL + "/api";

  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const { t } = useTranslation();

  const [paymentMethod, setPaymentMethod] =
    useState("iban");

  console.log("CART:", cart);

  // 🔥 İndirimli toplam
  const total = cart.reduce(
    (sum, item) =>
      sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  // 🔥 Eski toplam fiyat
  const originalTotal = cart.reduce(
    (sum, item) =>
      sum +
      ((item.originalPrice || item.price) *
        (item.quantity || 1)),
    0
  );

  const handleOrder = async () => {
    try {
      if (!user) {
        alert(t(UI_TEXT.mustLogin));
        return;
      }

      const items = cart
        .map((item) => {
          // 🔥 Yeni sistem
          if (item._id && item.name && item.price) {
            return {
              productId: item._id,
              name: item.name,

              // 🔥 İndirimli fiyat
              price: item.price,

              // 🔥 Eski fiyat
              originalPrice:
                item.originalPrice || item.price,

              quantity: item.quantity || 1,
            };
          }

          // 🔥 Eski sistem desteği
          if (
            item.productId &&
            item.productId._id
          ) {
            return {
              productId: item.productId._id,
              name: item.productId.name,
              price:
                item.price ||
                item.productId.price,

              originalPrice:
                item.originalPrice ||
                item.productId.price,

              quantity: item.quantity || 1,
            };
          }

          return null;
        })
        .filter(Boolean);

      if (!items.length) {
        alert("Sepet boş");
        return;
      }

      const orderData = {
        userId: user._id,

        customer: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },

        items,

        // 🔥 İndirimli toplam
        total,

        // 🔥 Eski toplam
        originalTotal,

        paymentMethod,
        paymentStatus: "paid",
      };

      const res = await fetch(
        `${API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(orderData),
        }
      );

      if (!res.ok) {
        alert(t(UI_TEXT.orderFailed));
        return;
      }

      alert(t(UI_TEXT.orderSuccess));

      clearCart();

      navigate("/orders", {
        replace: true,
      });
    } catch (err) {
      console.error(err);

      alert(t(UI_TEXT.genericError));
    }
  };

  return (
    <div className="max-w-4xl lg:mx-auto mx-4 mt-28 lg:p-8 p-2 bg-slate-200 shadow rounded-2xl">
      
      <h1 className="text-2xl font-bold mb-6">
        🧾 {t(UI_TEXT.orderSummary)}
      </h1>

      {cart.map((item) => (
        <div
          key={item._id}
          className="border-b py-3 px-3 flex justify-between items-center bg-slate-50 rounded-3xl shadow font-bold mb-2"
        >
          <div>
            <span className="block">
              {item.name} × {item.quantity}
            </span>

            {/* 🔥 Eski fiyat */}
            {item.originalPrice && (
              <span className="text-gray-400 line-through text-sm">
                {item.originalPrice.toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}{" "}
                ₺
              </span>
            )}

            {/* 🔥 İndirim etiketi */}
            <div>
              <span className="inline-block mt-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Kurban Bayramı İndirimi
              </span>
            </div>
          </div>

          {/* 🔥 Yeni fiyat */}
          <span className="text-red-500 font-bold text-lg">
            {item.price.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            ₺
          </span>
        </div>
      ))}

      {/* 🔥 Toplam alanı */}
      <div className="mt-4 bg-slate-50 rounded-3xl shadow px-4 py-4">
        
        {/* Eski toplam */}
        <p className="text-gray-400 line-through text-sm">
          {originalTotal.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          ₺
        </p>

        {/* Yeni toplam */}
        <h2 className="text-2xl font-bold text-red-500">
          {t(UI_TEXT.total)}:{" "}
          {total.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          ₺
        </h2>
      </div>

      {/* Ödeme yöntemi */}
      <div className="mt-6 bg-slate-50 rounded-3xl px-4 py-4 shadow">
        
        <h2 className="font-semibold mb-3">
          {t(UI_TEXT.paymentMethod)}
        </h2>

        <div className="flex flex-col gap-3">
          
          <label
            htmlFor="iban"
            className="flex items-center gap-2"
          >
            <input
              type="radio"
              id="iban"
              name="paymentMethod"
              checked={paymentMethod === "iban"}
              onChange={() =>
                setPaymentMethod("iban")
              }
            />

            {t(UI_TEXT.payWithIban)}
          </label>

          <label
            htmlFor="kapida"
            className="flex items-center gap-2"
          >
            <input
              type="radio"
              id="kapida"
              name="paymentMethod"
              checked={paymentMethod === "kapida"}
              onChange={() =>
                setPaymentMethod("kapida")
              }
            />

            {t(UI_TEXT.payAtDoor)}
          </label>
        </div>
      </div>

      {/* IBAN alanı */}
      {paymentMethod === "iban" && (
        <div className="mt-4 bg-yellow-100 p-4 rounded-3xl shadow">
          
          <p className="font-semibold">
            {t(UI_TEXT.ibanInfo)}
          </p>

          <p className="mt-2 font-bold">
            TR00 0000 0000 0000 0000 0000 00
          </p>

          <p className="mt-2 text-sm">
            {t(UI_TEXT.ibanDescription)}
          </p>
        </div>
      )}

      {/* Sipariş butonu */}
      <button
        onClick={handleOrder}
        className="mt-6 bg-slate-50 shadow px-6 py-3 rounded-3xl hover:bg-white text-lime-500 font-bold transition"
      >
        {t(UI_TEXT.confirmOrder)}
      </button>
    </div>
  );
}